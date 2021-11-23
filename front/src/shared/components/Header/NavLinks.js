import { NavLink } from 'react-router-dom';
import { useContext } from 'react';

import { AuthContext } from '../../context/auth-context';
import classes from './NavLinks.module.css';

const NavLinks = () => {
  const authCtx = useContext(AuthContext);

  return (
    <ul className={classes.navLinks}>
      {authCtx.isLoggedIn && (
        <li>
          <NavLink to={`/${authCtx.userId}/movies`}> MY MOVIES </NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          <NavLink to="/search"> SEARCH </NavLink>
        </li>
      )}
      {!authCtx.isLoggedIn && (
        <li>
          <NavLink to="/auth"> AUTHENTICATE </NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          <button onClick={authCtx.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
