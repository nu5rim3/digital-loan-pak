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
            <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <CHeader collapsed={collapsed} setCollapsed={setCollapsed} />
                {/* Wrapper to control height and scrolling */}
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <Content
                        className="p-4"
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                        }}
                    >
                        <Outlet />
                    </Content>
                </div>
                <CFooter />
            </Layout>
        </Layout>
    )
}

export default LayoutContainer