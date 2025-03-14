import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Logo1 from '../../assets/LOGO_BLACK.svg'
// import { useAuthContext } from "@asgardeo/auth-react";

const { Title } = Typography;
const { Content } = Layout;
import { useNavigate } from 'react-router-dom';
import CFooter from '../../components/layouts/footer/CFooter';
import { mainURL } from '../../App';


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    // const { state, signIn, signOut } = useAuthContext();

    const onFinish = () => {
        // signIn();
        navigate(`${mainURL}/select-user`)
    };

    return (
        <div className="bg-[url('/img/bg.svg')] h-screen">
            <Content className='flex flex-col justify-between h-screen'>
                <div className='h-full flex justify-center items-center'>
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <div className='flex justify-center'>
                            <img src={Logo1} alt='digital-loan' style={{ width: 250 }} />
                        </div>
                        <Title level={2} className="text-center mb-6">Login</Title>
                        <Form
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your Username!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    placeholder="Username"
                                    className="rounded-md"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    placeholder="Password"
                                    className="rounded-md"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <a className="float-right" href="">
                                    Forgot password
                                </a>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full rounded-md">
                                    Log in
                                </Button>
                                Or <a href="">register now!</a>
                            </Form.Item>
                        </Form>
                    </div>
                </div>

                <div className='w-full bg-gray-300 h-15'>
                    <CFooter />
                </div>
            </Content>
        </div>
    );
};

export default LoginPage;