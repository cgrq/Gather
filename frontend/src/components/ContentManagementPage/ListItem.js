import { NavLink } from "react-router-dom/cjs/react-router-dom.min"
import "./ContentManagementPage.css"

export default function ListItem({group}){
    return(
        <div className="content-management-list-item">
            <div className="content-management-image-wrapper">
                <img src={group.previewImage} />
            </div>
            <div className="content-management-list-item-details-wrapper">
                <h3 className="content-management-name">{group.name}</h3>
                <NavLink to={`/manage/groups/${group.id}/events`}>Manage Events</NavLink>
                <NavLink to={`/manage/groups/${group.id}/events`}>Manage Membership</NavLink>
            </div>
        </div>
    )
}
