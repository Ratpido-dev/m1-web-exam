import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

// Every field is optional, but none of them can be cleared with null.
const isProvided = (_object: unknown, value: unknown) => value !== undefined;

export class UpdateBikeDto {
  @ValidateIf(isProvided)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @ValidateIf(isProvided)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ValidateIf(isProvided)
  @Transform(trim)
  @IsString()
  description?: string;

  @ValidateIf(isProvided)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  category?: string;

  @ValidateIf(isProvided)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  frameMaterial?: string;

  @ValidateIf(isProvided)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  frameSizeCm?: number;

  @ValidateIf(isProvided)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  wheelSizeInches?: number;

  @ValidateIf(isProvided)
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  gearCount?: number;

  @ValidateIf(isProvided)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  weightKg?: number;

  @ValidateIf(isProvided)
  @IsBoolean()
  electric?: boolean;

  @ValidateIf(isProvided)
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  priceCents?: number;
}
