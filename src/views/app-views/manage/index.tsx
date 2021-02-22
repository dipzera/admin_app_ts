import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Instance from "./instance";
import InstanceCreate from "./instance/InstanceCreate";
import InstanceEdit from "./instance/InstanceEdit";

const Manage = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <Switch>
        <Route exact path={props.match.url}>
          <Instance {...props} />
        </Route>
        <Route path={`${props.match.url}/create`}>
          <InstanceCreate {...props} />
        </Route>
        <Route path={`${props.match.url}/edit/`}>
          <InstanceEdit {...props} />
        </Route>
      </Switch>
    </>
  );
};
export default Manage;
