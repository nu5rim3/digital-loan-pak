import React, { useContext } from 'react';
import { Button, Layout, Typography } from 'antd';
import Logo1 from '../../assets/full_logo_black.png'
import Logo from '../../assets/LOLC_CONVENTIONAL.png'
import CFooter from '../../components/layouts/footer/CFooter';
// import { IAuthContext, AuthContext } from 'react-oauth2-code-pkce';
import { useNavigate } from 'react-router-dom';
import { mainURL } from '../../App';
import { IAuthContext, AuthContext } from 'react-oauth2-code-pkce';

const { Title, Text } = Typography;
const { Content } = Layout;
const Landing: React.FC = () => {

  const { token, loginInProgress, logIn, logOut } = useContext<IAuthContext>(AuthContext);

  // const { logIn } = useContext<IAuthContext>(AuthContext);

  const handleGetStarted = () => {
    logIn();
    // navigate(`${mainURL}/login`);
  }

  return (
    <div className="bg-[url('/img/bg.svg')] h-screen">
      <Content className='flex flex-col justify-between h-screen'>
        <div className='flex justify-center '>
          <img src={Logo1} alt='digital-loan' style={{ width: 500 }} />
        </div>
        <div className='h-full flex flex-col justify-center items-center'>
          <img src={Logo} alt='digital-loan' style={{ width: 300 }} />
          <Title level={2} className="text-4xl font-bold mb-4">
            Welcome to Digital Loan
          </Title>
          <div className='text-center w-1/2'>
            <Text type="secondary" className="text-lg mb-4 text-center">
              Digital Loan allows banks to manage customer accounts, process transactions, and monitor activity through a secure digital dashboard, improving efficiency and customer experience.
            </Text>
          </div>
          <Button type="primary" size="large" className="mt-8 w-80" onClick={handleGetStarted}>
            LOGIN
          </Button>
        </div>
        <div className='w-full bg-gray-300 h-15'>
          <CFooter />
        </div>
      </Content>
    </div>
  );
};

export default Landing;