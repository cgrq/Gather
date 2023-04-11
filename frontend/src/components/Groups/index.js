import "./Groups.css";
import ResultsPage from "../ResultsPage";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getGroups } from "../../store/groups";

function Groups(){
    const dispatch = useDispatch()
    const groups = useSelector(state => state.groups.allGroups);
    console.log(`🖥 ~ file: index.js:10 ~ Groups ~ groups:`, groups)

    useEffect(()=>{
        dispatch(getGroups());
    },[dispatch])

    if(!groups) return null;
    if (groups.hasOwnProperty('optionalOrderedList')) {
        delete groups.optionalOrderedList;
    }

    return(
        <ResultsPage page="groups" dataObj={groups}></ResultsPage>
    )
}

export default Groups;
