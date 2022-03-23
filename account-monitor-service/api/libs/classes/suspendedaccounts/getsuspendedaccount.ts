import { DynamoDBUtil } from 'libs/utils/dynamodb/dynamodbutil';

export class GetSuspendedAccount extends DynamoDBUtil {
  public output: AWS.DynamoDB.DocumentClient.AttributeMap | null = null;
  constructor(public client: AWS.DynamoDB.DocumentClient, public params: AWS.DynamoDB.DocumentClient.QueryInput) {
    super();
  }

  async execute(): Promise<void> {
    try {
      const output = await this.client.query(this.params).promise();
      this.output = output.Items ? output.Items[0] || null : null;
    } catch (err) {
      this.handleQueryError(err as { code: string; message: string });
    }
  }
}
export default GetSuspendedAccount;
