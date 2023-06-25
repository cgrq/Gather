import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getGroupById, removeGroup } from "../../store/groups";
import { getEvent } from "../../store/events";
import { useHistory, useParams } from "react-router-dom";
import "./ContentManagementPage.css"
import EditUsersListItem from "./EditUsersListItem";

export default function EditUsersModal({ type, id }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({})
  const groups = useSelector((state) => state.groups)
  const events = useSelector((state) => state.events)
  const [memberships, setMemberships] = useState([])
  const [attendance, setAttendance] = useState([])
  const { closeModal } = useModal();


  useEffect(() => {
    if (type === "membership") {
      dispatch(getGroupById(id));
    } else {
      dispatch(getEvent(id));
    }
  }, []);

  useEffect(() => {
    if (groups && groups[id] && groups[id].Memberships) {
      setMemberships(groups[id].Memberships);
    }
  }, [groups, id]);

  useEffect(() => {
    if (events && events[id] && events[id].Attendances) {
      setAttendance(events[id].Attendances);
    }
  }, [events, id]);

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
          type === "membership" && memberships &&
          <>
            <h3>Pending</h3>
            {
              Object.values(memberships).map((membership) => (
                <>
                  {
                    membership.status === "pending" &&
                    <EditUsersListItem
                      key={membership.id}
                      user={membership}
                      users={memberships}
                      setUsers={setMemberships}
                    />
                  }
                </>
              ))
            }
            {
              Object.values(memberships).every((membership) => membership.status !== "pending") &&
              <div>
                None
              </div>
            }
          </>
        }
        <h3>Members</h3>
        {
          type === "membership"
            ? Object.values(memberships).map((membership) => (
              <>
                {
                  membership.status !== "pending" &&
                  <EditUsersListItem
                    key={membership.id}
                    user={membership}
                    users={memberships}
                    setUsers={setMemberships}
                  />
                }
              </>
            ))
            : Object.values(attendance).map((attendance) => (
              <div>
                {attendance.User.username}
              </div>
            ))
        }
      </div>
    </>
  );
}
