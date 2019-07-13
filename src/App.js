import React, { useState } from 'react';
import { useRoutes, navigate } from 'hookrouter';

import { Dashboard, Homepage, Login, NotFound, Signup } from './containers';
import AuthContextProvider from './contexts/AuthContext';
import ApiService from './utils/ApiService';
import { Header, Link, RootContainer } from './components';

const client = new ApiService();

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(client.isLoggedIn());

  const routes = {
    '/': () => <Homepage />,
    '/login': () => {
      return isLoggedIn ? (
        navigate('/dashboard')
      ) : (
        <Login client={client} setLoggedIn={setLoggedIn} />
      );
    },
    '/signup': () => {
      return isLoggedIn ? (
        navigate('/dashboard')
      ) : (
        <Signup client={client} setLoggedIn={setLoggedIn} />
      );
    },
    '/dashboard': () => {
      return !isLoggedIn ? navigate('/') : <Dashboard />;
    }
  };

  const logoutHandler = () => {
    window.localStorage.clear();
    setLoggedIn(false);
  };

  const routeResult = useRoutes(routes);

  return (
    <AuthContextProvider client={client}>
      <RootContainer>
        <Header>
          <Link href="/">Kite</Link>
          {!isLoggedIn && (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="#" onClick={logoutHandler}>
                Logout
                <i className="fas fa-user-circle" />
              </Link>
            </>
          )}
        </Header>
        {routeResult || <NotFound />}
      </RootContainer>
    </AuthContextProvider>
  );
};

export default App;
