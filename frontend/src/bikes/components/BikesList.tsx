import { Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { ListPagination } from "../../shared/components/ListPagination";
import type { CreateBikeModel } from "../models/BikeModel";
import { useBikesProvider } from "../providers/useBikesProvider";
import { AddBikeButton } from "./AddBikeButton";
import { BikeListItem } from "./BikeListItem";

export const BikesList = () => {
  const { bikes, totalCount, deleteBike, createBike, isLoading, load } =
    useBikesProvider();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    load(page, limit);
  }, [page, limit]);

  // Errors are passed through so the confirmation modal can show them
  // Deleting the only item of the last page: go back one page (the effect reloads)
  const reloadAfterDelete = () => {
    if (bikes.length === 1 && page > 1) setPage(page - 1);
    else load(page, limit);
  };

  const onDelete = (id: string) => deleteBike(id).then(reloadAfterDelete);

  // The new bike is placed by the backend order, so reload the page
  const onCreate = (input: CreateBikeModel) =>
    createBike(input).then(() => load(page, limit));

  const onPageChange = (newPage: number, newLimit: number) => {
    // Changing the page size restarts from the first page
    setPage(newLimit === limit ? newPage : 1);
    setLimit(newLimit);
  };

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddBikeButton createBike={onCreate} />
      {isLoading ? (
        <Skeleton />
      ) : (
        bikes.map((bike) => (
          <BikeListItem key={bike.id} bike={bike} deleteBike={onDelete} />
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
