import type { Callbacks } from '@langchain/core/callbacks/manager';
import type { AIMessage } from '@langchain/core/messages';
import { HumanMessage, ToolMessage } from '@langchain/core/messages';
import { END, START, StateGraph } from '@langchain/langgraph';
import { Inject, Injectable } from '@nestjs/common';
import {
  DEBATE_CLIENT,
  type DebateClient,
  type DebateInfo,
  PROMPT_STUDIO_AGENT,
  type PromptStudioAgent,
} from '@src/client';
import {
  RECOMMEND_TOPIC,
  RECOMMEND_TOPIC_TOOLS,
  START_DEBATE,
  START_DEBATE_TOOLS,
  SUPERVISOR,
  UNKNOWN_HANDLER,
} from './constants';
import { type DebateState, DebateStateAnnotation } from './debate.state';
import { recommendTopicNode } from './nodes/recommend-topic.node';
import { startDebateNode } from './nodes/start-debate.node';
import { supervisorNode } from './nodes/supervisor.node';
import { createDebateTools, type DebateTools, type ToolResult } from './nodes/tools.node';
import { unknownHandlerNode } from './nodes/unknown-handler.node';

export const DEBATE_GRAPH = Symbol.for('DEBATE_GRAPH');

/** Tool 호출 여부 확인 */
const hasToolCalls =
  (toolsNode: string) =>
  (state: DebateState): string => {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    return lastMessage?.tool_calls?.length ? toolsNode : END;
  };

/** Tool 결과에서 debateInfo 추출 */
const extractDebateInfo = (toolResult: ToolResult): DebateInfo | null => {
  if (toolResult.toolName === 'findDebate' && toolResult.success && toolResult.data) {
    const data = toolResult.data as { debateInfo?: DebateInfo };
    return data.debateInfo ?? null;
  }
  return null;
};

/** Tool 실행 노드 */
const toolNode = (tools: DebateTools) => {
  const toolMap = new Map(tools.map((t) => [t.name, t]));

  return async (state: DebateState): Promise<Partial<DebateState>> => {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    const toolCalls = lastMessage.tool_calls ?? [];

    let debateInfo: DebateInfo | null = null;

    const toolMessages = await Promise.all(
      toolCalls.map(async (call) => {
        const tool = toolMap.get(call.name);
        const result = tool ? await tool.invoke(call.args) : `Tool ${call.name} not found`;

        // Tool 결과에서 debateInfo 추출
        try {
          const parsed = JSON.parse(result as string) as ToolResult;
          const extracted = extractDebateInfo(parsed);
          if (extracted) {
            debateInfo = extracted;
          }
        } catch {
          // JSON 파싱 실패 시 무시
        }

        return new ToolMessage({
          tool_call_id: call.id ?? '',
          content: result,
        });
      })
    );

    return {
      messages: toolMessages,
      debateInfo,
    };
  };
};

@Injectable()
export class DebateGraph {
  private readonly graph: ReturnType<typeof this.createGraph>;

  constructor(
    @Inject(DEBATE_CLIENT)
    private readonly debateClient: DebateClient,
    @Inject(PROMPT_STUDIO_AGENT)
    private readonly promptStudio: PromptStudioAgent
  ) {
    this.graph = this.createGraph();
  }

  async run(
    message: string,
    sessionId: string,
    debateId?: string,
    callbacks?: Callbacks
  ): Promise<string> {
    const result = await this.graph.invoke(
      {
        messages: [new HumanMessage(message)],
        debateId: debateId ?? '',
      },
      {
        configurable: { thread_id: sessionId },
        callbacks,
      }
    );

    return result.response;
  }

  private createGraph() {
    const tools = createDebateTools(this.debateClient);
    const executeTools = toolNode(tools);

    return new StateGraph(DebateStateAnnotation)
      .addNode(SUPERVISOR, supervisorNode(this.promptStudio))
      .addNode(START_DEBATE, startDebateNode(tools, this.promptStudio))
      .addNode(START_DEBATE_TOOLS, executeTools)
      .addNode(RECOMMEND_TOPIC, recommendTopicNode(tools, this.promptStudio))
      .addNode(RECOMMEND_TOPIC_TOOLS, executeTools)
      .addNode(UNKNOWN_HANDLER, unknownHandlerNode)

      .addEdge(START, SUPERVISOR)
      .addConditionalEdges(
        SUPERVISOR,
        ({ next }: DebateState) => {
          if (next === START_DEBATE) return START_DEBATE;
          if (next === RECOMMEND_TOPIC) return RECOMMEND_TOPIC;
          return UNKNOWN_HANDLER;
        },
        [START_DEBATE, RECOMMEND_TOPIC, UNKNOWN_HANDLER]
      )
      .addConditionalEdges(START_DEBATE, hasToolCalls(START_DEBATE_TOOLS), [
        START_DEBATE_TOOLS,
        END,
      ])
      .addEdge(START_DEBATE_TOOLS, START_DEBATE)
      .addConditionalEdges(RECOMMEND_TOPIC, hasToolCalls(RECOMMEND_TOPIC_TOOLS), [
        RECOMMEND_TOPIC_TOOLS,
        END,
      ])
      .addEdge(RECOMMEND_TOPIC_TOOLS, RECOMMEND_TOPIC)
      .addEdge(UNKNOWN_HANDLER, END)
      .compile();
  }
}
