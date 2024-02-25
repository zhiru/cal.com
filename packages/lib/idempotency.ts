import { Redis } from "@upstash/redis";

const prefix = "idempotency:";

export async function checkIdempotencyKey(_key: string) {
  const UPSATCH_ENV_FOUND = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!UPSATCH_ENV_FOUND) {
    return false;
  }

  const redis = Redis.fromEnv();
  const key = prefix + _key;

  const foundKey = await redis.get(key);
  return foundKey;
}

export async function storeIdempotencyKey(_key: string, data: string) {
  const UPSATCH_ENV_FOUND = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!UPSATCH_ENV_FOUND) {
    return;
  }

  const redis = Redis.fromEnv();

  const key = prefix + _key;

  // Save the key (from client) - data (booking id for example) and an expiry for 24h as per mdn reccomendaiotns
  await redis.set(key, data, { ex: 86400 });
}
