import React from "react";
import { Menu } from "antd";
import { Avatar } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import { NavLink, RouteComponentProps, withRouter } from "react-router-dom";
import { MenuItemProps } from "antd/lib/menu/MenuItem";
import { IMarketAppList } from "../../../api/app/types";
import "./applications.scss";

interface IAppNavGrid extends MenuItemProps, RouteComponentProps {
  apps: IMarketAppList[];
}
const AppNavGrid = (props: IAppNavGrid) => {
  return (
    <>
      {props.apps.map((app) => (
        <Menu.Item key={app.ID} {...props} className="app-list__item">
          <NavLink to={`${APP_PREFIX_PATH}/id/${app.ID}`}>
            <div className="text-center">
              <Avatar
                src={app.Photo}
                icon={<ExperimentOutlined />}
                shape="square"
                alt={app.Name}
                style={{ marginBottom: "10px" }}
              />
            </div>
            <p className="text-center">{app.Name}</p>
          </NavLink>
        </Menu.Item>
      ))}
    </>
  );
};
export default withRouter(AppNavGrid);
