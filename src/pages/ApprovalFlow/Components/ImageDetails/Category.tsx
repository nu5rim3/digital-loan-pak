import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Divider } from "antd";
import AsyncImage from "./AsyncImage";
import GoogleVis from "../../../../components/common/GoogleMap/GoogleVis";

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



  return (
    <>
      {images.map((group, index) => (
        <div key={index} style={{ marginBottom: 32 }}>
          <Title level={5}>{removeUnderscore(group.imgMasterCategory)}</Title>
          <Divider style={{ margin: '12px 0' }} />
       <Row gutter={[16, 16]}>
  {group.images.map((img: any, idx) => (
    <Col xs={24} sm={12} md={8} lg={6} key={idx}>
      <div
        style={{
          border: "1px solid #eaeaea",
          borderRadius: "8px",
          padding: "10px",
          backgroundColor: "#fff",
        }}
      >
        {/* Image Display */}
        <div style={{ marginBottom: "12px", textAlign: "center" }}>
          <AsyncImage
            src={img.hashIdentifier}
            category={removeUnderscore(img.imgSubCategory)}
            // style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
          />
        </div>

        {/* Google Map Display */}
        {img?.latitude && img?.longitude && (
          <div
            style={{
              width: "100%",
              height: "250px",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <GoogleVis locations={[img]} />
          </div>
        )}
      </div>
    </Col>
  ))}
</Row>
        </div>
      ))}
    </>
  );
};

export default Category;
