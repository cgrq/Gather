import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Groups from "./components/Groups";
import Events from "./components/Events";
import GroupIdPage from "./components/Groups/GroupIdPage";
import EventIdPage from "./components/Events/EventIdPage";
import CreateGroupPage from "./components/Groups/CreateGroupPage";
import CreateEventPage from "./components/Events/CreateEventPage";
import UpdateGroupPage from "./components/Groups/UpdateGroupPage";


function App() {
  const dispatch = useDispatch();
  const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/groups/new">
            <CreateGroupPage />
          </Route>
          <Route path="/groups/:groupId/events/new">
            <CreateEventPage />
          </Route>
          <Route path="/groups/:groupId/edit">
            <UpdateGroupPage />
          </Route>
          <Route path="/groups/:groupId">
            <GroupIdPage />
          </Route>
          <Route exact path="/groups">
            <Groups />
          </Route>
          <Route exact path="/events">
            <Events />
          </Route>
          <Route path="/events/:eventId">
            <EventIdPage />
          </Route>
        </Switch>}
    </>
  );
}

export default App;
