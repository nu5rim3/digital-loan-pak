import React, { useEffect, useState } from "react";
import { Image, Button, Typography, Spin } from "antd";
import API from "../../../../services/APIServices";
const { Paragraph } = Typography;

interface AsyncImageProps {
  src: string;
  category?: string;
  className?: string;
}

const AsyncImage: React.FC<AsyncImageProps> = ({ src, category, className }) => {
  const [data, setData] = useState<string | null>(null);
  const [type, setType] = useState<'pdf' | 'image' | null>(null);
  const [loading, setLoading] = useState(true);

  const getImage = async () => {
    try{
        const response = await API.mobixCamsLoan.viewImageOrPDF(src)
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = URL.createObjectURL(blob);
        setData(url);
        setType(response.headers['content-type'] === "application/pdf" ? 'pdf' : 'image');
    }catch(err){
        console.log("err",err)
    }finally {
        setLoading(false);
    }
  }


  useEffect(() => {
    if(src) getImage()
  }, [src]);



  if (loading) return <Spin />;

  if (type === 'pdf' && data) {
    return (
      <div className={className}>
        <Button type="link" onClick={() => window.open(data, '_blank')} icon={<i className="far fa-file-pdf" />}>
          Open PDF
        </Button>
        <Paragraph>{category}</Paragraph>
      </div>
    );
  }

  if (data) {
    return (
      <div>
        <Image
          width={200}
          height={200}
          src={data}
          style={{ objectFit: "cover" }}
          alt="Image"
          className='max-w-full max-h-full'
          preview={true}
        />
        <Paragraph>{category}</Paragraph>
      </div>
    );
  }

  return null;
};

export default AsyncImage;
