/**
 * Serverni ishga tushirishdan oldin muhim environment variable larni tekshiradi.
 * Agar biror majburiy qiymat yo'q bo'lsa, server umuman ko'tarilmaydi -
 * bu "undefined" degan secret bilan ishga tushib ketishning oldini oladi.
 */
const REQUIRED_ENV_VARS = [
  "MONGO_URL",
  "SESSION_SECRET",
  "SECRET_TOKEN",
] as const;

export function validateEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[ENV ERROR] Quyidagi majburiy environment variable lar topilmadi: ${missing.join(", ")}`,
    );
    console.error(
      "Iltimos .env faylini tekshiring. Server xavfsizlik sababli ishga tushirilmaydi.",
    );
    process.exit(1);
  }

  const weakSecrets = ["SESSION_SECRET", "SECRET_TOKEN"] as const;
  for (const key of weakSecrets) {
    const value = process.env[key] as string;
    if (value.length < 24) {
      console.warn(
        `[ENV WARNING] ${key} juda qisqa (${value.length} belgi). Production uchun kamida 32 ta tasodifiy belgidan iborat qiymat tavsiya etiladi.`,
      );
    }
  }
}

export const isProduction = () => process.env.NODE_ENV === "production";

export const getAllowedOrigins = (): string[] =>
  (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
