import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Post, Body } from 'tsoa';
import { IQueueProvider } from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import { User } from '@modules/users/entities/User';
import { IPasswordResetsRepository } from '@modules/users/repositories/IPasswordResetsRepository';
import { DeleteCode } from '@jobs/DeleteCode';
import { InfoMail } from '@jobs/InfoMail';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IForgotPasswordDTO } from '@modules/users/dtos/IForgotPasswordDTO';
import { IIntervalDTO } from '@dtos/IIntervalDTO';
import { getName } from '@utils/email/getName';

@Route('/forgot-password')
@injectable()
export class ForgotPasswordService {
  public constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PasswordResetsRepository')
    private readonly passwordResetsRepository: IPasswordResetsRepository,

    @inject('QueueProvider')
    private readonly queueProvider: IQueueProvider,

    @inject('Connection')
    private readonly connection: IConnection,
  ) {}

  private get recoveryValidity(): IIntervalDTO {
    return '15min';
  }

  private get recoveryTime(): string | undefined {
    const match = this.recoveryValidity.match(/\d+/);
    if (match === null) {
      throw new AppError('INVALID_DELAY_FORMAT', 'Invalid delay format');
    }

    const time = parseInt(match[0], 10);
    const lastCharacter = time > 1 ? 's' : '';
    const unit = this.recoveryValidity.replace(/\d/g, '');

    switch (unit) {
      case 'd':
        return `${time} dia${lastCharacter}`;
      case 'h':
        return `${time} hora${lastCharacter}`;
      case 'min':
        return `${time} minuto${lastCharacter}`;
      case 's':
        return `${time} segundo${lastCharacter}`;
      default:
        return `${time} milisegundo${lastCharacter}`;
    }
  }

  private async sendMail(user: User, recoveryCode: number): Promise<void> {
    const name = getName(user);

    await this.queueProvider.execute({
      job: InfoMail,
      data: {
        templateData: {
          subject: 'Uma recuperação de senha foi solicitada',
          message: 'Recuperação de senha',
          info: [
            'Uma solicitação de recuperação de senha foi feita nesse email, se você não é o autor da solicitação, por favor ignore essa mensagem.',
            `Seu codigo de recuperação é: <b>${recoveryCode}</b>`,
            `<i>Esse código expirará em ${this.recoveryTime}*</i>`,
          ],
        },
        to: {
          name: name as string,
          email: user.email,
        },
      },
      attempts: 3,
    });
  }

  @Post()
  @Tags('User')
  public async execute(
    @Body() { email }: IForgotPasswordDTO,
  ): Promise<IResponseDTO<null>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const user = await this.usersRepository.findBy(
        {
          where: { email },
          relations: { profile: true },
          select: {
            id: true,
            email: true,
            profile: { fullName: true },
          },
        },
        trx,
      );

      if (!user) {
        throw new AppError('NOT_FOUND', 'User does not exist');
      }

      const recoveryCode = Math.floor(100000 + Math.random() * 900000);

      const passwordReset = await this.passwordResetsRepository.create(
        {
          email: user.email,
          userId: user.id,
          recoveryCode,
        },
        trx,
      );

      await this.sendMail(user, recoveryCode);
      await this.queueProvider.schedule({
        job: DeleteCode,
        data: {
          client: this.connection.client,
          id: passwordReset.id,
        },
        delay: this.recoveryValidity,
        attempts: 3,
      });

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        messageCode: 'SENT',
        message: 'Email successfully sent',
        data: null,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
