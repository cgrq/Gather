const ADD_GROUPS = "groups/allGroups/add";
const ADD_GROUP = "groups/add";


const addGroups = (groups) => {
    return {
        type:ADD_GROUPS,
        groups
    }
}

const addGroup = (group) => {
  return {
      type:ADD_GROUP,
      group
  }
}

export const getGroups = () => async(dispatch) => {
    const groupsRes = await fetch("/api/groups");
    const eventsRes = await fetch("/api/events");
    const groupsData = await groupsRes.json();
    const eventsData = await eventsRes.json();

    const eventsByGroupId = {};
    eventsData.Events.forEach(event => {
      if(eventsByGroupId[event.groupId]) eventsByGroupId[event.groupId].push(event);
      else eventsByGroupId[event.groupId] = [event]
    })

    const data = groupsData.Groups.map((group)=>{
      group.events = eventsByGroupId[group.id];
      return group;
    })
    dispatch(addGroups(data));
    return data;
}

export const getGroup = (groupId) => async(dispatch) => {
  const res = await fetch(`/api/groups/${groupId}`);
  const data = await res.json();

  dispatch(addGroup(data.Groups));
  return data;
}

const groupsReducer = (state = [], action) => {
    const newState = {...state};
    switch (action.type) {
      case ADD_GROUPS:
        newState.allGroups = {}

        action.groups.forEach(group => {
            newState.allGroups[group.id] = group
          });

        newState.allGroups.optionalOrderedList = [];
        return newState;
      case ADD_GROUP:
          newState[action.group.id] = action.group
          console.log(`🖥 ~ file: groups.js:61 ~ groupsReducer ~ action.group:`, action.group)

          return newState;
      default:
        return state;
    }
  };

  export default groupsReducer;
