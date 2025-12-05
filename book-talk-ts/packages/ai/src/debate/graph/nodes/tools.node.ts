import type { StructuredToolInterface } from '@langchain/core/tools';
import { tool } from '@langchain/core/tools';
import type { DebateClient, DebateInfo } from '@src/client';
import { z } from 'zod';

/** Debate Tools 타입 */
export type DebateTools = StructuredToolInterface[];

/** Tool 결과 타입 */
export interface ToolResult {
  toolName: string;
  success: boolean;
  data?: unknown;
  error?: string;
}

const findDebateSchema = z.object({ debateId: z.string() });

/** Tool 목록 생성 */
export const createDebateTools = (debateClient: DebateClient): DebateTools => [
  tool(
    async (input: z.infer<typeof findDebateSchema>): Promise<string> => {
      const debateInfo = await debateClient.findOne(input.debateId);

      if (!debateInfo) {
        const result: ToolResult = {
          toolName: 'findDebate',
          success: false,
          error: '토론방을 찾을 수 없습니다.',
        };
        return JSON.stringify(result);
      }

      const result: ToolResult = {
        toolName: 'findDebate',
        success: true,
        data: {
          debateInfo,
          formatted: formatDebateInfo(debateInfo),
        },
      };
      return JSON.stringify(result);
    },
    {
      name: 'findDebate',
      description:
        '토론방 ID로 토론방 정보를 조회합니다. 토론을 시작하거나 책 정보가 필요할 때 사용하세요.',
      schema: findDebateSchema,
    }
  ),
];

const formatDebateInfo = (info: DebateInfo): string =>
  `
토론 주제: ${info.topic}
설명: ${info.description ?? '없음'}
책 제목: ${info.bookInfo.title}
저자: ${info.bookInfo.author}
책 설명: ${info.bookInfo.description ?? '없음'}
참가자 수: ${info.members.length}명
`.trim();
