import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseProperties } from '@src/config/database.properties.js';
import { AiChatEntity, AiChatRepository } from '@src/data/entity/ai-chat.entity.js';
import {
  AiChatMessageEntity,
  AiChatMessageRepository,
} from '@src/data/entity/ai-chat-message.entity.js';
import { DataSource } from 'typeorm';

export const AI_CHAT_REPOSITORY = Symbol.for('AI_CHAT_REPOSITORY');
export const AI_CHAT_MESSAGE_REPOSITORY = Symbol.for('AI_CHAT_MESSAGE_REPOSITORY');

export type { AiChatRepository, AiChatMessageRepository };

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [DatabaseProperties],
      useFactory: (props: DatabaseProperties) => ({
        type: 'postgres',
        host: props.host,
        port: props.port,
        database: props.database,
        username: props.username,
        password: props.password,
        logging: props.logging,
        synchronize: false,
        entities: [AiChatEntity, AiChatMessageEntity],
      }),
    }),
  ],
  providers: [
    {
      provide: AI_CHAT_REPOSITORY,
      useFactory: (dataSource: DataSource) => new AiChatRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: AI_CHAT_MESSAGE_REPOSITORY,
      useFactory: (dataSource: DataSource) => new AiChatMessageRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [AI_CHAT_REPOSITORY, AI_CHAT_MESSAGE_REPOSITORY],
})
export class DataModule {}
