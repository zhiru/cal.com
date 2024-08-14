import type { Field, Response } from "../types/types";

function transformSelectValue({
  field,
  idOrLabel,
}: {
  field: Pick<Field, "options" | "type">;
  idOrLabel: string;
}) {
  idOrLabel = idOrLabel.trim();
  const options = field.options;
  if (!options) {
    return idOrLabel;
  }
  const areOptionsInLegacyFormat = !!options.find((option) => !option.id);
  const shouldUseLabelAsValue = areOptionsInLegacyFormat;
  const foundOptionById = options.find((option) => option.id === idOrLabel);
  if (foundOptionById) {
    if (shouldUseLabelAsValue) {
      return foundOptionById.label;
    } else {
      // If shouldUseLabelAsValue is false, then we must use id as value
      // Because shouldUseLabelAsValue is false, id must be set already
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return foundOptionById.id!;
    }
  } else {
    // No option was found that matches ID
    // So check if the label is provided
    const foundOptionByLabel = options.find((option) => {
      return option.label === idOrLabel;
    });
    if (foundOptionByLabel) {
      if (!shouldUseLabelAsValue) {
        // If shouldUseLabelAsValue is false, then we must use id as value
        // Because shouldUseLabelAsValue is false, id must be set already
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return foundOptionByLabel.id!;
      }
    }
  }
  return idOrLabel;
}

export default function transformFieldResponse({
  field,
  value,
}: {
  field: Pick<Field, "options" | "type">;
  value: Response[string]["value"] | undefined;
}) {
  if (!value) {
    return "";
  }
  // type="number" still gives value as a string but we need to store that as number so that number operators can work.
  if (field.type === "number") {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
  if (field.type === "multiselect") {
    // Could be option id(i.e. a UUIDv4) or option label for ease of prefilling
    let valueOrLabelArray = value instanceof Array ? value : value.toString().split(",");

    valueOrLabelArray = valueOrLabelArray.map((idOrLabel) => {
      return transformSelectValue({ field, idOrLabel });
    });

    return valueOrLabelArray;
  }

  if (field.type === "select") {
    const valueAsStringOrStringArray = typeof value === "number" ? String(value) : value;
    const valueAsString =
      valueAsStringOrStringArray instanceof Array
        ? valueAsStringOrStringArray[0]
        : valueAsStringOrStringArray;

    return transformSelectValue({ field, idOrLabel: valueAsString });
  }
  return value;
}
