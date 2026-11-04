import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
  CustomersPageModel,
} from "../models/CustomerModel";

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (page: number, limit: number) => {
    setIsLoading(true);
    axios
      .get<CustomersPageModel>("http://localhost:3000/customers", {
        params: { page, limit },
      })
      .then((result) => {
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Returns the request so the caller can reload the current page
  const deleteCustomer = (id: string) =>
    axios.delete(`http://localhost:3000/customers/${id}`);

  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios
      .post<CustomerModel>("http://localhost:3000/customers", input)
      .then(() => {});

  return {
    customers,
    totalCount,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
  };
};
