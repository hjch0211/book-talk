import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * OpenAI 관련 환경 변수 설정
 */
@Injectable()
export class OpenAIProperties {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  /** OpenAI API Key */
  get apiKey(): string {
    return this.configService.get<string>('OPENAI_API_KEY') ?? '';
  }

  public isValid(): boolean {
    return !!this.apiKey;
  }
}
