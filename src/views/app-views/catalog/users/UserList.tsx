import React, { Component } from "react";
import {
    Card,
    Table,
    Tag,
    Tooltip,
    message,
    Button,
    Modal,
    Input,
    Menu,
} from "antd";
import {
    EyeOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    KeyOutlined,
    UserAddOutlined,
    CheckOutlined,
    PlusOutlined,
    UserOutlined,
    FrownOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import moment from "moment";
import UserView from "./UserView";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import userData from "../../../../assets/data/user-list.data.json";
import "../hand_gesture.scss";
import axios from "axios";
import { connect } from "react-redux";
import { refreshToken, signOut } from "../../../../redux/actions/Auth";
import { UserModalEdit } from "./UserModalEdit";
import { UserModalAdd } from "./UserModalAdd";
import { ColumnsType } from "antd/lib/table";
import HttpClient from "../../../../api";
import Utils from "../../../../utils";
import {
    ACTIVATION_MSG_CONTENT,
    ACTIVATION_MSG_TITLE,
    DONE,
    EMAIL_CONFIRM_MSG,
    EXPIRE_TIME,
    LOADING,
} from "../../../../constants/Messages";
import Flex from "../../../../components/shared-components/Flex";
import utils from "../../../../utils";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import { SortOrder } from "antd/es/table/interface";
import { ApiResponse, IUsers } from "../../../../types";
import { API_APP_URL } from "../../../../configs/AppConfig";

enum status {
    inactive = 0,
    active = 1,
    deleted = 2,
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
}
interface ReduxStoreProps {
    token: string;
    locale: string;
    ID: number;
    CompanyID: number;
    signOut: any;
    refreshToken: any;
    loading: boolean;
}

export class UserList extends Component<ReduxStoreProps> {
    /* MAKE THIS FROM API CALL */
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
        loading: false,
        usersChanged: false,
    };

    getUsersInfo = () => {
        this.setState({ loading: true });
        return axios
            .get(`${API_APP_URL}/GetAllUsersInfo`, {
                params: {
                    Token: this.props.token,
                },
            })
            .then(({ data }) => {
                console.log(data);
                this.setState({ loading: false });
                if (data.ErrorCode === 0) {
                    const filteredUsers = data.Users.filter(
                        (user) => user.ID !== this.props.ID
                    );
                    this.setState({ usersToSearch: [...filteredUsers] });
                    this.setState({ users: [...filteredUsers] });
                } else if (data.ErrorCOde === 118) {
                    this.props.refreshToken(this.props.token);
                } else {
                    throw new Error(data.ErrorMessage);
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                const key = "updatable";
                message.error({ content: error.toString(), key });
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

    toggleStatusRow = async (row, statusNumber) => {
        Modal.confirm({
            title: `Are you sure you want to ${
                statusNumber === 0 ? "deactivate" : "activate"
            } ${row.length} ${row.length > 1 ? "users" : "user"}?`,
            onOk: async () => {
                for (const elm of row) {
                    await this.handleUserStatus(elm.ID, statusNumber);
                }
                this.setState({ selectedRows: [], selectedKeys: [] });
                await this.getUsersInfo();
            },
        });
    };

    deleteRow = (row) => {
        const objKey = "ID";
        let data = this.state.users;
        Modal.confirm({
            title: `Are you sure you want to delete ${
                this.state.selectedRows.length
            } ${this.state.selectedRows.length > 1 ? "users" : "user"}?`,
            onOk: () => {
                if (this.state.selectedRows.length > 1) {
                    this.state.selectedRows.forEach((elm) => {
                        this.handleUserStatus(elm.ID, status.deleted);
                        data = utils.deleteArrayRow(data, objKey, elm.ID);
                        this.setState({ users: data });
                        this.setState({ selectedRows: [] });
                    });
                } else {
                    for (const elm of row) {
                        data = utils.deleteArrayRow(data, objKey, elm.ID);
                        this.setState({ selectedRows: [], selectedKeys: [] });
                        this.setState({ users: data });
                        this.handleUserStatus(elm.ID, status.deleted);
                    }
                }
            },
        });
    };
    handleUserStatus = (userId: number, status: number) => {
        axios
            .get(`${API_APP_URL}/ChangeUserStatus`, {
                params: {
                    Token: this.props.token,
                    ID: userId,
                    Status: status,
                },
            })
            .then((res) => {
                console.log(res.data);
                if (res.data.ErrorCode === 0) {
                    // this.getUsersInfo();
                } else if (res.data.ErrorCode === 118) {
                    this.props.refreshToken(this.props.token);
                }
            })
            .catch((error) => {
                const key = "updatable";
                message.error({ content: error.toString(), key });
            });
    };

    dropdownMenu = (row) => (
        <Menu>
            <Menu.Item onClick={() => this.showUserProfile(row)}>
                <Flex alignItems="center">
                    <EyeOutlined />
                    <span className="ml-2">View Details</span>
                </Flex>
            </Menu.Item>
            <Menu.Item onClick={() => this.showEditModal(row)}>
                <Flex alignItems="center">
                    <EditOutlined />
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item>
            {row.Status === 0 ? (
                <Menu.Item
                    onClick={async () => {
                        Modal.confirm({
                            title: `Are you sure you want to activate this user?`,
                            onOk: async () => {
                                await this.handleUserStatus(
                                    row.ID,
                                    status.active
                                );
                                await this.getUsersInfo();
                            },
                        });
                    }}
                >
                    <Flex alignItems="center">
                        <CheckCircleOutlined />
                        <span className="ml-2">Activate</span>
                    </Flex>
                </Menu.Item>
            ) : (
                <Menu.Item
                    onClick={async () => {
                        Modal.confirm({
                            title: `Are you sure you want to deactivate this user?`,
                            onOk: async () => {
                                await this.handleUserStatus(
                                    row.ID,
                                    status.inactive
                                );
                                await this.getUsersInfo();
                            },
                        });
                    }}
                >
                    <Flex alignItems="center">
                        <CloseCircleOutlined />
                        <span className="ml-2">Deactivate</span>
                    </Flex>
                </Menu.Item>
            )}
            <Menu.Item
                onClick={async () => {
                    Modal.confirm({
                        title: `Are you sure you want to delete this user?`,
                        onOk: async () => {
                            await this.handleUserStatus(row.ID, status.deleted);
                            await this.getUsersInfo();
                        },
                    });
                }}
            >
                <Flex alignItems="center">
                    <DeleteOutlined />
                    <span className="ml-2">Delete</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

    render() {
        const {
            users,
            usersToSearch,
            userProfileVisible,
            selectedUser,
        } = this.state;
        const { token } = this.props;

        const onSearch = (e) => {
            const value = e.currentTarget.value;
            const searchArray = value ? users : usersToSearch;
            const data = utils.wildCardSearch(searchArray, value);
            this.setState({ users: data });
        };

        const tableColumns: ColumnsType<UsersProps> = [
            // {
            //     title: "ID",
            //     dataIndex: "ID",
            //     sorter: { compare: (a, b) => a.ID - b.ID },
            //     defaultSortOrder: "ascend" as SortOrder,
            // },
            {
                title: "User",
                dataIndex: "name",
                render: (_, record: UsersProps) => (
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
                title: "Company",
                dataIndex: "Company",
                render: (Company) => <span>{Company}</span>,
            },
            {
                title: "Role",
                render: () => "User",
            },
            {
                title: "Last online",
                dataIndex: "LastAuthorize",
                render: (LastAuthorize) => (
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
                title: "Last Authorize IP",
                dataIndex: "LastAuthorizeIP",
                render: (LastAuthorizeIP) => <span>{LastAuthorizeIP}</span>,
            },
            {
                title: "Status",
                dataIndex: "Status",
                render: (Status) => (
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
                        {Status === 1
                            ? "Active"
                            : Status === 2
                            ? "Disabled"
                            : "Inactive"}
                    </Tag>
                ),
                sorter: {
                    compare: (a, b) => a.Status - b.Status,
                },
            },
            {
                dataIndex: "actions",
                render: (_, elm: UsersProps) => (
                    <div className="text-right">
                        <EllipsisDropdown menu={this.dropdownMenu(elm)} />
                    </div>
                ),
            },
        ];
        return (
            <Card>
                <Flex
                    className="mb-1"
                    mobileFlex={false}
                    justifyContent="between"
                >
                    <div className="mr-md-3 mb-3">
                        <Input
                            placeholder="Search"
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
                                            ? `Activate (${this.state.selectedRows.length})`
                                            : "Activate"}
                                    </Button>
                                    <Button
                                        type="ghost"
                                        className="mr-3"
                                        onClick={() =>
                                            this.toggleStatusRow(
                                                this.state.selectedRows,
                                                status.inactive
                                            )
                                        }
                                    >
                                        {this.state.selectedRows.length > 1
                                            ? `Deactivate (${this.state.selectedRows.length})`
                                            : "Deactivate"}
                                    </Button>
                                    <Tooltip
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
                                    </Tooltip>
                                </>
                            )}
                            <Button
                                onClick={this.showNewUserModal}
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                block
                            >
                                Invite user
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
                    signOut={signOut}
                    onCreate={this.showNewUserModal}
                    onCancel={this.closeNewUserModal}
                    visible={this.state.newUserModalVisible}
                    token={this.props.token}
                    getUsersInfo={this.getUsersInfo}
                />
                <UserModalEdit
                    signOut={signOut}
                    getUsersInfo={this.getUsersInfo}
                    locale={this.props.locale}
                    data={selectedUser}
                    visible={this.state.editModalVisible}
                    onCancel={() => {
                        this.closeEditModal();
                    }}
                    token={this.props.token}
                />
                {/* Choose between Cascadia Code and MonoLisa fonts for VSCode */}
            </Card>
        );
    }
}

const mapDispatchToProps = {
    signOut,
    refreshToken,
};

const mapStateToProps = ({ auth, theme, account }) => {
    const { token, loading } = auth;
    const { CompanyID, ID } = account;
    const { locale } = theme;
    return { token, ID, locale, CompanyID, loading };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
