import {
  Divider,
  Form,
  Table,
  Tag,
  notification,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
// import ButtonContainer from '../../../../components/Buttons/Button';
// import Title from '../../../../components/Typography/Tytle';
// import { useSelector } from 'react-redux';
import { ColumnsType } from "antd/es/table";
// import { API } from '../../../../services/Services';
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Button } from "antd/lib";
import API from "../../../../services/APIServices";
import useUserStore from "../../../../store/userStore";
import { mainURL } from "../../../../App";
// import { genarateStepAction, genarateStepStatus } from '../../../../utils/setpsGenaration';
// import fileToBase64Async from '../../../../utils/fileToBase64Async';

export interface IApprovalProps {
  fileList: any;  
  tcDetails:any
    tcAmount:any
}

export default function Approval({  tcDetails, tcAmount }: IApprovalProps) {
  // approvalSteps

  // const {
  //   imageDetails,
  //   customerData,
  //   approvalSteps,
  //   financialDetailsSavePending,
  //   financialDetails,
  // } = fileList
  // useSelector((state: any) => state.Application)
  // const {
  //   selectedRole,
  //   userData
  // } = fileList
  // useSelector((state: any) => state.AppData)

  // const [roleWiseApproval, setRoleWiseApproval] = useState<any[]>([]);
  // const [isSecondMeeting, setIsSecondMeeting] = useState<boolean>(false);
  // const [reasons, setReasons] = useState<any[]>([]);
  // const [cycleNo, setCycleNo] = useState("");
  // const [isRequired, setIsRequired] = useState(false);
  // const [isCAImage, setCAImage] = useState(false);
  // const [isBMImage, setBMImage] = useState(false);

  const [flowHistory, setFlowHistory] = useState<any>({});

  const { appraisalId, flow } = useParams<{
    appraisalId: string;
    flow: string;
  }>();
  const { currentRole } = useUserStore();

  const { Title } = Typography;
  // useEffect(() => {
  //   if (selectedRole) {
  //     if (selectedRole === 'CSA') {
  //       return setRoleWiseApproval(['Return', 'Verified'])
  //     }
  //     if (selectedRole === 'CA') {
  //       return setRoleWiseApproval(['Return', 'Not Recommended', 'Recommended']) // DIRECT TO NEXT
  //     }
  //     if (selectedRole === 'BM' && isSecondMeeting) {
  //       return setRoleWiseApproval(['Reject', 'Approve'])
  //     }
  //     if (selectedRole === 'BM') {
  //       return setRoleWiseApproval(['Return', 'Reject', 'Approve'])
  //     }
  //     if (selectedRole === 'AM'
  //       || selectedRole === 'RM'
  //       || selectedRole === 'DIR'
  //       || selectedRole === 'BOD1'
  //       || selectedRole === 'BOD2'
  //       || selectedRole === 'BOD3'
  //     ) {
  //       return setRoleWiseApproval(['Reject', 'Approve'])
  //     }
  //     if (selectedRole === 'ADMIN') {
  //       return setRoleWiseApproval([])
  //     } else {
  //       return setRoleWiseApproval([])
  //     }
  //   }
  // }, [selectedRole, isSecondMeeting])

  // const [addingData, setAddingData] = useState("");
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const columns: ColumnsType<any> = [
    {
      title: "Status",
      dataIndex: "stepStatus",
      key: "stepStatus",
      render: (_, { stepStatus }) =>
        stepStatus === "PENDING" ||
        stepStatus === "RETURNED" ||
        stepStatus === "SECOND MEETING - PENDING" ? (
          <Tag color="yellow" key={stepStatus}>
            {stepStatus}
          </Tag>
        ) : (
          <Tag color="green" key={stepStatus}>
            {stepStatus}
          </Tag>
        ),
    },
    {
      title: "Role",
      dataIndex: "roleDescription",
      key: "roleDescription",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    //   render: ( text,  record) => {
    //     console.log(text);
    //     if (record?.reason != null) {
    //       return (
    //         <Space
    //           direction="vertical"
    //           size="middle"
    //           style={{ display: "flex" }}
    //         >
    //           <p> {record?.reasonDesc ? record?.reasonDesc : ""} </p>
    //           <p> {record?.comment} </p>
    //         </Space>
    //       );
    //     } else if (record?.comment === null) {
    //       return ``;
    //     } else {
    //       return `${record?.comment} `;
    //     }
    //   },
    },
    {
      title: "created By",
      dataIndex: "lastModifiedBy",
      key: "lastModifiedBy",
    },
    {
      title: "lastModifiedDate",
      key: "lastModifiedDate",
      dataIndex: "lastModifiedDate",
      render: (_, { lastModifiedDate }) =>
        moment(lastModifiedDate).format("YYYY-MM-DD - hh:mm:ss A"),
    },
  ];

  const handleSubmit = (type: string) => {
    // if (financialDetailsSavePending) {
    //   return notification.warning({
    //     message: 'Please save the updated Financial Approval to continue.'
    //   })
    // }

    // if ((selectedRole == 'BM' && isBMImage == false) && !fileList.length
    //   && (type === 'Recommended'
    //     || type === 'Approve' || type === 'Return' || type === 'Not Recommended')) {
    //   return notification.warning({
    //     message: 'Please Upload Image to continue'
    //   })
    // }

    // if (type === 'Not Recommended') {
    //   setIsRequired(true);
    // } else {
    //   setIsRequired(false);
    // }
    form.validateFields(["comment"]).then(async () => {
      try {
        // setAddingData(type);
        let data;

          data = {
            appraisalIdx: appraisalId,
            // secondMeetingStepAction: genarateStepStatus(type, selectedRole),
            // secondMeetingStepStatus: genarateStepAction(type, selectedRole, isSecondMeeting),
            stepAction: type,
            stepStatus: type,
            reSubmit: "N",
            // appraisalType:
            //   approvalSteps?.data?.approvalStepDtoList?.[
            //     approvalSteps?.data?.approvalStepDtoList?.length - 1
            //   ]?.appraisalType,
            loanProduct: tcDetails?.pTrhdLType,
            loanAmount: tcAmount?.object?.loanAmount,
            loanTerm: tcDetails?.pTrhdTerm,
            roleCode: currentRole?.code,
            loanType: tcDetails.pFacilityType,
            flowNo: flow === "firstFlow"? 1 : 2,
            // loanRate: financialDetails?.data?.pTrhdTr,
            comment: form.getFieldValue("comment"),
            // reason: form.getFieldValue('reason') ? form.getFieldValue('reason').value : "",
            // reasonDesc: form.getFieldValue('reason') ? form.getFieldValue('reason').label : "",
          };

        // const processedFiles = [];
        // if (
        //   selectedRole === "CA" ||
        //   selectedRole === "BM" ||
        //   selectedRole === "CSA" ||
        //   selectedRole === "AM" ||
        //   selectedRole === "RM" ||
        //   selectedRole === "DIR" ||
        //   selectedRole === "BOD1" ||
        //   selectedRole === "BOD2" ||
        //   selectedRole === "BOD3"
        // ) {
        //   for (const file of fileList) {
        //     // let base64
        //     // = file.preview
        //     // if(!base64){
        //     // const base64 = await fileToBase64Async(file.originFileObj);
        //     // }

        //     const processedFile = {
        //       stkIdx: customerData.data.cusIdx,
        //       cltIdx: customerData.data.cltIdx,
        //       centerIdx: customerData.data.centerIdx,
        //       appraisalIdx: customerData.data.appraisalId,
        //       imgMasterCategory: "APPROVAL_FLOW",
        //       imgSubCategory: selectedRole === "CA" ? "CA_LEVEL" : "BM_LEVEL",
        //       imgOriginalName: file.name,
        //       imgContentType: file.type,
        //       // image: base64,
        //     };

        //     processedFiles.push(processedFile);
        //   }
        // }
        const newData = {
          ...data,
          // documents: processedFiles,
        };

        if (flow === "firstFlow") {
           await API.mobixCamsApproval.approvalFirstFlow(newData)
        } else {
          await API.mobixCamsApproval.approvalSecondFlow(newData)
        }

        notification.success({
          message: "Application Updated Successfully.",
        });
        if (flow === "firstFlow") {
          return navigate( `${mainURL}/approval/list/firstFlow`);
        } else {
           return navigate( `${mainURL}/approval/list/secondFlow`);
        }
      } catch (err) {
        // console.log('[ERROR] - ', err)
        notification.error({
          message: "Application update failed",
        });
      } finally {
        // setAddingData("");
      }
    });
  };

  // useEffect(() => {
  //   const BMStatus = approvalSteps.data?.secondMeetingApprovalStepDtoList?.
  //     find((row: any) => row.secondMeetingCurrentRole == "BM")?.secondMeetingStepStatus

  //   const cycleNo = approvalSteps.data?.approvalStepDtoList[0]?.cycleNo;
  //   setCycleNo(cycleNo);
  //   const caImage = imageDetails.data?.filter((image: any) => image.imgSubCategory === 'CA_LEVEL')?.length;
  //   // console.log("caImage " + caImage)
  //   const bmImage = imageDetails.data?.filter((image: any) => image.imgSubCategory === 'BM_LEVEL')?.length;
  //   // console.log("imageDetails ", imageDetails)

  //   if (caImage > 0) {
  //     setCAImage(true);
  //   }
  //   if (bmImage > 0) {
  //     setBMImage(true);
  //   }

  //   if (BMStatus === 'PENDING') {
  //     setIsSecondMeeting(true)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [approvalSteps?.data?.secondMeetingApprovalStepDtoList])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // const allReasons = await API.reasonServices.getAllReasons();
  //     // setReasons(allReasons.data);
  //   };

  //   fetchData();

  // }, [approvalSteps.data?.approvalStepDtoList, selectedRole])

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const flowHistory = await API.mobixCamsApproval.getApprovalCombinedSteps(
        appraisalId!
      );
      console.log("xx", flowHistory);
      setFlowHistory(flowHistory.data);
      // setReasons(allReasons.data);
      // setIsRequired(false);
    } catch (e) {
      console.error("Error fetching approval flow history:", e);
      notification.error({
        message: "Failed to load approval flow history",
      });
    }
  };

  return (
    <div>
      {flowHistory?.ibuWf1ApprovalSteps?.find(
        (row: any) => row?.stepAction === "PENDING"
      )?.roleCode === currentRole?.code ||
      flowHistory?.ibuWf2ApprovalSteps?.find(
        (row: any) => row?.stepAction === "PENDING"
      )?.roleCode === currentRole?.code ? (
        <>
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 26 }}
            layout="vertical"
            // disabled={componentDisabled}
            // style={{ maxWidth: 600 }}
          >
            {/* {
                roleWiseApproval?.length && reasons.length > 0 && (selectedRole === 'ADMIN' || selectedRole === 'CA') ?
                  <Form.Item

                    name="reason"
                    label="Reason"
                    rules={[
                      {
                        required: isRequired,
                      },
                    ]}
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    <Select
                      showSearch
                      labelInValue
                    >
                      {
                        reasons?.map((option: any, index) => (

                          < Select.Option
                            value={option.code}
                            key={index.toString()}
                          >
                            {option.description}
                          </Select.Option>

                        ))
                      }
                    </Select>
                  </Form.Item>
                  : null} */}
            {/* {
                roleWiseApproval.length ? */}
            <Form.Item
              label="Comment"
              name="comment"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea rows={4} placeholder="Add Comment here" />
            </Form.Item>
            {/* : null} */}
            <div className="flex justify-center">
              {/* {roleWiseApproval.map((type: any) => {
                  return (
                    <Button
                      type='primary'
                      // label={type}
                      loading={addingData === type ? true : false}
                      disabled={
                        addingData ? true
                          : false
                      }
                      size='large'
                      // onClick={() => handleSubmit(type)}
                      className='mr-1 '
                      shape='round'
                    />
                  )
                })} */}
              <Button
                type="primary"
                // disabled={
                //   addingData ? true
                //     : false
                // }
                size="large"
                onClick={() => handleSubmit("REJECTED")}
                className="mr-1 "
                shape="round"
              >
                Reject
              </Button>
              <Button
                type="primary"
                // disabled={
                //   addingData ? true
                //     : false
                // }
                size="large"
                onClick={() => handleSubmit("RETURNED")}
                className="mr-1 "
                shape="round"
              >
                Return
              </Button>
              <Button
                type="primary"
                // label={type}
                // loading={addingData === type ? true : false}
                // disabled={
                //   addingData ? true
                //     : false
                // }
                size="large"
                onClick={() => handleSubmit("PROCEED")}
                className="mr-1 "
                shape="round"
              >
                Approve
              </Button>
            </div>
          </Form>
          <Divider />
        </>
      ) : null}
      {flowHistory?.ibuWf1ApprovalSteps?.length > 0 && (
        <div className="mt-5">
          <Title level={5}>Application First Flow History</Title>
          <div className="overflow-x-auto">
            <Table
              className="w-4/4"
              showHeader={false}
              bordered={false}
              columns={columns}
              pagination={false}
              dataSource={flowHistory?.ibuWf1ApprovalSteps}
              // dataSource={
              //   approvalSteps?.data?.approvalStepDtoList
              //     ? [
              //       ...approvalSteps.data?.secondMeetingApprovalStepDtoList?.
              //         filter((row: any) => row.secondMeetingCurrentRole == "BM")?.
              //         map((row: any) => ({
              //           ...row,
              //           stepStatus: `SECOND MEETING - ${row.secondMeetingStepStatus} `,
              //           roleDescription: row.secondMeetingCurrentRoleDesc
              //         })),
              //       ...approvalSteps?.data?.approvalStepDtoList,
              //     ]
              //     : []}
            />
          </div>
        </div>
      )}

      {flowHistory?.ibuWf2ApprovalSteps?.length > 0 && (
        <div className="mt-5">
          <Title level={5}>Application Second Flow History</Title>
          <div className="overflow-x-auto">
            <Table
              className="w-4/4"
              showHeader={false}
              bordered={false}
              columns={columns}
              pagination={false}
              dataSource={flowHistory?.ibuWf2ApprovalSteps}
              // dataSource={
              //   approvalSteps?.data?.approvalStepDtoList
              //     ? [
              //       ...approvalSteps.data?.secondMeetingApprovalStepDtoList?.
              //         filter((row: any) => row.secondMeetingCurrentRole == "BM")?.
              //         map((row: any) => ({
              //           ...row,
              //           stepStatus: `SECOND MEETING - ${row.secondMeetingStepStatus} `,
              //           roleDescription: row.secondMeetingCurrentRoleDesc
              //         })),
              //       ...approvalSteps?.data?.approvalStepDtoList,
              //     ]
              //     : []}
            />
          </div>
        </div>
      )}
    </div>
  );
}
