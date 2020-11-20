import * as React from "react";
import { useState, useEffect } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Empty, Tooltip, message } from "antd";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { AppNavGrid } from "./AppNavGrid";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { EXPIRE_TIME } from "../../../constants/Messages";
import { signOut } from "../../../redux/actions/Auth";
import { getMarketApps } from "../../../redux/actions/Applications";
import Loading from "../../../components/shared-components/Loading";
export interface IApps {
    CustomerPrice: number;
    DataBaseServer: string;
    Description: string;
    ID: number;
    IsActive: boolean;
    Name: string;
    PartnerPercent: number;
    Photo: string;
    ReferalPercent: number;
}
const AppStoreNav = () => {
    // const [apps, setApps] = useState<IApps[]>([]);
    const dispatch = useDispatch();
    const Token = useSelector((state) => state["auth"].token);
    const loading = useSelector((state) => state["auth"].loading);
    const apps: IApps[] = useSelector((state) => state["apps"]);
    const [isOpened, setIsOpened] = useState(true);
    // useEffect(() => {
    //     if (isOpened) {
    //         dispatch(getMarketApps(Token));
    //     }
    // }, [isOpened]);
    const menu = (
        <Menu
            style={{
                width: "330px",
                minHeight: loading && "300px",
            }}
        >
            {loading ? (
                <Loading cover="content" align="center" />
            ) : (
                <AppNavGrid apps={apps} />
            )}
            {apps.length > 0 || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={["click"]} placement={"bottomRight"}>
            <Menu mode={"horizontal"}>
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
