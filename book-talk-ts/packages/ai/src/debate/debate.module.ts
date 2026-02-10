import { ChatOpenAI } from '@langchain/openai';
import { Module } from '@nestjs/common';
import { PROMPT_STUDIO_CLIENT, type PromptStudioClient } from '@src/client/prompt-studio.client.js';
import { DebateController } from '@src/debate/debate.controller.js';
import { DEBATE_SERVICE, DebateService } from '@src/debate/debate.service.js';
import { DEBATE_CHAT_SERVICE, DebateChatService } from '@src/debate/debate-chat.service.js';
import { DEBATE_GRAPH, DebateGraph } from '@src/debate/graph/debate.graph.js';
import {
  DEBATE_PERSONA_A_NODE,
  DebatePersonaANode,
} from '@src/debate/graph/debate-persona-a.node.js';
import { DEBATE_STARTER_NODE, DebateStarterNode } from '@src/debate/graph/debate-starter.node.js';
import { DEBATE_TOOL_NODE, DebateToolNode } from '@src/debate/graph/debate-tool.node.js';
import { SUPERVISOR_NODE, SupervisorNode } from '@src/debate/graph/supervisor.node.js';
import {
  UNKNOWN_HANDLER_NODE,
  UnknownHandlerNode,
} from '@src/debate/graph/unknown-handler.node.js';

@Module({
  controllers: [DebateController],
  providers: [
    { provide: DEBATE_GRAPH, useClass: DebateGraph },
    { provide: DEBATE_SERVICE, useClass: DebateService },
    { provide: DEBATE_CHAT_SERVICE, useClass: DebateChatService },
    {
      provide: SUPERVISOR_NODE,
      useFactory: async (promptStudioAgent: PromptStudioClient) => {
        /** TODO: 환경변수로 빼야됨 */
        const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 });
        const prompt = await promptStudioAgent.getPrompt('debates/supervisor');
        if (!prompt) {
          throw new Error(`[SupervisorNodeProvider] Prompt not found`);
        }

        return new SupervisorNode(model, prompt);
      },
      inject: [PROMPT_STUDIO_CLIENT],
    },
    {
      provide: DEBATE_STARTER_NODE,
      useFactory: async (promptStudio: PromptStudioClient) => {
        const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 });

        const prompt = await promptStudio.getPrompt('debates/debate-starter');
        if (!prompt) {
          throw new Error('[DebateStarterNode] prompt not found');
        }

        return new DebateStarterNode(model, prompt);
      },
      inject: [PROMPT_STUDIO_CLIENT],
    },
    {
      provide: DEBATE_PERSONA_A_NODE,
      useFactory: async (promptStudio: PromptStudioClient) => {
        const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 });

        const prompt = await promptStudio.getPrompt('debates/persona-a');
        if (!prompt) {
          throw new Error('[DebatePersonaANode] prompt not found');
        }

        return new DebatePersonaANode(model, prompt);
      },
      inject: [PROMPT_STUDIO_CLIENT],
    },
    { provide: DEBATE_TOOL_NODE, useClass: DebateToolNode },
    { provide: UNKNOWN_HANDLER_NODE, useClass: UnknownHandlerNode },
  ],
})
export class DebateModule {}
