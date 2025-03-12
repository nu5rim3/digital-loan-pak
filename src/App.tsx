import { ConfigProvider, Space } from 'antd';
import React from 'react';
// import CButton from '@/components/Button';
import TestPage from './pages/Test';

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      token: {
        // Seed Token
        // colorPrimary: '#87282b',
        borderRadius: 5,

        // Alias Token
        colorBgContainer: '#f6ffed',
      },
    }}
  >
    <Space>
      <TestPage />
    </Space>
  </ConfigProvider>
);

export default App;