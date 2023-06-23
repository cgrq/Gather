import "./ContentManagementPage.css"
import { useEffect, useState } from "react"

export default function EditUsersListItem({ user }) {
    const [status, setStatus] = useState(user.status)

    useEffect(() => {
        console.log(`🖥 ~ file: EditUsersListItem.js:9 ~ useEffect ~ user.status:`, user.status)
    }, [])

    return (
        <div className="edit-users-list-item-wrapper">
            {
                status === "organizer(host)"
                    ? <span>Owner</span>
                    : <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="co-host">Co-Owner</option>
                        <option value="member">Member</option>
                        <option value="pending">Pending</option>
                    </select>
            }

            <div>{user.User.username}</div>
        </div>
    )
}
