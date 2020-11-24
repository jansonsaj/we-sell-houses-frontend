import React from 'react';
import 'antd/dist/antd.css';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {ThemeProvider} from './ThemeContext';
import Navbar from './components/Navbar';
import Home from './components/Home';

/**
 * React entrypoint
 * @return {JSX.Element}
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <main>
          <Navbar />
          <Switch>
            <Route path="/" exact component={Home}/>
          </Switch>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
