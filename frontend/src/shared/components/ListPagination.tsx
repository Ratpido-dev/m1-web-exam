import { Pagination } from "antd";

interface ListPaginationProps {
  page: number;
  limit: number;
  totalCount: number;
  onChange: (page: number, limit: number) => void;
}

// The API accepts at most 50 items per page
export const ListPagination = ({
  page,
  limit,
  totalCount,
  onChange,
}: ListPaginationProps) => (
  <Pagination
    current={page}
    pageSize={limit}
    total={totalCount}
    showSizeChanger
    pageSizeOptions={[10, 20, 50]}
    showTotal={(total, [from, to]) => `${from}-${to} of ${total}`}
    onChange={onChange}
  />
);
