import React, { Component } from "react";
import { Avatar, Drawer, Divider } from "antd";
import {
    MobileOutlined,
    MailOutlined,
    UserOutlined,
    CompassOutlined,
    CalendarOutlined,
    FacebookOutlined,
    InstagramOutlined,
    TwitterOutlined,
    GlobalOutlined,
    ApartmentOutlined,
    BankOutlined,
} from "@ant-design/icons";

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
                        {/* {data?.personalInfo.title} */}Company
                    </span>
                </div>
                <Divider dashed />
                <div className="">
                    <h6 className="text-muted text-uppercase mb-3">General</h6>
                    <p>
                        <span className=" text-dark">IDNO: {data?.IDNO}</span>
                    </p>
                    <p>
                        <span className=" text-dark">
                            Juridical name: {data?.JuridicalName}
                        </span>
                    </p>

                    <p>
                        <span className=" text-dark">
                            Commercial name: {data?.CommercialName}
                        </span>
                    </p>

                    {data?.VATCode && (
                        <p>
                            <span className=" text-dark">
                                VAT Code: {data?.VATCode}
                            </span>
                        </p>
                    )}
                    {/* <p>
            <CalendarOutlined />
            <span className="ml-3 text-dark">
              Born in {data?.personalInfo.birthday}
            </span>
          </p> */}
                </div>
                <div className="mt-5">
                    <h6 className="text-muted text-uppercase mb-3">Bank</h6>
                    <p>
                        <span className=" text-dark">Bank: {data?.Bank}</span>
                    </p>
                    <p>
                        <span className=" text-dark">IBAN: {data?.IBAN}</span>
                    </p>
                    <p>
                        <span className=" text-dark">BIC: {data?.BIC}</span>
                    </p>

                    {/* <p>
            <CompassOutlined />
            <span className="ml-3 text-dark">
              {data?.personalInfo.location}
            </span>
          </p> */}
                </div>
                <div className="mt-5">
                    <h6 className="text-muted text-uppercase mb-3">Address</h6>
                    <p>
                        <span className=" text-dark">
                            Juridical address: {data?.JuridicalAddress}
                        </span>
                    </p>
                    <p>
                        <span className=" text-dark">
                            Office Address: {data?.OfficeAddress}
                        </span>
                    </p>
                </div>
                <div className="mt-5">
                    <h6 className="text-muted text-uppercase mb-3">Contact</h6>
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
