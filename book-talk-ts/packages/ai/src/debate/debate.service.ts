import { Inject, Injectable } from '@nestjs/common';
import { DEBATE_CLIENT, type DebateClient } from '@src/client/debate.client.js';
import { DEBATE_SUMMARIZATION_REPOSITORY } from '@src/data/data.module.js';
import type { DebateSummarizationRepository } from '@src/data/entity/debate-summarization.entity.js';
import type { SummarizeRequest } from '@src/debate/_requests.js';
import { DEBATE_GRAPH, type DebateGraph } from '@src/debate/graph/debate.graph.js';

export const DEBATE_SERVICE = Symbol.for('DEBATE_SERVICE');

@Injectable()
export class DebateService {
  constructor(
    @Inject(DEBATE_GRAPH)
    private readonly debateGraph: DebateGraph,
    @Inject(DEBATE_SUMMARIZATION_REPOSITORY)
    private readonly debateSummarizationRepository: DebateSummarizationRepository,
    @Inject(DEBATE_CLIENT)
    private readonly debateClient: DebateClient
  ) {}

  /** 토론 요약 */
  async summarize(request: SummarizeRequest): Promise<void> {
    const { debateId } = request;

    const response = await this.debateGraph.runModerator([], '토론 시작', debateId);
    await this.debateSummarizationRepository.save({ debateId, content: response.message });
    await this.debateClient.notifySummaryCompleted(debateId);
  }
}
