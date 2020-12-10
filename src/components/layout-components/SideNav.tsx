import React, { useEffect } from "react";
import { Layout } from "antd";
import { connect } from "react-redux";
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_DARK,
    NAV_TYPE_SIDE,
} from "../../constants/ThemeConstant";
import { Scrollbars } from "react-custom-scrollbars";
import MenuContent from "./MenuContent";
import { IState } from "../../redux/reducers";
import { ITheme } from "../../redux/reducers/Theme";
import Localization from "../../utils/Localization";

const { Sider } = Layout;

interface SideNavProps {
    [key: string]: any;
}

export const SideNav = ({
    navCollapsed,
    sideNavTheme,
    routeInfo,
    hideGroupTitle,
    localization = true,
}: SideNavProps) => {
    const props = { sideNavTheme, routeInfo, hideGroupTitle, localization };

    useEffect(() => {
        if (routeInfo) {
            const title =
                routeInfo.key.charAt(0).toUpperCase() + routeInfo.key.slice(1);
            document.title = title;
        } else {
            document.title = "Admin Portal App";
        }
    }, [routeInfo]);
    return (
        <Sider
            className={`side-nav ${
                sideNavTheme === SIDE_NAV_DARK ? "side-nav-dark" : ""
            }`}
            width={SIDE_NAV_WIDTH}
            collapsed={navCollapsed}
        >
            <Scrollbars autoHide>
                <MenuContent type={NAV_TYPE_SIDE} {...props} />
            </Scrollbars>
        </Sider>
    );
};

const mapStateToProps = ({ theme }: IState) => {
    const { navCollapsed, sideNavTheme } = theme as ITheme;
    return { navCollapsed, sideNavTheme };
};

export default connect(mapStateToProps)(SideNav);
