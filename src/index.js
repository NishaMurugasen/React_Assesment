import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store'; // Import the store we created
import App from './App';
import 'antd/dist/reset.css'; // Import Ant Design styles if using v4 (v5 does this automatically)

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* This Provider is the missing piece causing your error */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);