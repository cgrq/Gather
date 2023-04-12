import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { isValidURL } from "../../utils/validation";

function GroupListItem({group}){
    const [imageUrl, setImageUrl] = useState(process.env.PUBLIC_URL + "/default-image.png")

    useEffect(()=>{
        if (group && isValidURL(group.previewImage)) {
            setImageUrl(group.previewImage)
        }
    }, [group])
    return(
        <NavLink  to={`groups/${group.id}`} className="nav-link">
            <div className="item-container">
                <div className="image-container">
                    <img onError={()=>setImageUrl(process.env.PUBLIC_URL + "/default-image.png")} src={imageUrl} />
                </div>
                <div className="text-container">
                    <div>{group.name}</div>
                    <div>{`${group.city}, ${group.state}`}</div>
                    <div className="about">{group.about}</div>
                    <div>{`${group.events ? group.events.length : 0} ${(group.events && group.events.length !== 1) ? "events" : "event"}`} · {group.private ? "Private" : "Public"}</div>
                    <div></div>
                </div>
            </div>
        </NavLink>
    )
}

export default GroupListItem;
