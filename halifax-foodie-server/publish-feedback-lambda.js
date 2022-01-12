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
      body: "Feedback is not available in request body."
    }
  }

  let body = JSON.parse(event.body);

  let params = {
    TableName: 'feedbacks_by_food_item',
    ProjectionExpression: "restaurant_name, feedbacks",
    FilterExpression: "restaurant_name = :restaurantName",
    ExpressionAttributeValues: {
      ":restaurantName": body.restaurant_name
    }
  };

  let feedbacks = await client.scan(params).promise();

  console.log(feedbacks);

  if (feedbacks.Items.length > 0) {
    let allFeedbacks = feedbacks.Items[0].feedbacks[body.food_item];
    allFeedbacks.push(body.feedback);

    let params1 = {
      TableName: 'feedbacks_by_food_item',
      Item: {
        "restaurant_name": body.restaurant_name,
        "feedbacks": feedbacks.Items[0].feedbacks
      }
    };

    await client.put(params1).promise();
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: "Feedback published Successfully.",
  };
};
