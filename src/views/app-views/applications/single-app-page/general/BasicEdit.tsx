import { Form, Input } from "antd";
import React from "react";
import TextEditor from "../TextEditor";

const BasicEdit = ({ app, setLongDesc, rules }) => {
    return (
        <>
            <Form.Item name="Name" label="Application name" rules={rules.name}>
                <Input />
            </Form.Item>
            <Form.Item
                name="ShortDescription"
                label="Short description"
                rules={rules.ShortDescription}
            >
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
                name="LongDescription"
                label="Long description"
                rules={rules.LongDescription}
            >
                <TextEditor
                    apps={app.LongDescription}
                    handleEditorChange={(content) => setLongDesc(content)}
                />
            </Form.Item>
        </>
    );
};
export default BasicEdit;
