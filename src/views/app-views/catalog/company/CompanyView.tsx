import React, { Component } from "react";
import { Avatar, Drawer, Divider } from "antd";
import {
    MobileOutlined,
    MailOutlined,
    UserOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import IntlMessage from "../../../../components/util-components/IntlMessage";

interface UserViewProps {
    data: any;
    visible: boolean;
    close: any;
}

export class CompanyView extends Component<UserViewProps> {
    render() {
        const { data, visible, close } = this.props;

        return (
            <Drawer
                width={300}
                placement="right"
                onClose={close}
                closable={false}
                visible={visible}
            >
                <div className="text-center mt-3">
                    <Avatar
                        size={80}
                        src={data?.Logo}
                        icon={<UserOutlined />}
                    />
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
                    <p>
                        <span className=" text-dark">
                            <IntlMessage id="account.company.IDNO" />{" "}
                            {data?.IDNO}
                        </span>
                    </p>
                    <p>
                        <span className=" text-dark">
                            <IntlMessage id="account.company.JuridicalName" />{" "}
                            {data?.JuridicalName}
                        </span>
                    </p>

                    <p>
                        <span className=" text-dark">
                            <IntlMessage id="account.company.CommercialName" />{" "}
                            {data?.CommercialName}
                        </span>
                    </p>

                    {data?.VATCode && (
                        <p>
                            <span className=" text-dark">
                                <IntlMessage id="account.company.VATCode" />{" "}
                                {data?.VATCode}
                            </span>
                        </p>
                    )}
                </div>
                <div className="mt-5">
                    <h6 className="text-muted text-uppercase mb-3">
                        <IntlMessage id="account.company.Bank" />{" "}
                    </h6>
                    <p>
                        <span className=" text-dark">
                            <IntlMessage id="account.company.Bank" />{" "}
                            {data?.Bank}
                        </span>
                    </p>
                    <p>
                        <span className=" text-dark">
                            <IntlMessage id="account.company.IBAN" />{" "}
                            {data?.IBAN}
                        </span>
                    </p>
                    <p>
                        <span className=" text-dark">
                            <IntlMessage id="account.company.BIC" /> {data?.BIC}
                        </span>
                    </p>
                </div>
                <div className="mt-5">
                    <h6 className="text-muted text-uppercase mb-3">
                        <IntlMessage id="company.Address" />
                    </h6>
                    <p>
                        <span className=" text-dark">
                            <IntlMessage id="account.company.JuridicalAddress" />{" "}
                            {data?.JuridicalAddress}
                        </span>
                    </p>
                    <p>
                        <span className=" text-dark">
                            <IntlMessage id="account.company.OfficeAddress" />{" "}
                            {data?.OfficeAddress}
                        </span>
                    </p>
                </div>
                <div className="mt-5">
                    <h6 className="text-muted text-uppercase mb-3">
                        <IntlMessage id="app.Contact" />
                    </h6>
                    <p>
                        <MobileOutlined />
                        <span className="ml-3 text-dark">
                            {data?.PhoneNumber}
                        </span>
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

                {/* <div className="mt-5">
          <h6 className="text-muted text-uppercase mb-3">Social profiles</h6>
          <p>
            <FacebookOutlined />
            <a href="/#" className="ml-3 text-dark">
              {data?.personalInfo.facebook ? data?.personalInfo.facebook : "-"}
            </a>
          </p>
          <p>
            <TwitterOutlined />
            <a href="/#" className="ml-3 text-dark">
              {data?.personalInfo.twitter ? data?.personalInfo.twitter : "-"}
            </a>
          </p>
          <p>
            <InstagramOutlined />
            <a href="/#" className="ml-3 text-dark">
              {data?.personalInfo.instagram
                ? data?.personalInfo.instagram
                : "-"}
            </a>
          </p>
          <p>
            <GlobalOutlined />
            <a href="/#" className="ml-3 text-dark">
              {data?.personalInfo.site ? data?.personalInfo.site : "-"}
            </a>
          </p>
        </div> */}
            </Drawer>
        );
    }
}

export default CompanyView;
