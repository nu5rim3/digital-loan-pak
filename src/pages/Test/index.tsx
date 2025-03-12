import React from 'react';
import CButton from '../../components/Button';

const TestPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <CButton onClick={() => console.log('hello')} text='hello' />
        </div>
    );
};

export default TestPage;