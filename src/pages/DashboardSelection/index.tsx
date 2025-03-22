import { useContext, useState } from "react";
import { Card, Spin } from "antd";
import Logo1 from '../../assets/full_logo_black.png'
import LOLC_ISLAMIC from "../../assets/LOLC_ISLAMIC.png";
import LOLC_CONVENTIONAL from "../../assets/LOLC_CONVENTIONAL.png";
import { Content } from "antd/es/layout/layout";
import CFooter from "../../components/layouts/footer/CFooter";
import { useNavigate } from "react-router-dom";
import { mainURL } from "../../App";
import { IAuthContext, AuthContext } from "react-oauth2-code-pkce";

const dashboards = [
    {
        id: "islamic",
        name: "Islamic Business Unit",
        image: LOLC_ISLAMIC,
    },
    {
        id: "conventional",
        name: "Conventional Business Unit",
        image: LOLC_CONVENTIONAL,
    },
];

export default function DashboardSelection() {
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(false);
    const { logOut } = useContext<IAuthContext>(AuthContext);



    const navigate = useNavigate();

    const handleSelect = (id: string) => {
        setSelected(id);
        setLoading(true);
        setTimeout(() => {
            setLoading(false)
            if (id === 'islamic') {
                navigate(`${mainURL}/select-user`);
            } else if (id === 'conventional') {
                // navigate(`${mainURL}/select-user`);
                logOut();
            }
        }, 1500); // Simulating async operation
    };

    return (
        <div className="bg-[url('/img/bg.svg')] h-screen">
            <Content className='flex flex-col justify-between h-screen'>
                <div className='flex justify-center '>
                    <img src={Logo1} alt='digital-loan' style={{ width: 500 }} />
                </div>
                <div className='h-full flex flex-col justify-center items-center'>
                    <div className='flex gap-4'>
                        {dashboards.map((dashboard) => (
                            <Card
                                key={dashboard.id}
                                hoverable
                                cover={
                                    <div className="relative h-32 flex justify-center items-center">
                                        <img alt={dashboard.name} src={dashboard.image} className="w-full h-full object-cover" />
                                        {loading && selected === dashboard.id && (
                                            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50">
                                                <Spin size="large" />
                                            </div>
                                        )}
                                    </div>
                                }
                                onClick={() => handleSelect(dashboard.id)}
                                className={selected === dashboard.id ? 'border-4 border-blue-500' : ''}
                            >
                                <Card.Meta title={dashboard.name} className="text-center" />
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
}