import type { PaginatedModel } from "../../shared/models/pagination.model";
import type { BikeModel } from "../models/bike.model";

export class BikeResponseDto {
  id: string;
  brand: string;
  model: string;
  description: string;
  category: string;
  frameMaterial: string;
  frameSizeCm: number;
  wheelSizeInches: number;
  gearCount: number;
  weightKg: number;
  electric: boolean;
  priceCents: number;

  static fromModel(model: BikeModel): BikeResponseDto {
    return Object.assign(new BikeResponseDto(), model);
  }
}

export class PaginatedBikesResponseDto {
  totalCount: number;
  bikes: BikeResponseDto[];

  static fromModel(
    model: PaginatedModel<BikeModel>,
  ): PaginatedBikesResponseDto {
    return Object.assign(new PaginatedBikesResponseDto(), {
      totalCount: model.totalCount,
      bikes: model.items.map((item) => BikeResponseDto.fromModel(item)),
    });
  }
}
