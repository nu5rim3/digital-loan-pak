import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Typography, Card, Spin, message } from "antd";
// import { getSignature, getThumb } from "services/customer.service";
import AsyncImage from "../ImageDetails/AsyncImage";
import API from "../../../../services/APIServices";


const { Paragraph, Title } = Typography;

const UndertakingDetails: React.FC = () => {
  const { appraisalId } = useParams();
  const [signature, setSignature] = useState<any[]>([]);
  const [thumb, setThumb] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getCustomerAcknowledgement = () => (
    <Paragraph style={{ direction: "rtl", textAlign: "right" }}>
      میں ا قرار کر تا/کر تی ھوں کہ اوپر دی گئی تمام معلومات میری علم کے مطابق درست ہیں اور کوئی آمر پوشیدہ نہیں رکھا گیا اور دی گئی معلومات اگر غلط ثابت ہوں تو پاک عمان مائکرو فنانس بینک میری قرضے کی درخواست کو مسترد کر سکتا ہے ۔مزید یہ کہہ میں پاک عمان بینک کو یہ حق بھی دیتا/دیتی ہوں کہ وہ میری معلومات کا تبادلہ کسی بھی بینک/کریڈٹ بیورو/فنانشل انسٹیٹیوٹ یا کمپنی کے ساتھ کر سکتا ہے اور یہ حق بھی رکھتا ہے کہ ان معلومات کا تبادلہ اسٹیٹ بینک کے ECIB کے ساتھ بھی کر سکتا ہے
    </Paragraph>
  );

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
        if(!appraisalId) {
          message.error("Appraisal ID is missing");
          return;
        }
      try {
        const signatureResponse:any = await API.mobixCamsLoan.getSignature(appraisalId, "CUSTOMER1");
        const thumbResponse:any = await API.mobixCamsLoan.getThumb(appraisalId, "CUSTOMER1FINGER");
        if (isMounted) {
          setSignature(signatureResponse?.data);
          setThumb(thumbResponse?.data);
        }
      } catch (error) {
        message.error("Failed to fetch customer image data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [appraisalId]);



  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={<Title level={5}>Customer Acknowledgement</Title>}>
            {getCustomerAcknowledgement()}
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Title level={5}>Customer Thumbnail</Title>}>
            {thumb && thumb.length > 0 ? (
              thumb
                .filter((item) => item.status === "A")
                .map((sign, index) => <AsyncImage src={sign.hashIdentifier} key={index} />)
            ) : (
              <Paragraph type="secondary">No thumbnail available</Paragraph>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Title level={5}>Customer Signature</Title>}>
            {signature && signature.length > 0 ? (
              signature
                .filter((item) => item.status === "A")
                .map((sign, index) => <AsyncImage src={sign.hashIdentifier} key={index} />)
            ) : (
              <Paragraph type="secondary">No signature available</Paragraph>
            )}
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default UndertakingDetails;
