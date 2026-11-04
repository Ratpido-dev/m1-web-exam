import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import type { CreateBikeModel } from "../models/BikeModel";
import { BikeFormFields } from "./BikeFormFields";
import type { BikeFormErrors, BikeFormValues } from "../utils/bikeForm";
import {
  emptyBikeValues,
  toCreateBikeModel,
  validateBike,
} from "../utils/bikeForm";

interface AddBikeButtonProps {
  createBike: (input: CreateBikeModel) => Promise<void>;
}

export const AddBikeButton = ({ createBike }: AddBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues>(emptyBikeValues);
  const [errors, setErrors] = useState<BikeFormErrors>({});

  const close = () => {
    setValues(emptyBikeValues);
    setErrors({});
    setIsOpen(false);
  };

  const onConfirm = () => {
    const validationErrors = validateBike(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    createBike(toCreateBikeModel(values))
      .then(close)
      // On failure, keep the modal open so the input is not lost
      .catch(() => {})
      .finally(() => setIsSaving(false));
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsOpen(true)}
      >
        Add bike
      </Button>
      <Modal
        open={isOpen}
        title="New bike"
        okText="Add bike"
        onCancel={close}
        onOk={onConfirm}
        confirmLoading={isSaving}
      >
        <BikeFormFields
          idPrefix="new-bike"
          values={values}
          errors={errors}
          onChange={(newValues, field) => {
            setValues(newValues);
            setErrors({ ...errors, [field]: undefined });
          }}
        />
      </Modal>
    </>
  );
};
