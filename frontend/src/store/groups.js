import { csrfFetch } from "./csrf";

import { compareEventDates } from "../utils/dates";
const ADD_GROUPS = "groups/allGroups/add";
const ADD_USER_GROUPS = "groups/userGroups/add";
const ADD_GROUP = "groups/:groupId/add";
const ADD_IMAGE = "groups/:groupId/images/add";
const DELETE_GROUP = "groups/:groupId/delete";
const DELETE_GROUP_EVENT = "groups/:groupId/:eventId/delete";


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


const addUserGroups = (groups) => {
  return {
    type: ADD_USER_GROUPS,
    groups
  }
}

const deleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId
  }
}
const deleteGroupEvent = (groupId, eventId) => {
  return {
    type: DELETE_GROUP_EVENT,
    groupId,
    eventId
  }
}

const addImage = (groupId, image) => {
  return {
    type: ADD_IMAGE,
    groupId,
    image
  }
}

export const getGroupById = (groupId) => async (dispatch) => {
  const res = await fetch(`/api/groups/${groupId}`);
  const data = await res.json();

  dispatch(addGroup(data));
  return data;
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

export const getUserGroups = () => async (dispatch) => {
  const groupsRes = await fetch("/api/groups/current");
  const data = await groupsRes.json();


  dispatch(addUserGroups(data));
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
  const { groupId, imageFile } = image;

  const formData = new FormData();

  if (image) formData.append("image", imageFile);

  formData.append("preview", true);

  const res = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "POST",
    body: formData
  });
  const imageData = await res.json();

  dispatch(addImage(groupId, imageData));
  return imageData;
}

export const updateGroupImage = (image) => async (dispatch) => {
  const { groupId, imageFile } = image;

  const formData = new FormData();

  if (image) formData.append("image", imageFile);

  formData.append("preview", true);

  const res = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "PUT",
    body: formData
  });
  const imageData = await res.json();

  dispatch(addImage(groupId, imageData));
  return imageData;
}

export const updateGroup = (group) => async (dispatch) => {
  const { groupId, name, about, isPrivate, type, city, state } = group;
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

  const groupRes = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
  const data = await groupRes.json();

  dispatch(deleteGroup(groupId));
  return data;
}

export const removeGroupEvent = (groupId, eventId) => async (dispatch) => {

  const eventRes = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });
  const data = await eventRes.json();

  dispatch(deleteGroupEvent(groupId, eventId));
  return data;
}

// export const getGroup = (groupId) => async (dispatch) => {
//   const res = await fetch(`/api/groups/${groupId}`);
//   const data = await res.json();

//   dispatch(addGroup(data.Groups));
//   return data;
// }

const groupsReducer = (state = [], action) => {
  const newState = { ...state };
  switch (action.type) {
    case ADD_GROUPS:
      newState.allGroups = {}

      action.groups.forEach(group => {
        newState.allGroups[group.id] = group
      });

      return newState;
    case ADD_USER_GROUPS:
      newState.userGroups = {}

      action.groups.Groups.forEach(group => {
        newState.userGroups[group.id] = group
      });

      return newState;

    case ADD_GROUP:
      newState[action.group.id] = action.group

      return newState;
    case ADD_IMAGE:
      newState[action.groupId].GroupImages = [action.image.url]

      return newState;
    case DELETE_GROUP:
      delete newState[action.groupId];

      if (newState.userGroups && newState.userGroups[action.groupId]) {
        delete newState.userGroups[action.groupId]
      }

      return newState;
    case DELETE_GROUP_EVENT:
      const groupId = action.groupId;
      const eventId = action.eventId;

      const eventIndex = newState.userGroups[groupId].Events.findIndex(
        (event) => event.id === eventId
      );

      if (eventIndex !== -1) {
        newState.userGroups[groupId].Events.splice(eventIndex, 1);
      }

      return newState;
    default:
      return state;
  }
};

export default groupsReducer;
