import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { z } from "zod";

export type User = {
  userId: string;
  refreshToken: string;
};

export class UserRepository {
  constructor(
    private readonly dynamodbClient: DynamoDBClient,
    private readonly dynamodbTableName: string
  ) {}

  async get(userId: string): Promise<User | undefined> {
    const res = await this.dynamodbClient.send(
      new GetItemCommand({
        TableName: this.dynamodbTableName,
        Key: {
          pk: { S: userId },
          sk: { S: userId },
        },
      })
    );

    if (res.Item === undefined) {
      return undefined;
    }

    const item = z
      .object({
        pk: z.object({ S: z.string() }),
        sk: z.object({ S: z.string() }),
        refreshToken: z.object({ S: z.string() }),
      })
      .parse(res.Item);

    return {
      userId: item.pk.S,
      refreshToken: item.refreshToken.S,
    };
  }

  async put(user: User): Promise<void> {
    await this.dynamodbClient.send(
      new PutItemCommand({
        TableName: this.dynamodbTableName,
        Item: {
          pk: { S: user.userId },
          sk: { S: user.userId },
          refreshToken: { S: user.refreshToken },
        },
      })
    );
  }
}
