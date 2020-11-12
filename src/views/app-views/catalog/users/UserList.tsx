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
import {
    API_IS_APP_SERVICE,
    API_IS_AUTH_SERVICE,
} from "../../../../constants/ApiConstant";
import axios from "axios";
import { connect } from "react-redux";
import { refreshToken, signOut } from "../../../../redux/actions/Auth";
import { UserModalEdit } from "./UserModalEdit";
import { UserModalAdd } from "./UserModalAdd";
import { ColumnsType } from "antd/lib/table";
import { useApiRequest } from "../../../../api";
import Utils from "../../../../utils";
import {
    ACTIVATION_MSG_CONTENT,
    ACTIVATION_MSG_TITLE,
    EMAIL_CONFIRM_MSG,
    EXPIRE_TIME,
} from "../../../../constants/Messages";
import Flex from "../../../../components/shared-components/Flex";
import utils from "../../../../utils";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";

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
    };

    componentDidMount() {
        this.setState({ loading: true });
        axios
            .get(`${API_IS_APP_SERVICE}/GetUsersInfo`, {
                params: {
                    Token: this.props.token,
                },
            })
            .then((res) => {
                this.setState({ loading: false });
                console.log(res.data);
                if (res.data.ErrorCode === 0) {
                    const filteredUsers = res.data.Users.filter(
                        (user) => user.ID !== this.props.ID
                    );
                    this.setState({ usersToSearch: [...filteredUsers] });
                    this.setState({ users: [...filteredUsers] });
                } else {
                    this.props.refreshToken(this.props.token);
                }
            });
    }

    deleteUser = (userId) => {
        this.setState({
            users: this.state.users.filter((item) => item["id"] !== userId),
        });
        message.success({ content: `Deleted user ${userId}`, duration: 2 });
    };

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

    showConfirmRegistrationModal = (UserID: number) => {
        const Token = this.props.token;
        const refreshToken = this.props.refreshToken;
        Modal.confirm({
            title: ACTIVATION_MSG_TITLE,
            content: ACTIVATION_MSG_CONTENT,
            onOk() {
                axios
                    .get(`${API_IS_AUTH_SERVICE}/SendActivationCode`, {
                        params: {
                            Token,
                            UserID,
                        },
                    })
                    .then((res) => {
                        console.log(res.data);
                        if (res.data.ErrorCode === 0) {
                            message.success(EMAIL_CONFIRM_MSG, 1.5);
                        } else if (res.data.ErrorCode === 118) {
                            refreshToken(Token);
                        }
                    });
            },
            onCancel() {},
        });
    };

    rowSelection = {
        onChange: (key, rows) => {
            this.setState({ selectedKeys: key });
            this.setState({ selectedRows: rows });
        },
    };

    deleteRow = (row) => {
        const objKey = "ID";
        let data = this.state.users;
        if (this.state.selectedRows.length > 1) {
            this.state.selectedRows.forEach((elm) => {
                /* Make API CALL TO DELETE USER */
                data = utils.deleteArrayRow(data, objKey, elm.ID);
                this.setState({ users: data });
                this.setState({ selectedRows: [] });
            });
        } else {
            data = utils.deleteArrayRow(data, objKey, row.ID);
            /* Make API CALL TO DELETE USER */
            this.setState({ users: data });
        }
    };

    dropdownMenu = (row) => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center">
                    <EyeOutlined />
                    <span className="ml-2">View Details</span>
                </Flex>
            </Menu.Item>
            <Menu.Item onClick={() => this.deleteRow(row)}>
                <Flex alignItems="center">
                    <DeleteOutlined />
                    <span className="ml-2">
                        {this.state.selectedRows.length > 0
                            ? `Delete (${this.state.selectedRows.length})`
                            : "Delete"}
                    </span>
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
            { title: "ID", dataIndex: "ID" },
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
                sorter: {
                    compare: (a: any, b: any) => {
                        a = a.FirstName.toLowerCase();
                        b = b.FirstName.toLowerCase();
                        return a > b ? -1 : b > a ? 1 : 0;
                    },
                },
            },
            {
                title: "Role",
                render: () => "User",
                /*         dataIndex: "role",
        sorter: {
          compare: (a, b) => a.role.length - b.role.length,
        }, */
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
                title: "Status",
                dataIndex: "Status",
                render: (Status) => (
                    <Tag
                        className="text-capitalize"
                        color={
                            Status === 1
                                ? "cyan"
                                : Status === 2
                                ? "red"
                                : "orange"
                        }
                    >
                        {Status === 1
                            ? "Active"
                            : Status === 2
                            ? "Disabled"
                            : "Not Activated"}
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
                        <Button
                            onClick={this.showNewUserModal}
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            block
                        >
                            Invite user
                        </Button>
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
                            selectedRowKeys: this.state.selectedKeys,
                            type: "checkbox",
                            preserveSelectedRowKeys: false,
                            ...this.rowSelection,
                        }}
                        locale={{
                            emptyText: !this["state"].loading && (
                                <PlusOutlined
                                    onClick={this.showNewUserModal}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "36px",
                                    }}
                                />
                            ),
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
                />
                <UserModalEdit
                    signOut={signOut}
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
