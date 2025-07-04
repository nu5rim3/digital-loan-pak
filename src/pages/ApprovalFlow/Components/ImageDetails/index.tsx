import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Button, Typography, message } from "antd";
import API from "../../../../services/APIServices";
import Category from "./Category";

const { Title } = Typography;

const ImageDetails: React.FC = () => {
  const { appraisalId } = useParams<{ appraisalId: string }>();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (appraisalId) {
        try {
          setLoading(true);
          const images:any = await API.mobixCamsLoan.getAllImages(appraisalId);
          const result = [...images?.data?.reduce((r:any, { imgMasterCategory, imgSubCategory, hashIdentifier }:any) => {
            if (!r.has(imgMasterCategory)) {
              r.set(imgMasterCategory, {
                imgMasterCategory,
                images: []
              });
            }
            r.get(imgMasterCategory).images?.push({ imgSubCategory, hashIdentifier });
            return r;
          }, new Map).values()];

          setGroups(result);
        } catch (error) {
          message.error("Failed to fetch image details");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [ appraisalId]);

  const handleExportPdf = async () => {
    try {
      const response = await API.mobixCamsLoan.exportAsPdf(appraisalId!);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${appraisalId}.pdf`;
      link.click();
    } catch (error) {
      message.error("Failed to export PDF");
    }
  };

  return (
    <Card title={<Title level={4}>Image Details</Title>} extra={<Button type="primary" onClick={handleExportPdf}>Export as PDF</Button>}>
      <Spin spinning={loading} tip="Loading Images...">
        <Category groups={groups} />
      </Spin>
    </Card>
  );
};

export default ImageDetails;
