import { AfterInsert, AfterLoad, AfterUpdate, Column, Entity } from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';

@Entity('addresses')
export class Address extends Base {
  @Column({ name: 'street', type: 'varchar', nullable: true })
  declare public street: string;

  @Column({ name: 'number', type: 'int', nullable: true })
  declare public number: number;

  @Column({ name: 'district', type: 'varchar', nullable: true })
  declare public district: string;

  @Column({ name: 'complement', type: 'varchar', nullable: true })
  declare public complement: string;

  @Column({ name: 'city', type: 'varchar', nullable: true })
  declare public city: string;

  @Column({ name: 'uf', type: 'varchar', length: 2, nullable: true })
  declare public uf: string;

  @Column({ name: 'zipcode', type: 'varchar', length: 8, nullable: true })
  declare public zipcode: string;

  @Column({
    name: 'lat',
    type: 'decimal',
    precision: 9,
    scale: 6,
    nullable: true,
  })
  declare public lat: number;

  @Column({
    name: 'lon',
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: true,
  })
  declare public lon: number;

  @AfterLoad()
  @AfterUpdate()
  @AfterInsert()
  protected normalizeCoordinates(): void {
    if (this.lat) this.lat = Number(this.lat);
    if (this.lon) this.lon = Number(this.lon);
  }
}
