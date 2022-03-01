function response(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}
function success(body) {
  return response(200, body);
}
function failure(body) {
  return response(500, body);
}

module.exports = {
  response,
  success,
  failure
}