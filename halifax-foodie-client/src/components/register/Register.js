import "./register.css"
import {Link} from "react-router-dom";
import React, {Component} from "react";
import Header from "../headers/Header";
import FormErrors from "../utility/FormErrors";
import Validate from "../utility/FormValidation";
import {Auth} from "aws-amplify";
import firestore from "../login/Firestore";
import {faEnvelope, faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {toast} from "react-toastify";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    answer: "",
    question: 0,
    errors: {
      cognito: null,
      blankfield: false,
      passwordmatch: false,
    },
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
        passwordmatch: false,
      },
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: {...this.state.errors, ...error},
      });
    }

    // AWS Cognito integration
    const {username, email, password, answer} = this.state;
    try {
      const signUpResponse = await Auth.signUp({
        username,
        password,
        attributes: {
          email: email,
        },
      });

      const db = firestore.firestore();
      await db.collection('security_answers').doc(email).set({answer: answer});

      toast.success('User registered successfully.');

      this.props.history.push("/login");

      console.log(signUpResponse);
    } catch (error) {
      let err = null;
      !error.message ? (err = {message: error}) : (err = error);
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err,
        },
      });
    }
  };

  onInputChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
    return (
      <>
        <Header isAuthenticated={false}/>
        <section className="section auth">
          <div className="container">
            <h1>Sign Up</h1>
            <FormErrors formerrors={this.state.errors}/>

            <form onSubmit={this.handleSubmit}>
              <div className="field">
                <p className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    type="text"
                    id="username"
                    aria-describedby="userNameHelp"
                    placeholder="Enter Name"
                    value={this.state.username}
                    onChange={this.onInputChange}
                  />
                  <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={faUser} color={"#5587c1"}/>
                    </span>
                </p>
              </div>
              <div className="field">
                <p className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    type="email"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.onInputChange}
                  />
                  <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={faEnvelope} color={"#5587c1"}/>
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
              <div className="field">
                <p className="control has-icons-left">
                  <input
                    className="input"
                    type="password"
                    id="confirmpassword"
                    placeholder="Re-Enter Password"
                    value={this.state.confirmpassword}
                    onChange={this.onInputChange}
                  />
                  <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={faLock} color={"#5587c1"}/>
                    </span>
                </p>
              </div>
              <div className="field is-flex">
                <div className="field mr-1">
                  <div className="control">
                    <div className="select">
                      <select
                        onChange={this.onInputChange}
                        id="question"
                        value={this.state.question}
                      >
                        <option disabled="disabled" value="0">
                          Answer Security question
                        </option>
                        <option value="1">Which is your favourite car ?</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field" style={{flex: 1, marginLeft: "10px"}}>
                  <input
                    className="input"
                    type="text"
                    id="answer"
                    placeholder="Answer"
                    value={this.state.answer}
                    onChange={this.onInputChange}
                  />
                </div>
              </div>
              <div className="field">
                <p className="control text-center justify-content-center">
                  Already have an account? <Link to={"/login"}>Login</Link>
                </p>
              </div>
              <div className="field">
                <p className="mt-3 control text-center justify-content-center">
                  <button className="btn btn-primary">Register</button>
                </p>
              </div>
            </form>
          </div>
        </section>
      </>
    );
  }
}

export default Register;
