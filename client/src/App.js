import './App.css';

import { Link, Route, BrowserRouter as Router } from 'react-router-dom';

import { Fib } from './Fib';
import { OtherPage } from './OtherPage';
import React from 'react';
import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <Link to="/">Home</Link>
          <Link to="/other-page">Other Page</Link>
        </header>
        <div>
          <Route exact path="/" component={Fib} />
          <Route page="/other-page" component={OtherPage} />
        </div>
      </Router>
    </div>
  );
}

export default App;
