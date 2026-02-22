import { Injectable } from '@nestjs/common';
import { AuditableUuidEntity } from '@src/data/entity/base.entity.js';
import { Column, type DataSource, Entity, Repository } from 'typeorm';

@Entity('ai_chat')
export class AiChatEntity extends AuditableUuidEntity {
  /** 토론방 ID */
  @Column({ name: 'debate_id' })
  debateId!: string;

  /** persona: a, b, ... */
  @Column({ name: 'persona' })
  persona!: string;
}

@Injectable()
export class AiChatRepository extends Repository<AiChatEntity> {
  constructor(dataSource: DataSource) {
    super(AiChatEntity, dataSource.createEntityManager());
  }
}
