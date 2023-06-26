import "./ContentManagementPage.css"
import { useEffect, useState } from "react"
import { csrfFetch } from "../../store/csrf"

export default function EditUsersListItem({ type, user, users, setUsers }) {
    const [status, setStatus] = useState(user.status)
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {

    }, [])

    const handleOnMembershipChange = async (e) => {
        setStatus(e.target.value)
        user.status = e.target.value
        const newUsers = users.map(userObj => userObj.id === user.id ? user : userObj)
        setUsers(newUsers)
        await csrfFetch(`/api/groups/${user.groupId}/membership`, {
            method: "PUT",
            body: JSON.stringify({
                memberId: user.id,
                status: e.target.value
            }),
        });
    }

    const handleOnAttendanceChange = async (e) => {
        setStatus(e.target.value)
        user.status = e.target.value
        const newUsers = users.map(userObj => userObj.id === user.id ? user : userObj)
        setUsers(newUsers)
        console.log(`🖥 ~ file: EditUsersListItem.js:34 ~ handleOnAttendanceChange ~ user.eventId:`, user.eventId)
        await csrfFetch(`/api/events/${user.eventId}/attendance`, {
            method: "PUT",
            body: JSON.stringify({
                memberId: user.id,
                status: e.target.value
            }),
        });
    }

    const handleDelete = async () => {
        const newUsers = users.filter(userObj => userObj.id !== user.id)
        setUsers(newUsers)
        if (type === "membership") {
            await csrfFetch(`/api/groups/${user.groupId}/membership`, {
                method: "DELETE",
                body: JSON.stringify({
                    memberId: user.id,
                    status
                }),
            });
        } else {
            await csrfFetch(`/api/events/${user.eventId}/attendance`, {
                method: "DELETE",
                body: JSON.stringify({
                    userId: user.id,
                    status
                }),
            });
        }
    }

    return (
        <>
            <div className="edit-users-list-item-wrapper">
                {
                    (type === "membership")
                        ? (status === "organizer(host)")
                            ? <span>Owner</span>
                            : <select value={status} onChange={(e) => handleOnMembershipChange(e)}>
                                <option value="co-host">Co-Owner</option>
                                <option value="member">Member</option>
                                <option value="pending">Pending</option>
                            </select>
                        : <select value={status} onChange={(e) => handleOnAttendanceChange(e)}>
                            <option value="attending">Attending</option>
                            <option value="waitlist">Waitlist</option>
                            <option value="pending">Pending</option>
                        </select>
                }

                <div className="edit-users-list-item-username">{user.User.username}</div>
                {
                    status !== "organizer(host)" && <div onClick={() => setConfirmDelete(!confirmDelete)} className="edit-users-list-item-delete">x</div>
                }
            </div>
            {
                confirmDelete &&
                <div className="edit-users-list-item-confirm-delete-wrapper">
                    Are you sure?
                    <div className="edit-users-list-item-confirm-delete-button edit-users-list-item-confirm-delete-button-yes" onClick={() => handleDelete()}>Yes</div>
                    <div className="edit-users-list-item-confirm-delete-button edit-users-list-item-confirm-delete-button-no" onClick={() => setConfirmDelete(false)} >No</div>
                </div>
            }
        </>
    )
}
