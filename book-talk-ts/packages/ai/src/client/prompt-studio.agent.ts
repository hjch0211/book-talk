import { LangfuseClient } from '@langfuse/client';
import { CallbackHandler } from '@langfuse/langchain';

export const PROMPT_STUDIO_AGENT = Symbol.for('PROMPT_STUDIO_AGENT');

/** Prompt Studio Agent */
export interface PromptStudioAgent {
  /** 프롬프트 조회 (파일명으로) */
  getPrompt(name: string): Promise<string | null>;

  /** LangChain용 콜백 핸들러 생성 */
  createCallbackHandler(): CallbackHandler | null;

  /** 클라이언트 종료 */
  shutdown(): Promise<void>;
}

/** Langfuse 설정 */
export interface LangfuseConfig {
  publicKey: string;
  secretKey: string;
  baseUrl: string;
}

export class LangfusePromptStudioAgent implements PromptStudioAgent {
  private readonly langfuse: LangfuseClient;

  constructor(readonly config: LangfuseConfig) {
    this.langfuse = new LangfuseClient({
      publicKey: config.publicKey,
      secretKey: config.secretKey,
      baseUrl: config.baseUrl,
    });
  }

  async getPrompt(name: string): Promise<string | null> {
    try {
      const textPromptClient = await this.langfuse.prompt.get(name);
      return textPromptClient.prompt;
    } catch {
      return null;
    }
  }

  createCallbackHandler(): CallbackHandler {
    return new CallbackHandler();
  }

  async shutdown(): Promise<void> {
    await this.langfuse.shutdown();
  }
}

/** NoOp PromptStudioAgent */
export class NoOpPromptStudioAgent implements PromptStudioAgent {
  async getPrompt(_name: string): Promise<null> {
    return null;
  }

  createCallbackHandler(): null {
    return null;
  }

  async shutdown(): Promise<void> {}
}
