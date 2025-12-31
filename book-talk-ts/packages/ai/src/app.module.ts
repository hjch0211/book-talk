import { Module } from '@nestjs/common';
import { ClientModule } from '@src/client/client.module.js';
import { ConfigModule } from '@src/config/config.module.js';
import { DataModule } from '@src/data/data.module.js';
import { DebateModule } from './debate/debate.module.js';

@Module({
  imports: [ConfigModule, DataModule, ClientModule, DebateModule],
})
export class AppModule {}
