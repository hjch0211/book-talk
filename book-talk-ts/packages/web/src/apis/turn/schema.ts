import { z } from 'zod';

/** Cloudflare TURN API 응답 스키마 */
export const PostGenerateIceServersResponseSchema = z.object({
  iceServers: z.array(
    z.object({
      urls: z.array(z.string()),
      username: z.string().optional(),
      credential: z.string().optional(),
    })
  ),
});

export type PostGenerateIceServersResponse = z.infer<typeof PostGenerateIceServersResponseSchema>;
