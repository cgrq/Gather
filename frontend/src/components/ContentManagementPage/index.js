import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserGroups } from "../../store/groups";
import ListItem from "./GroupListItem";

export default function ContentManagementPage(){
    const dispatch = useDispatch();
    const { userGroups } = useSelector((state)=> state.groups)

    useEffect(()=>{
        dispatch(getUserGroups())
    },[])

    if(!userGroups) return null

    return (
        <div className="content-management-page-wrapper">
            <h2>Manage groups</h2>
            {
                Object.values(userGroups).map((group)=>(
                   <ListItem key={group.id} group={group} />
                ))
            }
        </div>
    )
}
