import React, { useState } from 'react';
// import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'; // Ensure the types from this package are correct
import { Card, Layout, Typography } from 'antd';
import Logo from '../../assets/full_logo_black.png'
import { useNavigate } from 'react-router-dom';
import CFooter from '../../components/layouts/footer/CFooter';
import { mainURL } from '../../App';
import useUserStore, { IUserRols } from '../../store/userStore';
// import PageLoader from '../../components/common/loaders/PageLoader';

const { Content } = Layout;
const { Title } = Typography;

const SelectUser: React.FC = () => {

    // const { token, tokenData } = useContext<IAuthContext>(AuthContext);
    const navigate = useNavigate();

    const [selectedRoleCode, setSelectedRoleCode] = useState<string | null>(null);

    const { user, selectingRole } = useUserStore()

    const handleSelectRole = (role: IUserRols): void => {
        setSelectedRoleCode(role.code);
        selectingRole(role);
        if (role) {
            navigate(`${mainURL}/dashboard`);
        }
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
                        {user?.roles.map((role) => (
                            <Card
                                key={role.code}
                                hoverable
                                className={`shadow-md rounded-lg text-center cursor-pointer transition-transform transform ${selectedRoleCode === role.code
                                    ? 'border-blue-500 bg-blue-50 scale-105'
                                    : 'border-gray-200 bg-white'
                                    }`}
                                onClick={() => handleSelectRole(role)}
                            >
                                <Title level={4}>{role.description}</Title>
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
