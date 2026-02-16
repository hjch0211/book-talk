import { END } from '@langchain/langgraph';
import type { DebateState } from './debate.state.js';
import { DEBATE_STARTER_NODE } from './debate-starter.node.js';
import { DEBATE_TOOL_NODE } from './debate-tool.node.js';
import { UNKNOWN_HANDLER_NODE } from './unknown-handler.node.js';

export function supervisorEdge(state: DebateState): string {
  if (state.errorMessage) return UNKNOWN_HANDLER_NODE.description!;
  if (state.call === 'DEBATE_START') return DEBATE_STARTER_NODE.description!;
  if (state.response.type === 'PLAIN_ANSWER') return END;
  return UNKNOWN_HANDLER_NODE.description!;
}

export function debateStarterEdge(state: DebateState): string {
  if (state.errorMessage) return UNKNOWN_HANDLER_NODE.description!;
  if (state.call === 'GET_DEBATE_INFO') return DEBATE_TOOL_NODE.description!;
  if (state.response.type === 'PLAIN_ANSWER') return END;
  return UNKNOWN_HANDLER_NODE.description!;
}

export function debateToolEdge(state: DebateState): string {
  if (state.errorMessage) return UNKNOWN_HANDLER_NODE.description!;
  if (state.debateInfo) return DEBATE_STARTER_NODE.description!;
  return UNKNOWN_HANDLER_NODE.description!;
}

export function personaEdge(state: DebateState): string {
  if (state.errorMessage) return UNKNOWN_HANDLER_NODE.description!;
  if (state.call === 'GET_DEBATE_INFO') return DEBATE_TOOL_NODE.description!;
  if (state.response.type === 'PLAIN_ANSWER') return END;
  return UNKNOWN_HANDLER_NODE.description!;
}

export function DebateToolInPersonaEdge(personaNodeSymbol: symbol) {
  return (state: DebateState): string => {
    if (state.errorMessage) return UNKNOWN_HANDLER_NODE.description!;
    if (state.debateInfo) return personaNodeSymbol.description!;
    return UNKNOWN_HANDLER_NODE.description!;
  };
}
