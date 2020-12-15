import React, { Component } from "react";
import { Card, Table, Tag, Tooltip, Button, Modal, Input, Menu } from "antd";
import {
    EyeOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    UserOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import moment from "moment";
import UserView from "./UserView";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import "../hand_gesture.scss";
import { connect } from "react-redux";
import {
    refreshToken,
    signOut,
    sendActivationCode,
} from "../../../../redux/actions/Auth";
import { UserModalEdit } from "./UserModalEdit";
import { UserModalAdd } from "./UserModalAdd";
import { ColumnsType } from "antd/lib/table";
import { AdminApi } from "../../../../api";
import Flex from "../../../../components/shared-components/Flex";
import utils from "../../../../utils";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import "./table.scss";
import { IState } from "../../../../redux/reducers";
import { IAuth } from "../../../../redux/reducers/Auth";
import { IAccount } from "../../../../redux/reducers/Account";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import Localization from "../../../../utils/Localization";
import WithStringTranslate from "../../../../utils/translate";
import { ApiResponse } from "../../../../api";
import { AxiosResponse } from "axios";

enum status {
    inactive = 0,
    active = 1,
    disabled = 2,
}
export interface UsersProps {
    CompanyID: number;
    Email: string;
    FirstName: string;
    LastName: string;
    ID: number;
    LastAuthorize: string;
    LastAuthorizeIP: string;
    PhoneNumber: string;
    Photo: string;
    Status: number;
    UiLanguage: number;
}

interface UserListStateProps {
    users: UsersProps[];
    selectedRows: any;
    selectedKeys: any;
    usersToSearch: any;
    userProfileVisible: boolean;
    selectedUser: any;
    isHidden: string;
    editModalVisible: boolean;
    newUserModalVisible: boolean;
    registerUserModalVisible: boolean;
    loading: boolean;
    usersChanged: boolean;
    status: number | null;
}

interface StoreProps {
    sendActivationCode?: any;
    CompanyID?: number;
    ID?: number;
    loading?: boolean;
}
export class UserList extends Component<StoreProps> {
    state: UserListStateProps = {
        users: [],
        selectedRows: [],
        selectedKeys: [],
        usersToSearch: [],
        userProfileVisible: false,
        selectedUser: null,
        isHidden: "block",
        editModalVisible: false,
        newUserModalVisible: false,
        registerUserModalVisible: false,
        loading: true,
        usersChanged: false,
        status: null,
    };

    getUsersInfo = () => {
        return new AdminApi().GetAllUsers().then((data: any) => {
            this.setState({ loading: false });
            if (data) {
                const { ErrorCode } = data;
                if (ErrorCode === 0) {
                    const filteredUsers = data.Users.filter(
                        (user: any) => user.ID !== this.props.ID
                    );
                    const evaluatedArray = utils.sortData(
                        filteredUsers,
                        "ID"
                    ); /* Add .reverse() here if you want a reverse sort */
                    this.setState((prev) => ({
                        ...prev,
                        usersToSearch: [...evaluatedArray],
                    }));
                    this.setState((prev) => ({
                        ...prev,
                        users: [...evaluatedArray],
                    }));
                }
            }
        });
    };

    componentDidMount() {
        this.getUsersInfo();
    }
    showUserProfile = (userInfo: UsersProps) => {
        this.setState({
            userProfileVisible: true,
            selectedUser: userInfo,
        });
    };
    closeUserViewProfile = () => {
        this.setState({
            userProfileVisible: false,
            selectedUser: null,
        });
    };

    showEditModal = (userInfo: UsersProps) => {
        this.setState({
            editModalVisible: true,
            selectedUser: userInfo,
        });
    };
    closeEditModal = () => {
        this.setState({
            editModalVisible: false,
            selectedUser: null,
        });
    };

    showNewUserModal = () => {
        this.setState({
            newUserModalVisible: true,
        });
    };

    closeNewUserModal = () => {
        this.setState({
            newUserModalVisible: false,
        });
    };

    toggleStatusRow = async (row: any, statusNumber: any) => {
        Modal.confirm({
            title:
                statusNumber === 0 || statusNumber === 2
                    ? `${WithStringTranslate("user.disable.title2")} ${
                          row.length
                      } ${
                          row.length > 1
                              ? WithStringTranslate("user.plural")
                              : WithStringTranslate("user.singular")
                      }?`
                    : `${WithStringTranslate("user.activate.title2")} ${
                          row.length
                      } ${
                          row.length > 1
                              ? WithStringTranslate("user.plural")
                              : WithStringTranslate("user.singular")
                      }?`,
            onOk: async () => {
                console.log(this.state.users);
                console.log(row);
                await Promise.all(
                    row.map(async (elm: any) => {
                        await this.handleUserStatus(elm.ID, statusNumber);
                    })
                );
                this.getUsersInfo();

                this.setState({ selectedRows: [], selectedKeys: [] });
            },
        });
    };
    handleUserStatus = (userId: number, status: number) => {
        return new AdminApi().ChangeUserStatus(userId, status);
    };

    dropdownMenu = (row: any) => (
        <Menu>
            {row.Status === 0 && (
                <Menu.Item
                    onClick={() =>
                        Modal.confirm({
                            title:
                                WithStringTranslate(
                                    "user.sendCodeModal.title"
                                ) +
                                " " +
                                row.FirstName +
                                "?",
                            onOk: () => {
                                this.props.sendActivationCode(row.ID);
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
            <Menu.Item onClick={() => this.showUserProfile(row)}>
                <Flex alignItems="center">
                    <EyeOutlined />
                    <span className="ml-2">
                        <IntlMessage id="dropdown.ViewDetails" />
                    </span>
                </Flex>
            </Menu.Item>
            <Menu.Item onClick={() => this.showEditModal(row)}>
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
                                await this.handleUserStatus(
                                    row.ID,
                                    status.active
                                ).then((data: any) => {
                                    this.getUsersInfo();
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
                                await this.handleUserStatus(
                                    row.ID,
                                    status.disabled
                                );
                                this.getUsersInfo();
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

    render() {
        const {
            users,
            usersToSearch,
            userProfileVisible,
            selectedUser,
        } = this.state;

        const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.currentTarget.value;
            const searchArray = value ? users : usersToSearch;
            const data = utils.wildCardSearch(searchArray, value);
            this.setState({ users: data });
        };

        let tableColumns: any = [
            {
                title: <IntlMessage id="user.Title" />,
                dataIndex: "FirstName",
                render: (_: any, record: UsersProps) => (
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
                render: (LastAuthorize: any) => (
                    <span>
                        {LastAuthorize
                            ? moment
                                  .unix(LastAuthorize.slice(6, 16))
                                  .format("DD/MM/YYYY")
                            : " "}{" "}
                    </span>
                ),
            },
            {
                title: <IntlMessage id="user.LastAuthorizeIP" />,
                dataIndex: "LastAuthorizeIP",
                render: (LastAuthorizeIP: string) => (
                    <span>{LastAuthorizeIP}</span>
                ),
            },
            {
                title: <IntlMessage id="user.Status" />,
                dataIndex: "Status",
                render: (Status: number) => (
                    <Tag
                        className="text-capitalize"
                        color={
                            Status === 1
                                ? "cyan"
                                : Status === 2
                                ? "volcano"
                                : "orange"
                        }
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
                    compare: (a: any, b: any) => a.Status - b.Status,
                },
            },
            {
                dataIndex: "actions",
                render: (_: any, elm: UsersProps) => (
                    <div className="text-right">
                        <EllipsisDropdown menu={this.dropdownMenu(elm)} />
                    </div>
                ),
            },
        ].sort((a: any, b: any) => {
            if (a.ID < b.ID) return -1;
            if (a.ID > b.ID) return 1;
            return 0;
        });
        return (
            <Card>
                <Flex
                    className="mb-1"
                    mobileFlex={false}
                    justifyContent="between"
                >
                    <div className="mr-md-3 mb-3">
                        <Input
                            placeholder={WithStringTranslate("app.Search")}
                            prefix={<SearchOutlined />}
                            onChange={(e) => onSearch(e)}
                        />
                    </div>
                    <div>
                        <Flex>
                            {this.state.selectedRows.length > 0 && (
                                <>
                                    <Button
                                        type="primary"
                                        className="mr-3"
                                        onClick={() =>
                                            this.toggleStatusRow(
                                                this.state.selectedRows,
                                                status.active
                                            )
                                        }
                                    >
                                        {this.state.selectedRows.length > 1
                                            ? `${WithStringTranslate(
                                                  "user.activate"
                                              )} (${
                                                  this.state.selectedRows.length
                                              })`
                                            : `${WithStringTranslate(
                                                  "user.activate"
                                              )}`}
                                    </Button>
                                    <Button
                                        type="ghost"
                                        className="mr-3"
                                        onClick={() =>
                                            this.toggleStatusRow(
                                                this.state.selectedRows,
                                                status.disabled
                                            )
                                        }
                                    >
                                        {this.state.selectedRows.length > 1
                                            ? `${WithStringTranslate(
                                                  "user.disable"
                                              )} (${
                                                  this.state.selectedRows.length
                                              })`
                                            : `${WithStringTranslate(
                                                  "user.disable"
                                              )}`}
                                    </Button>
                                    {/* <Tooltip
                                        title={`${
                                            this.state.selectedRows.length > 1
                                                ? `Delete (${this.state.selectedRows.length})`
                                                : "Delete"
                                        }`}
                                    >
                                        <Button
                                            className="mr-3"
                                            danger
                                            onClick={() =>
                                                this.deleteRow(
                                                    this.state.selectedRows
                                                )
                                            }
                                        >
                                            <DeleteOutlined />
                                        </Button>
                                    </Tooltip> */}
                                </>
                            )}
                            <Button
                                onClick={this.showNewUserModal}
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                block
                            >
                                {" "}
                                <IntlMessage id="user.Invite" />
                            </Button>
                        </Flex>
                    </div>
                </Flex>
                <div className="table-responsive">
                    <Table
                        loading={this.state.loading}
                        columns={tableColumns}
                        dataSource={this.state.users}
                        rowKey="ID"
                        style={{ position: "relative" }}
                        rowSelection={{
                            onChange: (key, rows) => {
                                this.setState({ selectedKeys: key });
                                this.setState({ selectedRows: rows });
                            },
                            selectedRowKeys: this.state.selectedKeys,
                            type: "checkbox",
                            preserveSelectedRowKeys: false,
                        }}
                    />
                </div>
                <UserView
                    data={selectedUser}
                    visible={userProfileVisible}
                    close={() => {
                        this.closeUserViewProfile();
                    }}
                />
                <UserModalAdd
                    onCancel={this.closeNewUserModal}
                    visible={this.state.newUserModalVisible}
                    getUsersInfo={this.getUsersInfo}
                />
                <UserModalEdit
                    signOut={signOut}
                    getUsersInfo={this.getUsersInfo}
                    data={selectedUser}
                    visible={this.state.editModalVisible}
                    onCancel={() => {
                        this.closeEditModal();
                    }}
                />
                {/* Choose between Cascadia Code and MonoLisa fonts for VSCode */}
            </Card>
        );
    }
}

const mapStateToProps = ({ auth, account }: IState) => {
    const { loading } = auth as IAuth;
    const { CompanyID, ID } = account as IAccount;
    return { ID, CompanyID, loading };
};

export default connect(mapStateToProps, { sendActivationCode })(UserList);
