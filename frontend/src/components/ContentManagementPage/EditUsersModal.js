import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeGroup } from "../../store/groups";
import { useHistory, useParams } from "react-router-dom";
import "./ContentManagementPage.css"

export default function EditUsersModal({type, id}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal();

  const handleClick = (e) => {
    e.preventDefault();
    setErrors({});
    // const removedGroup = dispatch(removeGroup(groupId))
    //   .then(closeModal)
    //   .catch(async (res) => {
    //     const data = await res.json();
    //     if (data && data.errors) {
    //       setErrors(data.errors);
    //     }
    //   });
    //   history.push("/manage/groups")
  };

  return (
    <>
      <div className="edit-users-modal-container">
        <h2>Edit {type === "membership" ? "Membership" : "Attendees"}</h2>
      </div>
    </>
  );
}
