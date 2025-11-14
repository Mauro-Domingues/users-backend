import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { appConfig } from '@config/app';
import { storageConfig } from '@config/storage';
import { Base } from '@shared/container/modules/entities/Base';
import { Folder } from './Folder';

@Entity('files')
export class File extends Base {
  declare public fileUrl: string;

  @Column({ name: 'folder_id', type: 'uuid', nullable: false })
  declare public folderId: string;

  @Column({ name: 'file', type: 'varchar', nullable: false })
  declare public file: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  declare public name: string;

  @ManyToOne(() => Folder, folder => folder.files, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'folder_id',
    foreignKeyConstraintName: 'FK_files_folder',
    referencedColumnName: 'id',
  })
  declare public folder: Folder;

  @AfterLoad()
  @AfterUpdate()
  @AfterInsert()
  protected setFileUrl(): void {
    if (this.file) {
      const urlOrigins: Record<typeof storageConfig.driver, string> = {
        disk: `${appConfig.config.apiUrl}/uploads/${this.file}`,
        s3: `https://${storageConfig.config.s3.bucket}.s3.amazonaws.com/${this.file}`,
      };

      Object.defineProperty(this, 'fileUrl', {
        value: urlOrigins[storageConfig.driver],
        writable: false,
        enumerable: true,
        configurable: false,
      });
    }
  }
}
