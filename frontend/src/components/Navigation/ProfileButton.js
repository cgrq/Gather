import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import { NavLink } from 'react-router-dom';
import SignupFormModal from '../SignupFormModal';
import { getUserGroups } from "../../store/groups";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isOwnerOfGroup, setIsOwnerOfGroup] = useState(false);
  const sessionUser = useSelector((state)=> state.session.user)
  const {userGroups} = useSelector((state)=> state.groups)
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(()=>{
    if(user){
      dispatch(getUserGroups())
    }
  },[user])

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setIsOwnerOfGroup(false)
    closeMenu();
  };
  useEffect(()=>{
    if(sessionUser && userGroups && Object.values(userGroups).length){
      setIsOwnerOfGroup(true)
    }
  },[userGroups])

  const ulClassName = "profile-dropdown" + (showMenu ? "show-profile-list" : " hidden");



  return (
    <>
      <button className="profile-icon-button" onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <div className={`${ulClassName} profile-list`} ref={ulRef}>
        <div className={user ? "nav-upper-container" : "hidden"}>
          {
            user
            && (
              <>
                <div>Hello, {user.firstName}</div>
                <div className="nav-user-email">{user.email}</div>
              </>
            )
          }
        </div>
        <div className={`nav-lower-container nav-links ${!user ? `nav-lower-container-logged-out` : ""}`}>
          {
            user
              ? (
                <button onClick={logout}>Log Out</button>
              )
              : (
                <>
                  <OpenModalButton
                    buttonText="Log In"
                    onButtonClick={closeMenu}
                    modalComponent={<LoginFormModal />}
                  />
                  <OpenModalButton
                    buttonText="Sign Up"
                    onButtonClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                  />
                </>
              )
          }
          <NavLink onClick={closeMenu} className="nav-view" to="/groups">View groups</NavLink>
          <NavLink onClick={closeMenu} className="nav-view" to="/events">View events</NavLink>
          {
            isOwnerOfGroup &&
              <div className="nav-manage-container">
                <h4>Manage</h4>
                <NavLink onClick={closeMenu} className="nav-view" to="/manage/groups">Groups</NavLink>
              </div>
          }
        </div>
      </div>
    </>
  );
}

export default ProfileButton;
