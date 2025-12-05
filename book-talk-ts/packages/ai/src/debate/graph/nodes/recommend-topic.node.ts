import type { AIMessage } from '@langchain/core/messages';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { Runnable } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import type { PromptStudioAgent } from '@src/client';
import type { DebateTools } from '@src/debate/graph/nodes/tools.node';
import type { DebateState } from '../debate.state';

/** Recommend Topic Agent 노드 */
export const recommendTopicNode = (tools: DebateTools, promptStudio: PromptStudioAgent) => {
  let model: Runnable | null = null;
  let cachedPrompt: string | null = null;

  return async (state: DebateState): Promise<Partial<DebateState>> => {
    if (!model) {
      model = new ChatOpenAI({
        model: 'gpt-4o-mini',
        temperature: 0.8,
      }).bindTools(tools);
    }

    if (!cachedPrompt) {
      cachedPrompt = (await promptStudio.getPrompt('debate/recommend-topic')) ?? '';
    }

    const { debateId, debateInfo, messages } = state;
    const lastMessage = messages[messages.length - 1];

    // debateInfo가 있으면 컨텍스트에 포함
    const contextParts = [];
    if (debateId) contextParts.push(`debateId: ${debateId}`);
    if (debateInfo) {
      contextParts.push(`토론 정보: ${JSON.stringify(debateInfo)}`);
    }
    contextParts.push(`사용자 요청: ${lastMessage.content}`);

    const userContext = contextParts.join('\n');

    const aiResponse = (await model.invoke([
      new SystemMessage(cachedPrompt),
      new HumanMessage(userContext),
    ])) as AIMessage;

    // tool_calls가 없으면 최종 응답으로 간주
    const hasToolCalls = aiResponse.tool_calls && aiResponse.tool_calls.length > 0;

    return {
      messages: [aiResponse],
      ...(!hasToolCalls && { response: aiResponse.content as string }),
    };
  };
};
