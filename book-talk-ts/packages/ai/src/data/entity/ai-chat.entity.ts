import { Injectable } from '@nestjs/common';
import { Column, type DataSource, Entity, OneToMany, Repository } from 'typeorm';
import { AiChatMessageEntity } from './ai-chat-message.entity';
import { AuditableUuidEntity } from './base.entity';

@Entity('ai_chat')
export class AiChatEntity extends AuditableUuidEntity {
  /** 토론방 ID */
  @Column({ name: 'debate_id', type: 'varchar', nullable: true })
  debateId?: string;

  @OneToMany(
    () => AiChatMessageEntity,
    (message) => message.chat
  )
  messages?: AiChatMessageEntity[];
}

@Injectable()
export class AiChatRepository extends Repository<AiChatEntity> {
  constructor(dataSource: DataSource) {
    super(AiChatEntity, dataSource.createEntityManager());
  }
}
