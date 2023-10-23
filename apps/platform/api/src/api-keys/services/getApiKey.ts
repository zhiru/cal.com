import { hashAPIKey } from '../../utils/apiKey';
import type { ApiKeyType } from '../entities/types';

export const getApiKeyService = async (
  { getApiKeyByHash }: { getApiKeyByHash: (key: string) => Promise<ApiKeyType | undefined> },
  apiKey: string,
) => {
  const strippedApiKey = `${apiKey}`.replace(process.env.API_KEY_PREFIX || 'cal_', '');
  const hashedKey = hashAPIKey(strippedApiKey);
  return await getApiKeyByHash(hashedKey);
};
