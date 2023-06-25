import "./ContentManagementPage.css"
import { useEffect, useState } from "react"
import { csrfFetch } from "../../store/csrf"

export default function EditUsersListItem({ user, users, setUsers }) {
    const [status, setStatus] = useState(user.status)

    useEffect(() => {

    }, [])

    const handleOnChange = async (e) => {
        setStatus(e.target.value)
        user.status = e.target.value
        const newUsers = users.map(userObj => userObj.id === user.id ? user : userObj)
        setUsers(newUsers)
        const groupRes = await csrfFetch(`/api/groups/${user.groupId}/membership`, {
            method: "PUT",
            body: JSON.stringify({
                memberId: user.id,
                status: e.target.value
            }),
        });
        const data = await groupRes.json();
        console.log(`🖥 ~ file: EditUsersListItem.js:25 ~ handleOnChange ~ data:`, data)
    }

    return (
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

            <div>{user.User.username}</div>
        </div>
    )
}
