import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "antd";

interface AvatarStatusProps {
    name?: any;
    suffix?: any;
    subTitle?: any;
    id?: any;
    type?: any;
    src?: any;
    icon?: any;
    size?: any;
    shape?: any;
    gap?: any;
    text?: any;
    onNameClick?: any;
}

const renderAvatar = (props: any) => {
    return (
        <Avatar {...props} className={`ant-avatar-${props.type}`}>
            {props.text}
        </Avatar>
    );
};

const AvatarStatus = ({
    name,
    suffix,
    subTitle,
    id,
    type,
    src,
    icon,
    size,
    shape,
    gap,
    text,
    onNameClick,
}: AvatarStatusProps) => {
    return (
        <div className="avatar-status d-flex align-items-center">
            {renderAvatar({ icon, src, type, size, shape, gap, text })}
            <div className="ml-2">
                <div>
                    {onNameClick ? (
                        <div
                            onClick={() =>
                                onNameClick({ name, subTitle, src, id })
                            }
                            className="avatar-status-name clickable"
                        >
                            {name}
                        </div>
                    ) : (
                        <div className="avatar-status-name">{name}</div>
                    )}
                    <span>{suffix}</span>
                </div>
                <div className="text-muted avatar-status-subtitle">
                    {subTitle}
                </div>
            </div>
        </div>
    );
};

AvatarStatus.propTypes = {
    name: PropTypes.string,
    src: PropTypes.string,
    type: PropTypes.string,
    onNameClick: PropTypes.func,
};

export default AvatarStatus;
