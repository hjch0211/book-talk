import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SlackProperties {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  /** Slack Webhook URL */
  get webhookUrl(): string {
    return this.configService.get<string>('SLACK_WEBHOOK_URL') ?? '';
  }

  isValid(): boolean {
    return !!this.webhookUrl;
  }
}
