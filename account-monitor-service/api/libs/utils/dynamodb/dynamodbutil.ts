export class DynamoDBUtil {
  public output: AWS.DynamoDB.DocumentClient.AttributeMap[] = [];
  constructor(
    private client: AWS.DynamoDB.DocumentClient,
    private params: AWS.DynamoDB.DocumentClient.ScanInput | AWS.DynamoDB.DocumentClient.QueryInput,
    private type: 'QUERY' | 'SCAN',
  ) {}

  async execute(): Promise<void> {
    // Call DynamoDB's query API
    try {
      if (this.type === 'QUERY') {
        let items: AWS.DynamoDB.DocumentClient.QueryOutput;
        do {
          items = await this.client.query(this.params).promise();
          this.output = [...this.output, ...(items.Items || [])];
          this.params.ExclusiveStartKey = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey != 'undefined');
      }
      if (this.type === 'SCAN') {
        let items: AWS.DynamoDB.DocumentClient.ScanOutput;
        do {
          items = await this.client.scan(this.params).promise();
          this.output = [...this.output, ...(items.Items || [])];
          this.params.ExclusiveStartKey = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey != 'undefined');
      }
    } catch (err) {
      this.handleQueryError(err);
    }
  }

  handleQueryError(err) {
    if (!err) {
      console.error('Encountered error object was empty');
      return;
    }
    if (!err.code) {
      console.error(`An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(err)}`);
      return;
    }
    this.handleCommonErrors(err);
  }

  handleCommonErrors(err) {
    switch (err.code) {
      case 'InternalServerError':
        console.error(
          `Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`,
        );
        return;
      case 'ProvisionedThroughputExceededException':
        console.error(
          `Request rate is too high. If you're using a custom retry strategy make sure to retry with exponential back-off.` +
            `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`,
        );
        return;
      case 'ResourceNotFoundException':
        console.error(`One of the tables was not found, verify table exists before retrying. Error: ${err.message}`);
        return;
      case 'ServiceUnavailable':
        console.error(
          `Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`,
        );
        return;
      case 'ThrottlingException':
        console.error(
          `Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`,
        );
        return;
      case 'UnrecognizedClientException':
        console.error(
          `The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying.` +
            `Error: ${err.message}`,
        );
        return;
      case 'ValidationException':
        console.error(
          `The input fails to satisfy the constraints specified by DynamoDB, ` +
            `fix input before retrying. Error: ${err.message}`,
        );
        return;
      case 'RequestLimitExceeded':
        console.error(
          `Throughput exceeds the current throughput limit for your account, ` +
            `increase account level throughput before retrying. Error: ${err.message}`,
        );
        return;
      default:
        console.error(`An exception occurred, investigate and configure retry strategy. Error: ${err.message}`);
        return;
    }
  }
}
