import React, { useState } from 'react';
// import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'; // Ensure the types from this package are correct
import { Card, Layout, Typography } from 'antd';
import Logo from '../../assets/full_logo_black.png'
import { useNavigate } from 'react-router-dom';
import CFooter from '../../components/layouts/footer/CFooter';
import { mainURL } from '../../App';
// import PageLoader from '../../components/common/loaders/PageLoader';

const { Content } = Layout;
const { Title } = Typography;

interface Role {
    id: string;
    name: string;
    description: string;
}

const roles: Role[] = [
    { id: 'role1', name: 'Credit Officer', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 'role2', name: 'Super Administrator', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 'role3', name: 'Branch Manager', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 'role4', name: 'Call Center Officer', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 'role5', name: 'Chief Operating Officer', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 'role6', name: 'Credit Reviewer', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 'role7', name: 'Regional Business Head', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 'role8', name: 'Credit Approver', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 'role9', name: 'Area Manager', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
];

const SelectUser: React.FC = () => {

    // const { token, tokenData } = useContext<IAuthContext>(AuthContext);
    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const handleSelectRole = (roleId: string): void => {
        setSelectedRole(roleId);
        console.log('Selected Role:', roleId);
        setTimeout(() => {
            navigate(`${mainURL}/dashboard`);
        }, 1000);
    };

    return (
        <div className="bg-[url('/img/bg.svg')] h-screen">
            <Content className='flex flex-col justify-between h-screen'>
                <div className='h-full flex flex-col justify-center items-center'>
                    {/* Brand Logo */}
                    <div className="">
                        <img
                            src={Logo}
                            alt="Brand Logo"
                        // className="h-32 w-32 md:h-80 md:w-80"
                        />
                    </div>

                    {/* Title */}
                    <Title level={3} className="text-center pb-6">
                        Select Your User Role
                    </Title>

                    {/* Role Tiles */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 p-4">
                        {roles.map((role) => (
                            <Card
                                key={role.id}
                                hoverable
                                className={`shadow-md rounded-lg text-center cursor-pointer transition-transform transform ${selectedRole === role.id
                                    ? 'border-blue-500 bg-blue-50 scale-105'
                                    : 'border-gray-200 bg-white'
                                    }`}
                                onClick={() => handleSelectRole(role.id)}
                            >
                                <Title level={4}>{role.name}</Title>
                                <p>{role.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className='w-full bg-gray-300 h-15'>
                    <CFooter />
                </div>
            </Content>
        </div>
    );
};

export default SelectUser;
