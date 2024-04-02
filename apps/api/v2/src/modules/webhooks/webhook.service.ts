import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { ZodSchema, z } from "zod";

const EventCreatedSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  details: z.string(),
});

interface WebhookTypeSchemaMap {
  "event.created": typeof EventCreatedSchema;
}

@Injectable()
export class WebhookService {
  private webhooks: Map<keyof WebhookTypeSchemaMap, ZodSchema> = new Map();
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create();
  }

  registerWebhook<T extends keyof WebhookTypeSchemaMap>(type: T, schema: WebhookTypeSchemaMap[T]): void {
    this.webhooks.set(type, schema);
  }

  async checkAndCallWebhook(): Promise<void> {
    return void 0;
  }

  async callWebhook<T extends keyof WebhookTypeSchemaMap>(
    type: T,
    data: z.infer<WebhookTypeSchemaMap[T]>,
    url: string
  ): Promise<void> {
    const schema = this.webhooks.get(type);
    if (!schema) {
      throw new Error(`Webhook type '${type}' is not registered.`);
    }

    const result = schema.safeParse(data);
    if (!result.success) {
      throw new Error(`Validation failed for '${type}': ${result.error}`);
    }

    try {
      await this.httpClient.post(url, result);
    } catch (err) {
      throw new InternalServerErrorException(`Failed to call webhook for ${url} ${type}`);
    }
  }
}
