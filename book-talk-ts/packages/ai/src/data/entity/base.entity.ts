import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/** Auditable 엔티티 인터페이스 */
export interface AuditableEntity {
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

/** Long ID 기반 Auditable 엔티티 */
export abstract class AuditableLongIdEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'archived_at' })
  archivedAt?: Date;
}

/** UUID 기반 Auditable 엔티티 */
export abstract class AuditableUuidEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'archived_at' })
  archivedAt?: Date;
}
