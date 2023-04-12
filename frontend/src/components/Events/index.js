import "./Events.css";
import ResultsPage from "../ResultsPage";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getEvents } from "../../store/events";

function Events(){
    const dispatch = useDispatch()
    const events = useSelector(state => state.events.allEvents);

    useEffect(()=>{
        dispatch(getEvents());
    },[dispatch])

    if(!events) return null;

    return(
        <ResultsPage page="events" dataObj={events}></ResultsPage>
    )
}

export default Events;
