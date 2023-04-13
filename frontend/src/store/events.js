import { csrfFetch } from "./csrf";

const ADD_EVENT = "events/:eventId/add";
const ADD_EVENTS = "events/allEvents/add";
const ADD_IMAGE = "events/:eventId/images/add";
const DELETE_EVENT = "events/:eventId/delete";


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
const deleteEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    eventId
  }
}
const addImage = (eventId, image) => {
  console.log("In action creator")
  return {
    type: ADD_IMAGE,
    eventId,
    image
  }
}

export const createEvent = (event) => async (dispatch) => {
  const { groupId, name, type, price, startDate, endDate, description } = event;
  const venueRes = await csrfFetch(`/api/groups/${groupId}/venues`, {
    method: "POST",
    body: JSON.stringify({
      address: "123 Disney Lane",
      city: "New York",
      state: "NY",
      lat: 37.7645358,
      lng: -122.4730327
    }),
  });
  const venueData = await venueRes.json();
  const eventRes = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    body: JSON.stringify({
      venueId: venueData.id,
      groupId,
      name,
      description,
      type,
      capacity: 1,
      price,
      startDate,
      endDate,
    }),
  });
  const data = await eventRes.json();

  dispatch(addEvent(data));
  return data;
}
export const createEventImage = (image) => async (dispatch) => {
  const { eventId, url } = image;
  const res = await csrfFetch(`/api/events/${eventId}/images`, {
    method: "POST",
    body: JSON.stringify({
      url,
      preview: true
    }),
  });
  const imageData = await res.json();

  dispatch(addImage(eventId, imageData));
  return imageData;
}

export const removeEvent = (eventId) => async (dispatch) => {

  const eventRes = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });
  const data = await eventRes.json();

  dispatch(deleteEvent(data));
  return data;
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
    case ADD_IMAGE:
      newState[action.eventId].EventImages = [action.image.url]

      return newState;
    case DELETE_EVENT:
      delete newState[action.groupId];

      return newState;
    default:
      return state;
  }
};

export default eventsReducer;
