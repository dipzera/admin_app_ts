import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Tooltip,
} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { LoadingOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { ImageSvg } from "../../../../assets/svg/icon";
import CustomIcon from "../../../../components/util-components/CustomIcon";
import TextEditor from "./TextEditor";
import GeneralView from "./GeneralView";
import Flex from "../../../../components/shared-components/Flex";
const imageUploadProps: any = {
    name: "file",
    multiple: false,
    listType: "picture-card",
    showUploadList: false,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
};
const rules = {
    name: [
        {
            required: true,
            message: "Please enter product name",
        },
    ],
    description: [
        {
            required: true,
            message: "Please enter product description",
        },
    ],
    price: [
        {
            required: true,
            message: "Please enter product price",
        },
    ],
    comparePrice: [],
    taxRate: [
        {
            required: true,
            message: "Please enter tax rate",
        },
    ],
    cost: [
        {
            required: true,
            message: "Please enter item cost",
        },
    ],
};
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
};
const VIEW = "VIEW";
const EDIT = "EDIT";
const General = ({ app }) => {
    const [uploadLoading, setUploadLoading] = useState(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [uploadedImg, setImage] = useState("");
    const [longDesc, setLongDesc] = useState(app.LongDescription);
    const [submitLoading, setSubmitLoading] = useState(false);
    useEffect(() => {
        setImage(app.Logo);
        if (edit) {
            form.setFieldsValue(app);
        }
    }, [edit, setEdit]);
    const handleUploadChange = (info) => {
        if (info.file.status === "uploading") {
            setUploadLoading(true);
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj, (imageUrl) => {
                setImage(imageUrl);
                setUploadLoading(true);
            });
        }
    };
    /* I'd rather enter edit mode only for LongDescription Component,
    which means making a Edit Button only for Long Description, and switching between edit/view only for this input
     */
    return (
        <>
            {edit ? (
                <Form
                    form={form}
                    layout="vertical"
                    name="advanced_search"
                    className="ant-advanced-search-form"
                >
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
                                <Form.Item
                                    name="Name"
                                    label="Application name"
                                    rules={rules.name}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="ShortDescription"
                                    label="Short description"
                                    rules={rules.description}
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                                <Form.Item
                                    name="LongDescription"
                                    label="Long description"
                                    rules={rules.description}
                                >
                                    <TextEditor
                                        apps={app.LongDescription}
                                        handleEditorChange={(content) =>
                                            setLongDesc(content)
                                        }
                                    />
                                </Form.Item>
                            </Card>
                            <Card title="Packages">
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            name="price"
                                            label="Price"
                                            rules={rules.price}
                                        >
                                            <InputNumber
                                                className="w-100"
                                                formatter={(value) =>
                                                    `$ ${value}`.replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ","
                                                    )
                                                }
                                                parser={(value) =>
                                                    value!.replace(
                                                        /\$\s?|(,*)/g,
                                                        ""
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            name="comparePrice"
                                            label="Compare price"
                                            rules={rules.comparePrice}
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
                                                    value!.replace(
                                                        /\$\s?|(,*)/g,
                                                        ""
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            name="cost"
                                            label="Cost per item"
                                            rules={rules.cost}
                                        >
                                            <InputNumber
                                                className="w-100"
                                                formatter={(value) =>
                                                    `$ ${value}`.replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ","
                                                    )
                                                }
                                                parser={(value) =>
                                                    value!.replace(
                                                        /\$\s?|(,*)/g,
                                                        ""
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            name="taxRate"
                                            label="Tax rate"
                                            rules={rules.taxRate}
                                        >
                                            <InputNumber
                                                className="w-100"
                                                min={0}
                                                max={100}
                                                formatter={(value) =>
                                                    `${value}%`
                                                }
                                                parser={(value) =>
                                                    value!.replace("%", "")
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={7}>
                            <Card title="Media">
                                <Dragger
                                    {...imageUploadProps}
                                    beforeUpload={beforeUpload}
                                    onChange={(e) => handleUploadChange(e)}
                                >
                                    {uploadedImg ? (
                                        <img
                                            src={uploadedImg}
                                            alt="avatar"
                                            className="img-fluid"
                                        />
                                    ) : (
                                        <div>
                                            {uploadLoading ? (
                                                <div>
                                                    <LoadingOutlined className="font-size-xxl text-primary" />
                                                    <div className="mt-3">
                                                        Uploading
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <CustomIcon
                                                        className="display-3"
                                                        svg={ImageSvg}
                                                    />
                                                    <p>
                                                        Click or drag file to
                                                        upload
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Dragger>
                            </Card>
                            <Card title="Organization">
                                <Form.Item name="category" label="Category">
                                    <Select
                                        className="w-100"
                                        placeholder="Category"
                                    >
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
                </Form>
            ) : (
                <GeneralView app={app} edit={edit} setEdit={setEdit} />
            )}
        </>
    );
};

export default General;
