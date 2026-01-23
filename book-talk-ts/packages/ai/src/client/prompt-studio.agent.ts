import { LangfuseClient } from '@langfuse/client';
import type { NodeSDK } from '@opentelemetry/sdk-node';

export const PROMPT_STUDIO_AGENT = Symbol.for('PROMPT_STUDIO_AGENT');

/** Prompt Studio Agent */
export interface PromptStudioAgent {
  /** 프롬프트 조회 (파일명으로) */
  getPrompt(name: string): Promise<string | null>;

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

  constructor(
    readonly config: LangfuseConfig,
    private readonly nodeSdk: NodeSDK
  ) {
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

  async shutdown(): Promise<void> {
    await this.langfuse.shutdown();
    await this.nodeSdk.shutdown();
  }
}

/** NoOp PromptStudioAgent */
export class NoOpPromptStudioAgent implements PromptStudioAgent {
  async getPrompt(_name: string): Promise<null> {
    return null;
  }

  async shutdown(): Promise<void> {}
}
