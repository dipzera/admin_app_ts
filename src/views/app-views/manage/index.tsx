import { Avatar, Card, Popover } from "antd";
import React, { useState } from "react";
import { Route, Switch, Link, RouteComponentProps } from "react-router-dom";
import { EnDbServerLocation } from "../../../api/app/management-db/types";
import Instance from "./instance";
import InstanceCreate from "./instance/InstanceCreate";
import InstanceEdit from "./instance/InstanceEdit";
import "./manage.scss";

const publicDescription = `The public cloud is defined as computing services 
offered by third-party providers over the public 
Internet, making them available to anyone who wants
 to use or purchase them. They may be free or 
sold on-demand, allowing customers to pay only 
per usage for the CPU cycles, storage, or bandwidth 
they consume.`;
const privateDescription = `Private cloud is a computing model that offers a proprietary
environment dedicated to a single business entity. 
As with other types of cloud computing environments, 
private cloud provides extended, virtualized computing 
resources via physical components stored 
on-premises or at a vendor's datacenter.`;
const saasDescription = `One of the most popular forms of cloud computing 
is software-as-a-service (SaaS). Here’s a simple 
SaaS definition: a software distribution model in
 which a service provider hosts applications
 for customers and makes them available to 
these customers via the internet.`;
const CardStyles = {
  borderRadius: 40,
  background: "white",
  boxShadow: "0 0 5px #eee",
  padding: "15px 0 30px 0",
};
const ManageCloud = (props: RouteComponentProps) => {
  return (
    <div style={CardStyles}>
      <h3 className="text-center mb-5">What cloud would you like to manage?</h3>
      <div className="m-auto d-flex justify-content-between w-80 flex-wrap cloud flex-nowrap">
        <div className="text-center cloud-item">
          <Link
            to={`${props.match.url}/instance?cloud=${EnDbServerLocation.PUBLIC}`}
          >
            <Avatar
              src={`${process.env.PUBLIC_URL}/img/cloud-sharing.svg`}
              className="cloud-img"
              size={128}
              style={{ padding: 20 }}
            />
          </Link>
          <h5 className="my-3">Public Cloud</h5>
          <p className="w-75 m-auto">{publicDescription}</p>
        </div>
        <div className="text-center cloud-item">
          <Link
            to={`${props.match.url}/instance?cloud=${EnDbServerLocation.PRIVATE}`}
          >
            <Avatar
              src={`${process.env.PUBLIC_URL}/img/cloud-computing.svg`}
              size={128}
              style={{ padding: 20 }}
              className="cloud-img"
            />
          </Link>
          <h5 className="my-3">Private Cloud</h5>
          <p className="w-75 m-auto">{privateDescription}</p>
        </div>
        <div className="text-center cloud-item">
          <Link
            to={`${props.match.url}/instance?cloud=${EnDbServerLocation.SAAS}`}
          >
            <Avatar
              src={`${process.env.PUBLIC_URL}/img/saas.svg`}
              className="cloud-img"
              size={128}
              style={{ padding: 20 }}
            />
          </Link>
          <h5 className="my-3">SaaS Cloud</h5>
          <p className="w-75 m-auto">{saasDescription}</p>
        </div>
      </div>
    </div>
  );
};
const Manage = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <Switch>
        <Route exact path={props.match.url}>
          <ManageCloud {...props} />
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
