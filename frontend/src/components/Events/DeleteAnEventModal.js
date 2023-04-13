import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeEvent } from "../../store/events";
import { useHistory, useParams } from "react-router-dom";
import "./Events.css"

function DeleteAnEventModal({eventId}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal();

  const handleClick = (e) => {
    e.preventDefault();
    setErrors({});
    const removedEvent = dispatch(removeEvent(eventId))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
      history.push("/events")
  };

  return (
    <>
    <div className="delete-a-event-modal-container">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this event?</p>
      <button className="delete-a-event-modal-button delete-a-event-modal-button-yes" onClick={handleClick}>{"Yes (Delete Event)"}</button>
      <button className="delete-a-event-modal-button" onClick={closeModal}>{"No (Keep Event)"}</button>
    </div>
    </>
  );
}

export default DeleteAnEventModal;
