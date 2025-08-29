import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Collapse,
  Descriptions,
  Typography,
  Table,
  Button,
  Spin,
  message,
} from "antd";
// import {
//   getMasterData,
//   masterInformation,
//   contactInformation,
//   residentialInformation,
// } from "services/witness.service";
import { getValueAddressType } from "../../../../utils/Common";
import { APIAuth } from "../../../../services/api";


const { Panel } = Collapse;
const { Title } = Typography;

const renderDesc = (label: string, value: any) => (
  <Descriptions.Item label={label}>{value || "\u00A0"}</Descriptions.Item>
);

interface GuarantorDetailsProps {
  stakeholders: any;
}

const WitnessDetails: React.FC<GuarantorDetailsProps> = ({ stakeholders }) => {
  const { appraisalId } = useParams();
  const [loading, setLoading] = useState(true);
  const [witnesses, setWitnesses] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>();
  const [details, setDetails] = useState<any>({
    master: null,
    contacts: [],
    address: null,
  });

  useEffect(() => {
    const fetchData = async () => {
    //   if (active === "5") {
        try {
        //   const master = await getMasterData(appraisalId);
        //   setWitnesses(master.filter((item: any) => item.stkType === "W"));
          // const master:any = await APIAuth.get(`/mobixCamsClientele/v1/clienteles/stakeholder/${appraisalId}/appraisal`);
          setWitnesses(stakeholders?.filter((item: any) => item.stkType === "W"));
        } catch (err) {
          message.error("Failed to fetch witness list");
        } finally {
          setLoading(false);
        }
    //   }
    };
    fetchData();
  }, [appraisalId]);

  const loadWitnessDetails = async (witness: any) => {
    setLoading(true);
    try {
      const [master, contacts, addresses]: any = await Promise.allSettled([
        // masterInformation(witness.idx),
        // contactInformation(witness.idx),
        // residentialInformation(witness.idx),
        APIAuth.get(`/mobixCamsClientele/v1/clienteles/stakeholder/${witness.idx}`),
        APIAuth.get(`/mobixCamsClientele/v1/clienteles/contacts/${witness.idx}`),
        APIAuth.get(`/mobixCamsClientele/v1/clienteles/residence/${witness.idx}`)
      ]);

      setDetails({
        master: master.status === "fulfilled" ? master.value?.data : null,
        contacts: contacts.status === "fulfilled" ? contacts.value?.data : [],
        address:
          addresses.status === "fulfilled" && addresses.value?.data?.length > 0
            ? addresses.value.data[0]
            : null,
      });
    } catch (err) {
      message.error("Failed to load witness details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAreaByCode = async (provinceCode:string) => {
        setLoading(true);
      try {
        const response:any = await APIAuth.get(`/mobixCamsCommon/v1/cities/areas/${provinceCode}`);
        if(response?.data){
            setSelectedArea(response?.data?.description);
        }
        
      } catch (error) {
        console.error("Failed to fetch area code", error);
         setLoading(false);
      } finally {
        setLoading(false);
      }
    };
      if(details.address?.province){
          fetchAreaByCode(details.address?.province);
      }
   
  }, [details?.address?.province]);

  return (
    <Card>
      <Spin spinning={loading} fullscreen={false}>
        <Title level={4}>Witness List</Title>
        <Table
          dataSource={witnesses}
          rowKey={(record) => record.idx}
          pagination={false}
          columns={[
            {
              title: "Name",
              dataIndex: "stkCusName",
              key: "stkCusName",
            },
            {
              title: "CNIC",
              dataIndex: "stkCNic",
              key: "stkCNic",
            },
            {
              title: "Action",
              key: "action",
              render: (_, record) => (
                <Button type="primary" onClick={() => loadWitnessDetails(record)}>
                  Load
                </Button>
              ),
            },
          ]}
        />

        {details.master && (
          <Collapse defaultActiveKey={["1"]} className="mt-4">
            <Panel header="Witness Personal Information" key="1">
              <Descriptions bordered column={2} size="small">
                {renderDesc("CNIC", details.master?.stkCNic)}
                {renderDesc("Full Name", details.master?.stkCusName)}
                {renderDesc("Father/Husband Name", details.master?.stkFatherOrHusName)}
                {renderDesc("Address Type", getValueAddressType(details.address?.addressType))}
                {renderDesc("Address Line 1", details.address?.addressLine1)}
                {renderDesc("Address Line 2", details.address?.addressLine2)}
                {renderDesc("Address Line 3", details.address?.addressLine3)}
                {renderDesc("Address Line 4", details.address?.addressLine4)}
                {renderDesc("Area", selectedArea)}
                {renderDesc("City", details.address?.city)}
                {renderDesc("District", details.address?.district)}
                {renderDesc("Province", details.address?.province)}
              </Descriptions>
            </Panel>
          </Collapse>
        )}
      </Spin>
    </Card>
  );
};

export default WitnessDetails;
