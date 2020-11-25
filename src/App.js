import React from 'react';
import 'antd/dist/antd.css';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {ThemeProvider} from './ThemeContext';
import Header from './components/Header';
import Home from './components/Home';
import SignIn from './components/SignIn';
import NotFound from './components/NotFound';
import Footer from './components/Footer';

/**
 * React entrypoint
 * @return {JSX.Element}
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <main>
          <Header />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/signin" component={SignIn} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
