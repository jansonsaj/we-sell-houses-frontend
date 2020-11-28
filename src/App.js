import React, {useState} from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import {ThemeProvider} from './ThemeContext';
import Header from './components/Header';
import Home from './components/Home';
import SignIn from './components/SignIn';
import Register from './components/Register';
import NotFound from './components/NotFound';
import Footer from './components/Footer';

/**
 * React entrypoint
 * @return {JSX.Element}
 */
function App() {
  const [signedIn, setSignedIn] = useState(!!localStorage.getItem('userId'));

  const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
      signedIn ?
        <Component {...props} /> :
        <Redirect to='/signin' />
    )} />
  );

  PrivateRoute.propTypes = {
    component: PropTypes.element.isRequired,
  };

  return (
    <ThemeProvider>
      <Router>
        <main>
          <Header setSignedIn={setSignedIn} signedIn={signedIn} />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route
              path="/signin"
              render={() => <SignIn setSignedIn={setSignedIn} />} />
            <Route path="/register" component={Register} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
