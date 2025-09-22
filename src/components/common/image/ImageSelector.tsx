// src/components/ImageSelector.tsx
import { Button } from 'antd';
import React, {  ChangeEvent } from 'react';
import { PictureOutlined } from '@ant-design/icons'

interface IImageSelector {
    onCapture: Function;
    fileList:any
}

const ImageSelector: React.FC<IImageSelector> = ({ onCapture ,fileList}) => {

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
        const file = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            onCapture(reader.result, file); // Pass original file
        }
    }
};


    const handleButtonClick = () => {
        document.getElementById('fileInput')?.click();
    };

    return (
        <div>
            <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} className='hidden' />
            <Button disabled={fileList?.length >= 2} onClick={handleButtonClick} type='primary' icon={<PictureOutlined />} className='w-60'>Upload from Gallary</Button>
        </div>
    );
};

export default ImageSelector;
