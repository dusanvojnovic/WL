import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';

import Header from './shared/components/Header/Header';
// import MainHeader from './shared/components/Header/MainHeader';
import Form from './shared/components/Form/Form';
import UserPage from './movies/pages/UserPage/UserPage';
import SearchForm from './movies/components/SearchForm/SearchForm';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <h1 style={{ padding: '5rem', textAlign: 'center' }}> WELCOME </h1>
        </Route>
        <Route path="/search">
          <SearchForm />
        </Route>
        <Route path="/:userId/movies" exact>
          <UserPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <h1 style={{ padding: '5rem', textAlign: 'center' }}> WELCOME</h1>
        </Route>
        <Route path="/auth">
          <Form />
        </Route>
        <Route path="/search">
          <SearchForm />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        userId: userId,
      }}
    >
      <BrowserRouter>
        <Header />
        {routes}
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
