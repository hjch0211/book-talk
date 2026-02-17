import { LangfuseSpanProcessor } from '@langfuse/otel';
import { Global, Inject, Logger, Module, type OnModuleDestroy } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BooktalkDebateClient,
  DEBATE_CLIENT,
  type DebateClient,
  NoOpDebateClient,
} from '@src/client/debate.client.js';
import {
  MONITOR_CLIENT,
  type MonitorClient,
  NoOpMonitorClient,
  SlackMonitorClient,
} from '@src/client/monitor.client.js';
import {
  LangfusePromptStudioClient,
  NoOpPromptStudioClient,
  PROMPT_STUDIO_CLIENT,
  type PromptStudioClient,
} from '@src/client/prompt-studio.client.js';
import { BooktalkProperties } from '@src/config/booktalk.properties.js';
import { LangfuseProperties } from '@src/config/langfuse.properties.js';
import { SlackProperties } from '@src/config/slack.properties.js';

@Global()
@Module({
  providers: [
    {
      provide: PROMPT_STUDIO_CLIENT,
      inject: [LangfuseProperties],
      useFactory: (props: LangfuseProperties): PromptStudioClient => {
        if (props.isValid()) {
          const sdk = new NodeSDK({
            spanProcessors: [
              new LangfuseSpanProcessor({
                publicKey: props.publicKey,
                secretKey: props.secretKey,
                baseUrl: props.baseUrl,
                environment: process.env.NODE_ENV ?? 'development',
              }),
            ],
          });

          sdk.start();
          Logger.log('Langfuse otel 초기화 성공');

          return new LangfusePromptStudioClient(
            {
              publicKey: props.publicKey,
              secretKey: props.secretKey,
              baseUrl: props.baseUrl,
            },
            sdk
          );
        }
        Logger.warn('Langfuse 설정이 유효하지 않아 NoOp Agent가 사용됩니다.');
        return new NoOpPromptStudioClient();
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
    {
      provide: MONITOR_CLIENT,
      inject: [SlackProperties],
      useFactory: (props: SlackProperties): MonitorClient => {
        if (props.isValid()) {
          return new SlackMonitorClient(props.webhookUrl);
        }
        Logger.warn('Slack 설정이 유효하지 않아 NoOp MonitorClient가 사용됩니다.');
        return new NoOpMonitorClient();
      },
    },
  ],
  exports: [PROMPT_STUDIO_CLIENT, DEBATE_CLIENT, MONITOR_CLIENT],
})
export class ClientModule implements OnModuleDestroy {
  constructor(
    @Inject(PROMPT_STUDIO_CLIENT)
    private readonly agent: PromptStudioClient
  ) {}

  async onModuleDestroy() {
    await this.agent.shutdown();
  }
}
