import { Injectable } from '@nestjs/common';
import { AuditableLongIdEntity } from '@src/data/entity/base.entity.js';
import { Column, type DataSource, Entity, Repository } from 'typeorm';

@Entity('debate_summarization')
export class DebateSummarizationEntity extends AuditableLongIdEntity {
  /** 토론방 ID */
  @Column({ name: 'debate_id' })
  debateId!: string;

  /** 요약 내용 */
  @Column({ name: 'content' })
  content!: string;
}

@Injectable()
export class DebateSummarizationRepository extends Repository<DebateSummarizationEntity> {
  constructor(dataSource: DataSource) {
    super(DebateSummarizationEntity, dataSource.createEntityManager());
  }
}
