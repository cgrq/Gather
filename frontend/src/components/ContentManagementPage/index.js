import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getUserGroups } from "../../store/groups";

export default function ContentManagementPage(){
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getUserGroups())
    },[])

    return (
        <div>

        </div>
    )
}
