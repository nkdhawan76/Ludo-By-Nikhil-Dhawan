import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
// import CountUp from 'react-countup';

ReactDOM.render(

  <BrowserRouter>

     <App />

     {/* <CountUp end={100}>
       {({ countUpRef }) => <span ref={countUpRef} />}
     </CountUp> */}

  </BrowserRouter >
  , document.getElementById('root'));







