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
    PlayCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    PlusCircleOutlined,
    SearchOutlined,
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
import axios from "axios";
import { connect } from "react-redux";
import { signOut, refreshToken } from "../../../../redux/actions/Auth";
import { CompanyModalEdit } from "./CompanyModalEdit";
import { CompanyModalAdd } from "./CompanyModalAdd";
import { ColumnsType } from "antd/lib/table";
import {
    DONE,
    EMAIL_CONFIRM_MSG,
    EXPIRE_TIME,
    INTERNAL_ERROR,
    LOADING,
} from "../../../../constants/Messages";
import { Link } from "react-router-dom";
import {
    API_APP_URL,
    APP_PREFIX_PATH,
    CLIENT_URL,
} from "../../../../configs/AppConfig";
import utils from "../../../../utils";
import Flex from "../../../../components/shared-components/Flex";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";

enum status {
    active = 1,
    inactive = 0,
    deleted = 2,
}

interface CompanyStateProps {
    users: CompanyProps[];
    selectedRows: any;
    selectedKeys: any;
    companiesToSearch: any;
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

export interface ReduxStoreProps {
    token: string;
    locale: string;
    CompanyID: number;
    signOut: () => any;
    refreshToken: any;
}
export class CompanyList extends Component<ReduxStoreProps> {
    /* MAKE THIS FROM API CALL */
    state: CompanyStateProps = {
        users: [],
        selectedRows: [],
        selectedKeys: [],
        companiesToSearch: [],
        userProfileVisible: false,
        selectedUser: null,
        isHidden: "block",
        editModalVisible: false,
        newUserModalVisible: false,
        registerUserModalVisible: false,
        loading: false,
    };

    getCompanyList = () => {
        this.setState({ loading: true });
        axios
            .get(`${API_APP_URL}/GetCompanyList`, {
                params: {
                    Token: this.props.token,
                },
            })
            .then(({ data }) => {
                this.setState({ loading: false });
                if (data.ErrorCode === 0) {
                    const filteredCompanies = data.CompanyList.filter(
                        (company) => company.ID !== this.props.CompanyID
                    );
                    this.setState({ users: [...filteredCompanies] });
                    this.setState({
                        companiesToSearch: [...filteredCompanies],
                    });
                } else if (data.ErrorCode === 118) {
                    this.props.refreshToken(this.props.token);
                } else if (data.ErrorCode === -1) {
                    console.log(data.ErrorMessage);
                    throw new Error(INTERNAL_ERROR);
                }
            })
            .catch((error) => {
                const key = "updatable";
                this.setState({ loading: false });
                message.error({ content: error.toString(), key });
            });
    };

    componentDidMount() {
        this.getCompanyList();
    }

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
    rowSelection = {
        onChange: (key, rows) => {
            this.setState({ selectedKeys: key });
            this.setState({ selectedRows: rows });
        },
    };

    toggleStatusRow = async (row, statusNumber) => {
        Modal.confirm({
            title: `Are you sure you want to ${
                statusNumber === 0 ? "deactivate" : "activate"
            } ${row.length} ${row.length > 1 ? "companies" : "company"}?`,
            onOk: async () => {
                for (const elm of row) {
                    await this.handleUserStatus(elm.ID, statusNumber);
                }
                this.setState({ selectedRows: [], selectedKeys: [] });
                this.getCompanyList();
            },
        });
    };

    handleUserStatus = (userId: number, status: number) => {
        axios
            .get(`${API_APP_URL}/ChangeCompanyStatus`, {
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
            });
    };

    deleteRow = (row) => {
        const objKey = "ID";
        let data = this.state.users;
        Modal.confirm({
            title: `Are you sure you want to delete ${
                this.state.selectedRows.length
            } ${this.state.selectedRows.length > 1 ? "companies" : "company"}?`,
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

    getManagedToken = (CompanyID) => {
        return axios
            .get(`${API_APP_URL}/GetManagedToken`, {
                params: {
                    Token: this.props.token,
                    CompanyID,
                },
            })
            .then((res) => {
                if (res.data.ErrorCode === 0) {
                    return res.data.Token;
                } else if (res.data.ErrorCode === 118) {
                    this.props.refreshToken(this.props.token);
                }
            });
    };

    dropdownMenu = (row) => (
        <Menu>
            <Menu.Item
                onClick={async () => {
                    const token = await this.getManagedToken(row.ID);
                    window.open(`${CLIENT_URL}/auth/admin/${token}`, "_blank");
                }}
            >
                <Flex alignItems="center">
                    <PlayCircleOutlined />
                    <span className="ml-2">Manage</span>
                </Flex>
            </Menu.Item>
            {row.Status === 0 ? (
                <Menu.Item
                    onClick={async () => {
                        Modal.confirm({
                            title: `Are you sure you want to activate this company?`,
                            onOk: async () => {
                                await this.handleUserStatus(
                                    row.ID,
                                    status.active
                                );
                                this.getCompanyList();
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
                            title: `Are you sure you want to deactivate this company?`,
                            onOk: async () => {
                                await this.handleUserStatus(
                                    row.ID,
                                    status.inactive
                                );
                                this.getCompanyList();
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
            <Menu.Item
                onClick={async () => {
                    Modal.confirm({
                        title: `Are you sure you want to delete this company?`,
                        onOk: async () => {
                            await this.handleUserStatus(
                                row.ID,
                                status.inactive
                            );
                            this.getCompanyList();
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
    onSearch = (e) => {
        const value = e.currentTarget.value;
        const searchArray = value
            ? this.state.users
            : this.state.companiesToSearch;
        const data = utils.wildCardSearch(searchArray, value);
        this.setState({ users: data });
    };

    render() {
        const { users, userProfileVisible, selectedUser } = this.state;

        const tableColumns: ColumnsType<CompanyProps> = [
            // {
            //     title: "ID",
            //     dataIndex: "ID",
            //     sorter: {
            //         compare: (a, b) => a.ID - b.ID,
            //     },
            //     defaultSortOrder: "ascend",
            // },
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
                            : "Inactive"}
                    </Tag>
                ),
                sorter: {
                    compare: (a, b) => a.Status - b.Status,
                },
            },
            {
                dataIndex: "actions",
                render: (_, elm) => (
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
                            onChange={(e) => this.onSearch(e)}
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
                            {/*                             <Link to={`${APP_PREFIX_PATH}/wizard`}> */}
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                block
                                onClick={() => this.showNewUserModal()}
                            >
                                Register company
                            </Button>
                            {/*                             </Link> */}
                        </Flex>
                    </div>
                </Flex>
                <div className="table-responsive">
                    <Table
                        loading={this.state.loading}
                        columns={tableColumns}
                        dataSource={users}
                        rowKey="ID"
                        style={{ position: "relative" }}
                        rowSelection={{
                            selectedRowKeys: this.state.selectedKeys,
                            type: "checkbox",
                            preserveSelectedRowKeys: false,
                            ...this.rowSelection,
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
                <CompanyModalAdd
                    signOut={signOut}
                    CompanyID={this.props.CompanyID}
                    onCreate={this.showNewUserModal}
                    onCancel={this.closeNewUserModal}
                    visible={this.state.newUserModalVisible}
                    token={this.props.token}
                    getCompanyList={this.getCompanyList}
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
    refreshToken,
};
export default connect(mapStateToProps, mapDispatchToProps)(CompanyList);
