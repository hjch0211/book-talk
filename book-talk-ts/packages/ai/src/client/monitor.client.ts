import { Logger } from '@nestjs/common';
import axios from 'axios';

export const MONITOR_CLIENT = Symbol.for('MONITOR_CLIENT');

/** 알림 요청 */
export interface SendRequest {
  title: string;
  message: string;
  stackTrace: string;
  level: 'ERROR';
}

/** 모니터링 클라이언트 인터페이스 */
export interface MonitorClient {
  send(request: SendRequest): Promise<void>;
}

/** Slack 모니터링 클라이언트 */
export class SlackMonitorClient implements MonitorClient {
  constructor(private readonly webhookUrl: string) {}

  async send(request: SendRequest): Promise<void> {
    try {
      const response = await axios.post(this.webhookUrl, {
        blocks: this.buildBlocks(request),
      });

      if (response.status < 200 || response.status >= 300) {
        Logger.error(`Slack 알림 전송 실패: ${response.status}`);
      }
    } catch (error) {
      /** livelock 방지를 위해 예외 전파 x */
      Logger.error(`Slack 알림 처리 중 예외 발생: ${error}`);
    }
  }

  private buildBlocks(request: SendRequest): object[] {
    switch (request.level) {
      case 'ERROR':
        return [
          this.headerBlock(`:rotating_light: ${request.title}`),
          this.sectionBlock(`*- message*: ${request.message}`),
          this.sectionBlock(`*- stack trace*:\n\`\`\`${request.stackTrace}\`\`\``),
        ];
    }
  }

  private headerBlock(text: string) {
    return {
      type: 'header',
      text: { type: 'plain_text', text },
    };
  }

  private sectionBlock(text: string) {
    return {
      type: 'section',
      text: { type: 'mrkdwn', text },
    };
  }
}

/** NoOp 모니터링 클라이언트 */
export class NoOpMonitorClient implements MonitorClient {
  async send(request: SendRequest): Promise<void> {
    Logger.warn(`[NoOp] monitor send: ${JSON.stringify(request)}`);
  }
}
