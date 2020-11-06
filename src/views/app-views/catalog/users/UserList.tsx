import React, { Component } from "react";
import { Card, Table, Tag, Tooltip, message, Button, Modal } from "antd";
import {
    EyeOutlined,
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
import { signOut } from "../../../../redux/actions/Auth";
import { UserModalEdit } from "./UserModalEdit";
import { UserModalAdd } from "./UserModalAdd";
import { ColumnsType } from "antd/lib/table";
import { useApiRequest } from "../../../../api";
import Utils from "../../../../utils";
import {
    EXPIRE_TIME,
    REGISTRATION_SUCCESS,
} from "../../../../constants/Messages";

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
    /* From state */
    loading: boolean;
}

export class UserList extends Component<ReduxStoreProps> {
    /* MAKE THIS FROM API CALL */
    state: UserListStateProps = {
        users: [],
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
                    this.setState({ users: [...filteredUsers] });
                } else {
                    message
                        .loading(EXPIRE_TIME, 1.5)
                        .then(() => this.props.signOut());
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
        Modal.confirm({
            title: "User registration confirmation",
            content: "Press OK if you want us to send a new activation message",
            onOk() {
                axios
                    .get(`${API_IS_AUTH_SERVICE}/SendActivationCode`, {
                        params: {
                            Token,
                            UserID,
                        },
                    })
                    .then((res) => {
                        message.success(REGISTRATION_SUCCESS, 1.5);
                        console.log(res.data);
                    });
            },
            onCancel() {},
        });
    };

    render() {
        const { users, userProfileVisible, selectedUser } = this.state;
        const { token } = this.props;

        const tableColumns: ColumnsType<UsersProps> = [
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
                title: () => (
                    <div className="text-right">
                        <Button onClick={this.showNewUserModal} type="primary">
                            Register user
                        </Button>
                    </div>
                ),
                dataIndex: "actions",
                render: (_, elm: UsersProps) => (
                    <div className="text-right">
                        {elm.Status === 0 && (
                            <Tooltip title="Activate">
                                <Button
                                    icon={<KeyOutlined />}
                                    className="mr-2"
                                    size="small"
                                    onClick={() =>
                                        this.showConfirmRegistrationModal(
                                            elm.ID
                                        )
                                    }
                                />
                            </Tooltip>
                        )}
                        <Tooltip title="Edit">
                            <Button
                                type="dashed"
                                icon={<EditOutlined />}
                                className="mr-2"
                                size="small"
                                onClick={() => this.showEditModal(elm)}
                            />
                        </Tooltip>
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
                        {/* <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.deleteUser(elm.id);
                }}
                size="small"
              />
            </Tooltip> */}
                    </div>
                ),
            },
        ];
        return (
            <Card bodyStyle={{ padding: "0px", position: "relative" }}>
                <Table
                    loading={this.state.loading}
                    columns={tableColumns}
                    dataSource={this.state.users}
                    rowKey="ID"
                    style={{ position: "relative" }}
                    /* TODO: Copy locale above into Client Portal App as well */
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
};

const mapStateToProps = ({ auth, theme, account }) => {
    const { token, loading } = auth;
    const { CompanyID, ID } = account;
    const { locale } = theme;
    return { token, ID, locale, CompanyID, loading };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
