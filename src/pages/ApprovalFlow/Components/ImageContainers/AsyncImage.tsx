import React, { useEffect, useState } from "react";
import { Button, Image, Typography } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { APIAuth } from "../../../../services/api";
// import { viewImageOrPDF } from "services/images.service";

type AsyncImageProps = {
  src: string;
  category?: string;
  width?: number;
  height?: number;
};

const AsyncImage: React.FC<AsyncImageProps> = ({
  src,
  category,
  width = 200,
  height = 200,
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchImage = async () => {
      try {
        // const response = await viewImageOrPDF(src);
          const response = await APIAuth.get(
      `/mobixCamsLoan/v1/loans/static-assets/${src}`,
      { responseType: "blob" } // force axios to return a Blob
    );
        const contentType = response.headers["content-type"];

    if (contentType === "application/pdf") {
      const pdfUrl = URL.createObjectURL(response.data); // response.data is now a Blob
      if (mounted) {
        setDataUrl(pdfUrl);
        setIsPdf(true);
      }
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (mounted) {
          setDataUrl(reader.result as string);
          setIsPdf(false);
        }
      };
      reader.readAsDataURL(response.data); // safe now because it's a Blob
    }
      } catch (error) {
        console.error("Failed to load media:", error);
      }
    };

    fetchImage();

    return () => {
      mounted = false;
    };
  }, [src]);

  if (!dataUrl) return null;

  return (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      {isPdf ? (
        <Button
          icon={<FilePdfOutlined />}
          type="primary"
          onClick={() => window.open(dataUrl, "_blank")}
        >
          Open PDF
        </Button>
      ) : (
        <Image
          src={dataUrl}
          width={width}
          height={height}
          style={{ objectFit: "contain" }}
          alt={category}
        />
      )}
      {category && (
        <Typography.Text type="secondary" style={{ display: "block", marginTop: 4 }}>
          {category}
        </Typography.Text>
      )}
    </div>
  );
};

export default AsyncImage;
