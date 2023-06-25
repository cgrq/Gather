import "./ContentManagementPage.css"
import { useEffect, useState } from "react"
import { csrfFetch } from "../../store/csrf"

export default function EditUsersListItem({ user, users, setUsers }) {
    const [status, setStatus] = useState(user.status)
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {

    }, [])

    const handleOnChange = async (e) => {
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

    const handleDelete = async () => {
        const newUsers = users.filter(userObj => userObj.id !== user.id)
        setUsers(newUsers)
        await csrfFetch(`/api/groups/${user.groupId}/membership`, {
            method: "DELETE",
            body: JSON.stringify({
                memberId: user.id,
                status
            }),
        });
    }

    return (
        <>
            <div className="edit-users-list-item-wrapper">
                {
                    status === "organizer(host)"
                        ? <span>Owner</span>
                        : <select value={status} onChange={(e) => handleOnChange(e)}>
                            <option value="co-host">Co-Owner</option>
                            <option value="member">Member</option>
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
