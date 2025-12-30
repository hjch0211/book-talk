import { ChatOpenAI } from '@langchain/openai';
import { Module } from '@nestjs/common';
import { PROMPT_STUDIO_AGENT, type PromptStudioAgent } from '@src/client';
import { DEBATE_STARTER_NODE, DebateStarterNode } from '@src/debate/graph/debate-starter.node';
import { DEBATE_TOOL_NODE, DebateToolNode } from '@src/debate/graph/debate-tool.node';
import { SUPERVISOR_NODE, SupervisorNode } from '@src/debate/graph/supervisor.node';
import { UNKNOWN_HANDLER_NODE, UnknownHandlerNode } from '@src/debate/graph/unknown-handler.node';
import { DebateController } from './debate.controller';
import { DEBATE_SERVICE, DebateService } from './debate.service';
import { DEBATE_GRAPH, DebateGraph } from './graph/debate.graph';

@Module({
  controllers: [DebateController],
  providers: [
    { provide: DEBATE_GRAPH, useClass: DebateGraph },
    { provide: DEBATE_SERVICE, useClass: DebateService },
    {
      provide: SUPERVISOR_NODE,
      useFactory: async (promptStudioAgent: PromptStudioAgent) => {
        /** TODO: 환경변수로 빼야됨 */
        const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 });
        const prompt = await promptStudioAgent.getPrompt('debates/supervisor');
        if (!prompt) {
          throw new Error(`[SupervisorNodeProvider] Prompt not found`);
        }

        return new SupervisorNode(model, prompt);
      },
      inject: [PROMPT_STUDIO_AGENT],
    },
    {
      provide: DEBATE_STARTER_NODE,
      useFactory: async (promptStudio: PromptStudioAgent) => {
        const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 });

        const prompt = await promptStudio.getPrompt('debates/debate-starter');
        if (!prompt) {
          throw new Error('[DebateStarterNode] prompt not found');
        }

        return new DebateStarterNode(model, prompt);
      },
      inject: [PROMPT_STUDIO_AGENT],
    },
    { provide: DEBATE_TOOL_NODE, useClass: DebateToolNode },
    { provide: UNKNOWN_HANDLER_NODE, useClass: UnknownHandlerNode },
  ],
})
export class DebateModule {}
