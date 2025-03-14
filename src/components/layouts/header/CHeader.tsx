import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, MenuProps, Space, Tag } from 'antd';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { mainURL } from '../../../App';
const { Header } = Layout;

export interface ICHeaderProps {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
}
const CHeader: React.FC<ICHeaderProps> = ({ collapsed, setCollapsed }) => {

  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link to={`${mainURL}/select-user`}>
          Roles
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link to={`${mainURL}/dashboard-selection`}>
          Business Unit
        </Link>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          Settings
        </a>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      danger: true,
      label: <a onClick={() => {
        console.log('Logout')
        localStorage.removeItem('selectedRole')
        localStorage.clear()
        sessionStorage.clear()
        navigate(`${mainURL}/login`)
      }} >
        Logout
      </a>,
    },
  ];

  console.log('localStorage', localStorage)

  return (
    <Header style={{ paddingLeft: 5, paddingRight: 10 }}>
      <div className='flex flex-row justify-between'>
        <div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined className='text-white' /> : <MenuFoldOutlined className='text-white' />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
        <div>
          <Tag color='blue'>CAD - CHECKER</Tag>
        </div>
        <div>
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space className='text-white'>
                <Avatar size={32} icon={<UserOutlined />} className='bg-blue-500' />
                {'UserName'}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </Header>
  )
}

export default CHeader