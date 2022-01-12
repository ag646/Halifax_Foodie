let AWS = require("aws-sdk");
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

  if (!event.body) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: "Order detail is not available in request body."
    }
  }

  let body = JSON.parse(event.body);

  let params = {
    TableName: 'user_orders',
    Item: {
      order_id: body.order_id,
      user: body.user,
      status: 'Placed',
      createdAt: body.createdAt,
      restaurant_name: body.restaurant_name,
      food_item: body.food_item
    }
  };

  await client.put(params).promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: "Order placed successfully."
  };
};
