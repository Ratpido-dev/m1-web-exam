import type { PaginatedModel } from "../../shared/models/pagination.model";
import type { CustomerModel } from "../models/customer.model";
import { CustomerResponseDto } from "./customer-response.dto";

export class PaginatedCustomersResponseDto {
  totalCount: number;
  customers: CustomerResponseDto[];

  static fromModel(
    model: PaginatedModel<CustomerModel>,
  ): PaginatedCustomersResponseDto {
    return Object.assign(new PaginatedCustomersResponseDto(), {
      totalCount: model.totalCount,
      customers: model.items.map((item) => CustomerResponseDto.fromModel(item)),
    });
  }
}
