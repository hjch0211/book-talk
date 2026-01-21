import { END, START, StateGraph } from '@langchain/langgraph';
import type { CallbackHandler } from '@langfuse/langchain';
import { Inject, Injectable } from '@nestjs/common';
import {
  type ChatHistory,
  type DebateState,
  DebateStateAnnotation,
  type Response,
} from '@src/debate/graph/debate.state.js';
import {
  DEBATE_STARTER_NODE,
  type DebateStarterNode,
} from '@src/debate/graph/debate-starter.node.js';
import {
  UNKNOWN_HANDLER_NODE,
  type UnknownHandlerNode,
} from '@src/debate/graph/unknown-handler.node.js';
import { DEBATE_TOOL_NODE, type DebateToolNode } from './debate-tool.node.js';
import { SUPERVISOR_NODE, type SupervisorNode } from './supervisor.node.js';

export const DEBATE_GRAPH = Symbol.for('DEBATE_GRAPH');

@Injectable()
export class DebateGraph {
  private readonly graph: ReturnType<typeof this.createGraph>;

  constructor(
    @Inject(SUPERVISOR_NODE)
    private readonly supervisorNode: SupervisorNode,
    @Inject(UNKNOWN_HANDLER_NODE)
    private readonly unknownHandlerNode: UnknownHandlerNode,
    @Inject(DEBATE_STARTER_NODE)
    private readonly debateStarterNode: DebateStarterNode,
    @Inject(DEBATE_TOOL_NODE)
    private readonly debateToolNode: DebateToolNode
  ) {
    this.graph = this.createGraph();
  }

  async run(
    chatHistory: ChatHistory[],
    request: string,
    debateId: string,
    callback: CallbackHandler
  ): Promise<Response> {
    const result = await this.graph.invoke(
      { chatHistory, request, debateId },
      {
        callbacks: [callback],
        metadata: {
          langfuseSessionId: debateId,
          runName: 'debate-agent',
          tags: ['debate'],
        },
      }
    );
    return result.response;
  }

  private createGraph() {
    return new StateGraph(DebateStateAnnotation)
      .addNode(SUPERVISOR_NODE.description!, this.supervisorNode.process.bind(this.supervisorNode))
      .addNode(
        DEBATE_STARTER_NODE.description!,
        this.debateStarterNode.process.bind(this.debateStarterNode)
      )
      .addNode(
        UNKNOWN_HANDLER_NODE.description!,
        this.unknownHandlerNode.process.bind(this.unknownHandlerNode)
      )
      .addNode(
        DEBATE_TOOL_NODE.description!,
        this.debateToolNode.getDebateStarterTool.bind(this.debateToolNode)
      )
      .addEdge(START, SUPERVISOR_NODE.description!)
      .addConditionalEdges(SUPERVISOR_NODE.description!, ({ next }: DebateState) => next.node, [
        DEBATE_STARTER_NODE.description!,
        UNKNOWN_HANDLER_NODE.description!,
        END,
      ])
      .addConditionalEdges(DEBATE_STARTER_NODE.description!, ({ next }: DebateState) => next.node, [
        DEBATE_TOOL_NODE.description!,
        UNKNOWN_HANDLER_NODE.description!,
        END,
      ])
      .addConditionalEdges(DEBATE_TOOL_NODE.description!, ({ next }: DebateState) => next.node, [
        DEBATE_STARTER_NODE.description!,
        UNKNOWN_HANDLER_NODE.description!,
      ])
      .addEdge(UNKNOWN_HANDLER_NODE.description!, END)
      .compile();
  }
}
