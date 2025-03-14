import React from 'react';
import { Drawer } from 'antd';

interface DrawerProps {
    title: string;
    visible: boolean;
    onClose: () => void;
    form: React.ReactNode;
}

const SideDrawer: React.FC<DrawerProps> = ({ title, visible, onClose, form }) => {
    return (
        <Drawer
            title={title}
            width={1024}
            onClose={onClose}
            open={visible}
        >
            {form}
        </Drawer>
    );
};

export default SideDrawer;