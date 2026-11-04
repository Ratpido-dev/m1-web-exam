import { Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { ListPagination } from "../../shared/components/ListPagination";
import type { CreateCustomerModel } from "../models/CustomerModel";
import { useCustomersProvider } from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

export const CustomersList = () => {
  const {
    customers,
    totalCount,
    deleteCustomer,
    createCustomer,
    isLoading,
    load,
  } = useCustomersProvider();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    load(page, limit);
  }, [page, limit]);

  // Deleting the only item of the last page: go back one page (the effect reloads)
  const reloadAfterDelete = () => {
    if (customers.length === 1 && page > 1) setPage(page - 1);
    else load(page, limit);
  };

  const onDelete = (id: string) => {
    deleteCustomer(id).then(reloadAfterDelete);
  };

  // The new customer is placed by the backend order, so reload the page
  const onCreate = (input: CreateCustomerModel) =>
    createCustomer(input).then(() => load(page, limit));

  const onPageChange = (newPage: number, newLimit: number) => {
    // Changing the page size restarts from the first page
    setPage(newLimit === limit ? newPage : 1);
    setLimit(newLimit);
  };

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddCustomerButton createCustomer={onCreate} />
      {isLoading ? (
        <Skeleton />
      ) : (
        customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customer={customer}
            deleteCustomer={onDelete}
          />
        ))
      )}
      <ListPagination
        page={page}
        limit={limit}
        totalCount={totalCount}
        onChange={onPageChange}
      />
    </Space>
  );
};
