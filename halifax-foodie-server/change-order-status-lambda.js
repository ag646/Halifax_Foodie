let AWS = require("aws-sdk");
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let params = {
    TableName: 'user_orders'
  };

  let orders = await client.scan(params).promise();

  orders = orders.Items;

  console.log(orders);

  let placedOrders = orders && orders.filter(order => order.status === 'Placed');
  let dispatchedOrders = orders && orders.filter(order => order.status === 'Dispatched');

  if (placedOrders && placedOrders.length > 0) {
    for (let placeOrder of placedOrders) {
      placeOrder.status = 'Dispatched';

      let params1 = {
        TableName: 'user_orders',
        Item: placeOrder
      };

      await client.put(params1).promise();
    }
  } else if (dispatchedOrders && dispatchedOrders.length > 0) {
    for (let dispatchedOrder of dispatchedOrders) {
      dispatchedOrder.status = 'Delivered';

      let params1 = {
        TableName: 'user_orders',
        Item: dispatchedOrder
      };

      await client.put(params1).promise();
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: "Order status changed successfully."
  };
};
