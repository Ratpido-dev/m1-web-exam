import type { BikeModel, CreateBikeModel } from "../models/BikeModel";

// Form state: numbers stay null until the user types them
export type BikeFormValues = {
  brand: string;
  model: string;
  description: string;
  category: string;
  frameMaterial: string;
  frameSizeCm: number | null;
  wheelSizeInches: number | null;
  gearCount: number | null;
  weightKg: number | null;
  electric: boolean;
  // Edited in euros, sent in cents
  price: number | null;
};

export type BikeFormErrors = Partial<Record<keyof BikeFormValues, string>>;

export const emptyBikeValues: BikeFormValues = {
  brand: "",
  model: "",
  description: "",
  category: "",
  frameMaterial: "",
  frameSizeCm: null,
  wheelSizeInches: null,
  gearCount: null,
  weightKg: null,
  electric: false,
  price: null,
};

export const toBikeFormValues = (bike: BikeModel): BikeFormValues => ({
  brand: bike.brand,
  model: bike.model,
  description: bike.description,
  category: bike.category,
  frameMaterial: bike.frameMaterial,
  frameSizeCm: bike.frameSizeCm,
  wheelSizeInches: bike.wheelSizeInches,
  gearCount: bike.gearCount,
  weightKg: bike.weightKg,
  electric: bike.electric,
  price: bike.priceCents / 100,
});

// Same rules as the API (and the database check constraint)
export const validateBike = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};
  if (!values.brand.trim()) errors.brand = "Brand is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.category.trim()) errors.category = "Category is required";
  if (!values.frameMaterial.trim())
    errors.frameMaterial = "Frame material is required";
  if (!values.frameSizeCm || values.frameSizeCm <= 0)
    errors.frameSizeCm = "Must be greater than 0";
  if (!values.wheelSizeInches || values.wheelSizeInches <= 0)
    errors.wheelSizeInches = "Must be greater than 0";
  if (
    !values.gearCount ||
    !Number.isInteger(values.gearCount) ||
    values.gearCount < 1
  )
    errors.gearCount = "Must be a whole number of at least 1";
  if (!values.weightKg || values.weightKg <= 0)
    errors.weightKg = "Must be greater than 0";
  if (values.price === null || values.price < 0)
    errors.price = "Price is required";
  return errors;
};

// Only call after validateBike returned no error
export const toCreateBikeModel = (values: BikeFormValues): CreateBikeModel => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  description: values.description.trim(),
  category: values.category.trim(),
  frameMaterial: values.frameMaterial.trim(),
  frameSizeCm: values.frameSizeCm ?? 0,
  wheelSizeInches: values.wheelSizeInches ?? 0,
  gearCount: values.gearCount ?? 0,
  weightKg: values.weightKg ?? 0,
  electric: values.electric,
  priceCents: Math.round((values.price ?? 0) * 100),
});
