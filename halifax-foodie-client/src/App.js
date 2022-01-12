import './App.css';
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "./components/main/Main";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/home/Home";
import MyOrders from "./components/my-orders/MyOrders";
import Security from "./components/login/Security";
import Similarity from "./components/find-similarity/Similarity";
import ChatModule from "./components/chat-module/ChatModule";
import OnlineSupport from "./components/online-support-module/OnlineSupport";
import Restaurant1ChatModule from "./components/chat-module/Restaurant1ChatModule";
import Restaurant2ChatModule from "./components/chat-module/Restaurant2ChatModule";
import Restaurant3ChatModule from "./components/chat-module/Restaurant3ChatModule";
import Visualization from "./components/visualization/visualization";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="App">
        {/*<Header {...this.props}/>*/}
        <Switch>
          <Route exact path="/" component={Main}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/security" component={Security}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/home" component={Home}/>
          <Route exact path="/my-orders" component={MyOrders}/>
          <Route exact path="/classification" component={Similarity}/>
          <Route exact path="/chat" component={ChatModule}/>
          <Route exact path="/online-support" component={OnlineSupport}/>
          <Route exact path="/restaurant1-chat" component={Restaurant1ChatModule}/>
          <Route exact path="/restaurant2-chat" component={Restaurant2ChatModule}/>
          <Route exact path="/restaurant3-chat" component={Restaurant3ChatModule}/>
          <Route exact path="/visualization" component ={Visualization}/>
        </Switch>
      </div>
    );
  }
}

export default App;
