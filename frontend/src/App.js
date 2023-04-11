import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Groups from "./components/Groups";
import Events from "./components/Events";


function App() {
  const dispatch = useDispatch();
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
          <Route exact path="/groups">
            <Groups />
          </Route>
          <Route exact path="/events">
            <Events />
          </Route>
          <Route path="/groups/:groupId">
            
          </Route>
        </Switch>}
    </>
  );
}

export default App;
