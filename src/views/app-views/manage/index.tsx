import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { Route, Switch, Link } from "react-router-dom";
import {
  EnDbServerLocation,
  EnDbServerType,
} from "../../../api/app/management-db/types";
import Instance from "./instance";
import InstanceCreate from "./instance/InstanceCreate";
import InstanceEdit from "./instance/InstanceEdit";

const Manage = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <Switch>
        <Route path={props.match.ur}>
          <Switch>
            <Route exact path={props.match.url}>
              <h4 className="text-center mb-3">Choose cloud</h4>
              <div className="text-center mb-5">
                <Button className="mr-3">
                  <Link
                    to={`${props.match.url}/instance?cloud=${EnDbServerLocation.PUBLIC}`}
                  >
                    Public
                  </Link>
                </Button>
                <Button>
                  <Link
                    to={`${props.match.url}/instance?cloud=${EnDbServerLocation.PRIVATE}`}
                  >
                    Private
                  </Link>
                </Button>
              </div>
              <div className="text-center">
                <img
                  width={600}
                  src={process.env.PUBLIC_URL + "/img/others/img-18.png"}
                  alt="Cloud"
                />
              </div>
            </Route>
            <Route path={`${props.match.url}/instance`}>
              <Instance {...props} />
            </Route>
            <Route path={`${props.match.url}/create`}>
              <InstanceCreate {...props} />
            </Route>
            <Route path={`${props.match.url}/edit/`}>
              <InstanceEdit {...props} />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </>
  );
};
export default Manage;
