import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import type { PromptStudioAgent } from '@src/client';
import { always, cond, equals, T } from 'ramda';
import { RECOMMEND_TOPIC, START_DEBATE, UNKNOWN_HANDLER } from '../constants';
import type { DebateState, NextNode } from '../debate.state';

interface SupervisorResponse {
  command: 'start_debate' | 'recommend_topic' | 'unknown';
  debateId: string | null;
}

const routeByCommand = cond<[string], NextNode>([
  [equals('start_debate'), always(START_DEBATE)],
  [equals('recommend_topic'), always(RECOMMEND_TOPIC)],
  [T, always(UNKNOWN_HANDLER)],
]);

/** Supervisor 노드 */
export const supervisorNode = (promptStudio: PromptStudioAgent) => {
  let cachedPrompt: string | null = null;

  return async (state: DebateState): Promise<Partial<DebateState>> => {
    if (!cachedPrompt) {
      cachedPrompt = (await promptStudio.getPrompt('debate/supervisor')) ?? '';
    }

    const lastMessage = state.messages[state.messages.length - 1];

    const response = await new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0,
    }).invoke([new SystemMessage(cachedPrompt), new HumanMessage(lastMessage.content as string)]);

    const content = (response.content as string).trim();

    try {
      const parsed: SupervisorResponse = JSON.parse(content);

      return {
        next: routeByCommand(parsed.command),
        debateId: parsed.debateId ?? state.debateId,
      };
    } catch {
      return { next: UNKNOWN_HANDLER };
    }
  };
};
