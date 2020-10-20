import React, { Component } from "react";
import {
  UserOutlined,
  LockOutlined,
  CreditCardOutlined,
  BellOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import InnerAppLayout from "../../../layouts/inner-app-layout";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import Billing from "./Billing";
import Notification from "./Notification";
import IntlMessage from "../../../components/util-components/IntlMessage";
import Security from "./Security";

interface ISettingOption {
  match?: any;
  location?: any;
  children?: any;
}

const SettingOption = ({ match, location }: ISettingOption) => {
  return (
    <Menu
      defaultSelectedKeys={[`${match.url}/general`]}
      mode="inline"
      selectedKeys={[location.pathname]}
    >
      <Menu.Item key={`${match.url}/general`}>
        <UserOutlined />
        <span>
          <IntlMessage id={"account.sidenav.EditProfile"} />
        </span>
        <Link to={"general"} />
      </Menu.Item>
      <Menu.Item key={`${match.url}/change-password`}>
        <LockOutlined />
        <span>
          <IntlMessage id={"account.sidenav.ChangePassword"} />
        </span>
        <Link to={"change-password"} />
      </Menu.Item>
      <Menu.Item key={`${match.url}/security`}>
        <FireOutlined />
        <span>
          <IntlMessage id={"account.sidenav.Security"} />
        </span>
        <Link to={"security"} />
      </Menu.Item>
    </Menu>
  );
};

const SettingContent = ({ match }: ISettingOption) => {
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/general`} />
      <Route path={`${match.url}/general`} component={EditProfile} />
      <Route path={`${match.url}/change-password`} component={ChangePassword} />
      <Route path={`${match.url}/security`} component={Security} />
    </Switch>
  );
};

class Setting extends Component {
  render() {
    return (
      <InnerAppLayout
        sideContentWidth={320}
        sideContent={<SettingOption {...this.props} />}
        mainContent={<SettingContent {...this.props} />}
      />
    );
  }
}

export default Setting;
