import { END } from '@langchain/langgraph';
import type { DebateState } from './debate.state.js';
import { DEBATE_STARTER_NODE } from './debate-starter.node.js';
import { DEBATE_TOOL_NODE } from './debate-tool.node.js';
import { UNKNOWN_HANDLER_NODE } from './unknown-handler.node.js';

export function supervisorEdge(state: DebateState): string {
  if (state.errorMessage) return UNKNOWN_HANDLER_NODE.description!;
  if (state.nodeRequest?.command === 'DEBATE_START') return DEBATE_STARTER_NODE.description!;
  if (state.response.data) return END;
  return UNKNOWN_HANDLER_NODE.description!;
}

export function debateStarterEdge(state: DebateState): string {
  if (state.errorMessage) return UNKNOWN_HANDLER_NODE.description!;
  if (state.nodeRequest?.command === 'GET_DEBATE_INFO') return DEBATE_TOOL_NODE.description!;
  if (state.response.data) return END;
  return UNKNOWN_HANDLER_NODE.description!;
}

export function debateToolEdge(state: DebateState): string {
  if (state.errorMessage) return UNKNOWN_HANDLER_NODE.description!;
  if (state.nodeRequest?.command === 'DEBATE_START') return DEBATE_STARTER_NODE.description!;
  return UNKNOWN_HANDLER_NODE.description!;
}
