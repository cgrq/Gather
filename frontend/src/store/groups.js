import { csrfFetch } from "./csrf";

import { compareEventDates } from "../utils/dates";
const ADD_GROUPS = "groups/allGroups/add";
const ADD_GROUP = "groups/:groupId/add";
const ADD_IMAGE = "groups/:groupId/images/add";
const DELETE_GROUP = "groups/:groupId/delete";


const addGroups = (groups) => {
  return {
    type: ADD_GROUPS,
    groups
  }
}

const addGroup = (group) => {
  return {
    type: ADD_GROUP,
    group
  }
}

const deleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId
  }
}

const addImage = (groupId, image) => {
  console.log("In action creator")
  return {
    type: ADD_IMAGE,
    groupId,
    image
  }
}

export const getGroups = () => async (dispatch) => {
  const groupsRes = await fetch("/api/groups");
  const eventsRes = await fetch("/api/events");
  const groupsData = await groupsRes.json();
  const eventsData = await eventsRes.json();
  eventsData.Events.sort(compareEventDates)

  const eventsByGroupId = {};
  eventsData.Events.forEach(event => {
    if (eventsByGroupId[event.groupId]) eventsByGroupId[event.groupId].push(event);
    else eventsByGroupId[event.groupId] = [event]
  })

  const data = groupsData.Groups.map((group) => {
    group.events = eventsByGroupId[group.id];
    return group;
  })
  dispatch(addGroups(data));
  return data;
}

export const createGroup = (group) => async (dispatch) => {
  const { name, about, isPrivate, type, city, state } = group;
  const groupRes = await csrfFetch("/api/groups", {
    method: "POST",
    body: JSON.stringify({
      name,
      about,
      type,
      private: isPrivate,
      city,
      state
    }),
  });
  const data = await groupRes.json();

  dispatch(addGroup(data));
  return data;
}


export const createGroupImage = (image) => async (dispatch) => {
  const { groupId, url } = image;
  const res = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "POST",
    body: JSON.stringify({
      url,
      preview: true
    }),
  });
  const imageData = await res.json();

  dispatch(addImage(groupId, imageData));
  return imageData;
}

export const updateGroup = (group) => async (dispatch) => {
  console.log(`🖥 ~ file: groups.js:89 ~ updateGroup ~ group:`, group)
  const { groupId, name, about, isPrivate, type, city, state } = group;
  console.log(`🖥 ~ file: groups.js:91 ~ updateGroup ~ isPrivate:`, isPrivate)
  const groupRes = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
      about,
      type,
      private: isPrivate,
      city,
      state
    }),
  });
  const data = await groupRes.json();

  dispatch(addGroup(data));
  return data;
}

export const removeGroup = (groupId) => async (dispatch) => {
console.log(`🖥 ~ file: groups.js:118 ~ removeGroup ~ groupId:`, groupId)

  const groupRes = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
  const data = await groupRes.json();

  dispatch(deleteGroup(data));
  return data;
}

export const getGroup = (groupId) => async (dispatch) => {
  console.log("In thunk")
  const res = await fetch(`/api/groups/${groupId}`);
  const data = await res.json();

  dispatch(addGroup(data.Groups));
  return data;
}

const groupsReducer = (state = [], action) => {
  console.log("IN REDUCER")
  const newState = { ...state };
  switch (action.type) {
    case ADD_GROUPS:
      newState.allGroups = {}

      action.groups.forEach(group => {
        newState.allGroups[group.id] = group
      });

      newState.allGroups.optionalOrderedList = [];
      return newState;
    case ADD_GROUP:
      console.log(`🖥 ~ file: groups.js:133 ~ groupsReducer ~ action.group.id:`, action.group.id)
      newState[action.group.id] = action.group

      return newState;
    case ADD_IMAGE:
      newState[action.groupId].GroupImages = [action.image.url]

      return newState;
    case DELETE_GROUP:
      delete newState[action.groupId];

      return newState;
    default:
      return state;
  }
};

export default groupsReducer;
