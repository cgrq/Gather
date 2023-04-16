// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  const handleDemoSubmit = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential: "Demo-lition", password: "password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <div className="login-container">
        <h1>Log In</h1>
        <form className="login-main-form" onSubmit={handleLoginSubmit}>
          <div className="login-main-input-container">
            <label>
              Username or Email
            </label>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </div>
          <div className="login-main-input-container">
            <label>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errors.credential && (
            <p>{errors.credential}</p>
          )}
          <button disabled={(credential.length < 4 || password.length < 6) ? true : false} type="submit">Log In</button>
        </form>
        <div className="login-dividing-line" />
        <form className="login-demo-form" onSubmit={handleDemoSubmit}>
          <button type="submit">Log In As Demo User</button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
