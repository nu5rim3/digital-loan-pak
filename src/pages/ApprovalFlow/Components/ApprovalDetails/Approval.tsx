import {
  Divider,
  Form,
  Table,
  Tag,
  notification,
  Typography,
  Tabs,
  Input,
  Row,
  Col,
  Space,
  Collapse,
  Modal,
} from "antd";
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
import {
  CheckSquareOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getObExceptionals } from "../../../../utils/Common";

// import { genarateStepAction, genarateStepStatus } from '../../../../utils/setpsGenaration';
// import fileToBase64Async from '../../../../utils/fileToBase64Async';

export interface IApprovalProps {
  fileList: any;
  tcDetails: any;
  tcAmount: any;
  isGoldProduct: boolean;
}

export default function Approval({
  tcDetails,
  tcAmount,
  isGoldProduct,
}: IApprovalProps) {
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
  const { Panel } = Collapse;
  const [flowHistory, setFlowHistory] = useState<any>({});

  const { appraisalId, flow } = useParams<{
    appraisalId: string;
    flow: string;
  }>();
  const { user, currentRole } = useUserStore();
  const [exceptionalApprovals, setExceptionalApprovals] = useState<any>([]);
  const [originationApproval, setOriginationApproval] = useState<any>([]);
  const [findUser, setFindUser] = useState<any>(null);
  const [isLoadingOb, setIsLoadingOb] = useState(false);
  const [obComments, setObComments] = useState<Record<string, string>>({});
  const [caComments, setCaComments] = useState<Record<string, string>>({});

  const { Title, Text } = Typography;
  const { TabPane } = Tabs;
  const { TextArea } = Input;
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

  const [addingData, setAddingData] = useState("");
  const [verticalObActiveTab, setVerticalObActiveTab] = useState(0);
  const [verticalCaActiveTab, setVerticalCaActiveTab] = useState(0);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const columns: ColumnsType<any> = [
    {
      title: "Status",
      dataIndex: "stepStatus",
      key: "stepStatus",
      render: (_, { stepStatus }) =>
        stepStatus === "REJECTED" ? (
          <Tag color="red" key={stepStatus}>
            {stepStatus}
          </Tag>
        ) : stepStatus === "PENDING" ||
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
      render: (_, { roleDescription, stepStatus }) =>
        stepStatus === "PENDING" ? "" : roleDescription,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (_, { comment, stepStatus }) =>
        stepStatus === "PENDING" ? "" : comment,
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
       render: (_, { lastModifiedBy, stepStatus }) =>
        stepStatus === "PENDING" ? "" : lastModifiedBy,
    },
    {
      title: "lastModifiedDate",
      key: "lastModifiedDate",
      dataIndex: "lastModifiedDate",
      // render: (_, { lastModifiedDate }) =>
      //   moment(lastModifiedDate).format("YYYY-MM-DD - hh:mm:ss A"),
       render: (_, { lastModifiedDate, stepStatus }) =>
        stepStatus === "PENDING" ? "" : moment(lastModifiedDate).format("YYYY-MM-DD - hh:mm:ss A"),
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
    setIsLoadingOb(true);
    form.validateFields(["comment"]).then(async () => {
      try {
        setAddingData(type);
        let data;

        data = {
          appraisalIdx: appraisalId,
          // secondMeetingStepAction: genarateStepStatus(type, selectedRole),
          // secondMeetingStepStatus: genarateStepAction(type, selectedRole, isSecondMeeting),
          stepAction:
            (currentRole?.code === "CD" || currentRole?.code === "CAD") &&
            type == "PROCEED"
              ? "APPROVED"
              : type,
          stepStatus:
            (currentRole?.code === "CD" || currentRole?.code === "CAD") &&
            type == "PROCEED"
              ? "APPROVED"
              : type,
          reSubmit: "N",
          // appraisalType:
          //   approvalSteps?.data?.approvalStepDtoList?.[
          //     approvalSteps?.data?.approvalStepDtoList?.length - 1
          //   ]?.appraisalType,
          loanProduct: tcDetails?.pTrhdLType,
          loanAmount: tcAmount?.object?.loanAmount,
          loanTerm: tcDetails?.pTrhdTerm,
          roleCode: currentRole?.code, //CD
          loanType: isGoldProduct ? "GOLD" : "NORMAL",
          flowNo: flow === "firstFlow" ? 1 : 2,
          // loanRate: financialDetails?.data?.pTrhdTr,
          comment: form.getFieldValue("comment"),
          // reason: form.getFieldValue('reason') ? form.getFieldValue('reason').value : "",
          // reasonDesc: form.getFieldValue('reason') ? form.getFieldValue('reason').label : "",
          documents: [],
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
          await API.mobixCamsApproval.approvalFirstFlow(newData);
        } else {
          await API.mobixCamsApproval.approvalSecondFlow(newData);
        }

        notification.success({
          message: "Application Updated Successfully.",
        });
        if (flow === "firstFlow") {
          return navigate(`${mainURL}/approval/list/firstFlow`);
        } else {
          return navigate(`${mainURL}/approval/list/secondFlow`);
        }
      } catch (err) {
        // console.log('[ERROR] - ', err)
        notification.error({
          message: "Application update failed",
        });
      } finally {
        setAddingData("");
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
    console.log("xxx", user);
    try {
      if (!appraisalId || !user) return;

      let flowHistory: any = [];
      let exceptionalApprovals: any = [];
      let approvalOrigination: any = [];
      let userVerify: any = null;

      // Fetch flowHistory
      try {
        const result = await API.mobixCamsApproval.getApprovalCombinedSteps(
          appraisalId
        );
        flowHistory = result.data;
      } catch (err) {
        console.warn("Failed to fetch flow history", err);
      }

      // Fetch exceptionalApprovals
      try {
        exceptionalApprovals =
          await API.mobixCamsApproval.getAllExceptionalApprovals(appraisalId);
      } catch (err) {
        console.warn("Failed to fetch exceptional approvals", err);
      }

      // Fetch origination approval
      try {
        approvalOrigination =
          await API.mobixCamsApproval.getOriginationApproval(appraisalId);
      } catch (err) {
        console.warn("Failed to fetch origination approval", err);
      }

      // Verify user
      try {
        userVerify = await API.mobixCamsApproval.verifyApprovalUser(user?.idx);
      } catch (err) {
        console.warn("Failed to verify user", err);
      }

      // Set state safely even if some values are undefined or null
      setExceptionalApprovals(exceptionalApprovals?.data || []);
      setOriginationApproval(approvalOrigination || []);
      setFindUser(userVerify || null);
      setFlowHistory(flowHistory || []);
    } catch (e) {
      console.error("Unexpected error in fetchData:", e);
      notification.error({
        message: "Unexpected error occurred while fetching data",
      });
    }
  };

  //   const verifyActiveStepAndUser = () => {
  //   var result = false
  //   if (
  //     findUser !== null &&
  //     findUser !== undefined &&
  //     originationApproval?.approvalStepDto !== null &&
  //     originationApproval?.approvalStepDto !== undefined
  //   ) {
  //     result =
  //       findUser?.group?.code ===
  //         originationApproval?.approvalStepDto.workflowStep.name &&
  //       originationApproval?.approvalStepDto.stepAction === "P"
  //     return result
  //   }

  //   if (
  //     originationApproval?.approvalStepDto !== null &&
  //     originationApproval?.approvalStepDto !== undefined
  //   ) {
  //     var role = currentRole?.code
  //     result =
  //       role === originationApproval.approvalStepDto?.workflowStep.roleCode &&
  //       originationApproval.approvalStepDto?.stepAction === "P"
  //     return result
  //   }

  //   return result
  // }

  const verifyUserWithLevel = (level: string) => {
    if (level !== "" && level !== null) {
      var role = currentRole?.code;
      return role === level;
    }

    return false;
  };

  // Utility to show error if comment is empty
  const validateComment = (comment: string) => {
    if (!comment || comment.trim() === "") {
      notification.error({ message: "Comment is required" });
      return false;
    }
    return true;
  };

  // On-Boarding Exceptional Approve
  const submitObExceptionalApprove = async (index: number, item: any) => {
    const comment = obComments[index] || item.comments?.comment || "";
    if (!validateComment(comment)) return;

    setIsLoadingOb(true);
    try {
      const payload = {
        comment,
        appType: "OB",
        approvalIdx: item.idx,
        appraisalIdx: item.appraisalIdx,
        action: "A",
        clienteleIdx: item.clienteleIdx, // if relevant; original code had it
      };

      await API.mobixCamsApproval.createApprovalComment(payload);
      notification.success({ message: "On-boarding exceptional approved" });
      // refresh data
      await fetchData();
    } catch (err) {
      console.error("OB approve error", err);
      notification.error({
        message: "Failed to approve on-boarding exceptional",
      });
    } finally {
      setIsLoadingOb(false);
    }
  };

  // On-Boarding Exceptional Reject
  const submitObExceptionalReject = async (index: number, item: any) => {
    const comment = obComments[index] || item.comments?.comment || "";
    if (!validateComment(comment)) return;

    setIsLoadingOb(true);
    try {
      const payload = {
        comment,
        appType: "OB",
        approvalIdx: item.idx,
        appraisalIdx: item.appraisalIdx,
        action: "R",
        clienteleIdx: item.clienteleIdx,
      };

      await API.mobixCamsApproval.createApprovalComment(payload);
      notification.success({ message: "On-boarding exceptional rejected" });
      await fetchData();
    } catch (err) {
      console.error("OB reject error", err);
      notification.error({
        message: "Failed to reject on-boarding exceptional",
      });
    } finally {
      setIsLoadingOb(false);
    }
  };

  // Credit Appraisal Exceptional Approve
  const submitCaApprove = async (index: number, item: any) => {
    const comment = caComments[index] || item.comments?.comment || "";
    if (!validateComment(comment)) return;

    setIsLoadingOb(true); // reuse loading flag or introduce separate if needed
    try {
      const payload = {
        comment,
        appType: "CA",
        approvalIdx: item.idx,
        appraisalIdx: item.appraisalIdx,
        action: "A",
      };

      await API.mobixCamsApproval.createApprovalComment(payload);
      notification.success({ message: "Exceptional approval approved" });
      await fetchData();
    } catch (err) {
      console.error("CA approve error", err);
      notification.error({ message: "Failed to approve exceptional approval" });
    } finally {
      setIsLoadingOb(false);
    }
  };

  // Credit Appraisal Exceptional Reject
  const submitCaReject = async (index: number, item: any) => {
    const comment = caComments[index] || item.comments?.comment || "";
    if (!validateComment(comment)) return;

    setIsLoadingOb(true);
    try {
      const payload = {
        comment,
        appType: "CA",
        approvalIdx: item.idx,
        appraisalIdx: item.appraisalIdx,
        action: "R",
      };

      await API.mobixCamsApproval.createApprovalComment(payload);
      notification.success({ message: "Exceptional approval rejected" });
      await fetchData();
    } catch (err) {
      console.error("CA reject error", err);
      notification.error({ message: "Failed to reject exceptional approval" });
    } finally {
      setIsLoadingOb(false);
    }
  };

  const isRejected =
  flowHistory?.ibuWf1ApprovalSteps?.[0]?.stepAction === "REJECTED" ||
  flowHistory?.ibuWf2ApprovalSteps?.[0]?.stepAction === "REJECTED";

  return (
    <div>
      <Collapse accordion>
        {/* <Panel header="ON-BOARDING EXCEPTIONAL APPROVALS" key="1">
          {originationApproval?.requestDtoList?.length ? (
            <Row gutter={16}>
              <Title level={5}>On-Boarding Excaptional Approvals</Title>
              <Col span={6}>
                <Tabs
                  tabPosition="left"
                  activeKey={verticalObActiveTab.toString()}
                  onChange={(key: any) =>
                    // toggleObVertical(parseInt(key))
                    setVerticalObActiveTab(key)
                  }
                >
                  {originationApproval.requestDtoList?.map(
                    (item: any, index: number) => (
                      <TabPane
                        tab={
                          <Space>
                            <Text strong>{`0${index + 1}. ${getObExceptionals(
                              item.type
                            )}`}</Text>
                            {item.status === "A" && (
                              <CheckSquareOutlined style={{ color: "green" }} />
                            )}
                            {item.status === "R" && (
                              <CloseCircleOutlined style={{ color: "red" }} />
                            )}
                          </Space>
                        }
                        key={index.toString()}
                      >
                        <Row>
                          <Col span={24}>
                            <Title level={5}>Requester’s Comment:</Title>
                            <Text>{item.remark}</Text>

                            <TextArea
                              readOnly={!!item.comments}
                              defaultValue={item.comments?.comment || ""}
                              rows={4}
                              onChange={(e) =>
                                setObComments((prev) => ({
                                  ...prev,
                                  [index]: e.target.value,
                                }))
                              }
                            />

                            {item.status === "P" &&
                              findUser?.group?.code === "AG_LEVEL_2" && (
                                <Space
                                  className="mt-3"
                                  style={{ float: "right" }}
                                >
                                  <Button
                                    danger
                                    loading={isLoadingOb}
                                    onClick={() =>
                                      submitObExceptionalReject(index, item)
                                    }
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    type="primary"
                                    loading={isLoadingOb}
                                    onClick={() =>
                                      submitObExceptionalApprove(index, item)
                                    }
                                  >
                                    Approve
                                  </Button>
                                </Space>
                              )}
                          </Col>
                        </Row>
                      </TabPane>
                    )
                  )}
                </Tabs>
              </Col>
            </Row>
          ) : null}
        </Panel> */}
        {/* ON-BOARDING EXCEPTIONAL APPROVALS */}
        <Panel header="ON-BOARDING EXCEPTIONAL APPROVALS" key="1">
          {originationApproval?.length ? (
            <Tabs
              tabPosition="left"
              activeKey={String(verticalCaActiveTab)}
              onChange={(key: any) =>
                // toggleCaVertical(parseInt(key))
                setVerticalCaActiveTab(key)
              }
            >
              {originationApproval?.map((item: any, index: number) => (
                <TabPane
                  tab={
                    <Row
                      className={`w-full px-2 py-1 rounded-md text-sm ${
                        String(verticalCaActiveTab) === String(item.id)
                          ? "bg-[#f1b44c] text-white"
                          : "bg-[#f1b44c] text-gray-800"
                      }`}
                      align="middle"
                    >
                      {/* Left column: number + category, left-aligned */}
                      <Col
                        flex="1 1 200px"
                        style={{
                          minWidth: 200,
                          textAlign: "left",
                          color: "white",
                        }}
                      >
                        {`0${index + 1}. `}
                        <span>{getObExceptionals(item.type)}</span>
                      </Col>

                      {/* Right column: status icons */}
                      <Col flex="0 0 32px" className="text-right">
                        {item.status === "A" && (
                          <CheckSquareOutlined
                            style={{ strokeWidth: 2 }}
                            className="text-white"
                          />
                        )}
                        {item.status === "R" && (
                          <CloseCircleOutlined className="text-white" />
                        )}
                      </Col>
                    </Row>
                  }
                  key={String(index)}
                >
                  <Row>
                    <Col span={24}>
                      <Title level={5}>Requester's Comment:</Title>
                      <Text>{item.remark}</Text>

                      <TextArea
                       className="mt-3"
                        readOnly={!!item.comments}
                        defaultValue={item.comments?.comment || ""}
                        rows={4}
                        onChange={(e) =>
                          setObComments((prev) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col>
                      {findUser?.group?.code === "AG_LEVEL_2" &&
                        item.status === "P" && (
                          <Space className="mt-3" style={{ float: "right" }}>
                            <Button
                              className="bg-[#f46a6a] text-white border-none"
                              icon={
                                <CloseCircleOutlined className="text-white" />
                              }
                              // loading={isLoadingCa}
                              //onClick={() => submitCaReject(index, item)}
                              onClick={() => {
                                Modal.confirm({
                                  title: `Are you sure that you want to reject?`,
                                  icon: (
                                    <ExclamationCircleOutlined
                                      style={{ color: "#080808ff" }}
                                    />
                                  ),
                                  content: (
                                    <span>
                                      You are about to Reject the On-Boarding Exceptional.
                                      Do you want to continue?
                                    </span>
                                  ),
                                  okText: "Yes",
                                  cancelText: "No",
                                  onOk: async () => {
                                    submitObExceptionalReject(index, item);
                                  },
                                });
                              }}
                            >
                              Reject
                            </Button>
                            <Button
                              type="primary"
                              // loading={isLoadingCa}
                              className="bg-[#34c38f] text-white border-none"
                              icon={
                                <CheckSquareOutlined className="text-white" />
                              }
                              // onClick={() => submitCaApprove(index, item)}
                              onClick={() => {
                                Modal.confirm({
                                  title: `Are you sure that you want to approve?`,
                                  icon: (
                                    <ExclamationCircleOutlined
                                      style={{ color: "#131313ff" }}
                                    />
                                  ),
                                  content: (
                                    <span>
                                      You are about to Approve the
                                      On-Boarding Exceptional.Do you want to continue?
                                    </span>
                                  ),
                                  okText: "Yes",
                                  cancelText: "No",
                                  onOk: async () => {
                                    submitObExceptionalApprove(index, item);
                                  },
                                });
                              }}
                            >
                              Approve
                            </Button>
                          </Space>
                        )}
                    </Col>
                  </Row>
                </TabPane>
              ))}
            </Tabs>
          ) : null}
        </Panel>

        {/* CREDIT APPRAISAL EXCEPTIONAL APPROVALS */}
        <Panel header="EXCEPTIONAL APPROVALS" key="2">
          {exceptionalApprovals?.length ? (
            <Tabs
              tabPosition="left"
              activeKey={String(verticalCaActiveTab)}
              onChange={(key: any) =>
                // toggleCaVertical(parseInt(key))
                setVerticalCaActiveTab(key)
              }
            >
              {exceptionalApprovals?.map((item: any, index: number) => (
                <TabPane
                  tab={
                    <Row
                      className={`w-full px-2 py-1 rounded-md text-sm ${
                        String(verticalCaActiveTab) === String(item.id)
                          ? "bg-[#f46a6a] text-white"
                          : "bg-[#f46a6a] text-gray-800"
                      }`}
                      align="middle"
                    >
                      {/* Left column: number + category, left-aligned */}
                      <Col
                        flex="1 1 200px"
                        style={{
                          minWidth: 200,
                          textAlign: "left",
                          color: "white",
                        }}
                      >
                        {`0${index + 1}. `}
                        <span>{item.categoryDec}</span>
                      </Col>

                      {/* Right column: status icons */}
                      <Col flex="0 0 32px" className="text-right">
                        {item.status === "A" && (
                          <CheckSquareOutlined
                            style={{ strokeWidth: 2 }}
                            className="text-white"
                          />
                        )}
                        {item.status === "R" && (
                          <CloseCircleOutlined className="text-white" />
                        )}
                      </Col>
                    </Row>
                  }
                  key={String(index)}
                >
                  <Row>
                    <Col span={24}>
                      <Title level={5}>Approval User:</Title>
                      <Text>{item.role}</Text>

                      <Title level={5}>Requester's Comment:</Title>
                      <Text  >{item.remark}</Text>

                      <TextArea
                      className="mt-3"
                        readOnly={
                          !verifyUserWithLevel(item.roleCode) || !!item.comments
                        }
                        defaultValue={item.comments?.comment || ""}
                        rows={4}
                        onChange={(e) =>
                          setCaComments((prev) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                      />
                    </Col>
                    <Col>
                      {verifyUserWithLevel(item.roleCode) &&
                        item.status === "P" && (
                          <Space className="mt-3" style={{ float: "right" }}>
                            <Button
                              className="bg-[#f46a6a]  text-white border-none"
                              icon={
                                <CloseCircleOutlined className="text-white" />
                              }
                              // loading={isLoadingCa}
                              //onClick={() => submitCaReject(index, item)}
                              onClick={() => {
                                Modal.confirm({
                                  title: `Are you sure that you want to reject?`,
                                  icon: (
                                    <ExclamationCircleOutlined
                                      style={{ color: "#080808ff" }}
                                    />
                                  ),
                                  content: (
                                    <span>
                                      You are about to Reject the Exceptional.
                                      Do you want to continue?
                                    </span>
                                  ),
                                  okText: "Yes",
                                  cancelText: "No",
                                  onOk: async () => {
                                    submitCaReject(index, item);
                                  },
                                });
                              }}
                            >
                              Reject
                            </Button>
                            <Button
                              type="primary"
                              // loading={isLoadingCa}
                              className="bg-[#34c38f] text-white border-none"
                              icon={
                                <CheckSquareOutlined className="text-white" />
                              }
                              // onClick={() => submitCaApprove(index, item)}
                              onClick={() => {
                                Modal.confirm({
                                  title: `Are you sure that you want to approve?`,
                                  icon: (
                                    <ExclamationCircleOutlined
                                      style={{ color: "#131313ff" }}
                                    />
                                  ),
                                  content: (
                                    <span>
                                      You are about to Approve the
                                      Exceptional.Do you want to continue?
                                    </span>
                                  ),
                                  okText: "Yes",
                                  cancelText: "No",
                                  onOk: async () => {
                                    submitCaApprove(index, item);
                                  },
                                });
                              }}
                            >
                              Approve
                            </Button>
                          </Space>
                        )}
                    </Col>
                  </Row>
                </TabPane>
              ))}
            </Tabs>
          ) : null}
        </Panel>
      </Collapse>

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
           
            <Form.Item
              label="Comment"
              name="comment"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea rows={4} placeholder="Add Comment here"  disabled={isRejected}/>
            </Form.Item>
            {/* : null} */}
            <div className="flex justify-center">
             
              <Button
                type="primary"
                disabled={addingData ? true : false}
                size="large"
                onClick={() => handleSubmit("REJECTED")}
                className="mr-1 "
                shape="round"
              >
                Reject
              </Button>
              <Button
                type="primary"
                disabled={addingData ? true : false}
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
                disabled={addingData ? true : false}
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
