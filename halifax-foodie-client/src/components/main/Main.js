import './main.css'
import ParticlesBg from "particles-bg";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import React, {Component} from "react";
import Header from "../headers/Header";

class Main extends Component {
  render() {
    return (
      <section>
        <Header isAuthenticated={false}/>
        <ParticlesBg type="cobweb" bg={true} color={"#88CACA"}/>
        <Container fluid={"sm"}>
          <Row className={"justify-content-center mt-5 ml-0 mr-0"}>
            <p className={"logo-name"}/>
          </Row>
          <Row className={"justify-content-center text-center mt-5"}>
            <Col sm={6} className={"mt-4"}>
              <h2>All-in-one Food Ordering Platform for your needs</h2>
              <br/>
              <p>Order food, track your orders, chat with restaurant owners and provide feedback - everything you need, within one interface.</p>
              <Link to={"/login"}>
                <Button variant={"info mt-3 mr-2"}>Login / Register</Button>
              </Link>
            </Col>
            <Col sm={6}>
              <Image src={"/main-food.png"} alt={"Plain Logo"} className={"main-image"}/>
            </Col>
          </Row>
        </Container>
      </section>
    )
  }
}

export default Main
