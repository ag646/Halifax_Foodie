import React, {Component} from "react";
import Header from "../headers/Header";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {faSync} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import bsCustomFileInput from "bs-custom-file-input";
import firebase from "../login/Firestore";

class Similarity extends Component {

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
      recipeFile: '',
      recipeFileContent: '',
      classifiedFile: '',
      errors: ''
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();

    if (this.state.recipeFile) {
      let storage = firebase.storage();
      const storageRef = storage.ref();
      const imageRef = storageRef.child(this.state.recipeFile.name);
      imageRef.put(this.state.recipeFile)
        .then(() => {
          toast.success(this.state.recipeFile.name + " File uploaded successfully.");
        });
    } else {
      toast.error("Please upload a recipe file.")
    }
  }

  async componentDidMount() {
    bsCustomFileInput.init();
    try {
      setInterval(async () => {
        this.getClassifiedFiles();
      }, 60000);
    } catch (e) {
      console.log(e);
    }
  }

  getClassifiedFiles = () => {
    let storage = firebase.storage();
    const storageRef = storage.refFromURL("gs://csci5410-classified-files/similar-recipe.json");

    storageRef.getDownloadURL()
      .then(async url => {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        let fileContent = await new Promise((resolve, reject) => {
          xhr.onload = function (event) {
            let content = xhr.response;

            console.log(content);
            storageRef.putString("{}").then(() => {
            });

            resolve(content);
          };
          xhr.open('GET', url);
          xhr.send();
        });
        this.setState({
          classifiedFile: fileContent
        });
      })
      .catch(error => {
        toast.error(error);
      })
  }

  fileChange = (e) => {
    if (e.target.files[0]) {
      let fileReader = new FileReader();
      fileReader.onloadend = () => {
        const content = fileReader.result;
        this.setState({
          recipeFileContent: content
        });
      };
      fileReader.readAsText(e.target.files[0]);
    }

    this.setState({
      recipeFile: e.target.files[0]
    });

    console.log(e.target.files[0]);
  }

  render() {
    return (
      <section>
        <Header isAuthenticated={this.props.location.isAuthenticated}/>
        <Row className="m-3">
          <Col className={"text-left"}>
            <h2>Perform Classification</h2>
            <hr/>
          </Col>
        </Row>
        <Row className="m-3">
          <Col sm={3} className={"text-left"}>
            <Form>
              <div className="mb-3">
                <Form.File id="custom-file" custom>
                  {this.state.errors.length > 0 ? (
                    <Form.File.Input
                      isInvalid
                      accept="text/plain"
                      className={"invalid-input"}
                      onChange={this.fileChange}
                    />
                  ) : (
                    <Form.File.Input accept="text/plain" onChange={this.fileChange}/>
                  )}
                  <Form.File.Label data-browse="Browse">
                    Provide Recipe File
                  </Form.File.Label>
                  {this.state.errors.length > 0 && (
                    <Form.Control.Feedback type={"invalid"}>
                      {this.state.errors}
                    </Form.Control.Feedback>
                  )}
                </Form.File>
                {/*<Form.File id="formcheck-api-custom" custom>*/}
                {/*  <Form.File.Input value={this.state.recipeFile.name} accept="text/plain" onChange={this.fileChange} isValid />*/}
                {/*  <Form.File.Label data-browse="Browse">*/}
                {/*    Provide Recipe File*/}
                {/*  </Form.File.Label>*/}
                {/*</Form.File>*/}
              </div>
            </Form>

            <Button variant={"primary"} className="mt-5" onClick={this.onSubmit} block>Classify</Button>
          </Col>
          <Col sm={2}/>
          <Col className={"text-left"}>
            <Card>
              <Card.Body>
                <Card.Title>Classified Files <FontAwesomeIcon className={"ml-3 font-icon"} icon={faSync}
                                                              color={"#5587c1"}
                                                              onClick={() => this.getClassifiedFiles()}/></Card.Title>
                <hr/>
                {this.state.recipeFile &&
                <Card.Body>
                  <Card.Text><strong>User uploaded File:</strong></Card.Text>
                  <Card.Text>{this.state.recipeFile.name}</Card.Text>
                  <br/>
                  <Card.Text><strong>File Content:</strong></Card.Text>
                  <Card.Text>{this.state.recipeFileContent}</Card.Text>
                </Card.Body>
                }
                {this.state.classifiedFile && this.state.classifiedFile.fileName &&
                <>
                  <hr/>
                  <Card.Body>
                    <Card.Text><strong>Similar File:</strong></Card.Text>
                    <Card.Text>{this.state.classifiedFile.fileName}</Card.Text>
                    <br/>
                    <Card.Text><strong>File Content:</strong></Card.Text>
                    <Card.Text>{this.state.classifiedFile.fileContent}</Card.Text>
                  </Card.Body>
                </>
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    )
  }
}

export default Similarity
