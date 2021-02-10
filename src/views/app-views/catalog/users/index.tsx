import React, { Component } from "react";
import { Card, Table, Button, Modal, Input } from "antd";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import UserView from "./UserView";
import { connect } from "react-redux";
import { sendActivationCode } from "../../../../redux/actions/Auth";
import UserModalEdit from "./UserModalEdit";
import { UserModalAdd } from "./UserModalAdd";
import { AuthService } from "../../../../api/auth";
import { AppService } from "../../../../api/app";
import Flex from "../../../../components/shared-components/Flex";
import utils from "../../../../utils";
import { IState } from "../../../../redux/reducers";
import { IAccount } from "../../../../redux/reducers/Account";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import TranslateText from "../../../../utils/translate";
import { IUsers } from "../../../../api/app/types";
import UserTable from "./UserTable";
import "./table.scss";

export enum status {
  inactive = 0,
  active = 1,
  disabled = 2,
}

interface UserListStateProps {
  users: IUsers[];
  pageSize: number;
  selectedRows: IUsers[];
  selectedKeys: any;
  usersToSearch: IUsers[];
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
  sendActivationCode: (ID: number) => void;
  CompanyID?: number;
  ID?: number;
}
export class UserList extends Component<StoreProps> {
  state: UserListStateProps = {
    users: [],
    pageSize: 10,
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

  private AppInstance = new AppService();
  private AuthInstance = new AuthService();
  getUsersInfo = async () => {
    return await this.AppInstance.GetAllUsers().then((data) => {
      if (data && data.ErrorCode === 0) {
        this.setState({ loading: false });
        const filteredUsers = data.Users.filter(
          (user) => user.ID !== this.props.ID
        );
        const evaluatedArray = utils.sortData(filteredUsers, "ID").reverse();
        // One state to show, one state to search through
        this.setState({
          usersToSearch: evaluatedArray,
          users: evaluatedArray,
        });
      }
    });
  };

  componentDidMount() {
    this.getUsersInfo();
  }

  componentWillUnmount() {
    this.AppInstance._source.cancel();
    this.AuthInstance._source.cancel();
  }
  showUserProfile = (userInfo: IUsers) => {
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

  showEditModal = (userInfo: IUsers) => {
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

  toggleStatusRow = async (row: IUsers[], statusNumber: number) => {
    Modal.confirm({
      title:
        statusNumber === 0 || statusNumber === 2
          ? `${TranslateText("user.disable.title2")} ${row.length} ${
              row.length > 1
                ? TranslateText("user.plural")
                : TranslateText("user.singular")
            }?`
          : `${TranslateText("user.activate.title2")} ${row.length} ${
              row.length > 1
                ? TranslateText("user.plural")
                : TranslateText("user.singular")
            }?`,
      onOk: async () => {
        await Promise.all(
          row.map(async (elm) => {
            await this.handleUserStatus(elm.ID, statusNumber);
          })
        );
        this.getUsersInfo();

        this.setState({ selectedRows: [], selectedKeys: [] });
      },
    });
  };
  handleUserStatus = async (userId: number, status: number) => {
    return await this.AppInstance.ChangeUserStatus(userId, status);
  };

  render() {
    const {
      users,
      usersToSearch,
      userProfileVisible,
      selectedUser,
    } = this.state;

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      const data = utils.wildCardSearch(usersToSearch, value);
      this.setState({ users: data });
    };

    return (
      <Card>
        <Flex className="mb-1" mobileFlex={false} justifyContent="between">
          <div className="mr-md-3 mb-3">
            <Input
              placeholder={TranslateText("app.Search")}
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
            pagination={{
              total: this.state.users.length,
              showSizeChanger: true,
              pageSize: this.state.pageSize,
              onShowSizeChange: (current, size) => {
                this.setState({ pageSize: size });
              },
            }}
            columns={UserTable(
              this.props.sendActivationCode,
              this.showUserProfile,
              this.showEditModal,
              this.getUsersInfo,
              this.handleUserStatus
            )}
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
          getUsersInfo={this.getUsersInfo}
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
  const { CompanyID, ID } = account as IAccount;
  return { ID, CompanyID };
};

export default connect(mapStateToProps, { sendActivationCode })(UserList);
