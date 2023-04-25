import { shallow } from "zustand/shallow";

import dayjs from "@calcom/dayjs";
import { useBreakpoints } from "@calcom/lib/hooks/useMediaQuery";

import { Calendar } from "../../../calendars/weeklyview";
import { useBookerStore } from "../store";

export const LargeCalendar = () => {
  const { isTablet } = useBreakpoints();
  const [setSelectedDate, setSelectedTimeslot] = useBookerStore(
    (state) => [state.setSelectedDate, state.setSelectedTimeslot],
    shallow
  );
  const startDateString = useBookerStore((state) => state.selectedDate);

  const startDate = dayjs(startDateString);

  const extraDays = isTablet ? 2 : 4;

  return (
    <Calendar
      startDate={startDate.toDate()}
      endDate={startDate.add(extraDays, "days").toDate()}
      events={[]}
    />
  );
};
