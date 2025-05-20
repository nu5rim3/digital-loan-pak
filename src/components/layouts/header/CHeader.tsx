import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, MenuProps, Skeleton, Space, Tag } from 'antd';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { mainURL } from '../../../App';
import { IAuthContext, AuthContext } from 'react-oauth2-code-pkce';
import useUserStore from '../../../store/userStore';
import { formatName, getRoleName } from '../../../utils/formatterFunctions';
const { Header } = Layout;

export interface ICHeaderProps {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
}
const CHeader: React.FC<ICHeaderProps> = ({ collapsed, setCollapsed }) => {

  const { logOut } = useContext<IAuthContext>(AuthContext);
  const { user, currentRole } = useUserStore()

  // const navigate = useNavigate();

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
        // console.log('Logout')
        logOut();
        localStorage.removeItem("oauth_token");
        sessionStorage.clear(); // Clear all session data
        document.cookie = "oauth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // navigate(`${mainURL}/login`)
      }} >
        Logout
      </a>,
    },
  ];

  return (
    <Header style={{ paddingLeft: 5, paddingRight: 10 }}>
      <div className='flex flex-row justify-between'>
        <div>
          <Button
            type="text"
            hidden
            icon={collapsed ? <MenuUnfoldOutlined className='text-white' /> : <MenuFoldOutlined className='text-white' />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
        <div>
          <Tag color='blue'>{getRoleName(currentRole?.code ?? '')}</Tag>
        </div>
        <div>
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space className='text-white'>
                <Avatar size={32} icon={<UserOutlined />} className='bg-blue-500' />
                {user?.userName ? (
                  <b>{formatName(user?.userName)}</b>
                ) : (
                  <Skeleton.Input style={{ width: 120 }} active size="small" />
                )}
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