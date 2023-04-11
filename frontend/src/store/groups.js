const ADD_GROUPS = "groups/add";


const addGroups = (groups, events) => {
    return {
        type:ADD_GROUPS,
        groups,
        events
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
      default:
        return state;
    }
  };

  export default groupsReducer;
