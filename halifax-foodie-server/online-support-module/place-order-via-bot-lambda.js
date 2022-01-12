'use strict';
     
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

 
function dispatch(intentRequest, callback) {
    console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
    
    var AWS = require('aws-sdk');

    AWS.config.update({region: 'us-east-1'});


    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const restaurant_name = slots.RestuarantName;
let food_item = null;
if(slots.RestaurantOne){
food_item = slots.RestaurantOne;
}
else if (slots.RestaurantTwo){
food_item = slots.RestaurantTwo;
}
else if (slots.RestuarantThree){
food_item = slots.RestuarantThree;
}
console.log(restaurant_name);
console.log(food_item);

var params = {
  TableName: 'Orders',
  Item: {
    "order_id": {S:"ORDER" + Date.now()},
    'createdAt' : {S: "" + new Date().toISOString()},
    'food_item' : {S: food_item},
    'restaurant_name' :{S: restaurant_name},
    'status':{S:'Placed'},
    'user': {S:'kr210190@dal.ca'}
    
  }
};



ddb.putItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
    callback(close(sessionAttributes, 'Failed',
    {'contentType': 'PlainText', 'content': `Failed`}));
  } else {
    console.log("Success", data);
    callback(close(sessionAttributes, 'Fulfilled',
    {'contentType': 'PlainText', 'content': `Okay, your order is placed`}));
  }
});

}
 

exports.handler = (event, context, callback) => {
    
    console.log(JSON.stringify(event));
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
}