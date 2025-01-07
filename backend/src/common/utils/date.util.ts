import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as chrono from 'chrono-node';
import * as timezone from 'dayjs/plugin/timezone';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const dayjsUtil = dayjs;

export function getMonth(month: number) {
  switch (month) {
    case 0:
      return 'January';

    case 1:
      return 'February';

    case 2:
      return 'March';

    case 3:
      return 'April';

    case 4:
      return 'May';

    case 5:
      return 'June';

    case 6:
      return 'July';

    case 7:
      return 'August';

    case 8:
      return 'September';

    case 9:
      return 'October';

    case 10:
      return 'November';

    case 11:
      return 'December';

    default:
      break;
  }
}

export function splitDate(date) {
  const newDate = new Date(date);
  const dateNum = newDate.getDate();
  const month = newDate.getMonth();
  const year = newDate.getFullYear();
  return { dateNum, month, year };
}

export function isFutureDate(date) {
  date = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
}

export function getNumberOfDays(startDate, end_date) {
  const date1 = new Date(startDate);
  const date2 = new Date(end_date);

  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = date2.getTime() - date1.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
}

export function getUTCDateTimeRange(
  fromDate: string,
  toDate: string | null | undefined,
  tz?: string,
) {
  // TODO: Should tz be included - https://day.js.org/docs/en/plugin/timezone
  if (tz) {
    return {
      fromDatetime: dayjs(fromDate).tz(tz).startOf('day').toISOString(),
      toDatetime: toDate ? dayjs(toDate).tz(tz).endOf('day').toISOString() : null,
    };
  } else
    return {
      fromDatetime: dayjs(fromDate).startOf('day').toISOString(),
      toDatetime: toDate ? dayjs(toDate).endOf('day').toISOString() : null,
    };
}

export function getUTCEndDateTime(date: string, tz?: string) {
  if (tz) {
    return dayjs(date).tz(tz).endOf('day').toISOString();
  }
  return dayjs(date).endOf('day').toISOString();
}

export function getYesterdayEndDateTime() {
  return dayjs().subtract(1, 'day').endOf('day').toISOString();
}

export function getPreviousDateTimeRange(
  fromDatetime: string,
  toDatetime: string | null | undefined,
) {
  const isDateRange = toDatetime ? true : false;
  if (isDateRange) {
    const daysBetween = dayjs(toDatetime).diff(fromDatetime, 'day');
    return {
      previousFromDateTime: dayjs(fromDatetime).subtract(daysBetween, 'day').toISOString(),
      previousToDateTime: fromDatetime,
    };
  } else {
    return {
      previousFromDateTime: dayjs(fromDatetime).subtract(1, 'day').toISOString(),
      previousToDateTime: null,
    };
  }
}

export function getUTCDateTimeRangeForSmartFilters(
  fromDate: string,
  toDate: string | null | undefined,
  tz?: string,
) {
  if (tz) {
    return {
      fromDatetime: dayjs(fromDate).tz(tz).startOf('day').toISOString(),
      toDatetime: toDate
        ? dayjs(toDate).tz(tz).endOf('day').toISOString()
        : dayjs(fromDate).tz(tz).endOf('day').toISOString(),
    };
  } else
    return {
      fromDatetime: dayjs(fromDate).startOf('day').toISOString(),
      toDatetime: toDate
        ? dayjs(toDate).endOf('day').toISOString()
        : dayjs(fromDate).tz(tz).endOf('day').toISOString(),
    };
}

export function getUTCStartDateTime(date: string, tz?: string) {
  if (tz) {
    return dayjs(date).tz(tz).startOf('day').toISOString();
  }
  return dayjs(date).startOf('day').toISOString();
}

export function getCustomParseFormat(date: string, currentFormat: string, newFormat: string) {
  return new Date(dayjs(date, currentFormat).format(newFormat)).toISOString();
}

export function formatDateTime(date: string, currentFormat: string, newFormat: string) {
  return new Date(dayjs(date, currentFormat).format(newFormat)).toISOString();
}

export function formatTime(date: string | Date) {
  return dayjs(date).format('hh A');
}

export function formatDate(date: string | Date) {
  return dayjs(date).format('YYYY-MM-DD');
}

export function addHour(time: string, hour: number) {
  return dayjs(time, 'hh A').add(hour, 'hour').format('hh A');
}

export function subtractDay(date: string | Date, day: number) {
  return dayjs(date).subtract(day, 'day').toISOString();
}

export function minutesDiff(dateTimeValue2: Date, dateTimeValue1: Date) {
  let differenceValue = (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
  differenceValue /= 60;
  return Math.abs(Math.round(differenceValue));
}

export function extractDate(value: string) {
  return chrono.parseDate(value);
}
