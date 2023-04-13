// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
// import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

function DeleteAGroupModal() {
  // const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // const handleLoginSubmit = (e) => {
  //   e.preventDefault();
  //   setErrors({});
  //   return dispatch(sessionActions.login({ credential, password }))
  //     .then(closeModal)
  //     .catch(async (res) => {
  //       const data = await res.json();
  //       if (data && data.errors) {
  //         setErrors(data.errors);
  //       }
  //     });
  // };

  return (
    <>
      <h1>ConfirmDelete</h1>
      {/* <form onSubmit={""}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button disabled={(credential.length < 4 || password.length < 6) ? true : false} type="submit">Log In</button>
      </form> */}
    </>
  );
}

export default DeleteAGroupModal;
