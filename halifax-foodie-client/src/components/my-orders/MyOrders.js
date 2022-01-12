import "./my-orders.css";
import React, {Component} from "react";
import Header from "../headers/Header";
import {Button, Card, Col, Form, Modal, Row, Table} from "react-bootstrap";
import axios from "axios";
import {GET_ORDERS, PUBLISH_FEEDBACK} from "../../config";
import {toast} from "react-toastify";
import {faSync} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

class MyOrders extends Component {
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
      myOrders: [],
      selectedOrder: '',
      showModal: false
    }
  }

  componentDidMount = async () => {
    await this.getOrders();
  }

  getOrders = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    await axios
      .get(GET_ORDERS + user.userEmail)
      .then((response) => {
        let orders = response.data.Items;

        this.setState({
          myOrders: orders
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  }

  addFeedback = (order) => {
    this.setState({
      selectedOrder: {...order},
      showModal: true
    });
  }

  closeModal = () => {
    this.setState({
      showModal: false
    });
  }

  onFeedbackChange = (e) => {
    let selectedOrder = {...this.state.selectedOrder};
    selectedOrder['feedback'] = e.target.value

    this.setState({
      selectedOrder: selectedOrder
    });
  }

  publishFeedback = async () => {
    console.log(JSON.stringify(this.state.selectedOrder));
    let bodyData = {
      "restaurant_name": this.state.selectedOrder.restaurant_name,
      "food_item": this.state.selectedOrder.food_item,
      "feedback": this.state.selectedOrder.feedback
    }

    await axios
      .post(PUBLISH_FEEDBACK, bodyData)
      .then((response) => {
        toast.success(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });

    this.closeModal();
  }

  render() {
    return (
      <section>
        <Header isAuthenticated={this.props.location.isAuthenticated}/>
        <Row className="m-3">
          <Col className={"text-left"}>
            <h2>My Orders</h2>
            <hr/>
          </Col>
        </Row>
        <Row className="m-3">
          <Col sm={12}>
            <Card>
              <Card.Body>
                <Card.Title className={"text-left"}>Orders <FontAwesomeIcon className={"ml-3 font-icon"} icon={faSync} color={"#5587c1"} onClick={() => this.getOrders()}/></Card.Title>
                {this.state.myOrders.length > 0 ? (
                  <Table striped bordered hover responsive="sm">
                    <thead>
                    <tr>
                      <th className="text-left">Order ID</th>
                      <th>Restaurant</th>
                      <th>Food Item</th>
                      <th>Status</th>
                      <th>Created On</th>
                      <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.myOrders.map((order) => (
                      <tr key={order.order_id}>
                        <td className="text-left">{order.order_id}</td>
                        <td className="text-left">{order.restaurant_name}</td>
                        <td className="text-left">{order.food_item}</td>
                        <td>{order.status}</td>
                        <td>{order.createdAt}</td>
                        <td><Button variant={"primary"}
                                    onClick={() => this.addFeedback(order)} disabled={order.status !== 'Delivered'}>Add Feedback</Button></td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>
                ) : (
                  <Card.Text className="text-center">
                    No orders Available.
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal show={this.state.showModal} animation={false} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Provide Feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label className={"m-0"}><strong>Order</strong></Form.Label>
              <Form.Control plaintext readOnly
                            defaultValue={this.state.selectedOrder.order_id}
                            className={"p-0"}/>
            </Form.Group>
            <Form.Group controlId="feedbackTextarea">
              <Form.Label>Feedback</Form.Label>
              <Form.Control onChange={this.onFeedbackChange} as="textarea" rows={3}/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.publishFeedback}>Publish</Button>
          </Modal.Footer>
        </Modal>
		<div className="row">
          <div className="field col">
            <p className="control text-center justify-content-center">
              Past Order information <Link to={"/visualization"}>Visualize Past Orders</Link>
            </p>
          </div>
        </div>
      </section>
    )
  }
}

export default MyOrders
