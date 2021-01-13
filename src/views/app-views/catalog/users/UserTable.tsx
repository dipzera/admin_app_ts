import * as React from "react";
import { ColumnsType } from "antd/lib/table";
import {
  IChangeUserStatusResponse,
  IUsers,
} from "../../../../api/types.response";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { Menu, Modal, Tag } from "antd";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import WithStringTranslate from "../../../../utils/translate";
import Flex from "../../../../components/shared-components/Flex";
import {
  EyeOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { status } from "./";

const UserTable = (
  sendActivationCode: (ID: number) => void,
  showUserProfile: (userInfo: IUsers) => void,
  showEditModal: (userInfo: IUsers) => void,
  getUsersInfo: () => void,
  handleUserStatus: (
    userId: number,
    status: number
  ) => Promise<IChangeUserStatusResponse>
) => {
  let dropdownMenu = (row: IUsers) => (
    <Menu>
      {row.Status === 0 && (
        <Menu.Item
          onClick={() =>
            Modal.confirm({
              title:
                WithStringTranslate("user.sendCodeModal.title") +
                " " +
                row.FirstName +
                "?",
              onOk: () => {
                sendActivationCode(row.ID);
              },
              onCancel: () => {},
            })
          }
        >
          <Flex alignItems="center">
            <ArrowRightOutlined />
            <span className="ml-2">
              <IntlMessage id="dropdown.SendActivationCode" />
            </span>
          </Flex>
        </Menu.Item>
      )}
      <Menu.Item onClick={() => showUserProfile(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">
            <IntlMessage id="dropdown.ViewDetails" />
          </span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => showEditModal(row)}>
        <Flex alignItems="center">
          <EditOutlined />
          <span className="ml-2">
            <IntlMessage id="dropdown.Edit" />
          </span>
        </Flex>
      </Menu.Item>
      {row.Status === 2 ? (
        <Menu.Item
          onClick={async () => {
            Modal.confirm({
              title: WithStringTranslate("user.activate.title"),
              onOk: async () => {
                await handleUserStatus(row.ID, status.active).then(() => {
                  getUsersInfo();
                });
              },
            });
          }}
        >
          <Flex alignItems="center">
            <CheckCircleOutlined />
            <span className="ml-2">
              <IntlMessage id="dropdown.Activate" />
            </span>
          </Flex>
        </Menu.Item>
      ) : row.Status === status.active ? (
        <Menu.Item
          onClick={async () => {
            Modal.confirm({
              title: WithStringTranslate("user.disable.title"),
              onOk: async () => {
                await handleUserStatus(row.ID, status.disabled).then(() => {
                  getUsersInfo();
                });
              },
            });
          }}
        >
          <Flex alignItems="center">
            <CloseCircleOutlined />
            <span className="ml-2">
              <IntlMessage id="dropdown.Disable" />
            </span>
          </Flex>
        </Menu.Item>
      ) : null}
    </Menu>
  );

  let tableColumns: ColumnsType<IUsers> = [
    {
      title: <IntlMessage id="user.Title" />,
      dataIndex: "FirstName",
      render: (_: any, record: IUsers) => (
        <div className="d-flex">
          <AvatarStatus
            src={record.Photo}
            name={`${record.FirstName} ${record.LastName}`}
            subTitle={record.Email}
            icon={<UserOutlined />}
          />
        </div>
      ),
    },
    {
      title: <IntlMessage id="company.Title" />,
      dataIndex: "Company",
      render: (Company: string) => <span>{Company}</span>,
    },
    {
      title: <IntlMessage id="user.Role" />,
      render: () => "User",
    },
    {
      title: <IntlMessage id="user.LastOnline" />,
      dataIndex: "LastAuthorize",
      render: (LastAuthorize: string) => (
        <span>
          {LastAuthorize
            ? moment.unix(+LastAuthorize.slice(6, 16)).format("DD/MM/YYYY")
            : " "}{" "}
        </span>
      ),
    },
    {
      title: <IntlMessage id="user.LastAuthorizeIP" />,
      dataIndex: "LastAuthorizeIP",
      render: (LastAuthorizeIP: string) => <span>{LastAuthorizeIP}</span>,
    },
    {
      title: <IntlMessage id="user.Status" />,
      dataIndex: "Status",
      render: (Status: number) => (
        <Tag
          className="text-capitalize"
          color={Status === 1 ? "cyan" : Status === 2 ? "volcano" : "orange"}
        >
          {Status === 1 ? (
            <IntlMessage id="user.status.Active" />
          ) : Status === 2 ? (
            <IntlMessage id="user.status.Disabled" />
          ) : (
            <IntlMessage id="user.status.Inactive" />
          )}
        </Tag>
      ),
      sorter: {
        compare: (a: IUsers, b: IUsers) => a.Status - b.Status,
      },
    },
    {
      dataIndex: "actions",
      render: (_: any, elm: IUsers) => (
        <div className="text-right">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];
  return tableColumns;
};

export default UserTable;
