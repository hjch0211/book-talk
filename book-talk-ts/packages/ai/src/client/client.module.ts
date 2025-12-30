import { Global, Inject, Logger, Module, type OnModuleDestroy } from '@nestjs/common';
import { BooktalkProperties, LangfuseProperties } from '@src/config';
import {
  BooktalkDebateClient,
  DEBATE_CLIENT,
  type DebateClient,
  NoOpDebateClient,
} from './debate.client';
import {
  LangfusePromptStudioAgent,
  NoOpPromptStudioAgent,
  PROMPT_STUDIO_AGENT,
  type PromptStudioAgent,
} from './prompt-studio.agent';

@Global()
@Module({
  providers: [
    {
      provide: PROMPT_STUDIO_AGENT,
      inject: [LangfuseProperties],
      useFactory: (props: LangfuseProperties): PromptStudioAgent => {
        if (props.isValid()) {
          return new LangfusePromptStudioAgent({
            publicKey: props.publicKey,
            secretKey: props.secretKey,
            baseUrl: props.baseUrl,
          });
        }
        Logger.warn('Langfuse 설정이 유효하지 않아 NoOp Agent가 사용됩니다.');
        return new NoOpPromptStudioAgent();
      },
    },
    {
      provide: DEBATE_CLIENT,
      inject: [BooktalkProperties],
      useFactory: (props: BooktalkProperties): DebateClient => {
        if (props.isValid()) {
          return new BooktalkDebateClient({ baseUrl: props.baseUrl });
        }
        Logger.warn('Booktalk 설정이 유효하지 않아 NoOp Client가 사용됩니다.');
        return new NoOpDebateClient();
      },
    },
  ],
  exports: [PROMPT_STUDIO_AGENT, DEBATE_CLIENT],
})
export class ClientModule implements OnModuleDestroy {
  constructor(
    @Inject(PROMPT_STUDIO_AGENT)
    private readonly agent: PromptStudioAgent
  ) {}

  async onModuleDestroy() {
    await this.agent.shutdown();
  }
}
