import { Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'archived_at', type: 'timestamp', nullable: true })
  archivedAt?: Date;
}

/** UUID 기반 Auditable 엔티티 */
export abstract class AuditableUuidEntity implements AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'archived_at', type: 'timestamp', nullable: true })
  archivedAt?: Date;
}
