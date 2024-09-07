// // chat-app/src/logger.js
// import * as Sentry from '@sentry/react';
// import { Integrations } from '@sentry/tracing';

// Sentry.init({
//     dsn: process.env.REACT_APP_SENTRY_DSN,
//     integrations: [new Integrations.BrowserTracing()],
//     tracesSampleRate: 1.0,
// });

// const log = {
//     info: (message, data) => {
//         console.info(message, data);
//         Sentry.captureMessage(message, 'info');
//     },
//     error: (message, data) => {
//         console.error(message, data);
//         Sentry.captureException(new Error(message));
//     },
//     debug: (message, data) => {
//         console.debug(message, data);
//     }
// };

// export default log;
