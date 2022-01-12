const express = require('express');
const cors = require('cors');
const app = express();
const {PubSub} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

const port = process.env.PORT || 3001;

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());

app.get('/get', async function (request, response) {
  let user = request.query.user;
  let subscriptionName = "projects/csci-5410-s21-314709/subscriptions/" + user;

  const subscription = pubSubClient.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  let data = '';
  const messageHandler = message => {
    data = message.data.toString();
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
    return response.status(200).json({
      message: data
    });
  }, 3 * 1000);
});

app.post('/publish', async function (request, response) {
  let body = request.body
  const dataBuffer = Buffer.from(body.user + " : " + body.message);

  try {
    const messageId = await pubSubClient.topic("projects/csci-5410-s21-314709/topics/" + body.topic).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
  }

  return response.status(200).json({
    message: 'Message Published.'
  })
});

app.post('/subscribe', async function (request, response) {
  let body = request.body

  let subscriptionName = "projects/csci-5410-s21-314709/subscriptions/" + body.user;
  try {
    const [subscriptions] = await pubSubClient.topic("projects/csci-5410-s21-314709/topics/" + body.topic).getSubscriptions();

    let found = false;
    subscriptions.forEach(subscription => {
      if (subscription.name === subscriptionName) {
        found = true;
      }
    });
    if (!found) {
      await pubSubClient.topic("projects/csci-5410-s21-314709/topics/" + body.topic).createSubscription(subscriptionName);
      return response.status(200).json({
        message: 'Subscription created.'
      })
    } else {
      return response.status(200).json({
        message: 'Subscription already exists.'
      })
    }
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
  }
  return response.status(200).json({
    message: 'Subscription created.'
  })
});

app.post('/unsubscribe', async function (request, response) {
  let body = request.body

  let subscriptionName = "projects/csci-5410-s21-314709/subscriptions/" + body.user;
  try {
    const [subscriptions] = await pubSubClient.topic("projects/csci-5410-s21-314709/topics/" + body.topic).getSubscriptions();

    let found = false;
    subscriptions.forEach(subscription => {
      if (subscription.name === subscriptionName) {
        found = true;
      }
    });
    if (found) {
      await pubSubClient.topic("projects/csci-5410-s21-314709/topics/" + body.topic).subscription(subscriptionName).delete();
      return response.status(200).json({
        message: 'Subscription deleted.'
      })
    } else {
      return response.status(200).json({
        message: 'Subscription does not exist.'
      })
    }
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
  }
  return response.status(200).json({
    message: 'Subscription deleted.'
  })
});

app.listen(port, () => console.log(`Server is running on port ${port}`));