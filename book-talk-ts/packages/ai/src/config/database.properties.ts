import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseProperties {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  /** 데이터베이스 호스트 */
  get host(): string {
    return this.configService.get<string>('DB_HOST') ?? 'localhost';
  }

  /** 데이터베이스 포트 */
  get port(): number {
    return this.configService.get<number>('DB_PORT') ?? 5438;
  }

  /** 데이터베이스 이름 */
  get database(): string {
    return this.configService.get<string>('DB_NAME') ?? 'booktalk';
  }

  /** 데이터베이스 사용자 */
  get username(): string {
    return this.configService.get<string>('DB_USER') ?? '';
  }

  /** 데이터베이스 비밀번호 */
  get password(): string {
    return this.configService.get<string>('DB_PASSWORD') ?? '';
  }

  /** SQL 로깅 여부 */
  get logging(): boolean {
    const showSql = this.configService.get<string>('JPA_SHOW_SQL');
    return showSql === 'true';
  }

  public isValid(): boolean {
    return !!this.username && !!this.password;
  }
}
