import * as React from "react";
import { useState } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Tooltip } from "antd";
import IntlMessage from "../../../components/util-components/IntlMessage";
import AppNavGrid from "./AppNavGrid";
import Loading from "../../../components/shared-components/Loading";
import { IMarketAppList } from "../../../api/types.response";
import { AppService } from "../../../api";
const AppStoreNav = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [apps, setApps] = useState<IMarketAppList[]>([]);
  const renderApps = async () =>
    await new AppService().GetMarketAppList().then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        setApps(data.MarketAppList);
      }
    });
  const menu = (
    <Menu
      style={{
        width: "330px",
        minHeight: loading ? "300px" : "auto",
      }}
    >
      {loading ? (
        <Loading cover="content" align="center" />
      ) : (
        <AppNavGrid apps={apps ?? []} />
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement={"bottomRight"}>
      <Menu mode={"horizontal"} onClick={() => renderApps()}>
        <Menu.Item>
          <Tooltip title={<IntlMessage id={"header.applications"} />}>
            <AppstoreOutlined className={"nav-icon"} />
          </Tooltip>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

export default AppStoreNav;
