import React from "react";
import { Menu, Dropdown, Avatar, Modal } from "antd";
import { connect } from "react-redux";
import {
  // EditOutlined,
  SettingOutlined,
  // ShopOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Icon from "../util-components/Icon";
import { signOut } from "../../redux/actions/Auth";
import { clearSettings } from "../../redux/actions/Account";
import { NavLink } from "react-router-dom";
import IntlMessage from "../util-components/IntlMessage";
import { IState } from "../../redux/reducers";
import { IAccount } from "../../redux/reducers/Account";
import TranslateText from "../../utils/translate";
const menuItem = [
  {
    title: <IntlMessage id={"header.profile.AccountSettings"} />,
    icon: SettingOutlined,
    path: "/app/settings",
  },
  {
    title: <IntlMessage id={"header.profile.HelpCenter"} />,
    icon: QuestionCircleOutlined,
    path: "/",
  },
];

const NavProfile = ({ signOut, FirstName, Photo }: any) => {
  const { confirm } = Modal;
  const confirmLogout = () => {
    confirm({
      title: TranslateText("header.logout.message"),
      onOk: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(signOut());
          }, 1000);
        });
      },
      onCancel: () => {},
    });
  };

  // const profileImg = "/img/avatars/thumb-1.jpg";
  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar size={45} src={Photo} icon={<UserOutlined />} />
          <div className="pl-3">
            <h4 className="mb-0">{FirstName}</h4>
            {/* <span className="text-muted">Frontend Developer</span> */}
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu selectable={false}>
          {menuItem.map((el, i) => {
            return (
              <Menu.Item key={i}>
                <NavLink to={el.path}>
                  <Icon className="mr-3" type={el.icon} />
                  <span className="font-weight-normal">{el.title}</span>
                </NavLink>
              </Menu.Item>
            );
          })}
          <Menu.Item key={menuItem.length + 1} onClick={confirmLogout}>
            <span>
              <LogoutOutlined className="mr-3" />
              <span className="font-weight-normal">
                <IntlMessage id={"header.profile.SignOut"} />
              </span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item>
          <Avatar src={Photo} icon={<UserOutlined />} />
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

const mapStateToProps = ({ account }: IState) => {
  const { FirstName, Photo } = account as IAccount;

  return { FirstName, Photo };
};

export default connect(mapStateToProps, { signOut, clearSettings })(NavProfile);
