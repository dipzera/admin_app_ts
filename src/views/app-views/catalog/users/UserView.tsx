import React, { Component } from "react";
import { Avatar, Drawer, Divider } from "antd";
import {
  MobileOutlined,
  MailOutlined,
  UserOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import IntlMessage from "../../../../components/util-components/IntlMessage";

interface UserViewProps {
  data: any;
  visible: boolean;
  close: () => void;
}

class UserView extends Component<UserViewProps> {
  render() {
    const { data, visible, close } = this.props;
    return (
      <Drawer
        width={300}
        placement="right"
        onClose={close}
        closable={false}
        visible={visible}
      >
        <div className="text-center mt-3">
          <Avatar size={80} src={data?.Photo} icon={<UserOutlined />} />
          <h3 className="mt-2 mb-0">
            {data?.FirstName && data?.LastName
              ? data?.FirstName + " " + data?.LastName
              : " "}
          </h3>
          <span className="text-muted">
            <IntlMessage id="user.Title" />
          </span>
        </div>
        <Divider dashed />
        <div className="">
          <h6 className="text-muted text-uppercase mb-3">
            <IntlMessage id="user.AccountDetails" />
          </h6>
          <p>
            <UserOutlined />
            <span className="ml-3 text-dark">
              <IntlMessage id="user.PersonalID" />: {data?.ID}
            </span>
          </p>
          <p>
            <ApartmentOutlined />
            <span className="ml-3 text-dark">
              <IntlMessage id="user.CompanyID" />: {data?.CompanyID}
            </span>
          </p>
        </div>
        <div className="mt-5">
          <h6 className="text-muted text-uppercase mb-3">
            <IntlMessage id="app.Contact" />
          </h6>
          <p>
            <MobileOutlined />
            <span className="ml-3 text-dark">{data?.PhoneNumber}</span>
          </p>
          <p>
            <MailOutlined />
            <span className="ml-3 text-dark">
              {data?.Email ? data?.Email : "-"}
            </span>
          </p>
        </div>
      </Drawer>
    );
  }
}

export default UserView;
