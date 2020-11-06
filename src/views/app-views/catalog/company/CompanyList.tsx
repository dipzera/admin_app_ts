import React, { Component } from "react";
import { Card, Table, Tag, Tooltip, message, Button, Modal } from "antd";
import {
    EyeOutlined,
    DeleteOutlined,
    KeyOutlined,
    EditOutlined,
    UserAddOutlined,
    CheckOutlined,
    PlusOutlined,
    UserOutlined,
    FrownOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import moment from "moment";
import UserView from "./CompanyView";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import userData from "../../../../assets/data/user-list.data.json";
import "../hand_gesture.scss";
import {
    API_IS_APP_SERVICE,
    API_IS_AUTH_SERVICE,
} from "../../../../constants/ApiConstant";
import axios from "axios";
import { connect } from "react-redux";
import { signOut, sendActivationCode } from "../../../../redux/actions/Auth";
import { CompanyModalEdit } from "./CompanyModalEdit";
import { CompanyModalAdd } from "./CompanyModalAdd";
import { ColumnsType } from "antd/lib/table";
import {
    EXPIRE_TIME,
    REGISTRATION_SUCCESS,
} from "../../../../constants/Messages";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../configs/AppConfig";

interface CompanyStateProps {
    users: CompanyProps[];
    userProfileVisible: boolean;
    selectedUser: any;
    isHidden: string;
    editModalVisible: boolean;
    newUserModalVisible: boolean;
    registerUserModalVisible: boolean;
    loading: boolean;
}

export interface CompanyProps {
    BIC: string;
    Bank: string;
    Email: string;
    CommercialName: string;
    CountryID: number;
    ID: number;
    IBAN: string;
    IDNO: string;
    IsVATPayer: boolean;
    JuridicalAddress: string;
    JuridicalName: string;
    Logo: string;
    OfficeAddress: string;
    PostalCode: string;
    Status: number;
    VATCode: number;
    WebSite: string;
}

interface ReduxStoreProps {
    token: string;
    locale: string;
    CompanyID: number;
    signOut: () => any;
    sendActivationCode: (Token: any, UserID: any) => any;
}
export class CompanyList extends Component<ReduxStoreProps> {
    /* MAKE THIS FROM API CALL */
    state: CompanyStateProps = {
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
            .get(`${API_IS_APP_SERVICE}/GetCompanyList`, {
                params: {
                    Token: this.props.token,
                },
            })
            .then((res) => {
                this.setState({ loading: false });
                console.log(res.data);
                if (res.data.ErrorCode === 0) {
                    const filteredCompanies = res.data.CompanyList.filter(
                        (company) => company.ID !== this.props.CompanyID
                    );
                    this.setState({ users: [...filteredCompanies] });
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

    showUserProfile = (userInfo: CompanyProps) => {
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

    showEditModal = (userInfo: CompanyProps) => {
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

        const tableColumns: ColumnsType<CompanyProps> = [
            {
                title: "Company",
                dataIndex: "",
                render: (_, record: CompanyProps) => (
                    <div className="d-flex">
                        <AvatarStatus
                            src={record.Logo}
                            name={record.JuridicalName}
                            subTitle={record.Email}
                            icon={<UserOutlined />}
                        />
                    </div>
                ),
                sorter: {
                    compare: (a: any, b: any) => {
                        a = a.JuridicalName.toLowerCase();
                        b = b.JuridicalName.toLowerCase();
                        return a > b ? -1 : b > a ? 1 : 0;
                    },
                },
            },
            {
                title: "IDNO",
                dataIndex: "",
                render: (_, record) => (
                    <Tag className="text-capitalize">{record.IDNO}</Tag>
                ),
            },
            {
                title: "Address",
                dataIndex: "",
                render: (_, record) => (
                    <p className="text-capitalize">{record.JuridicalAddress}</p>
                ),
            },

            {
                title: "Status",
                dataIndex: "Status",
                render: (Status, record) => (
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
                        <Button
                            /* Turn off disabled when register company api comes */
                            type="primary"
                        >
                            <Link to={`${APP_PREFIX_PATH}/wizard`}>
                                Register company
                            </Link>
                        </Button>
                    </div>
                ),
                dataIndex: "actions",
                render: (_, elm: CompanyProps) => (
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
                    dataSource={users}
                    rowKey="ID"
                    style={{ position: "relative" }}
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
                <CompanyModalAdd
                    signOut={signOut}
                    CompanyID={this.props.CompanyID}
                    onCreate={this.showNewUserModal}
                    onCancel={this.closeNewUserModal}
                    visible={this.state.newUserModalVisible}
                    token={this.props.token}
                />
                <CompanyModalEdit
                    signOut={signOut}
                    locale={this.props.locale}
                    data={selectedUser}
                    visible={this.state.editModalVisible}
                    onCancel={() => {
                        this.closeEditModal();
                    }}
                    token={this.props.token}
                />
                {/* {this.state.users.length > 0 && !this.state.loading && (
                    <Tooltip title="Register company">
                        <PlusOutlined
                            onClick={this.showNewUserModal}
                            className="add_company"
                            style={{
                                position: "absolute",
                                bottom: "15px",
                                left: "15px",
                                cursor: "pointer",
                                fontSize: "36px",
                            }}
                        />
                    </Tooltip>
                )} */}
                {/* Continue coding here... */}
            </Card>
        );
    }
}

const mapStateToProps = ({ auth, theme, account }) => {
    const { token } = auth;
    const { CompanyID } = account;
    const { locale } = theme;
    return { token, locale, CompanyID };
};
const mapDispatchToProps = {
    signOut,
    sendActivationCode,
};
export default connect(mapStateToProps, mapDispatchToProps)(CompanyList);
