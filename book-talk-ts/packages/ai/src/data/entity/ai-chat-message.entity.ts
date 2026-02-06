import { Injectable } from '@nestjs/common';
import { AiChatEntity } from '@src/data/entity/ai-chat.entity.js';
import { AuditableUuidEntity } from '@src/data/entity/base.entity.js';
import {
  Column,
  type DataSource,
  Entity,
  JoinColumn,
  ManyToOne,
  type Relation,
  Repository,
} from 'typeorm';

@Entity('ai_chat_message')
export class AiChatMessageEntity extends AuditableUuidEntity {
  /** 채팅방 ID */
  @Column()
  chatId!: string;

  /** 역할 (user, assistant) */
  @Column()
  role!: 'user' | 'assistant';

  /** 메시지 내용 */
  @Column()
  content!: string;

  @ManyToOne(
    () => AiChatEntity,
    (chat) => chat.messages
  )
  @JoinColumn({ name: 'chat_id' })
  chat?: Relation<AiChatEntity>;
}

@Injectable()
export class AiChatMessageRepository extends Repository<AiChatMessageEntity> {
  constructor(dataSource: DataSource) {
    super(AiChatMessageEntity, dataSource.createEntityManager());
  }
}
