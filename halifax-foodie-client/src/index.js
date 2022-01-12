import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ToastContainer} from "react-toastify";
import {BrowserRouter} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Amplify from "aws-amplify";
import config from "./config";

library.add(faEdit);

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.json1.cognito.REGION,
        userPoolId: config.json1.cognito.USER_POOL_ID,
        userPoolWebClientId: config.json1.cognito.APP_CLIENT_ID
    }
});
ReactDOM.render(
  <React.StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
