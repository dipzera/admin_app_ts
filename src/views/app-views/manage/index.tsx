import { Avatar, Button, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { Route, Switch, Link } from "react-router-dom";
import {
  EnDbServerLocation,
  EnDbServerType,
} from "../../../api/app/management-db/types";
import Instance from "./instance";
import InstanceCreate from "./instance/InstanceCreate";
import InstanceEdit from "./instance/InstanceEdit";
import "./manage.scss";

const Manage = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <Switch>
        <Route exact path={props.match.url}>
          <h1 className="text-center mt-5 mb-5">Choose cloud</h1>
          <div className="m-auto d-flex justify-content-between w-50">
            <div className="text-center">
              <Link
                to={`${props.match.url}/instance?cloud=${EnDbServerLocation.PUBLIC}`}
              >
                <Avatar
                  src={`${process.env.PUBLIC_URL}/img/cloud-sharing.svg`}
                  className="cloud-item"
                  size={128}
                  style={{ padding: 20 }}
                />
              </Link>
              <h5 className="mt-3">Public Cloud</h5>
            </div>
            <div className="text-center">
              <Link
                to={`${props.match.url}/instance?cloud=${EnDbServerLocation.PRIVATE}`}
              >
                <Avatar
                  src={`${process.env.PUBLIC_URL}/img/cloud-computing.svg`}
                  size={128}
                  style={{ padding: 20 }}
                  className="cloud-item"
                />
              </Link>
              <h5 className="mt-3">Private Cloud</h5>
            </div>
            <div className="text-center">
              <Popover
                title={"What is Software-as-a-Service (SaaS)?"}
                content={
                  "Software-as-a-Service, or SaaS for short, is a cloud-based method of providing software to users."
                }
                style={{ width: 100 }}
              >
                <Link
                  to={`${props.match.url}/instance?cloud=${EnDbServerLocation.SAAS}`}
                >
                  <Avatar
                    src={`${process.env.PUBLIC_URL}/img/saas.svg`}
                    className="cloud-item"
                    size={128}
                    style={{ padding: 20 }}
                  />
                </Link>
              </Popover>
              <h5 className="mt-3">SaaS Cloud</h5>
            </div>
          </div>
        </Route>
        <Route exact path={`${props.match.url}/instance`}>
          <Instance {...props} />
        </Route>
        <Route path={`${props.match.url}/instance/create`}>
          <InstanceCreate {...props} />
        </Route>
        <Route path={`${props.match.url}/instance/edit`}>
          <InstanceEdit {...props} />
        </Route>
      </Switch>
    </>
  );
};
export default Manage;
