import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { BikeModel } from "../models/BikeModel";

interface DeleteBikeButtonProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
  label?: string;
}

export const DeleteBikeButton = ({
  bike,
  deleteBike,
  label,
}: DeleteBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onCancel = () => {
    setError(null);
    setIsOpen(false);
  };

  const onConfirm = () => {
    setIsDeleting(true);
    deleteBike(bike.id)
      .then(onCancel)
      .catch((reason) => {
        // 409: the bike was sold, deleting it would erase the sales history
        setError(
          isAxiosError(reason) && reason.response?.status === 409
            ? "This bike has already been sold and cannot be deleted."
            : "The bike could not be deleted.",
        );
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <>
      <Button
        danger
        icon={<DeleteOutlined />}
        aria-label={`Delete ${bike.brand} ${bike.model}`}
        onClick={() => setIsOpen(true)}
      >
        {label}
      </Button>
      <Modal
        okButtonProps={{ danger: true, disabled: error !== null }}
        open={isOpen}
        title={`Deleting ${bike.brand} ${bike.model}`}
        onCancel={onCancel}
        onOk={onConfirm}
        confirmLoading={isDeleting}
        okText="Yes, delete"
      >
        <p>
          You are about to delete the bike {bike.brand} {bike.model}. This
          action cannot be undone, are you sure ?
        </p>
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Modal>
    </>
  );
};
