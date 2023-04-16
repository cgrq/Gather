import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          console.log(`🖥 ~ file: index.js:38 ~ handleSubmit ~ data.errors:`, data.errors)

          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  const disableSubmitButton = () => {
    if (email.length === 0 ||
      username.length === 0 ||
      firstName.length === 0 ||
      lastName.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0) return true;

    if (username.length < 4) return true;

    if (password.length < 6) return true;
  }

  return (
    <>
      <div className="signup-container">
        <h1>Sign Up</h1>
        <form className="signup-main-form" onSubmit={handleSubmit}>
          <div className="signup-main-input-container">
            <label>
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>
          {errors.email && <p className="input-error">{errors.email}</p>}
          <div className="signup-main-input-container">
            <label>
              Username
            </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
          </div>
          {errors.username && <p className="input-error">{errors.username}</p>}
          <div className="signup-main-input-container">
            <label>
              First Name
            </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

          </div>
          {errors.firstName && <p className="input-error">{errors.firstName}</p>}
          <div className="signup-main-input-container">
            <label>
              Last Name
            </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

          </div>
          {errors.lastName && <p className="input-error">{errors.lastName}</p>}
          <div className="signup-main-input-container">
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
          {errors.password && <p className="input-error">{errors.password}</p>}
          <div className="signup-main-input-container">
            <label>
              Confirm Password
            </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

          </div>
          {errors.confirmPassword && (<p className="input-error">{errors.confirmPassword}</p>)}
          <button type="submit" className={disableSubmitButton() ? "disable-button" : ""} disabled={disableSubmitButton() ? true : false} >Sign Up</button>
        </form>
      </div>
    </>
  );
}

export default SignupFormModal;
