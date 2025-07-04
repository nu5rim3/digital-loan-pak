import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Divider } from "antd";
import AsyncImage from "./AsyncImage";

const { Title } = Typography;

interface ImageGroup {
  imgMasterCategory: string;
  images: {
    imgSubCategory: string;
    hashIdentifier: string;
  }[];
}

const Category: React.FC<{ groups: ImageGroup[] }> = ({ groups }) => {
  const [images, setImages] = useState<ImageGroup[]>([]);

  useEffect(() => {
    setImages(groups);
  }, [groups]);

  const removeUnderscore = (str: string) => str.replace(/_/g, " ");

  console.log('images', images);

  return (
    <>
      {images.map((group, index) => (
        <div key={index} style={{ marginBottom: 32 }}>
          <Title level={5}>{removeUnderscore(group.imgMasterCategory)}</Title>
          <Divider style={{ margin: '12px 0' }} />
          <Row gutter={[16, 16]}>
            {group.images.map((img, idx) => (
              <Col xs={24} sm={12} md={8} lg={6} key={idx}>
                <AsyncImage src={img.hashIdentifier} category={removeUnderscore(img.imgSubCategory)} />
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </>
  );
};

export default Category;
