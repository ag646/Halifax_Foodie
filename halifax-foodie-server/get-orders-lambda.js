let AWS = require("aws-sdk");
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

  if (!event.queryStringParameters || !event.queryStringParameters.user) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: "User detail is not available in request body."
    }
  }

  let params = {
    TableName: 'user_orders',
    ProjectionExpression: "order_id, #userEmail, #status, createdAt, restaurant_name, food_item",
    FilterExpression: "#userEmail = :userEmail",
    ExpressionAttributeNames: {
      "#userEmail": "user",
      "#status": "status"
    },
    ExpressionAttributeValues: {
      ":userEmail": event.queryStringParameters.user
    }
  };

  let orders = await client.scan(params).promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(orders)
  };
};
