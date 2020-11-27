import React, { Component } from "react";
import { Card, Table, Tag, Button, Modal, Input, Menu } from "antd";
import {
    EyeOutlined,
    PlayCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    PlusCircleOutlined,
    SearchOutlined,
    EditOutlined,
    UserOutlined,
} from "@ant-design/icons";
import UserView from "./CompanyView";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import "../hand_gesture.scss";
import { connect } from "react-redux";
import { signOut, refreshToken } from "../../../../redux/actions/Auth";
import { CompanyModalEdit } from "./CompanyModalEdit";
import { CompanyModalAdd } from "./CompanyModalAdd";
import { ColumnsType } from "antd/lib/table";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH, CLIENT_URL } from "../../../../configs/AppConfig";
import utils from "../../../../utils";
import Flex from "../../../../components/shared-components/Flex";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import { AdminApi, AuthApi } from "../../../../api";

enum status {
    active = 1,
    disabled = 2,
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

    sortData = (arr) => {
        return arr.slice().sort((a: any, b: any) => a.ID - b.ID);
    };
    getCompanyList = () => {
        try {
            return new AdminApi().GetCompanyList().then((data: any) => {
                if (data) {
                    if (data.ErrorCode === 0) {
                        const filteredCompanies = data.CompanyList.filter(
                            (company) => company.ID !== this.props.CompanyID
                        );
                        const evaluatedArray = this.sortData(filteredCompanies);
                        this.setState({ users: [...evaluatedArray] });
                        this.setState({
                            companiesToSearch: [...evaluatedArray],
                        });
                    }
                }
            });
        } catch {}
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
                statusNumber === 0 ? "disable" : "activate"
            } ${row.length} ${row.length > 1 ? "companies" : "company"}?`,
            onOk: async () => {
                await Promise.all(
                    row.map(async (elm) => {
                        await this.handleUserStatus(elm.ID, statusNumber);
                    })
                );
                this.getCompanyList();
                this.setState({ selectedRows: [], selectedKeys: [] });
            },
        });
    };

    handleUserStatus = (userId: number, status: number) => {
        return new AdminApi().ChangeCompanyStatus(userId, status);
    };

    // deleteRow = (row) => {
    //     const objKey = "ID";
    //     debugger;
    //     let data = this.state.users;
    //     Modal.confirm({
    //         title: `Are you sure you want to delete ${
    //             this.state.selectedRows.length
    //         } ${this.state.selectedRows.length > 1 ? "companies" : "company"}?`,
    //         onOk: () => {
    //             if (this.state.selectedRows.length > 1) {
    //                 this.state.selectedRows.forEach((elm) => {
    //                     this.handleUserStatus(elm.ID, status.disabled);
    //                     data = utils.deleteArrayRow(data, objKey, elm.ID);
    //                     this.setState({ users: data });
    //                     this.setState({ selectedRows: [] });
    //                 });
    //             } else {
    //                 for (const elm of row) {
    //                     data = utils.deleteArrayRow(data, objKey, elm.ID);
    //                     this.setState({ selectedRows: [], selectedKeys: [] });
    //                     this.setState({ users: data });
    //                     this.handleUserStatus(elm.ID, status.disabled);
    //                 }
    //             }
    //         },
    //     });
    // };

    getManagedToken = (CompanyID) => {
        return new AuthApi().GetManagedToken(CompanyID).then((data: any) => {
            if (data.ErrorCode === 0) return data.Token;
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
            {row.Status === 0 || row.Status === 2 ? (
                <Menu.Item
                    onClick={async () => {
                        Modal.confirm({
                            title: `Are you sure you want to activate this company?`,
                            onOk: async () => {
                                await this.handleUserStatus(
                                    row.ID,
                                    status.active
                                ).then(() => {
                                    this.getCompanyList();
                                });
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
                            title: `Are you sure you want to disable this company?`,
                            onOk: async () => {
                                await this.handleUserStatus(
                                    row.ID,
                                    status.disabled
                                ).then(() => {
                                    this.getCompanyList();
                                });
                            },
                        });
                    }}
                >
                    <Flex alignItems="center">
                        <CloseCircleOutlined />
                        <span className="ml-2">Disable</span>
                    </Flex>
                </Menu.Item>
            )}
            {/* <Menu.Item
                onClick={async () => {
                    Modal.confirm({
                        title: `Are you sure you want to delete this company?`,
                        onOk: async () => {
                            await this.handleUserStatus(row.ID, status.deleted);
                            this.getCompanyList();
                        },
                    });
                }}
            >
                <Flex alignItems="center">
                    <DeleteOutlined />
                    <span className="ml-2">Delete</span>
                </Flex>
            </Menu.Item> */}
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
                                                status.disabled
                                            )
                                        }
                                    >
                                        {this.state.selectedRows.length > 1
                                            ? `Disable (${this.state.selectedRows.length})`
                                            : "Disable"}
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
                            <Link to={`${APP_PREFIX_PATH}/wizard`}>
                                <Button
                                    type="primary"
                                    icon={<PlusCircleOutlined />}
                                    block
                                    // onClick={() => this.showNewUserModal()}
                                >
                                    Register company
                                </Button>
                            </Link>
                        </Flex>
                    </div>
                </Flex>
                <div className="table-responsive">
                    <Table
                        loading={this.state.loading}
                        columns={tableColumns}
                        /* TODO: FILTER THIS BY ID BEFORE MOUNTING */
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
                    onCancel={this.closeNewUserModal}
                    visible={this.state.newUserModalVisible}
                    getCompanyList={this.getCompanyList}
                />
                <CompanyModalEdit
                    getCompanyList={this.getCompanyList}
                    data={selectedUser}
                    visible={this.state.editModalVisible}
                    onCancel={() => {
                        this.closeEditModal();
                    }}
                />
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
