import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Langfuse 관련 환경 변수 설정
 */
@Injectable()
export class LangfuseProperties {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  /** Langfuse Public Key */
  get publicKey(): string {
    return this.configService.get<string>('LANGFUSE_PUBLIC_KEY') ?? '';
  }

  /** Langfuse Secret Key */
  get secretKey(): string {
    return this.configService.get<string>('LANGFUSE_SECRET_KEY') ?? '';
  }

  /** Langfuse 서버 URL */
  get baseUrl(): string {
    return this.configService.get<string>('LANGFUSE_BASE_URL') ?? '';
  }

  public isValid(): boolean {
    return !!this.publicKey && !!this.secretKey && !!this.baseUrl;
  }
}