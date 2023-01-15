import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

export type Device = {
  deviceId: string;
  name: string;
  description?: string;
  macAddress: string;
};

export class DeviceRepository {
  constructor(
    private readonly dynamodbClient: DynamoDBClient,
    private readonly dynamodbTableName: string
  ) {}

  async query(userId: string): Promise<Device[]> {
    const res = await this.dynamodbClient.send(
      new QueryCommand({
        TableName: this.dynamodbTableName,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": { S: userId },
        },
      })
    );

    const items = z
      .array(
        z.object({
          pk: z.object({ S: z.string() }),
          sk: z.object({ S: z.string() }),
          name: z.object({ S: z.string() }),
          description: z.object({ S: z.string().optional() }).optional(),
          macAddress: z.object({ S: z.string() }),
        })
      )
      .parse((res.Items ?? []).filter((it) => it["pk"]?.S !== it["sk"]?.S));

    return items.map((it) => ({
      deviceId: it.sk.S,
      name: it.name.S,
      description: it.description?.S,
      macAddress: it.macAddress.S,
    }));
  }
}
