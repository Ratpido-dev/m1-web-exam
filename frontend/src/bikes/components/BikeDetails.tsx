import {
  ArrowLeftOutlined,
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
  TagOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import type { DescriptionsProps } from "antd";
import { Button, Card, Descriptions, Skeleton, Space, Tag } from "antd";
import Title from "antd/es/typography/Title";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { formatPrice } from "../../shared/utils/formatPrice";
import { useBikeDetailsProvider } from "../providers/useBikeDetailsProvider";
import { BikeFormFields } from "./BikeFormFields";
import type { BikeFormErrors, BikeFormValues } from "../utils/bikeForm";
import {
  toBikeFormValues,
  toCreateBikeModel,
  validateBike,
} from "../utils/bikeForm";
import { DeleteBikeButton } from "./DeleteBikeButton";

interface BikeDetailsProps {
  bikeId: string;
}

export const BikeDetails = ({ bikeId }: BikeDetailsProps) => {
  const { bike, isLoading, load, updateBike, deleteBike } =
    useBikeDetailsProvider(bikeId);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues | null>(null);
  const [errors, setErrors] = useState<BikeFormErrors>({});

  useEffect(() => {
    load();
  }, [bikeId]);

  const startEditing = () => {
    if (!bike) return;
    setValues(toBikeFormValues(bike));
    setErrors({});
    setIsEditing(true);
  };

  const cancel = () => {
    setValues(null);
    setErrors({});
    setIsEditing(false);
  };

  const save = () => {
    if (!values) return;
    const validationErrors = validateBike(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    updateBike(toCreateBikeModel(values))
      .then(cancel)
      // On failure, stay in edit mode so the changes are not lost
      .catch(() => {})
      .finally(() => setIsSaving(false));
  };

  const onDelete = () =>
    deleteBike().then(() => {
      navigate({ to: "/bikes" });
    });

  const value = (content: ReactNode) =>
    isLoading ? <Skeleton.Input active size="small" /> : (content ?? "—");

  const items: DescriptionsProps["items"] = [
    { key: "brand", label: "Brand", children: value(bike?.brand) },
    { key: "model", label: "Model", children: value(bike?.model) },
    {
      key: "category",
      label: "Category",
      children: value(bike && <Tag>{bike.category}</Tag>),
    },
    {
      key: "frameMaterial",
      label: "Frame material",
      children: value(bike?.frameMaterial),
    },
    {
      key: "frameSizeCm",
      label: "Frame size",
      children: value(bike && `${bike.frameSizeCm} cm`),
    },
    {
      key: "wheelSizeInches",
      label: "Wheel size",
      children: value(bike && `${bike.wheelSizeInches}"`),
    },
    { key: "gearCount", label: "Gears", children: value(bike?.gearCount) },
    {
      key: "weightKg",
      label: "Weight",
      children: value(bike && `${bike.weightKg} kg`),
    },
    {
      key: "electric",
      label: "Electric",
      children: value(
        bike &&
          (bike.electric ? (
            <Space>
              <ThunderboltOutlined />
              Yes
            </Space>
          ) : (
            "No"
          )),
      ),
    },
    {
      key: "price",
      label: "Price",
      children: value(bike && <strong>{formatPrice(bike.priceCents)}</strong>),
    },
    {
      key: "description",
      label: "Description",
      span: "filled",
      children: value(bike && (bike.description || "—")),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: ".25rem .5rem",
      }}
    >
      <ButtonLink to="/bikes" icon={<ArrowLeftOutlined />}>
        Back to bikes
      </ButtonLink>

      <Space align="center">
        <TagOutlined style={{ fontSize: "1.5rem" }} />
        {isLoading ? (
          <Skeleton.Input active size="large" />
        ) : (
          <Title level={2} style={{ margin: 0 }}>
            {bike ? `${bike.brand} ${bike.model}` : "Bike not found"}
          </Title>
        )}
      </Space>

      <Card
        title="Characteristics"
        style={{ alignSelf: "stretch" }}
        extra={
          isEditing ? (
            <Space>
              <Button icon={<CloseOutlined />} onClick={cancel}>
                Cancel
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={isSaving}
                onClick={save}
              >
                Save
              </Button>
            </Space>
          ) : (
            <Space>
              <Button
                icon={<EditOutlined />}
                aria-label="Edit bike"
                disabled={!bike}
                onClick={startEditing}
              />
              {bike && <DeleteBikeButton bike={bike} deleteBike={onDelete} />}
            </Space>
          )
        }
      >
        {isEditing && values ? (
          <BikeFormFields
            idPrefix="bike"
            values={values}
            errors={errors}
            onChange={(newValues, field) => {
              setValues(newValues);
              setErrors({ ...errors, [field]: undefined });
            }}
          />
        ) : (
          <Descriptions column={{ xs: 1, md: 2 }} items={items} />
        )}
      </Card>
    </div>
  );
};
