import { END, START, StateGraph } from '@langchain/langgraph';
import { CallbackHandler } from '@langfuse/langchain';
import { Inject, Injectable } from '@nestjs/common';
import type { AiResponse } from '@src/ai-response.js';
import { type ChatHistory, DebateStateAnnotation } from '@src/debate/graph/debate.state.js';
import {
  DEBATE_STARTER_NODE,
  type DebateStarterNode,
} from '@src/debate/graph/debate-starter.node.js';
import {
  UNKNOWN_HANDLER_NODE,
  type UnknownHandlerNode,
} from '@src/debate/graph/unknown-handler.node.js';
import {
  DebateToolInPersonaEdge,
  debateStarterEdge,
  debateToolEdge,
  personaEdge,
  supervisorEdge,
} from './debate.edges.js';
import { DEBATE_PERSONA_A_NODE, type DebatePersonaANode } from './debate-persona-a.node.js';
import { DEBATE_TOOL_NODE, type DebateToolNode } from './debate-tool.node.js';
import { SUPERVISOR_NODE, type SupervisorNode } from './supervisor.node.js';

export const DEBATE_GRAPH = Symbol.for('DEBATE_GRAPH');

@Injectable()
export class DebateGraph {
  private readonly moderatorGraph: ReturnType<typeof this.createModeratorGraph>;
  private readonly aiDebateGraph: ReturnType<typeof this.createAiDebateGraph>;

  constructor(
    @Inject(SUPERVISOR_NODE)
    private readonly supervisorNode: SupervisorNode,
    @Inject(UNKNOWN_HANDLER_NODE)
    private readonly unknownHandlerNode: UnknownHandlerNode,
    @Inject(DEBATE_STARTER_NODE)
    private readonly debateStarterNode: DebateStarterNode,
    @Inject(DEBATE_TOOL_NODE)
    private readonly debateToolNode: DebateToolNode,
    @Inject(DEBATE_PERSONA_A_NODE)
    private readonly debatePersonaANode: DebatePersonaANode
  ) {
    this.moderatorGraph = this.createModeratorGraph();
    this.aiDebateGraph = this.createAiDebateGraph();
  }

  async runModerator(
    chatHistory: ChatHistory[],
    request: string,
    debateId: string
  ): Promise<AiResponse> {
    const result = await this.moderatorGraph.invoke(
      { chatHistory, request, debateId },
      {
        callbacks: [new CallbackHandler()],
        metadata: {
          runName: 'debate-moderator',
          tags: ['debate'],
        },
      }
    );
    return result.response;
  }

  async runAiDebate(
    chatHistory: ChatHistory[],
    request: string,
    debateId: string
  ): Promise<AiResponse> {
    const result = await this.aiDebateGraph.invoke(
      { chatHistory, request, debateId },
      {
        callbacks: [new CallbackHandler()],
        metadata: {
          runName: 'debate-ai-debate',
          tags: ['debate'],
        },
      }
    );
    return result.response;
  }

  private createModeratorGraph() {
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
      .addConditionalEdges(SUPERVISOR_NODE.description!, supervisorEdge, [
        DEBATE_STARTER_NODE.description!,
        UNKNOWN_HANDLER_NODE.description!,
        END,
      ])
      .addConditionalEdges(DEBATE_STARTER_NODE.description!, debateStarterEdge, [
        DEBATE_TOOL_NODE.description!,
        UNKNOWN_HANDLER_NODE.description!,
        END,
      ])
      .addConditionalEdges(DEBATE_TOOL_NODE.description!, debateToolEdge, [
        DEBATE_STARTER_NODE.description!,
        UNKNOWN_HANDLER_NODE.description!,
      ])
      .addEdge(UNKNOWN_HANDLER_NODE.description!, END)
      .compile();
  }

  private createAiDebateGraph() {
    // TODO: 페르소나 추가 필요
    const { node, symbol } = this.getPersonaConfig('a');

    return new StateGraph(DebateStateAnnotation)
      .addNode(symbol.description!, node.process.bind(node))
      .addNode(
        DEBATE_TOOL_NODE.description!,
        this.debateToolNode.getDebateStarterTool.bind(this.debateToolNode)
      )
      .addNode(
        UNKNOWN_HANDLER_NODE.description!,
        this.unknownHandlerNode.process.bind(this.unknownHandlerNode)
      )
      .addEdge(START, symbol.description!)
      .addConditionalEdges(symbol.description!, personaEdge, [
        DEBATE_TOOL_NODE.description!,
        UNKNOWN_HANDLER_NODE.description!,
        END,
      ])
      .addConditionalEdges(DEBATE_TOOL_NODE.description!, DebateToolInPersonaEdge(symbol), [
        symbol.description!,
        UNKNOWN_HANDLER_NODE.description!,
      ])
      .addEdge(UNKNOWN_HANDLER_NODE.description!, END)
      .compile();
  }

  private getPersonaConfig(persona: 'a') {
    switch (persona) {
      case 'a':
        return { node: this.debatePersonaANode, symbol: DEBATE_PERSONA_A_NODE };
    }
  }
}
