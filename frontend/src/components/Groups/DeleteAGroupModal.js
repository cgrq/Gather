import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { getUserGroups, removeGroup } from "../../store/groups";
import { useHistory, useParams } from "react-router-dom";
import "./Groups.css"

function DeleteAGroupModal({groupId, manage = false}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal();

  const handleClick = (e) => {
    e.preventDefault();
    setErrors({});
    const removedGroup = dispatch(removeGroup(groupId))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
      if(manage){
        dispatch(getUserGroups()) 

      } else {
        history.push("/groups")
      }

  };

  return (
    <>
    <div className="delete-a-group-modal-container">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this group?</p>
      <button className="delete-a-group-modal-button delete-a-group-modal-button-yes" onClick={handleClick}>{"Yes (Delete Group)"}</button>
      <button className="delete-a-group-modal-button" onClick={closeModal}>{"No (Keep Group)"}</button>
    </div>
    </>
  );
}

export default DeleteAGroupModal;
