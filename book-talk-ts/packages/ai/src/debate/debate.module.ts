import { ChatOpenAI } from '@langchain/openai';
import { Module } from '@nestjs/common';
import { PROMPT_STUDIO_CLIENT, type PromptStudioClient } from '@src/client/prompt-studio.client.js';
import {
  DebatePersonaAAgentResponseSchema,
  DebateStarterAgentResponseSchema,
  SupervisorAgentResponseSchema,
} from '@src/debate/_responses.js';
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
import { createAgent, providerStrategy } from 'langchain';

@Module({
  controllers: [DebateController],
  providers: [
    { provide: DEBATE_GRAPH, useClass: DebateGraph },
    { provide: DEBATE_SERVICE, useClass: DebateService },
    { provide: DEBATE_CHAT_SERVICE, useClass: DebateChatService },
    {
      provide: SUPERVISOR_NODE,
      useFactory: async (promptStudioAgent: PromptStudioClient) => {
        const prompt = await promptStudioAgent.getPrompt('debates/supervisor');
        if (!prompt) {
          throw new Error(`[SupervisorNodeProvider] Prompt not found`);
        }

        const agent = createAgent({
          model: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 }).withRetry({
            stopAfterAttempt: 3,
          }),
          systemPrompt: prompt,
          responseFormat: providerStrategy(SupervisorAgentResponseSchema),
        });

        return new SupervisorNode(agent);
      },
      inject: [PROMPT_STUDIO_CLIENT],
    },
    {
      provide: DEBATE_STARTER_NODE,
      useFactory: async (promptStudio: PromptStudioClient) => {
        const prompt = await promptStudio.getPrompt('debates/debate-starter');
        if (!prompt) {
          throw new Error('[DebateStarterNode] prompt not found');
        }

        const agent = createAgent({
          model: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 }).withRetry({
            stopAfterAttempt: 3,
          }),
          systemPrompt: prompt,
          responseFormat: providerStrategy(DebateStarterAgentResponseSchema),
        });

        return new DebateStarterNode(agent);
      },
      inject: [PROMPT_STUDIO_CLIENT],
    },
    {
      provide: DEBATE_PERSONA_A_NODE,
      useFactory: async (promptStudio: PromptStudioClient) => {
        const prompt = await promptStudio.getPrompt('debates/persona-a');
        if (!prompt) {
          throw new Error('[DebatePersonaANode] prompt not found');
        }

        const agent = createAgent({
          model: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 }).withRetry({
            stopAfterAttempt: 3,
          }),
          systemPrompt: prompt,
          responseFormat: providerStrategy(DebatePersonaAAgentResponseSchema),
        });

        return new DebatePersonaANode(agent);
      },
      inject: [PROMPT_STUDIO_CLIENT],
    },
    { provide: DEBATE_TOOL_NODE, useClass: DebateToolNode },
    { provide: UNKNOWN_HANDLER_NODE, useClass: UnknownHandlerNode },
  ],
})
export class DebateModule {}
