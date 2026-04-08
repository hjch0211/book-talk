import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TavilyProperties {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  get apiKey(): string {
    return this.configService.get<string>('TAVILY_API_KEY') ?? '';
  }

  public isValid(): boolean {
    return !!this.apiKey;
  }
}
