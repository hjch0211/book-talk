import { Langfuse } from 'langfuse';
import { CallbackHandler } from 'langfuse-langchain';

export const PROMPT_STUDIO_AGENT = Symbol.for('PROMPT_STUDIO_AGENT');

/** Prompt Studio Agent */
export interface PromptStudioAgent {
  /** 프롬프트 조회 (파일명으로) */
  getPrompt(name: string): Promise<string | null>;

  /** LangChain용 콜백 핸들러 생성 */
  createCallbackHandler(sessionId?: string): CallbackHandler | null;

  /** 트레이스 생성 */
  createTrace(name: string, metadata?: Record<string, unknown>): unknown;

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
  private readonly langfuse: Langfuse;

  constructor(private readonly config: LangfuseConfig) {
    this.langfuse = new Langfuse({
      publicKey: config.publicKey,
      secretKey: config.secretKey,
      baseUrl: config.baseUrl,
    });
  }

  async getPrompt(name: string): Promise<string | null> {
    try {
      const prompt = await this.langfuse.getPrompt(name);
      return prompt.prompt;
    } catch {
      return null;
    }
  }

  createCallbackHandler(sessionId?: string): CallbackHandler {
    return new CallbackHandler({
      publicKey: this.config.publicKey,
      secretKey: this.config.secretKey,
      baseUrl: this.config.baseUrl,
      sessionId,
    });
  }

  createTrace(name: string, metadata?: Record<string, unknown>) {
    return this.langfuse.trace({ name, metadata });
  }

  async shutdown(): Promise<void> {
    await this.langfuse.flushAsync();
    await this.langfuse.shutdownAsync();
  }
}

/** NoOp PromptStudioAgent */
export class NoOpPromptStudioAgent implements PromptStudioAgent {
  async getPrompt(_name: string): Promise<null> {
    return null;
  }

  createCallbackHandler(_sessionId?: string): null {
    return null;
  }

  createTrace(_name: string, _metadata?: Record<string, unknown>): null {
    return null;
  }

  async shutdown(): Promise<void> {}
}
