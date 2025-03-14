import { Layout } from 'antd';
import React, { useState } from 'react'
import CSideBar from './sidebar/CSideBar';
import CFooter from './footer/CFooter';
import { Outlet } from 'react-router-dom';
import CHeader from './header/CHeader';
const { Content } = Layout;

const LayoutContainer: React.FC = () => {

    const [collapsed, setCollapsed] = useState<boolean>(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <CSideBar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Layout>
                <CHeader collapsed={collapsed} setCollapsed={setCollapsed} />
                <Content className='p-4'>
                    <Outlet />
                </Content>
                <CFooter />
            </Layout>
        </Layout>
    )
}

export default LayoutContainer