import { Modal } from "antd"
import { ReactNode } from "react"

type CommonModalProps = {
  open: boolean
  title?: string | null
  content?: ReactNode
  onOk?: () => void
  onCancel?: () => void
  okText?: string
  cancelText?: string
}

export const DualNumberVerificationModal = ({
  open,
  title = "Notification",
  content,
  onOk,
  onCancel,
  okText ,
  cancelText ,
}: CommonModalProps) => {
  return (
    <Modal
      open={open}
      title={title ?? null}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText ?? "OK"}
      cancelText={cancelText ?? "Cancel"}
      destroyOnClose
    >
      {content}
    </Modal>
  )
}
