import "./Groups.css";
import { NavLink } from "react-router-dom";

function GroupPreview({ group }) {
    return (
        <NavLink className="nav-link" to={`/groups/${group.id}`}>
            <div className="group-preview-container">
                <div className="group-preview-image-container">
                    <img className="group-preview-image" src={group.GroupImages[0].url} />
                </div>
                <div className="group-preview-text-container">
                    <h2>{group.name}</h2>
                    <div>{group.private ? "Private" : "Public"}</div>
                </div>
            </div>
        </NavLink>
    )
}
export default GroupPreview;
