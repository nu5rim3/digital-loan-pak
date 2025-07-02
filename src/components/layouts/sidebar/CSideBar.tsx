import { ApartmentOutlined, BlockOutlined, DeploymentUnitOutlined, GroupOutlined, NodeIndexOutlined, ProductOutlined, ProjectOutlined, RocketOutlined, RubyOutlined, UngroupOutlined, UsergroupAddOutlined, UserOutlined, UserSwitchOutlined, TeamOutlined, PushpinOutlined, PushpinFilled } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo1 from '../../../assets/full_logo_white.png';
import Logo2 from '../../../assets/logo.png';
import lolclogo from '../../../assets/LOLC_ICON.png'
import lolclogo2 from '../../../assets/LOLC_ISLAMIC.png'
import { ItemType as SideItemType } from 'antd/es/menu/interface';
import useUserStore from '../../../store/userStore';

type CustomItemType = SideItemType & {
    roles?: string[];
};

export interface ICSideBarProps {
    collapsed: boolean
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
}

const { Sider } = Layout;

const tenet = import.meta.env.VITE_TENET;
const baseURL = import.meta.env.VITE_BASE_URL;

const mainNavigation = `${tenet}-${baseURL}/auth`
const CSideBar: React.FC<ICSideBarProps> = ({ collapsed, setCollapsed }) => {

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
            onClick: () => navigate(`/${mainNavigation}/dashboard`),
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
                    onClick: () => navigate(`/${mainNavigation}/permission/roles`)
                },
                {
                    label: 'System Users',
                    key: '2-2',
                    icon: <DeploymentUnitOutlined />,
                    onClick: () => navigate(`/${mainNavigation}/permission/accounts`)
                },
                {
                    label: 'Business Introducers',
                    key: '2-3',
                    icon: <UsergroupAddOutlined />,
                    onClick: () => navigate(`/${mainNavigation}/permission/business-introducers`)
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
                    onClick: () => navigate(`/${mainNavigation}/approval/group`)
                },
                {
                    label: 'User',
                    key: '4-2',
                    icon: <UserOutlined />,
                    onClick: () => navigate(`/${mainNavigation}/approval/user`)
                },
                {
                    label: 'Workflow',
                    key: '4-3',
                    icon: <ApartmentOutlined />,
                    onClick: () => navigate(`/${mainNavigation}/approval/workflow`)
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
                    label: 'Approvals For First Flow',
                    key: '3-1',
                    icon: <ProjectOutlined />,
                    onClick: () => navigate(`/${mainNavigation}/approval/firstFlow`)
                },
                {
                    label: 'Approvals For Second Flow',
                    key: '3-2',
                    icon: <ProjectOutlined />,
                    onClick: () => navigate(`/${mainNavigation}/approval/secondFlow`)
                },
            ]
        },
        {
            type: 'submenu',
            icon: <TeamOutlined />,
            label: 'Application Users',
            key: '5',
            roles: ["ADMIN", "BHO"],
            children: [
                {
                    label: 'Customers',
                    key: '5-1',
                    icon: <UserOutlined />,
                    onClick: () => navigate(`/${mainNavigation}/users/customers`),
                },
                {
                    label: 'Guarantors',
                    key: '5-2',
                    icon: <UserOutlined />,
                    onClick: () => navigate(`/${mainNavigation}/users/guarantors`),
                },
                {
                    label: 'Witnesses',
                    key: '5-3',
                    icon: <UserOutlined />,
                    onClick: () => navigate(`/${mainNavigation}/users/witnesses`),
                },
            ]
        },
        {
            type: 'submenu',
            icon: <RocketOutlined />,
            label: 'Loan Application',
            key: '6',
            roles: ["ADMIN", 'BHO', 'CRO'],
            children: [
                {
                    label: 'Loan Request',
                    key: '6-1',
                    icon: <UngroupOutlined />,
                    onClick: () => navigate(`/${mainNavigation}/loan/application`),
                },
            ]
        }

    ]

    const { currentRole } = useUserStore()
    // Filter menu based on selected role
    const filteredMenu = items.filter((item: CustomItemType) => item.roles?.includes(currentRole?.code ?? ''));
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const handleOpenChange = (keys: string[]) => {
        // Only keep the last opened submenu
        setOpenKeys(keys.length ? [keys[keys.length - 1]] : []);
    };
    return (
        <Sider
            // collapsible
            collapsed={collapsed}
            onCollapse={handleCollapse}
            width={280}
            style={{
                position: 'relative', // important for absolute positioning to work
                height: '100vh', // ensure full height
            }}
        >
            <div className="flex justify-center items-center py-2 font-bold text-xl">
                {
                    collapsed ? <img src={Logo2} alt='digital-me' style={{ width: 45 }} /> : <img src={Logo1} alt='digital-me' style={{ width: 200 }} />
                }
            </div>
            <div className='flex justify-end'>
                <Button icon={collapsed ? <PushpinOutlined /> : <PushpinFilled />} shape="circle" onClick={() => handleCollapse(!collapsed)}></Button>
            </div>
            <Menu
                mode='inline'
                theme='dark'
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                items={filteredMenu}
                onSelect={() => {
                    if (!collapsed) {
                        handleCollapse(!collapsed)
                    }
                }
                }
            />

            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                }}
            >
                <img
                    style={{ maxWidth: '60%', maxHeight: '100%' }}
                    src={!collapsed ? lolclogo2 : lolclogo}
                />
            </div>

        </Sider>
    )
}

export default CSideBar