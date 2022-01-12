let AWS = require("aws-sdk");
const client = new AWS.DynamoDB.DocumentClient();
const comprehend = new AWS.Comprehend({apiVersion: '2017-11-27'});

exports.handler = async (event) => {
  if (!event.queryStringParameters || !event.queryStringParameters.restaurant_name || !event.queryStringParameters.food_item) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: "Restaurant or Food item is not available in request params."
    }
  }

  let params = {
    TableName: 'feedbacks_by_food_item',
    Key: {
      "restaurant_name": event.queryStringParameters.restaurant_name
    }
  };

  let data = await client.get(params).promise();

  let feedbacks = data.Item.feedbacks;

  let allFeedbacks = [];
  Object.entries(feedbacks).forEach(([key, value]) => {
    console.log(key);
    console.log(value);
    if (key === event.queryStringParameters.food_item) {
      allFeedbacks.push(...value);
    }
  });

  let params1 = {
    LanguageCode: 'en',
    TextList: allFeedbacks
  };

  let entities = await new Promise((resolve, reject) => {
    comprehend.batchDetectEntities(params1, function(err, data) {
      if (err) console.log(err, err.stack);
      else     console.log(JSON.stringify(data));
      resolve(data.ResultList);
    });
  });

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(entities)
  };
};
