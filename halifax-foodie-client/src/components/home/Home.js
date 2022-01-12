import "./home.css";
import React, {Component} from "react";
import Header from "../headers/Header";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import Select from "react-select";
import {toast} from "react-toastify";
import axios from "axios";
import {GET_RESTAURANTS_DATA, CREATE_ORDER, GET_NAMED_ENTITIES} from "../../config";
import ReactWordcloud from 'react-d3-cloud';

class Home extends Component {
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
      words: [],
      restaurants: [],
      selectedRestaurant: '',
      selectedFoodItem: '',
      isError: {
        restaurant: '',
        foodItem: ''
      }
    }
  }

  componentDidMount = async () => {
    await axios
      .get(GET_RESTAURANTS_DATA)
      .then((response) => {
        let restaurants = response.data;

        restaurants.forEach(restaurant => {
          restaurant.foodItems = restaurant.foodItems.map(foodItem => {
            return {value: foodItem, label: foodItem};
          });
        });

        this.setState({
          selectedRestaurant: restaurants[0],
          selectedFoodItem: restaurants[0].foodItems[0],
          restaurants: restaurants
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });

      await this.loadWordCloud(this.state.selectedRestaurant.restaurant_name, this.state.selectedFoodItem.value);
  }

  loadWordCloud = async (restaurant_name, food_item) => {
    let queryParams = "restaurant_name=" + restaurant_name + "&food_item=" + food_item;
    console.log(queryParams);
    await axios
      .get(GET_NAMED_ENTITIES + "?" + queryParams)
      .then((response) => {
        let namedEntitiesResponse = response.data;
        let words = [];

        namedEntitiesResponse.forEach(namedEntitiesObject => {
          namedEntitiesObject.Entities.forEach(entity => {
            words.push({text: entity.Text, value: entity.Score * 100})
          });
        });

        this.setState({
          words: words
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  }

  onSubmit = async (e) => {
    e.preventDefault();

    let userEmail = JSON.parse(localStorage.getItem('user')).userEmail;

    let bodyData = {
      "order_id": "ORDER" + Date.now(),
      "user": userEmail,
      "createdAt": new Date(),
      "restaurant_name": this.state.selectedRestaurant.restaurant_name,
      "food_item": this.state.selectedFoodItem.value
    }

    await axios
      .post(CREATE_ORDER, bodyData)
      .then((response) => {
        toast.success(response.data);
        this.props.history.push({
          pathname: '/my-orders'
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });

  }

  onRestaurantSelect = async (restaurant) => {
    let state = {...this.state};

    state.selectedRestaurant = restaurant;
    state.selectedFoodItem = restaurant.foodItems[0];
    state.words = [];

    this.setState(state);

    await this.loadWordCloud(restaurant.restaurant_name, restaurant.foodItems[0].value);
  }

  onFoodItemSelect = async (foodItem) => {
    let state = {...this.state};

    state.selectedFoodItem = foodItem;
    state.words = [];

    this.setState(state);

    await this.loadWordCloud(this.state.selectedRestaurant.restaurant_name, foodItem.value);
  }

  render() {

    const fontSizeMapper = word => word.value/3;

    const rotate = word => word.value % 90;

    return (
      <section>
        <Header isAuthenticated={this.props.location.isAuthenticated}/>
        <Row className="m-3">
          <Col className={"text-left"}>
            <h2>Place New Order</h2>
            <hr/>
          </Col>
        </Row>
        <Row className="m-3">
          <Col sm={3} className={"text-left"}>
            <Form.Group controlId="restaurant">
              <Form.Label><Card.Title>Restaurant</Card.Title></Form.Label>
              <Select
                value={this.state.selectedRestaurant}
                options={this.state.restaurants}
                getOptionValue={restaurant => restaurant.restaurant_name}
                getOptionLabel={restaurant => restaurant.restaurant_name}
                placeholder="Select Restaurant"
                onChange={this.onRestaurantSelect}
              />
            </Form.Group>

            <Form.Group controlId="foodItem">
              <Form.Label><Card.Title>Food Item</Card.Title></Form.Label>
              <Select
                value={this.state.selectedFoodItem}
                options={this.state.selectedRestaurant.foodItems}
                placeholder="Select Food Item"
                onChange={this.onFoodItemSelect}
              />
            </Form.Group>
            <Button variant={"primary"} className="mt-5" onClick={this.onSubmit} block>Place Order</Button>
          </Col>
          <Col sm={2} />
          <Col className={"text-left"}>
            <Form.Group controlId="foodItem">
              <Form.Label><Card.Title>Word Cloud of feedbacks for selected food item of selected restaurant</Card.Title></Form.Label>
              <ReactWordcloud
                fontSizeMapper={fontSizeMapper}
                rotate={rotate}
                data={this.state.words}
              />
            </Form.Group>
          </Col>
        </Row>
      </section>
    )
  }
}

export default Home
