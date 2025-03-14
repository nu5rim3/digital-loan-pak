import { ApartmentOutlined, BlockOutlined, DeploymentUnitOutlined, GroupOutlined, NodeIndexOutlined, ProductOutlined, ProjectOutlined, RocketOutlined, RubyOutlined, UngroupOutlined, UsergroupAddOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo1 from '../../../assets/full_logo_white.png';
import Logo2 from '../../../assets/logo.png';
import { ItemType as SideItemType } from 'antd/es/menu/interface';
import { useRole } from '../../../hooks/RoleContext';

type CustomItemType = SideItemType & {
    roles?: string[];
};

export interface ICSideBarProps {
    collapsed: boolean
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
}

const { Sider } = Layout;

const CSideBar: React.FC<ICSideBarProps> = ({ collapsed, setCollapsed }) => {

    const tenet = import.meta.env.VITE_TENET;
    const baseURL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    const handleCollapse = (collapseState: boolean) => {
        setCollapsed(collapseState);
    };

    const items: CustomItemType[] = [
        {
            type: 'item',
            label: 'Dashboard',
            key: '1',
            icon: <ProductOutlined />,
            onClick: () => navigate(`/${tenet}-${baseURL}/dashboard`),
            roles: ["ADMIN", "EDITOR", "VIEWER"],
        },
        {
            type: 'submenu',
            icon: <RubyOutlined />,
            label: 'Access and Permission',
            key: '2',
            roles: ["ADMIN", "EDITOR"],
            children: [
                {
                    label: 'Roles',
                    key: '2-1',
                    icon: <UserSwitchOutlined />,
                    onClick: () => navigate(`/${tenet}-${baseURL}/permission/roles`)
                },
                {
                    label: 'System Users',
                    key: '2-2',
                    icon: <DeploymentUnitOutlined />,
                    onClick: () => navigate(`/${tenet}-${baseURL}/permission/accounts`)
                },
                {
                    label: 'Business Introducers',
                    key: '2-3',
                    icon: <UsergroupAddOutlined />,
                    onClick: () => navigate(`/${tenet}-${baseURL}/permission/members`)
                }
            ]
        },
        {
            type: 'submenu',
            icon: <NodeIndexOutlined />,
            label: 'Approval and Ratification',
            key: '4',
            roles: ["ADMIN", "EDITOR", "VIEWER"],
            children: [
                {
                    label: 'Group',
                    key: '4-1',
                    icon: <GroupOutlined />,
                    onClick: () => navigate(`/${tenet}-${baseURL}/approval/group`)
                },
                {
                    label: 'User',
                    key: '4-2',
                    icon: <UserOutlined />,
                    onClick: () => navigate(`/${tenet}-${baseURL}/approval/user`)
                },
                {
                    label: 'Workflow',
                    key: '4-3',
                    icon: <ApartmentOutlined />,
                    onClick: () => navigate(`/${tenet}-${baseURL}/approval/workflow`)
                }
            ]
        },
        {
            type: 'submenu',
            icon: <BlockOutlined />,
            label: 'Approval Flow',
            key: '3',
            roles: ["ADMIN", "EDITOR", "VIEWER"],
            children: [
                {
                    label: 'Origination',
                    key: '3-1',
                    icon: <ProjectOutlined />,
                    onClick: () => navigate(`/${tenet}-${baseURL}/gold/goldsmith`)
                },
            ]
        },
        {
            type: 'submenu',
            icon: <RocketOutlined />,
            label: 'Loan Application',
            key: '5',
            roles: ["ADMIN"],
            children: [
                {
                    label: 'Loan Request',
                    key: '5-1',
                    icon: <UngroupOutlined />,
                    onClick: () => navigate(`/${tenet}-${baseURL}/loan/application`),
                },
            ]
        }

    ]

    const { selectedRole } = useRole();
    // Filter menu based on selected role
    const filteredMenu = items.filter((item: CustomItemType) => item.roles?.includes(selectedRole));
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const handleOpenChange = (keys: string[]) => {
        // Only keep the last opened submenu
        setOpenKeys(keys.length ? [keys[keys.length - 1]] : []);
    };
    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={handleCollapse}
            width={280}
        >
            <div className="flex justify-center items-center py-2 font-bold text-xl">
                {
                    collapsed ? <img src={Logo2} alt='digital-me' style={{ width: 60 }} /> : <img src={Logo1} alt='digital-me' style={{ width: 200 }} />
                }
            </div>
            <Menu
                mode='inline'
                theme='dark'
                defaultSelectedKeys={['1']}
                openKeys={openKeys}
                onOpenChange={handleOpenChange} // Ensures only one submenu stays open
                items={filteredMenu}
            />
        </Sider>
    )
}

export default CSideBar