import { Card, Form } from 'antd'
import React from 'react'

const CRIBDetails: React.FC = () => {
    return (
        <Card title={'Internal CRIB Details'}>
            <Form>
                <div className="grid grid-cols-3 gap-3">
                    <Form.Item label="Previous Loans">
                        <b>1</b>
                    </Form.Item>
                    <Form.Item label="Active Loans">
                        <b>2</b>
                    </Form.Item>
                    <Form.Item label="Active Loans Amount">
                        <b>200,000,000.00</b>
                    </Form.Item>
                    <Form.Item label="Active Outstanding">
                        <b>200,000,000.00</b>
                    </Form.Item>
                    <Form.Item label="Overdue">
                        <b>200,000,000.00</b>
                    </Form.Item>
                    <Form.Item label="Active Installment Value">
                        <b>200,000,000.00</b>
                    </Form.Item>
                </div>
            </Form>
        </Card>
    )
}

export default CRIBDetails