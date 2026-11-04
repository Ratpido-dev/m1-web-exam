import {
  AutoComplete,
  Col,
  Input,
  InputNumber,
  Row,
  Switch,
  Typography,
} from "antd";
import type { BikeFormErrors, BikeFormValues } from "../utils/bikeForm";

type TextField = "brand" | "model" | "category" | "frameMaterial";
type NumberField = "frameSizeCm" | "wheelSizeInches" | "gearCount" | "weightKg";

// Suggestions only: the API accepts any value
const categories = ["road", "mountain", "gravel", "city", "hybrid"];
const frameMaterials = ["aluminium", "carbon", "steel"];

interface BikeFormFieldsProps {
  idPrefix: string;
  values: BikeFormValues;
  errors: BikeFormErrors;
  onChange: (values: BikeFormValues, field: keyof BikeFormValues) => void;
}

export const BikeFormFields = ({
  idPrefix,
  values,
  errors,
  onChange,
}: BikeFormFieldsProps) => {
  const error = (name: keyof BikeFormValues) =>
    errors[name] && (
      <Typography.Text type="danger">{errors[name]}</Typography.Text>
    );

  const textField = (name: TextField, label: string, options?: string[]) => (
    <>
      <label htmlFor={`${idPrefix}-${name}`}>{label}</label>
      {options ? (
        <AutoComplete
          id={`${idPrefix}-${name}`}
          style={{ width: "100%" }}
          value={values[name]}
          status={errors[name] && "error"}
          options={options.map((option) => ({ value: option }))}
          onChange={(value: string) =>
            onChange({ ...values, [name]: value }, name)
          }
        />
      ) : (
        <Input
          id={`${idPrefix}-${name}`}
          value={values[name]}
          status={errors[name] && "error"}
          onChange={(event) =>
            onChange({ ...values, [name]: event.target.value }, name)
          }
        />
      )}
      {error(name)}
    </>
  );

  const numberField = (
    name: NumberField | "price",
    label: string,
    step: number = 1,
  ) => (
    <>
      <label htmlFor={`${idPrefix}-${name}`}>{label}</label>
      <InputNumber
        id={`${idPrefix}-${name}`}
        style={{ width: "100%" }}
        min={0}
        step={step}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(value) => onChange({ ...values, [name]: value }, name)}
      />
      {error(name)}
    </>
  );

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>{textField("brand", "Brand *")}</Col>
      <Col span={12}>{textField("model", "Model *")}</Col>
      <Col span={12}>{textField("category", "Category *", categories)}</Col>
      <Col span={12}>
        {textField("frameMaterial", "Frame material *", frameMaterials)}
      </Col>
      <Col span={24}>
        <label htmlFor={`${idPrefix}-description`}>Description</label>
        <Input.TextArea
          id={`${idPrefix}-description`}
          rows={3}
          value={values.description}
          onChange={(event) =>
            onChange(
              { ...values, description: event.target.value },
              "description",
            )
          }
        />
      </Col>
      <Col span={12}>{numberField("frameSizeCm", "Frame size (cm) *")}</Col>
      <Col span={12}>
        {numberField("wheelSizeInches", "Wheel size (in) *", 0.5)}
      </Col>
      <Col span={12}>{numberField("gearCount", "Gears *")}</Col>
      <Col span={12}>{numberField("weightKg", "Weight (kg) *", 0.1)}</Col>
      <Col span={12}>{numberField("price", "Price (€) *", 10)}</Col>
      <Col span={12}>
        <label htmlFor={`${idPrefix}-electric`}>Electric</label>
        <div>
          <Switch
            id={`${idPrefix}-electric`}
            checked={values.electric}
            onChange={(checked) =>
              onChange({ ...values, electric: checked }, "electric")
            }
          />
        </div>
      </Col>
    </Row>
  );
};
