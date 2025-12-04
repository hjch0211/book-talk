import { Module } from '@nestjs/common';
import { ClientModule } from '@src/client';
import { ConfigModule } from '@src/config';
import { DataModule } from '@src/data/data.module';
import { DebateModule } from './debate/debate.module';

@Module({
  imports: [ConfigModule, DataModule, ClientModule, DebateModule],
})
export class AppModule {}
