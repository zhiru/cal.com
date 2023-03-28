import { useState } from "react";
import { FormattedNumber, IntlProvider } from "react-intl";



import { useAppContextWithSchema } from "@calcom/app-store/EventTypeAppContext";
import AppCard from "@calcom/app-store/_components/AppCard";
import type { EventTypeAppCardComponent } from "@calcom/app-store/types";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { TextField } from "@calcom/ui";
import { FiSunrise, FiSunset } from "@calcom/ui/components/icon";



import type { appDataSchema } from "../zod";


const EventTypeAppCard: EventTypeAppCardComponent = function EventTypeAppCard({ eventType, app }) {
  const [getAppData, setAppData] = useAppContextWithSchema<typeof appDataSchema>();
  const receiverAddress = getAppData("receiverAddress");
  const price = getAppData("price");
  const [enabled, setEnabled] = useState(getAppData("enabled"));

    const { t } = useLocale();

  return (
    <AppCard
      setAppData={setAppData}
      app={app}
      switchOnClick={(e) => {
        if (!e) {
          setEnabled(false);
          setAppData("enabled", false);
        } else {
          setEnabled(true);
          setAppData("enabled", true);
        }
      }}
      description={
        <>
          <div className="">
            {t("require_payment")} (1%)
          {" "}
            {t("commission_per_transaction")}
          </div>
        </>
      }
      switchChecked={enabled}>
      <div className="mt-2 text-sm">
        <div className="block items-center sm:flex">
        <div className="min-w-48 mb-4 sm:mb-0">
          <label htmlFor="smartContractAddress" className="flex text-sm font-medium text-gray-700">
            Receiving Address
          </label>
        </div>
        <div className="w-full">
          <div className="relative mt-1 rounded-sm">
            <input
              type="text"
              className="block w-full rounded-sm border-gray-300 text-sm "
              placeholder={t("Example: 0x71c7656ec7ab88b098defb751b7401b5f6d8976f")}
              defaultValue={(receiverAddress || "") as string}
              onChange={(e) => {
                setAppData("receiverAddress", e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      </div>
         <div className="mt-2 text-sm">
        <div className="block items-center sm:flex">
        <div className="min-w-48 mb-4 sm:mb-0">
          <label htmlFor="smartContractAddress" className="flex text-sm font-medium text-gray-700">
            Price
          </label>
        </div>
        <div className="w-full">
              <div className="mt-2 block items-center sm:flex w-full">
              <TextField
                label=""
                addOnLeading={<>USD</>}
                step="0.01"
                min="0.5"
                type="number"
                required
                className="block w-full rounded-sm border-gray-300 pl-2 pr-2 text-sm"
                placeholder="Price"
                onChange={(e) => {
                  setAppData("price", Number(e.target.value) * 100);
                }}
                value={price > 0 ? price / 100 : undefined}
              />
            </div>
        </div>
      </div>
      </div>
    </AppCard>
  );
};

export default EventTypeAppCard;