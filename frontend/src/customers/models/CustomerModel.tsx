export type CustomerModel = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
};

// Only the fields sent are changed; null clears an optional field
export type UpdateCustomerModel = Partial<Omit<CustomerModel, "id">>;

export type CreateCustomerModel = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
};

// Response of GET /customers?page=&limit=
export type CustomersPageModel = {
  totalCount: number;
  customers: CustomerModel[];
};
