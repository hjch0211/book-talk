import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { BooktalkProperties } from './booktalk.properties';
import { DatabaseProperties } from './database.properties';
import { LangfuseProperties } from './langfuse.properties';
import { OpenAIProperties } from './openai.properties';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? [] : './.env.local',
    }),
  ],
  providers: [
    BooktalkProperties,
    DatabaseProperties,
    LangfuseProperties,
    OpenAIProperties,
  ],
  exports: [
    BooktalkProperties,
    DatabaseProperties,
    LangfuseProperties,
    OpenAIProperties,
  ],
})
export class ConfigModule {}
