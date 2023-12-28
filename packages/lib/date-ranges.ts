import { DateTime, Interval } from "luxon";

import type { Dayjs } from "@calcom/dayjs";
import dayjs from "@calcom/dayjs";
import type { Availability } from "@calcom/prisma/client";

export type DateRange = {
  start: Dayjs;
  end: Dayjs;
};

export type DateOverride = Pick<Availability, "date" | "startTime" | "endTime">;
export type WorkingHours = Pick<Availability, "days" | "startTime" | "endTime">;

export function processWorkingHours({
  item,
  dateFrom,
  dateTo,
}: {
  item: WorkingHours;
  dateFrom: DateTime;
  dateTo: Dayjs;
}) {
  const utcDateTo = dateTo.utc();
  const results = [];
  for (
    let date = dateFrom.startOf("day");
    utcDateTo.valueOf() > date.valueOf();
    date = date.plus({ days: 1 })
  ) {
    // it always has to be start of the day (midnight) even when DST changes
    if (!item.days.includes(date.weekday)) {
      continue;
    }

    const start = date.plus({ hours: item.startTime.getUTCHours(), minutes: item.startTime.getUTCMinutes() });
    const end = date.plus({ hours: item.endTime.getUTCHours(), minutes: item.endTime.getUTCMinutes() });

    const interval = Interval.fromDateTimes(start, end);
    if (interval.isValid) results.push(interval);
  }
  return results;
}

export function processDateOverride({
  item,
  timeZone,
}: {
  item: Omit<DateOverride, "date"> & { date: Date };
  timeZone: string;
}): Interval<true> {
  const startDate = DateTime.fromJSDate(item.date, { zone: "utc" }) // Convert to Luxon DateTime object in UTC
    .startOf("day")
    .plus({ hours: item.startTime.getUTCHours(), minutes: item.startTime.getUTCMinutes() })
    .setZone(timeZone, { keepLocalTime: true });

  const endDate = DateTime.fromJSDate(item.date, { zone: "utc" }) // Convert to Luxon DateTime object in UTC
    .startOf("day")
    .plus({ hours: item.endTime.getUTCHours(), minutes: item.endTime.getUTCMinutes() })
    .setZone(timeZone, { keepLocalTime: true });

  const interval = Interval.fromDateTimes(startDate, endDate);
  if (!interval.isValid) throw new Error("Invalid DateOverride");
  return interval;
}

function _castLuxonDayjsInterop(interval: Interval<true>): DateRange {
  return {
    start: dayjs.tz(interval.start.toJSDate(), interval.start?.zoneName),
    end: dayjs.tz(interval.end.toJSDate(), interval.end?.zoneName),
  };
}

function _castDayjsLuxonInterop(dateRange: DateRange): Interval<true> {
  const interval = Interval.fromDateTimes(dateRange.start.toDate(), dateRange.end.toDate());
  if (!interval.isValid) throw new Error("Invalid DateRange");
  return interval;
}
export function buildDateRanges({
  availability,
  timeZone /* Organizer timeZone */,
  dateFrom /* Attendee dateFrom */,
  dateTo /* `` dateTo */,
}: {
  timeZone: string;
  availability: (DateOverride | WorkingHours)[];
  dateFrom: Dayjs;
  dateTo: Dayjs;
}) {
  const zonedDateFrom = DateTime.fromJSDate(dateFrom.toDate()).setZone(timeZone);
  const groupedWorkingHours = groupByDate(
    availability.reduce((processed: Interval[], item) => {
      if ("days" in item) {
        processed = processed.concat(processWorkingHours({ item, dateFrom: zonedDateFrom, dateTo }));
      }
      return processed;
    }, [])
  );
  const groupedDateOverrides = groupByDate(
    availability.reduce((processed: Interval[], item) => {
      if ("date" in item && item.date !== null) {
        processed.push(processDateOverride({ item: { ...item, date: item.date }, timeZone }));
      }
      return processed;
    }, [])
  );

  const dateRanges = Object.values({
    ...groupedWorkingHours,
    ...groupedDateOverrides,
  }).map(
    // remove 0-length overrides that were kept to cancel out working dates until now.
    (ranges) => ranges.filter((range) => range.isEmpty())
  );
  // flatten, cast to Dayjs for compatibility
  return dateRanges.reduce((dateRanges: { start: Dayjs; end: Dayjs }[], intervals) => {
    intervals.forEach((interval) => {
      if (!interval.start || !interval.end) return;
      dateRanges.push(_castLuxonDayjsInterop(interval));
    });
    return dateRanges;
  }, []);
}

export function groupByDate(ranges: Interval[]): { [x: string]: Interval[] } {
  const results = ranges.reduce(
    (
      previousValue: {
        [date: string]: Interval[];
      },
      currentValue
    ) => {
      if (!currentValue.start) return previousValue;

      const dateString = currentValue.start.toFormat("yyyy-MM-dd");

      previousValue[dateString] =
        typeof previousValue[dateString] === "undefined"
          ? [currentValue]
          : [...previousValue[dateString], currentValue];
      return previousValue;
    },
    {}
  );

  return results;
}

export function intersect(_ranges: DateRange[][]): DateRange[] {
  if (!_ranges.length) return [];
  const ranges = _ranges.map((ranges) => ranges.map(_castDayjsLuxonInterop));
  // Get the ranges of the first user
  let commonAvailability = ranges[0];

  // For each of the remaining users, find the intersection of their ranges with the current common availability
  for (let i = 1; i < ranges.length; i++) {
    const userRanges = ranges[i];
    const intersectedRanges: Interval[] = [];
    commonAvailability.forEach((commonRange) => {
      userRanges.forEach((userRange) => {
        const intersection = commonRange.intersection(userRange);
        if (intersection !== null) {
          // If the current common range intersects with the user range, add the intersected time range to the new array
          intersectedRanges.push(intersection);
        }
      });
    });

    commonAvailability = intersectedRanges;
  }

  // If the common availability is empty, there is no time when all users are available
  if (commonAvailability.length === 0) {
    return [];
  }

  return commonAvailability.map((interval) => _castLuxonDayjsInterop(interval));
}

export function subtract(sourceRanges: DateRange[], excludedRanges: DateRange[]): DateRange[] {
  const resultIntervals: Interval[] = [];

  const _sourceRanges = sourceRanges.map(_castDayjsLuxonInterop);
  const _excludedRanges = excludedRanges.map(_castDayjsLuxonInterop);

  for (const sourceInterval of _sourceRanges) {
    let currentIntervals: Interval[] = [sourceInterval];

    for (const exclusionInterval of _excludedRanges) {
      currentIntervals = currentIntervals.flatMap((interval) =>
        subtractSingleInterval(interval, exclusionInterval)
      );
    }

    resultIntervals.push(...currentIntervals);
  }

  return resultIntervals.map(_castLuxonDayjsInterop);
}

function subtractSingleInterval(interval: Interval, exclusion: Interval): Interval[] {
  if (!interval.isValid || !exclusion.isValid) return [];

  if (exclusion.engulfs(interval)) return [];

  if (interval.engulfs(exclusion)) {
    return splitInterval(interval, exclusion.start, exclusion.end);
  }

  if (interval.overlaps(exclusion)) {
    return excludeOverlap(interval, exclusion);
  }

  return [interval];
}

function splitInterval(
  interval: Interval,
  splitStart: DateTime | null,
  splitEnd: DateTime | null
): Interval[] {
  if (!splitStart || !splitEnd || !interval.start || !interval.end) return [interval];
  return [
    Interval.fromDateTimes(interval.start, splitStart),
    Interval.fromDateTimes(splitEnd, interval.end),
  ].filter((i) => i.isValid && !i.isEmpty());
}

function excludeOverlap(interval: Interval, exclusion: Interval): Interval[] {
  if (!interval.start || !interval.end || !exclusion.start || !exclusion.end) return [interval];
  const newStart = DateTime.max(interval.start, exclusion.end);
  const newEnd = DateTime.min(interval.end, exclusion.start);
  if (newStart < newEnd) {
    // This means there's an overlap and we create a new interval
    return [Interval.fromDateTimes(newStart, newEnd)];
  }
  // No overlap, return an empty array
  return [];
}
