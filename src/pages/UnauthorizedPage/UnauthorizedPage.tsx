import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { mainURL } from '../../App';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Result
        status="403"
        title="Unauthorized"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => navigate(`${mainURL}/dashboard`)}>Go Home</Button>
        }
      />
    </div>
  );
}
