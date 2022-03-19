import { DynamoDBUtil } from 'libs/utils/dynamodb/dynamodbutil';

export class GetSuspendedAccounts extends DynamoDBUtil {
  public output: AWS.DynamoDB.DocumentClient.AttributeMap[] = [];
  constructor(public client: AWS.DynamoDB.DocumentClient, public params: AWS.DynamoDB.DocumentClient.QueryInput) {
    super();
  }

  async execute(): Promise<void> {
    try {
      let items: AWS.DynamoDB.DocumentClient.QueryOutput;
      this.params = this.params as AWS.DynamoDB.DocumentClient.QueryInput;
      do {
        items = await this.client.query(this.params).promise();
        this.output = [...this.output, ...(items.Items || [])];
        this.params.ExclusiveStartKey = items.LastEvaluatedKey;
      } while (typeof items.LastEvaluatedKey != 'undefined');
    } catch (err) {
      this.handleQueryError(err);
    }
  }
}

export default GetSuspendedAccounts;
