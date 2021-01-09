import React, { Component } from "react";
import { Card, Table, Button, Modal, Input } from "antd";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import UserView from "./UserView";
import "../hand_gesture.scss";
import { connect } from "react-redux";
import { signOut, sendActivationCode } from "../../../../redux/actions/Auth";
import { UserModalEdit } from "./UserModalEdit";
import { UserModalAdd } from "./UserModalAdd";
import { AppService } from "../../../../api";
import Flex from "../../../../components/shared-components/Flex";
import utils from "../../../../utils";
import "./table.scss";
import { IState } from "../../../../redux/reducers";
import { IAccount } from "../../../../redux/reducers/Account";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import WithStringTranslate from "../../../../utils/translate";
import { IUsers } from "../../../../api/types.response";
import UserTable from "./UserTable";

export enum status {
  inactive = 0,
  active = 1,
  disabled = 2,
}

interface UserListStateProps {
  users: IUsers[];
  selectedRows: IUsers[];
  selectedKeys: any;
  usersToSearch: IUsers[];
  userProfileVisible: boolean;
  selectedUser: IUsers | null;
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

  mounted = true;

  getUsersInfo = async () => {
    return await new AppService().GetAllUsers().then((data) => {
      this.setState({ loading: false });
      if (data) {
        const { ErrorCode } = data;
        if (ErrorCode === 0) {
          const filteredUsers = data.Users.filter(
            (user: any) => user.ID !== this.props.ID
          );
          const evaluatedArray = utils
            .sortData(filteredUsers, "ID")
            .reverse(); /* Add .reverse() here if you want a reverse sort */
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
    if (this.mounted) this.getUsersInfo();
  }

  componentWillUnmount() {
    this.mounted = false;
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
          ? `${WithStringTranslate("user.disable.title2")} ${row.length} ${
              row.length > 1
                ? WithStringTranslate("user.plural")
                : WithStringTranslate("user.singular")
            }?`
          : `${WithStringTranslate("user.activate.title2")} ${row.length} ${
              row.length > 1
                ? WithStringTranslate("user.plural")
                : WithStringTranslate("user.singular")
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
    return await new AppService().ChangeUserStatus(userId, status);
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
      const searchArray = value ? users : usersToSearch;
      const data = utils.wildCardSearch(searchArray, value);
      this.setState({ users: data });
    };

    return (
      <Card>
        <Flex className="mb-1" mobileFlex={false} justifyContent="between">
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
                      ? `${WithStringTranslate("user.activate")} (${
                          this.state.selectedRows.length
                        })`
                      : `${WithStringTranslate("user.activate")}`}
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
                      ? `${WithStringTranslate("user.disable")} (${
                          this.state.selectedRows.length
                        })`
                      : `${WithStringTranslate("user.disable")}`}
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
          signOut={signOut}
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
