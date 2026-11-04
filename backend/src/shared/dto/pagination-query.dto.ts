import { Transform } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

// Query parameters always arrive as strings: only plain digit strings are
// converted, anything else ("abc", "1.5", "1e2", repeated keys) fails @IsInt.
const toInteger = ({ value }: { value: unknown }) =>
  typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;

export class PaginationQueryDto {
  @Transform(toInteger)
  @IsInt()
  @Min(1)
  // Larger numbers lose precision in JavaScript and break the SQL offset
  @Max(Number.MAX_SAFE_INTEGER)
  page: number = 1;

  @Transform(toInteger)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}
