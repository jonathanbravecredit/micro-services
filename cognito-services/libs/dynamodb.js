// import * as AWS from "aws-sdk";

// function call(action, params) {
//   const dynamoDb = new AWS.DynamoDB.DocumentClient();
//   return dynamoDb[action](params).promise();
// }

function sortByDate(a, b) {
  if (a.createdOn > b.createdOn) {
    return -1;
  } else return 1;
}

module.exports = {
  sortByDate
}