import "./login.css"
import React, {Component} from "react";
import Header from "../headers/Header";
import FormErrors from "../utility/FormErrors";
import firestore from "./Firestore";
import {toast} from "react-toastify";

class Security extends Component {

  state = {
    answer: "",
    errors: ""
  };

  constructor(props) {
    super(props);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userEmail) {
      this.props.location.isAuthenticated = true;
    } else {
      this.props.history.push({
        pathname: '/'
      });
    }
  }

  handleSubmit = async event => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));

    const db = firestore.firestore();
    db.collection('security_answers').doc(user.userEmail).get().then((doc) => {
      if (doc.exists) {
        let answer = doc.data().answer;

        if (this.state.answer === answer) {
          user.secure = true;
          localStorage.setItem('user', JSON.stringify(user));
          toast.success('User logged in successfully.');
          this.props.history.push({
            pathname: '/home',
            isAuthenticated: true
          });
        } else {
          this.setState({
            errors: "Invalid answer"
          });
        }
      } else {
        this.setState({
          error: "Invalid answer"
        });
      }
    });
  };

  onInputChange = event => {
    this.setState({
      answer: event.target.value
    });
  };

  render() {
    return (
      <>
        <Header isAuthenticated={false}/>
        <section className="section auth">
          <div className="container">
            <h1>Verification</h1>
            <form onSubmit={this.handleSubmit}>
              <div className="field">
                <h2>Provide Answer to Below Security Question</h2>
              </div>
              <div className="field">
                Which is your favourite car ?
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
                {this.state.errors.length > 0 && (
                  <span style={{color: "red"}}>{this.state.errors}</span>
                )}
              </div>
              <FormErrors formerrors={this.state.errors}/>
              <div className="field">
                <p className="mt-3 control text-center justify-content-center">
                  <button className="btn btn-primary">Verify</button>
                </p>
              </div>
            </form>
          </div>
        </section>
      </>
    );
  }
}

export default Security;