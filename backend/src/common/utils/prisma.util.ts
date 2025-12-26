import { getUTCEndDateTime } from './date.util';

export const prismaEnumToStringArray = (enumObj) => {
  return Object.values(enumObj);
};

export interface IPrismaDateTimeRangeFilterQuery {
  column: string;
  fromDatetime: string;
  toDatetime: string | null | undefined;
}

export interface IPrismaDateTimeFilterQuery {
  column: string;
  datetime: string;
}

export const getPrismaDateTimeRangeFilterQuery = (query: IPrismaDateTimeRangeFilterQuery) => {
  const { column, fromDatetime, toDatetime } = query;
  let dateFilterQuery = {};
  dateFilterQuery[column] = {
    gte: fromDatetime,
    lte: toDatetime ? toDatetime : getUTCEndDateTime(fromDatetime),
  };
  return dateFilterQuery;
};

export interface IPrismaDateTimeRangeFilterQueryByCustomField {
  column: string;
  field: string;
  fromDatetime: string;
  toDatetime: string | null | undefined;
}
