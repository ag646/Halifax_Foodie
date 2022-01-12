import "./login.css"

import {Link} from "react-router-dom";
import React, {Component} from "react";
import Header from "../headers/Header";
import FormErrors from "../utility/FormErrors";
import Validate from "../utility/FormValidation";
import {Auth} from "aws-amplify";
import {faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Login extends Component {
  state = {
    username: "",
    password: "",
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: {...this.state.errors, ...error}
      });
    }

    // AWS Cognito integration
    try {
      const user = await Auth.signIn(this.state.username, this.state.password);
      localStorage.setItem('user', JSON.stringify({"userEmail": user.attributes.email}));
      this.props.history.push({
        pathname: '/security',
        isAuthenticated: true
      });
    } catch (error) {
      let err = null;
      !error.message ? err = {"message": error} : err = error;
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
    return (
      <>
        <Header isAuthenticated={false}/>
        <section className="section auth">
          <div className="container">
            <h1>Log in</h1>
            <FormErrors formerrors={this.state.errors}/>
            <form onSubmit={this.handleSubmit}>
              <div className="field">
                <p className="control has-icons-left">
                  <input
                    className="input"
                    type="text"
                    id="username"
                    aria-describedby="usernameHelp"
                    placeholder="Enter username or email"
                    value={this.state.username}
                    onChange={this.onInputChange}
                  />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faUser} color={"#5587c1"}/>
                  </span>
                </p>
              </div>
              <div className="field">
                <p className="control has-icons-left">
                  <input
                    className="input"
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.onInputChange}
                  />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faLock} color={"#5587c1"}/>
                  </span>
                </p>
              </div>
              <div className="row">
                <div className="field col">
                  <p className="control text-center justify-content-center">
                    Don't have an account? <Link to={"/register"}>Register</Link>
                  </p>
                </div>
              </div>
              <div className="field">
                <p className="mt-3 control text-center justify-content-center">
                  <button className="btn btn-primary">Login</button>
                </p>
              </div>
            </form>
          </div>
        </section>
      </>
    );
  }
}

export default Login;