import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SectionThree(){
    const sessionUser = useSelector(state => state.session.user);


    const seeAllGroupsCaption = "Nunc sed augue lacus viverra vitae congue. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed. Aliquam faucibus purus in massa tempor nec feugiat nisl.";

    return(
        <div className="section-three-container">
            <ActionCard
                iconImgPath={"./placeholder-icon.png"}
                linkPath={"/groups"}
                title={"See all groups"}
                caption={seeAllGroupsCaption} />
            <ActionCard
                iconImgPath={"./placeholder-icon.png"}
                linkPath={"/"}
                title={"Find an event"}
                caption={seeAllGroupsCaption} />
            <ActionCard
                iconImgPath={"./placeholder-icon.png"}
                linkPath={"/groups/new"}
                title={"Start a group"}
                caption={seeAllGroupsCaption}
                disabled={sessionUser ? false : true} />
        </div>
    )
}

function ActionCard({iconImgPath, linkPath, title, caption, disabled=false}){
    return (
        <div className="action-card-container">
            <img src={iconImgPath} />
            <NavLink className={disabled ? "isDisabled" : ""} to={linkPath}>{title}</NavLink>
            <p>{caption}</p>
        </div>
    )
}

export default SectionThree;
