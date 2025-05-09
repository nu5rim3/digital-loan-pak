import React, { useContext } from 'react';
import { Button, Card, Layout } from 'antd';
import Logo1 from '../../assets/full_logo_black.png'
import Logo from '../../assets/LOLC_CONVENTIONAL.png'
import CFooter from '../../components/layouts/footer/CFooter';
import { IAuthContext, AuthContext } from 'react-oauth2-code-pkce';

const { Content } = Layout;
const Landing: React.FC = () => {

  const { logIn } = useContext<IAuthContext>(AuthContext);

  const handleGetStarted = () => {
    logIn();
  }

  return (
    <div className="h-screen">
      <Content className='flex flex-col h-screen'>
        <div className='flex justify-center '>
          <img src={Logo1} alt='digital-loan' style={{ width: 500 }} />
        </div>
        <div className='h-full flex flex-col justify-center items-center'>
          <img src={Logo} alt='digital-loan' style={{ width: 300 }} className='mb-5' />
          <div className='flex flex-row gap-10'>
            <Card style={{ width: 400 }}>
              <h1 className='text-2xl text-center text-blue-950'>
                Conventional Unit
              </h1>
              <p className='text-lg text-center'>
                Conventional individual loan appraisals initiated by the Credit Relationship Officer through the Digital Loan mobile app will be seamlessly captured and stored in this system in real time, ensuring a streamlined and efficient approval process.
              </p>
            </Card>
            <Card style={{ width: 400 }}>
              <h1 className='text-2xl text-center text-blue-950'>
                Islamic Buisness Unit
              </h1>
              <p className='text-lg text-center'>
                Islamic Business individual loan appraisals initiated by the Credit Relationship Officer through the Digital Loan mobile app will be seamlessly captured and stored in this system in real time, ensuring a streamlined and efficient approval process.
              </p>
            </Card>
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