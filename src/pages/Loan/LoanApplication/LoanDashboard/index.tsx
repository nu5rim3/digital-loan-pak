import { Button, Card, Tag } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const appID = 'APP0935093095'


const statuses = [
    { label: "Customer", color: "green", path: 'customer', status: 'Verified' },
    { label: "Guarantor", color: "red", path: 'guarantor', status: 'Pending' },
    { label: "Witness", color: "yellow", path: 'witness', status: 'Failed' },
];

const LoanDaashboard: React.FC = () => {

    const navigate = useNavigate();



    return (
        <>
            <Card title={`Loan Application - ${appID}`}>
                <div className="grid grid-cols-3 gap-3">
                    {statuses.map((status, index) => (
                        <Card
                            key={index}
                            className="relative flex justify-center items-center p-6 hover:shadow-xl cursor-pointer"
                            onClick={() => navigate(`${status.path}`)}
                        >
                            {/* <span className={`absolute top-3 right-3 w-5 h-5 rounded-full ${status.color}`} /> */}
                            <Tag color={`${status.color}`} className="absolute w-5 right-3 top-3 left-3">Verfied</Tag>

                            <p className="font-semibold text-xl">{status.label}</p>
                        </Card>
                    ))}
                </div>

            </Card>

            <div className="fixed bottom-16 flex">
                {/* Your additional content goes here */}
                <Button type="default" onClick={() => navigate(-1)}>Back</Button>
                <Button type="primary" className="ml-3">Ready to Apply</Button>
            </div>
        </>
    );
}

export default LoanDaashboard