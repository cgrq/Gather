import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getGroupById, removeGroup } from "../../store/groups";
import { getEvent } from "../../store/events";
import { useHistory, useParams } from "react-router-dom";
import "./ContentManagementPage.css"

export default function EditUsersModal({ type, id }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({})
  const groups = useSelector((state) => state.groups)
  const events = useSelector((state) => state.events)
  const { closeModal } = useModal();

  useEffect(() => {
    if (type === "membership") {
      dispatch(getGroupById(id));
    } else {
      dispatch(getEvent(id));
    }
  }, [])

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
  if ((type === "membership" && (!groups || !groups[id])) || (type !== "membership" && (!events || !events[id]))) return null;

  return (
    <>
      <div className="edit-users-modal-container">
        <h2>Edit {type === "membership" ? "Membership" : "Attendees"}</h2>
        {
          type === "membership" && groups[id].Memberships[0] &&
          <>
            <h3>Pending</h3>
            {
              Object.values(groups[id].Memberships).map((membership) => (
                <>
                  {
                    membership.status === "pending" &&
                    <div>
                      {membership.User.username}
                    </div>
                  }
                </>
              ))
            }
            {
              Object.values(groups[id].Memberships).every((membership) => membership.status !== "pending") &&
              <div>
                None
              </div>
            }
          </>
        }
        <h3>Members</h3>
        {
          type === "membership"
            ? Object.values(groups[id].Memberships).map((membership) => (
              <div>
                {membership.User.username}
              </div>
            ))
            : Object.values(events[id].Attendances).map((attendance) => (
              <div>
                {attendance.User.username}
              </div>
            ))
        }
      </div>
    </>
  );
}
