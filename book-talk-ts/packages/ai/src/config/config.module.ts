import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { BooktalkProperties } from '@src/config/booktalk.properties.js';
import { DatabaseProperties } from '@src/config/database.properties.js';
import { LangfuseProperties } from '@src/config/langfuse.properties.js';
import { OpenAIProperties } from '@src/config/openai.properties.js';
import { SlackProperties } from '@src/config/slack.properties.js';

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
    SlackProperties,
  ],
  exports: [
    BooktalkProperties,
    DatabaseProperties,
    LangfuseProperties,
    OpenAIProperties,
    SlackProperties,
  ],
})
export class ConfigModule {}
