import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="nav-list">

      <NavLink className="gather-title" exact to="/">
        <img className="gather-logo" src={process.env.PUBLIC_URL + "/logo.png"} alt="Gather" />
      </NavLink>

      {isLoaded && (
        <div className="right-nav-container">
          {
            sessionUser && <NavLink className="nav-link" to="/groups/new">Start a new group</NavLink>
          }
          <div className="profile-container">
            <ProfileButton user={sessionUser} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
