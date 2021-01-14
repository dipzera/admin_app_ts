import React, { Component } from "react";
import { Avatar, Drawer, Divider } from "antd";
import {
  MobileOutlined,
  MailOutlined,
  UserOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ICompanyData } from "../../../../api/types.response";

interface IUserView {
  data: ICompanyData;
  visible: boolean;
  close: () => void;
}

class CompanyView extends Component<IUserView> {
  render() {
    const { data, visible, close } = this.props;
    return (
      <Drawer
        width={350}
        placement="right"
        onClose={close}
        closable={false}
        visible={visible}
      >
        <div className="text-center mt-3">
          <Avatar size={80} src={data?.Logo} icon={<UserOutlined />} />
          <h3 className="mt-2 mb-0">{data?.JuridicalName}</h3>
          <span className="text-muted">
            <IntlMessage id="company.Title" />
          </span>
        </div>
        <Divider dashed />
        <div className="">
          <h6 className="text-muted text-uppercase mb-3">
            <IntlMessage id="account.company.General" />
          </h6>
          <div className="p-1">
            <div>
              <IntlMessage id="account.company.IDNO" />{" "}
            </div>
            <span className=" text-dark">{data?.IDNO}</span>
          </div>
          <div className="p-1">
            <div>
              <IntlMessage id="account.company.JuridicalName" />{" "}
            </div>
            <span className=" text-dark">{data?.JuridicalName}</span>
          </div>

          <div className="p-1">
            <div>
              <IntlMessage id="account.company.CommercialName" />{" "}
            </div>
            <span className=" text-dark">{data?.CommercialName}</span>
          </div>

          {data?.VATCode && (
            <div className="p-1">
              <div>
                <IntlMessage id="account.company.VATCode" />
              </div>
              <span className=" text-dark">{data?.VATCode}</span>
            </div>
          )}
        </div>
        <div className="mt-5">
          <h6 className="text-muted text-uppercase mb-3">
            <IntlMessage id="account.company.Bank" />{" "}
          </h6>
          <div className="p-1">
            <div>
              <IntlMessage id="account.company.Bank" />
            </div>
            <span className=" text-dark">{data?.Bank}</span>
          </div>
          <div className="p-1">
            <div>
              <IntlMessage id="account.company.IBAN" />
            </div>
            <span className=" text-dark">{data?.IBAN}</span>
          </div>
          <div className="p-1">
            <div>
              <IntlMessage id="account.company.BIC" />
            </div>
            <span className=" text-dark">{data?.BIC}</span>
          </div>
        </div>
        <div className="mt-5">
          <h6 className="text-muted text-uppercase mb-3">
            <IntlMessage id="company.Address" />
          </h6>
          <div className="p-1">
            <div>
              <IntlMessage id="account.company.JuridicalAddress" />
            </div>
            <span className=" text-dark">{data?.JuridicalAddress}</span>
          </div>
          <div className="p-1">
            <div>
              <IntlMessage id="account.company.OfficeAddress" />
            </div>
            <span className=" text-dark">{data?.OfficeAddress}</span>
          </div>
        </div>
        <div className="mt-5">
          <h6 className="text-muted text-uppercase mb-3">
            <IntlMessage id="app.Contact" />
          </h6>
          <p>
            <MobileOutlined />
            <span className="ml-3 text-dark">{data?.PhoneNumber}</span>
          </p>
          <p>
            <MailOutlined />
            <span className="ml-3 text-dark">{data?.Email}</span>
          </p>
          <p>
            <GlobalOutlined />
            <span className="ml-3 text-dark">{data?.WebSite}</span>
          </p>
        </div>
      </Drawer>
    );
  }
}

export default CompanyView;
