import { notification } from "antd";
import { AxiosError } from "axios";

/**
 * Handles Axios errors and shows Ant Design notifications
 * @param {AxiosError} error - The error object from Axios
 */
export const handleAxiosError = (error: AxiosError) => {
  // Extract response details
  const status = error.response?.status;

  // Handle different status codes
  switch (status) {
    case 400:
      notification.error({
        message: "Bad Request",
        description: "The request was invalid.",
      });
      break;
    case 401:
      notification.error({
        message: "Unauthorized",
        description: "Your session has expired. Please log in again.",
      });
      // Optionally, redirect to login page
      // setTimeout(() => { window.location.href = "/login"; }, 2000);
      break;
    case 403:
      notification.warning({
        message: "Forbidden",
        description: "You don't have permission to access this resource.",
      });
      break;
    case 404:
      notification.error({
        message: "Not Found",
        description: "The requested resource was not found.",
      });
      break;
    case 429:
      notification.error({
        message: "Too Many Requests",
        description: "You have made too many requests in a short period.",
      });
      break;
    case 500:
      notification.error({
        message: "Server Error",
        description: "An error occurred on the server. Please try again later.",
      });
      break;
    default:
      notification.error({
        message: "Error",
        description: "An unexpected error occurred.",
      });
  }

  return Promise.reject(error);
};
