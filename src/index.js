import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import registerServiceWorker from "./workers/registerServiceWorker";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import filterReducer from './reducers/filterReducer';

// Filter Data store
const filterStore = createStore(filterReducer);

ReactDOM.render(<Provider store={filterStore}><App /></Provider>, document.getElementById("root"));
registerServiceWorker();
