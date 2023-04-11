import "./Groups.css";
import ResultsPage from "../ResultsPage";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getGroups } from "../../store/groups";

function Groups(){
    const dispatch = useDispatch()
    const groups = useSelector(state => state.groups.allGroups);

    useEffect(()=>{
        dispatch(getGroups());
    },[dispatch])

    if(!groups) return null;

    return(
        <ResultsPage page="groups" dataObj={groups}></ResultsPage>
    )
}

export default Groups;
