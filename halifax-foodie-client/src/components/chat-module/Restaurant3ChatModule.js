import React, {Component} from "react";
import Header from "../headers/Header";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import bsCustomFileInput from "bs-custom-file-input";
import axios from "axios";
import {GET_MESSAGES, PUBLISH_MESSAGES} from "../../config";

class Restaurant3ChatModule extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      newMessage: ''
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();

    let bodyData = {
      "user": "restaurant3",
      "message": this.state.newMessage,
      "topic": "restaurant-3"
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

    try {
      setInterval(async () => {
        await axios
          .get(GET_MESSAGES + "restaurant3")
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

  render() {
    return (
      <section>
        <Header isAuthenticated={false}/>
        <Row className="m-3">
          <Col className={"text-left"}>
            <h2>Restaurant 3 Chat</h2>
            <hr/>
          </Col>
        </Row>
        <Row className="m-3 text-left">

        </Row>
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
      </section>
    )
  }
}

export default Restaurant3ChatModule
