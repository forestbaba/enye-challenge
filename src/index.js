import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ApolloProvider from './app/util/ApolloProvider'

ReactDOM.render(ApolloProvider,  document.getElementById('root')
);
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

serviceWorker.unregister();
