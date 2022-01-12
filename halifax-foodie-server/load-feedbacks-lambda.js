let AWS = require("aws-sdk");
let fs = require("fs");
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let feedbacks = JSON.parse(fs.readFileSync('initial-feedback-data.json', 'utf8'));

  for (const [key, value] of Object.entries(feedbacks)) {
    console.log(key);
    console.log(value);

    let params = {
      TableName: 'feedbacks_by_food_item',
      Item: {
        "restaurant_name": key,
        "feedbacks": value
      }
    };

    await new Promise((resolve, reject) => {
      client.put(params, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
          console.log('Feedbacks are added.');
        }
        resolve();
      });
    });
  }


  return {
    statusCode: 200,
    body: JSON.stringify('All feedbacks are added into DynamoDB database!'),
  };
};
