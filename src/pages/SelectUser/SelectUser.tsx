import React, { useState } from 'react';
// import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'; // Ensure the types from this package are correct
import { Card, Layout, Typography } from 'antd';
import MAIN_LOGO from '../../assets/full_logo_black.png'
import { useNavigate } from 'react-router-dom';
import CFooter from '../../components/layouts/footer/CFooter';
import { mainURL } from '../../App';
import useUserStore, { IUserRols } from '../../store/userStore';
import Logo from '../../assets/LOLC_CONVENTIONAL.png'
import { getRoleName } from '../../utils/formatterFunctions';
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
        <div className="bg-[url('/img/bg.svg')]">
            <Content className='flex flex-col justify-between h-screen'>
                <div className='flex flex-row'>
                    <div className='flex flex-1/2'>
                        <div className='flex flex-col w-full'>
                            <img src={Logo} alt='digital-loan' style={{ width: 300 }} className='mb-5' />
                            <div className="flex flex-1 justify-center items-center">
                                <div className='h-50'>
                                    <img
                                        src={MAIN_LOGO}
                                        alt="Brand Logo"
                                        style={{ width: 450 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-1/2 bg-blue-100 justify-center'>
                        <div className='flex flex-col justify-center p-4'>
                            <Title level={3} className="text-center pb-6">
                                Select Your User Role
                            </Title>
                            <div className="grid grid-cols-1 gap-4  max-h-[86vh] overflow-y-auto">
                                {user?.roles.map((role) => (
                                    <Card
                                        style={{ width: 450 }}
                                        key={role.code}
                                        hoverable
                                        className={`shadow-md rounded-lg text-center cursor-pointer transition-transform transform ${selectedRoleCode === role.code
                                            ? 'border-blue-500 bg-blue-50 scale-105'
                                            : 'border-gray-200 bg-white'
                                            }`}
                                        onClick={() => handleSelectRole(role)}
                                    >
                                        <Title level={4}>{getRoleName(role.code)}</Title>
                                        <p>{role.description}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full bg-gray-300'>
                    <CFooter />
                </div>

            </Content >
        </div >
    );
};

export default SelectUser;
