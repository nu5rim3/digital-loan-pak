import { Layout } from 'antd';
import React from 'react'
import pkJson from '../../../../package.json';
const { Footer } = Layout;
const CFooter: React.FC = () => {
  return (
    <Footer className='bg-gray-200 py-3'>
      <div className='flex flex-row justify-between'>
        {/* <div></div> */}
        <div>{new Date().getFullYear()} © Powered By LOLC Technologies Ltd</div>
        <div>version  {pkJson.version}</div>
      </div>
    </Footer>
  )
}

export default CFooter