import React, {Component} from "react";
import Header from "../headers/Header";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import bsCustomFileInput from "bs-custom-file-input";
import axios from "axios";
import {GET_MESSAGES, PUBLISH_MESSAGES, SUBSCRIBE, UNSUBSCRIBE} from "../../config";

class ChatModule extends Component {

  constructor(props) {
    super(props);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userEmail && user.secure) {
      this.props.location.isAuthenticated = true;
    } else {
      this.props.history.push({
        pathname: '/'
      });
    }

    this.state = {
      messages: [],
      newMessage: '',
      startChat: false,
      restaurantTopic: ''
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    let userprefix = user.userEmail.split("@")[0];

    let bodyData = {
      "user": userprefix,
      "message": this.state.newMessage,
      "topic": this.state.restaurantTopic
    }

    await axios
      .post(PUBLISH_MESSAGES, bodyData)
      .then((response) => {
        toast.success("Message published.");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });

    this.setState({
      newMessage: ''
    })
  }

  async componentDidMount() {
    bsCustomFileInput.init();

    const user = JSON.parse(localStorage.getItem('user'));
    let userprefix = user.userEmail.split("@")[0];
    try {
      setInterval(async () => {
        if (this.state.restaurantTopic) {
          await axios
            .get(GET_MESSAGES + userprefix)
            .then((response) => {
              if (response.data && response.data.message) {
                let messages = [...this.state.messages];
                messages.push(response.data.message);

                this.setState({
                  messages: messages
                });
              }
            })
            .catch((error) => {
              console.log(error);
              toast.error(error.response.data);
            });
        }
      }, 5000);
    } catch (e) {
      console.log(e);
    }
  }

  onMessageSend = (e) => {
    this.setState({
      newMessage: e.target.value
    });
  }

  startChat = async (restaurantTopic) => {
    const user = JSON.parse(localStorage.getItem('user'));
    let userprefix = user.userEmail.split("@")[0];

    let bodyData = {
      "user": userprefix,
      "topic": restaurantTopic
    }

    await axios
      .post(SUBSCRIBE, bodyData)
      .then((response) => {
        console.log(response.data);
        toast.success("Chat started.");
        this.setState({
          startChat: true,
          restaurantTopic: restaurantTopic
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  }

  endChat = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    let userprefix = user.userEmail.split("@")[0];

    let bodyData = {
      "user": userprefix,
      "topic": this.state.restaurantTopic
    }

    await axios
      .post(UNSUBSCRIBE, bodyData)
      .then((response) => {
        console.log(response.data);
        toast.success("Chat started.");
        this.setState({
          messages: [],
          newMessage: '',
          startChat: false,
          restaurantTopic: ''
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  }

  render() {
    return (
      <section>
        <Header isAuthenticated={this.props.location.isAuthenticated}/>
        <Row className="m-3">
          <Col className={"text-left"}>
            <h2>Chat with Restaurants</h2>
            <hr/>
          </Col>
        </Row>
        {!this.state.startChat &&
        <Row className="m-3 text-left">
          <Col sm={3}>
            <Button variant={"primary"} className="mt-3" onClick={() => this.startChat("restaurant-1")} block>Start Chat with
              Restaurant 1</Button>
            <Button variant={"primary"} className="mt-3" onClick={() => this.startChat("restaurant-2")} block>Start Chat with
              Restaurant 2</Button>
            <Button variant={"primary"} className="mt-3" onClick={() => this.startChat("restaurant-3")} block>Start Chat with
              Restaurant 3</Button>
          </Col>
        </Row>
        }
        {this.state.startChat &&
        <Row className="m-3">
          <Col sm={3} className={"text-left"}>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control type="text" placeholder="Enter Message" value={this.state.newMessage}
                              onChange={this.onMessageSend}/>
              </Form.Group>
            </Form>

            <Button variant={"primary"} className="mt-3" onClick={this.onSubmit} block>Send</Button>
          </Col>
          <Col sm={2}/>
          <Col className={"text-left"}>
            <Card>
              <Card.Body>
                <Card.Title>Chat Messages</Card.Title>
                <hr/>
                {this.state.messages.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        }
        {this.state.startChat &&
        <Row className="m-3 text-left">
          <Col sm={3}>
            <Button variant={"primary"} className="mt-3" onClick={this.endChat} block>Close Chat</Button>
          </Col>
        </Row>
        }
      </section>
    )
  }
}

export default ChatModule
