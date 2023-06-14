const map: Record<string, number> = {
  SUCCESSFUL: 200,
  UNAUTHORIZED: 401,
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

export default function mapStatusHTTP(status: string): number {
  return map[status] ?? 500;
}
