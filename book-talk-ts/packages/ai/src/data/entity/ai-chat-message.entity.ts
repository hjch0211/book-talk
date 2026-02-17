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
  /** 역할 (user, assistant) */
  @Column({ name: 'role' })
  role!: 'user' | 'assistant';

  /** 메시지 내용 */
  @Column({ name: 'content' })
  content!: string;

  @ManyToOne(() => AiChatEntity)
  @JoinColumn({ name: 'chat_id' })
  chat?: Relation<AiChatEntity>;
}

@Injectable()
export class AiChatMessageRepository extends Repository<AiChatMessageEntity> {
  constructor(dataSource: DataSource) {
    super(AiChatMessageEntity, dataSource.createEntityManager());
  }
}
