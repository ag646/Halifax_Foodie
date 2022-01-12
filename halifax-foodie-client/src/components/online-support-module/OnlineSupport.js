import React, {Component} from "react";
import Header from "../headers/Header";
import {Col, Row} from "react-bootstrap";
import awsConfig from "../../aws-exports";
import Amplify from "aws-amplify";
import {AmplifyChatbot} from "@aws-amplify/ui-react";

Amplify.configure(awsConfig);

class OnlineSupport extends Component {

  constructor(props) {
    super(props);

    this.props = props;

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
      startChat: false
    }
  }

  async componentDidMount() {

  }

  render() {
    return (
      <section>
        <Header isAuthenticated={this.props.location.isAuthenticated}/>
        <Row className="m-3">
          <Col className={"text-left"}>
            <h2>Online Support</h2>
            <hr/>
          </Col>
        </Row>
        <Row className="m-3 text-left justify-content-sm-center">
          <AmplifyChatbot
            botName="HalifaxOnlineSupport"
            botTitle="Halifax Foodie Virtual Assistant"
            welcomeMessage="Hello, how can I help you?"
          />
        </Row>
      </section>
    )
  }
}

export default OnlineSupport
