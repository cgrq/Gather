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

export const createEvent = (group) => async (dispatch) => {
    const { name, type, isPrivate, price, startDate, endDate, description } = group;
    const groupRes = await csrfFetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        name,
        private: isPrivate,
        type,
        price,
        startDate,
        endDate,
        description
      }),
    });
    const data = await groupRes.json();

    dispatch(addEvent(data));
    return data;
  }
  export const createEventImage = (image) => async (dispatch) => {
    const {eventId, url} = image;
    const res = await csrfFetch(`/api/events/${eventId}/images`, {
      method: "POST",
      body: JSON.stringify({
        url,
        preview: true
      }),
    });
    const data = await res.json();

    dispatch(addGroup(data));
    return res;
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
