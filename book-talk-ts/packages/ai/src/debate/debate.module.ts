import { Module } from '@nestjs/common';
import { DebateController } from './debate.controller';
import { DEBATE_SERVICE, DebateService } from './debate.service';
import { DEBATE_GRAPH, DebateGraph } from './graph/debate.graph';

@Module({
  controllers: [DebateController],
  providers: [
    { provide: DEBATE_GRAPH, useClass: DebateGraph },
    { provide: DEBATE_SERVICE, useClass: DebateService },
  ],
})
export class DebateModule {}