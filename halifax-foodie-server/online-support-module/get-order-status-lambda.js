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
 
// --------------- Events -----------------------
 
function dispatch(intentRequest, callback) {
    console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const sessionAttributes = intentRequest.sessionAttributes;
    const slotDetails = intentRequest.currentIntent.slotDetails;
    const order_id = slotDetails.orderNumber.originalValue;
    
    var AWS = require('aws-sdk');
// Set the region 
    AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

console.log(order_id);
    var params = {
      TableName: 'Orders',
      Key: {
        'order_id': {S: order_id }
      },

    };

// Call DynamoDB to read the item from the table
ddb.getItem(params, function(err, data) {
  if (err) {
    // console.log("Error", err);
    callback(close(sessionAttributes, 'Failed',
    {'contentType': 'PlainText', 'content': `Please enter a correct order number`}));
    
  } else {
    // console.log("Success", data.Item);
    if(data.Item){
    callback(close(sessionAttributes, 'Fulfilled',
    {'contentType': 'PlainText', 'content': `Okay, your order from restaurant ${data.Item.restaurant_name.S} is ${data.Item.status.S}`}));
  }
  else{
      callback(close(sessionAttributes, 'Failed',
    {'contentType': 'PlainText', 'content': `Please enter a correct order number`}));
  }}
});
}

// --------------- Main handler -----------------------
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