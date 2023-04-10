import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className="nav-list">
      <li >
        <NavLink className="gather-title" exact to="/">
          <img src="./logo.png" alt="Gather"/>
        </NavLink>
      </li>
      {isLoaded && (
        <li className="profile-container">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
