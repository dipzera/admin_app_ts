import * as React from "react";
import { Menu } from "antd";
import { Avatar } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import "./app_list.scss";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import { Link } from "react-router-dom";
import { MenuItemProps } from "antd/lib/menu/MenuItem";
import { IMarketAppList } from "../../../api/types.response";
interface IAppNavGrid extends MenuItemProps {
  apps: IMarketAppList[];
}
export const AppNavGrid = (props: IAppNavGrid) => {
  return (
    <>
      {props.apps.map((app) => (
        <Menu.Item key={app.ID} {...props} className="app-list__item">
          <Link to={`${APP_PREFIX_PATH}/applications/${app.ID}`}>
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
          </Link>
        </Menu.Item>
      ))}
    </>
  );
};
