/**
 * @name env
 * @warning 환경변수 접근은 반드시 이 파일을 통해서만 사용
 */
export const env = {
  /** Main server API URL */
  BASE_URL: String(import.meta.env.VITE_API_BASE_URL),
  /** cloudflare TURN url */
  CLOUDFLARE_TURN_URL: String(import.meta.env.VITE_CLOUDFLARE_TURN_URL),
  /** cloudflare API token */
  CLOUDFLARE_API_TOKEN: String(import.meta.env.VITE_CLOUDFLARE_API_TOKEN),
};
