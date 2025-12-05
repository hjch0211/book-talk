import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BooktalkProperties {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  /** Booktalk API 서버 URL */
  get baseUrl(): string {
    return this.configService.get<string>('BOOKTALK_API_URL') ?? '';
  }

  isValid(): boolean {
    return !!this.baseUrl;
  }
}
