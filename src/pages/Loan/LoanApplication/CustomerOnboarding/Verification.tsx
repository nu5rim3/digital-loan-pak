import { Button, Card, Form, Tag } from 'antd'
import React from 'react'

const Verification: React.FC = () => {
    const onRefresh = () => {
        console.log("Refreshed")
    }

    return (
        <Card title={'Blacklist Verification'}>
            <Form>
                <div className="grid grid-cols-3 gap-3">
                    <Form.Item label="Name">
                        <b>Shabira</b>
                    </Form.Item>
                    <Form.Item label="CNIC">
                        <b>12103-24-424-424</b>
                    </Form.Item>
                    <Form.Item label="MSAS Status">
                        <Tag color="green">Verfied</Tag>
                        {/* <Tag color="red">Blacklisted</Tag> */}
                    </Form.Item>
                </div>
                <div>
                    <Button type="primary" onClick={onRefresh}>Refresh</Button>
                </div>
            </Form>
        </Card>
    )
}

export default Verification