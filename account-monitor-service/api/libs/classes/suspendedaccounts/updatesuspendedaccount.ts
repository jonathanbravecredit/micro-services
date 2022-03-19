import { DynamoDBUtil } from 'libs/utils/dynamodb/dynamodbutil';

export class UpdateSuspendedAccount extends DynamoDBUtil {
  public output: AWS.DynamoDB.DocumentClient.UpdateItemOutput;
  constructor(public client: AWS.DynamoDB.DocumentClient, public params: AWS.DynamoDB.DocumentClient.UpdateItemInput) {
    super();
  }

  async execute(): Promise<void> {
    try {
      this.output = await this.client.update(this.params).promise();
    } catch (err) {
      this.handleQueryError(err);
    }
  }
}
export default UpdateSuspendedAccount;
