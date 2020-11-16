import {
    Button,
    Card,
    Col,
    Form,
    InputNumber,
    Row,
    Select,
    Tooltip,
} from "antd";
import Avatar from "antd/lib/avatar/avatar";
import Dragger from "antd/lib/upload/Dragger";
import React from "react";
import { ExperimentOutlined, EditOutlined } from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";

const GeneralView = ({ app, edit, setEdit }) => {
    return (
        <Row gutter={16}>
            <Col xs={24} sm={24} md={17}>
                <Card>
                    <Flex justifyContent="between">
                        <h4>Basic Info</h4>

                        <Tooltip title="Edit">
                            <Button
                                type="primary"
                                onClick={() => setEdit(!edit)}
                                className="mb-2"
                                icon={<EditOutlined />}
                            />
                        </Tooltip>
                    </Flex>
                    <Form.Item label="Application Name">
                        <div>{app.Name}</div>
                    </Form.Item>
                    <Form.Item label="Short description">
                        <div>{app.ShortDescription}</div>
                    </Form.Item>
                    <Form.Item label="Long description">
                        <div
                            className="mt-2"
                            dangerouslySetInnerHTML={{
                                __html: app.LongDescription,
                            }}
                        ></div>
                    </Form.Item>
                </Card>
                <Card title="Packages">
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="price" label="Price">
                                <InputNumber
                                    className="w-100"
                                    formatter={(value) =>
                                        `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    parser={(value) =>
                                        value!.replace(/\$\s?|(,*)/g, "")
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                name="comparePrice"
                                label="Compare price"
                            >
                                <InputNumber
                                    className="w-100"
                                    value={0}
                                    formatter={(value) =>
                                        `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    parser={(value) =>
                                        value!.replace(/\$\s?|(,*)/g, "")
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="cost" label="Cost per item">
                                <InputNumber
                                    className="w-100"
                                    formatter={(value) =>
                                        `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    parser={(value) =>
                                        value!.replace(/\$\s?|(,*)/g, "")
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="taxRate" label="Tax rate">
                                <InputNumber
                                    className="w-100"
                                    min={0}
                                    max={100}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => value!.replace("%", "")}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col xs={24} sm={24} md={7}>
                <Card title="Media">
                    <Dragger disabled>
                        <Avatar
                            src={app.Logo}
                            icon={<ExperimentOutlined />}
                            size={72}
                            alt="avatar"
                            className="img-fluid"
                        />
                    </Dragger>
                </Card>
                <Card title="Organization">
                    <Form.Item name="category" label="Category">
                        <Select className="w-100" placeholder="Category">
                            {/* {categories.map((elm) => (
                            <Option key={elm} value={elm}>
                                {elm}
                            </Option>
                        ))} */}
                        </Select>
                    </Form.Item>
                    <Form.Item name="tags" label="Tags">
                        <Select
                            mode="tags"
                            style={{ width: "100%" }}
                            placeholder="Tags"
                        >
                            {/* {tags.map((elm) => (
                            <Option key={elm}>{elm}</Option>
                        ))} */}
                        </Select>
                    </Form.Item>
                </Card>
            </Col>
        </Row>
    );
};

export default GeneralView;
