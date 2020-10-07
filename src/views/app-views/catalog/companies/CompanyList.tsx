import React, { Component } from "react";
import { Card, Table, Tag, Tooltip, message, Button } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import UserView from "./CompanyView";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import companyData from "../../../../assets/data/company-list.data.json";

export class UserList extends Component {
  /* MAKE THIS FROM API CALL */
  state = {
    users: companyData,
    userProfileVisible: false,
    selectedUser: null,
  };

  deleteUser = (userId) => {
    this.setState({
      users: this.state.users.filter((item) => item.id !== userId),
    });
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  showUserProfile = (userInfo) => {
    this.setState({
      userProfileVisible: true,
      selectedUser: userInfo,
    });
  };

  closeUserProfile = () => {
    this.setState({
      userProfileVisible: false,
      selectedUser: null,
    });
  };

  render() {
    const { users, userProfileVisible, selectedUser } = this.state;

    const tableColumns = [
      {
        title: "Company",
        dataIndex: "name",
        render: (_, record) => (
          <div className="d-flex">
            <AvatarStatus
              src={process.env.PUBLIC_URL + record.img}
              name={record.CommercialName}
              subTitle={record.Email}
            />
          </div>
        ),
        sorter: {
          compare: (a, b) => {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
          },
        },
      },
      {
        title: "Address",
        dataIndex: "OfficeAddress",
      },
      {
        title: "Last online",
        dataIndex: "lastOnline",
        render: (date) => (
          <span>{moment.unix(date).format("MM/DD/YYYY")} </span>
        ),
        sorter: (a, b) =>
          moment(a.lastOnline).unix() - moment(b.lastOnline).unix(),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status) => (
          <Tag
            className="text-capitalize"
            color={status === "active" ? "cyan" : "red"}
          >
            {status}
          </Tag>
        ),
        sorter: {
          compare: (a, b) => a.status.length - b.status.length,
        },
      },
      {
        title: "",
        dataIndex: "actions",
        render: (_, elm) => (
          <div className="text-right">
            <Tooltip title="View">
              <Button
                type="primary"
                className="mr-2"
                icon={<EyeOutlined />}
                onClick={() => {
                  this.showUserProfile(elm);
                }}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.deleteUser(elm.id);
                }}
                size="small"
              />
            </Tooltip>
          </div>
        ),
      },
    ];
    return (
      <Card bodyStyle={{ padding: "0px" }}>
        <Table columns={tableColumns} dataSource={users} rowKey="id" />
        <UserView
          data={selectedUser}
          visible={userProfileVisible}
          close={() => {
            this.closeUserProfile();
          }}
        />
      </Card>
    );
  }
}

export default UserList;