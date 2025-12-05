export { ClientModule } from './client.module';
export {
  BooktalkDebateClient,
  type BooktalkConfig,
  DEBATE_CLIENT,
  type DebateClient,
  type DebateInfo,
  type BookInfo,
  type MemberInfo,
  type PresentationInfo,
  type RoundInfo,
  NoOpDebateClient,
} from './debate.client';
export {
  LangfusePromptStudioAgent,
  type LangfuseConfig,
  NoOpPromptStudioAgent,
  PROMPT_STUDIO_AGENT,
  type PromptStudioAgent,
} from './prompt-studio.agent';