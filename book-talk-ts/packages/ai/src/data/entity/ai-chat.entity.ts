import { Injectable } from '@nestjs/common';
import { AiChatMessageEntity } from '@src/data/entity/ai-chat-message.entity.js';
import { AuditableUuidEntity } from '@src/data/entity/base.entity.js';
import { Column, type DataSource, Entity, OneToMany, type Relation, Repository } from 'typeorm';

@Entity('ai_chat')
export class AiChatEntity extends AuditableUuidEntity {
  /** 토론방 ID */
  @Column()
  debateId!: string;

  @OneToMany(
    () => AiChatMessageEntity,
    (message) => message.chat
  )
  messages!: Relation<AiChatMessageEntity[]>;
}

@Injectable()
export class AiChatRepository extends Repository<AiChatEntity> {
  constructor(dataSource: DataSource) {
    super(AiChatEntity, dataSource.createEntityManager());
  }
}
