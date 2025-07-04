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
        const response = await APIAuth(`/mobixCamsLoan/v1/loans/static-assets/${src}`);
        const contentType = response?.headers["content-type"];

        if (contentType === "application/pdf") {
          const blob = new Blob([response.data], { type: contentType });
          const pdfUrl = URL.createObjectURL(blob);
          if (mounted) {
            setDataUrl(pdfUrl);
            setIsPdf(true);
          }
        } else {
          const base64 = Buffer.from(response.data).toString("base64");
          const imageUrl = `data:${contentType};base64,${base64}`;
          if (mounted) {
            setDataUrl(imageUrl);
            setIsPdf(false);
          }
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
