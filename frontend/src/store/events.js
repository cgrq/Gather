import { compareEventDates } from "../utils/dates";

const ADD_EVENT = "events/singleEvent/add";
const ADD_EVENTS = "events/allEvents/add";

const addEvent = (event) => {
    return {
        type: ADD_EVENT,
        event
    }
}
const addEvents = (events) => {
    return {
        type: ADD_EVENTS,
        events
    }
}

export const getEvent = (eventId) => async (dispatch) => {
    const res = await fetch(`/api/events/${eventId}`);
    const data = await res.json();

    dispatch(addEvent(data));
    return data;
}

export const getEvents = () => async (dispatch) => {
    const eventsRes = await fetch("/api/events");
    const data = await eventsRes.json();

    dispatch(addEvents(data.Events));
    return data;
}

const eventsReducer = (state = [], action) => {
    const newState = { ...state };
    switch (action.type) {
        case ADD_EVENTS:
            newState.allEvents = {}

            action.events.forEach(event => {
                newState.allEvents[event.id] = event
            });

            return newState;
        case ADD_EVENT:
            newState[action.event.id] = action.event
            return newState;
        default:
            return state;
    }
};

export default eventsReducer;
