/* General API Constants */
const API_URL = process.env.REACT_APP_CONTAINER_1_URL || 'http://localhost:3001';

/* Custom Endpoint Constants */
const LOGIN = API_URL + "/login";
const REGISTER = API_URL + "/register";
const GET_NAMED_ENTITIES = "https://x52vtjy08d.execute-api.us-east-1.amazonaws.com/default/dynamoLambda";
const GET_RESTAURANTS_DATA = "https://jefiepx1uh.execute-api.us-east-1.amazonaws.com/default/getRestaurantsData";
const CREATE_ORDER = "https://jxwt2vhun5.execute-api.us-east-1.amazonaws.com/default/createOrder";
const GET_ORDERS = "https://aqi8uec2xc.execute-api.us-east-1.amazonaws.com/default/getOrders?user=";
const PUBLISH_FEEDBACK = "https://yjnv1uwpqi.execute-api.us-east-1.amazonaws.com/default/publishFeedback";
const CHANGE_ORDER_STATUS = "https://b44j7zt642.execute-api.us-east-1.amazonaws.com/default/changeOrderStatus";
const GET_MESSAGES = "https://online-support-module-roeeg45uoa-uw.a.run.app/get?user=";
const PUBLISH_MESSAGES = "https://online-support-module-roeeg45uoa-uw.a.run.app/publish";
const SUBSCRIBE = "https://online-support-module-roeeg45uoa-uw.a.run.app/subscribe";
const UNSUBSCRIBE = "https://online-support-module-roeeg45uoa-uw.a.run.app/unsubscribe";

const json1 = {
  "api": {
    "invokeUrl": "https://5bltcq602h.execute-api.us-west-2.amazonaws.com/prod"
  },
  "cognito": {
    "REGION": "us-east-1",
    "USER_POOL_ID": "us-east-1_9yfNs2Ciq",
    "APP_CLIENT_ID": "42b7q3bkko71upddf3ld3bjsi8"
  }
};

module.exports = {
  API_URL,
  LOGIN,
  REGISTER,
  GET_NAMED_ENTITIES,
  GET_RESTAURANTS_DATA,
  CREATE_ORDER,
  GET_ORDERS,
  PUBLISH_FEEDBACK,
  CHANGE_ORDER_STATUS,
  json1,
  GET_MESSAGES,
  PUBLISH_MESSAGES,
  SUBSCRIBE,
  UNSUBSCRIBE
}