let AWS = require("aws-sdk");
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let params = {
    TableName: 'restaurant_food_items'
  };

  let items =  await client.scan(params).promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(items.Items)
  };
};