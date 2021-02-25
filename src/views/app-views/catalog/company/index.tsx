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
import { connect } from "react-redux";
import CompanyModalEdit from "./CompanyModalEdit";
import { ColumnsType } from "antd/lib/table";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH, CLIENT_URL } from "../../../../configs/AppConfig";
import utils from "../../../../utils";
import Flex from "../../../../components/shared-components/Flex";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import { AuthService } from "../../../../api/auth";
import { AppService } from "../../../../api/app";
import { IState } from "../../../../redux/reducers";
import { IAccount } from "../../../../redux/reducers/Account";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import Translate from "../../../../utils/translate";
import TranslateText from "../../../../utils/translate";
import { ICompanyData } from "../../../../api/app/types";

enum status {
  active = 1,
  disabled = 2,
}

interface CompanyStateProps<T> {
  companies: T;
  pageSize: number;
  selectedRows: T;
  selectedKeys: any;
  companiesToSearch: T;
  userProfileVisible: boolean;
  selectedUser: ICompanyData;
  isHidden: string;
  editModalVisible: boolean;
  newUserModalVisible: boolean;
  registerUserModalVisible: boolean;
  loading: boolean;
}

export class CompanyList extends Component {
  state: CompanyStateProps<ICompanyData[]> = {
    companies: [],
    pageSize: 10,
    selectedRows: [],
    selectedKeys: [],
    companiesToSearch: [],
    userProfileVisible: false,
    selectedUser: {},
    isHidden: "block",
    editModalVisible: false,
    newUserModalVisible: false,
    registerUserModalVisible: false,
    loading: true,
  };

  private AppInstance = new AppService();
  private AuthInstance = new AuthService();

  getCompanyList = async () => {
    return await this.AppInstance.GetCompanyList().then((data) => {
      if (data && data.ErrorCode === 0) {
        this.setState({ loading: false });
        const evaluatedCompanies = utils
          .sortData(data.CompanyList, "ID")
          .reverse();

        /*
         * Create 2 different states for users data in order to be able,
         * to search through them.
         */
        this.setState({
          companies: evaluatedCompanies,
          companiesToSearch: evaluatedCompanies,
        });
      }
    });
  };

  componentDidMount() {
    this.getCompanyList();
  }

  componentWillUnmount() {
    this.AppInstance._source.cancel();
    this.AuthInstance._source.cancel();
  }

  showUserProfile = (userInfo: ICompanyData) => {
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

  showEditModal = (userInfo: ICompanyData) => {
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
    onChange: (key: any, rows: any) => {
      this.setState({ selectedKeys: key });
      this.setState({ selectedRows: rows });
    },
  };

  toggleStatusRow = async (row: ICompanyData[], statusNumber: number) => {
    Modal.confirm({
      title:
        statusNumber === 0 || statusNumber === 2
          ? `${TranslateText("user.disable.title2")} ${row.length} ${
              row.length > 1
                ? TranslateText("company.plural")
                : TranslateText("company.singular")
            }?`
          : `${TranslateText("user.activate.title2")} ${row.length} ${
              row.length > 1
                ? TranslateText("company.plural")
                : TranslateText("company.singular")
            }?`,
      onOk: async () => {
        await Promise.all(
          row.map(async (elm) => {
            await this.handleUserStatus(elm.ID ?? 0, statusNumber);
          })
        );
        this.getCompanyList();
        this.setState({ selectedRows: [], selectedKeys: [] });
      },
    });
  };

  handleUserStatus = (userId: number, status: number) => {
    return this.AppInstance.ChangeCompanyStatus(userId, status);
  };

  getManagedToken = async (CompanyID: number) => {
    return await this.AuthInstance.GetManagedToken(CompanyID).then((data) => {
      if (data && data.ErrorCode === 0) return data.Token;
    });
  };

  dropdownMenu = (row: ICompanyData) => (
    <Menu>
      <Menu.Item
        onClick={async () => {
          const token = await this.getManagedToken(row.ID ?? 0);
          if (token) window.open(`${CLIENT_URL}/auth/admin/${token}`, "_blank");
        }}
      >
        <Flex alignItems="center">
          <PlayCircleOutlined />
          <span className="ml-2">
            <IntlMessage id={"dropdown.Manage"} />
          </span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => this.showUserProfile(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">
            <IntlMessage id={"dropdown.ViewDetails"} />
          </span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => this.showEditModal(row)}>
        <Flex alignItems="center">
          <EditOutlined />
          <span className="ml-2">
            <IntlMessage id={"dropdown.Edit"} />
          </span>
        </Flex>
      </Menu.Item>
      {row.Status === 0 || row.Status === 2 ? (
        <Menu.Item
          onClick={async () => {
            Modal.confirm({
              title: `Are you sure you want to activate this company?`,
              onOk: async () => {
                await this.handleUserStatus(row.ID ?? 0, status.active).then(
                  () => {
                    this.getCompanyList();
                  }
                );
              },
            });
          }}
        >
          <Flex alignItems="center">
            <CheckCircleOutlined />
            <span className="ml-2">
              <IntlMessage id={"dropdown.Activate"} />
            </span>
          </Flex>
        </Menu.Item>
      ) : (
        <Menu.Item
          onClick={async () => {
            Modal.confirm({
              title: `Are you sure you want to disable this company?`,
              onOk: async () => {
                await this.handleUserStatus(row.ID ?? 0, status.disabled).then(
                  () => {
                    this.getCompanyList();
                  }
                );
              },
            });
          }}
        >
          <Flex alignItems="center">
            <CloseCircleOutlined />
            <span className="ml-2">
              <IntlMessage id={"dropdown.Disable"} />
            </span>
          </Flex>
        </Menu.Item>
      )}
    </Menu>
  );
  onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const data = utils.wildCardSearch(this.state.companiesToSearch, value);
    this.setState({ companies: data });
  };

  render() {
    const { companies, userProfileVisible, selectedUser } = this.state;

    const tableColumns: ColumnsType<ICompanyData> = [
      {
        title: <IntlMessage id="company.Title" />,
        dataIndex: "",
        render: (_, record) => (
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
        title: <IntlMessage id="company.IDNO" />,
        dataIndex: "",
        render: (_, record) => (
          <Tag className="text-capitalize">{record.IDNO}</Tag>
        ),
      },
      {
        title: <IntlMessage id="company.Address" />,

        dataIndex: "",
        render: (_, record) => (
          <p className="text-capitalize">{record.JuridicalAddress}</p>
        ),
      },

      {
        title: <IntlMessage id="company.Status" />,
        dataIndex: "Status",
        render: (Status, record) => (
          <Tag
            className="text-capitalize"
            color={Status === 1 ? "cyan" : Status === 2 ? "red" : "orange"}
          >
            {Status === 1 ? (
              <IntlMessage id="company.status.Active" />
            ) : Status === 2 ? (
              <IntlMessage id="company.status.Disabled" />
            ) : (
              <IntlMessage id="company.status.Inactive" />
            )}
          </Tag>
        ),
        sorter: {
          compare: (a, b) => a.Status! - b.Status!,
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
        <Flex className="mb-1" mobileFlex={false} justifyContent="between">
          <div className="mr-md-3 mb-3">
            <Input
              placeholder={Translate("app.Search")}
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
                      ? `${TranslateText("user.activate")} (${
                          this.state.selectedRows.length
                        })`
                      : `${TranslateText("user.activate")}`}
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
                      ? `${TranslateText("user.disable")} (${
                          this.state.selectedRows.length
                        })`
                      : `${TranslateText("user.disable")}`}
                  </Button>
                </>
              )}
              <Link to={`${APP_PREFIX_PATH}/wizard`}>
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  block
                  // onClick={() => this.showNewUserModal()}
                >
                  {" "}
                  <IntlMessage id="company.Register" />
                </Button>
              </Link>
            </Flex>
          </div>
        </Flex>
        <div className="table-responsive">
          <Table
            loading={this.state.loading}
            columns={tableColumns}
            dataSource={companies}
            rowKey="ID"
            style={{ position: "relative" }}
            rowSelection={{
              selectedRowKeys: this.state.selectedKeys,
              type: "checkbox",
              preserveSelectedRowKeys: false,
              ...this.rowSelection,
            }}
            pagination={{
              total: this.state.companies.length,
              pageSize: this.state.pageSize,
              showSizeChanger: true,
              onShowSizeChange: (current, size) => {
                this.setState({ pageSize: size });
              },
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

const mapStateToProps = ({ account }: IState) => {
  const { CompanyID } = account as IAccount;
  return { CompanyID };
};
export default connect(mapStateToProps, null)(CompanyList);
