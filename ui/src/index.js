import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import reducers from './reducers/reducers';

import 'semantic-ui-css/semantic.min.css'
import "react-alice-carousel/lib/alice-carousel.css";
import 'rc-slider/assets/index.css';
import 'react-toastify/dist/ReactToastify.min.css'; 
import './index.css';

const store = createStore(
    combineReducers(reducers),
    applyMiddleware(thunk)
);

ReactDOM.render((
    <Provider store={store}>
        <Router>
            <Route path="/" component={ App } />
        </Router>
    </Provider>),
    document.getElementById('root')
);

registerServiceWorker();
