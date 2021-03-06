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
import Properties from './components/Properties';
import NewProperty from './components/NewProperty';
import Property from './components/Property';
import UpdateProperty from './components/UpdateProperty';
import NewMessage from './components/NewMessage';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import Messages from './components/Messages';
import Message from './components/Message';

/**
 * React entrypoint / Top level component.
 * Managed routing and context providers.
 * @component
 * @return {JSX.Element}
 */
function App() {
  const [signedIn, setSignedIn] = useState(!!localStorage.getItem('userId'));

  const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
      signedIn ?
        <Component {...props} signedIn={signedIn} /> :
        <Redirect to={{
          pathname: '/signin',
          state: {
            redirectAfterSignIn: {
              pathname: props.location.pathname,
              search: props.location.search,
            },
          },
        }} />
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
            <PrivateRoute
              path="/properties/:id/update"
              component={UpdateProperty} />
            <Route
              path="/properties/:id"
              render={() => <Property signedIn={signedIn} />} />
            <Route
              path="/properties"
              render={() => <Properties signedIn={signedIn} />} />
            <PrivateRoute path="/new-property" component={NewProperty} />
            <PrivateRoute path="/messages/:id" component={Message} />
            <PrivateRoute path="/messages" component={Messages} />
            <Route path="/new-message" component={NewMessage} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
