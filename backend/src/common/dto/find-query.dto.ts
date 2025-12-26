import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { FIND_QUERY_PAGINATION_CONSTANTS } from '../constants/find-query.constant';

export class SortByDto {
  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  custom: boolean;
}

export class OrderByDto {
  @IsNotEmpty()
  property: string;

  @IsNotEmpty()
  @IsIn(['asc', 'desc'])
  order: string;
}

export class FindQueryDTO {
  @IsOptional()
  search?: string = '';

  @IsOptional()
  @IsInt()
  @Min(FIND_QUERY_PAGINATION_CONSTANTS.DEFAULT_PAGE_NO)
  @Type(() => Number)
  page_no?: number = FIND_QUERY_PAGINATION_CONSTANTS.DEFAULT_PAGE_NO;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  page_size?: number = FIND_QUERY_PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => OrderByDto)
  // order_by?: OrderByDto;
}

export class FilterOptionsDto {
  @IsOptional()
  @IsNotEmpty()
  has_advance_filter?: boolean;

  @IsOptional()
  @IsNotEmpty()
  has_group_by?: boolean;

  @IsOptional()
  @IsObject()
  @Type(() => SortByDto)
  @ValidateNested()
  sort_by?: SortByDto;
}
