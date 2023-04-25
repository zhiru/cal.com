import { shallow } from "zustand/shallow";

import dayjs from "@calcom/dayjs";
import { Button, ButtonGroup } from "@calcom/ui";
import { ChevronLeft, ChevronRight } from "@calcom/ui/components/icon";

import { useCalendarStore } from "../../state/store";

export function SchedulerHeading() {
  const [startDate, endDate, handleDateChange] = useCalendarStore(
    (state) => [dayjs(state.startDate), dayjs(state.endDate), state.handleDateChange],
    shallow
  );

  return (
    <header className="flex flex-none flex-col justify-between py-4 sm:flex-row sm:items-center">
      <h1 className="text-emphasis text-xl font-semibold">
        {startDate.format("MMM DD")}-{endDate.format("DD")}
        <span className="text-subtle">,{startDate.format("YYYY")}</span>
      </h1>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <ButtonGroup combined>
          {/* TODO: i18n label with correct view */}
          <Button
            StartIcon={ChevronLeft}
            variant="icon"
            color="secondary"
            aria-label="Previous Week"
            onClick={() => {
              handleDateChange("DECREMENT");
            }}
          />
          <Button
            StartIcon={ChevronRight}
            variant="icon"
            color="secondary"
            aria-label="Next Week"
            onClick={() => {
              handleDateChange("INCREMENT");
            }}
          />
        </ButtonGroup>
      </div>
    </header>
  );
}
