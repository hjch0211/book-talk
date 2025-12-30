import { Injectable } from '@nestjs/common';
import { Column, type DataSource, Entity, JoinColumn, ManyToOne, Repository } from 'typeorm';
import { AiChatEntity } from './ai-chat.entity';
import { AuditableUuidEntity } from './base.entity';

export type ChatRole = 'user' | 'assistant';

@Entity('ai_chat_message')
export class AiChatMessageEntity extends AuditableUuidEntity {
  /** 채팅방 ID */
  @Column({ name: 'chat_id', type: 'uuid' })
  chatId!: string;

  /** 역할 (user, assistant) */
  @Column({ type: 'varchar' })
  role!: ChatRole;

  /** 메시지 내용 */
  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(
    () => AiChatEntity,
    (chat) => chat.messages,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'chat_id' })
  chat?: AiChatEntity;
}

@Injectable()
export class AiChatMessageRepository extends Repository<AiChatMessageEntity> {
  constructor(dataSource: DataSource) {
    super(AiChatMessageEntity, dataSource.createEntityManager());
  }
}
