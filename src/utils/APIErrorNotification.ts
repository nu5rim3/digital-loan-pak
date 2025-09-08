import { notification } from "antd";
import { AxiosError } from "axios";

export const handleAxiosError = (error: AxiosError) => {
  // Extract response details
  const status = error.response?.status ?? 400;

  // Ensure response data is treated as an object with optional message
  const responseData = error.response?.data as { message?: string } | undefined;

  const message = responseData?.message || error.message || "An error occurred";

  // Handle different status codes
  switch (status) {
    case 400:
      notification.error({
        message: "Error",
        description: message || "The request was invalid.",
      });
      break;
    case 401:
      notification.error({
        message: "Unauthorized",
        description:
          message || "Your session has expired. Please log in again.",
      });
      // Optionally, redirect to login page
      // setTimeout(() => { window.location.href = "/login"; }, 2000);
      break;
    case 403:
      notification.warning({
        message: "Forbidden",
        description:
          message || "You don't have permission to access this resource.",
      });
      break;
    case 404:
      notification.error({
        message: "Not Found",
        description: message || "The requested resource was not found.",
      });
      break;
    case 429:
      notification.error({
        message: "Too Many Requests",
        description:
          message || "You have made too many requests in a short period.",
      });
      break;
    case 500:
      notification.error({
        message: "Server Error",
        description:
          message || "An error occurred on the server. Please try again later.",
      });
      break;
    default:
      notification.error({
        message: "Error",
        description: message || "An unexpected error occurred.",
      });
  }

  return Promise.reject(error);
};
