import { DynamoDBUtil } from 'libs/utils/dynamodb/dynamodbutil';

export class GetSuspendedAccounts extends DynamoDBUtil {
  public output: AWS.DynamoDB.DocumentClient.AttributeMap[] = [];
  constructor(public client: AWS.DynamoDB.DocumentClient, public params: AWS.DynamoDB.DocumentClient.QueryInput) {
    super();
  }

  async execute(): Promise<void> {
    console.log('params in class: ==> ', this.params);
    try {
      let output: AWS.DynamoDB.DocumentClient.QueryOutput;
      do {
        output = await this.client.query(this.params).promise();
        this.output = [...this.output, ...(output.Items || [])];
        this.params.ExclusiveStartKey = output.LastEvaluatedKey;
      } while (typeof output.LastEvaluatedKey != 'undefined');
    } catch (err) {
      this.handleQueryError(err as { code: string; message: string });
    }
  }
}

export default GetSuspendedAccounts;
