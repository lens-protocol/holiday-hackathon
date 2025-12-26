import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { LIST_QUERY_PAGINATION_CONSTANTS } from '../constants/list-query.constant';

export class ListQueryDTO {
  @IsOptional()
  search?: string = '';

  @IsOptional()
  @IsInt()
  @Min(LIST_QUERY_PAGINATION_CONSTANTS.DEFAULT_PAGE_NO)
  @Type(() => Number)
  page_no?: number = LIST_QUERY_PAGINATION_CONSTANTS.DEFAULT_PAGE_NO;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  //page_size?: number = LIST_QUERY_PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE;
  page_size?: number = 1000;
}

export class ListByRouteNameDto {
  @IsNotEmpty()
  route_name: string;
}
