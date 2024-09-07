import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
// import * as Sentry from '@sentry/react';
// import { Integrations } from '@sentry/tracing';
import './index.css';

// Sentry.init({
//   dsn: process.env.REACT_APP_SENTRY_DSN,
//   integrations: [new Integrations.BrowserTracing()],
//   tracesSampleRate: 1.0,
// });

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
