import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { ImageUploader, Avatar, Button } from "@calcom/ui";

const ImageUploadField = <TFieldValues extends FieldValues>({
  name,
  control,
}: {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
}) => {
  const { t } = useLocale();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const showRemoveAvatarButton = !!value;
        return (
          <>
            <Avatar imageSrc={value} alt="Name" size="lg" />
            <div className="ms-4">
              <h2 className="mb-2 text-sm font-medium">{t("profile_picture")}</h2>
              <div className="flex gap-2">
                <ImageUploader
                  target={name}
                  id="avatar-upload"
                  buttonMsg={t("upload_target", { target: name })}
                  handleAvatarChange={onChange}
                  imageSrc={value}
                  triggerButtonColor={showRemoveAvatarButton ? "secondary" : "primary"}
                />

                {showRemoveAvatarButton && (
                  <Button
                    color="secondary"
                    onClick={() => {
                      onChange(null);
                    }}>
                    {t("remove")}
                  </Button>
                )}
              </div>
            </div>
          </>
        );
      }}
    />
  );
};

export { ImageUploadField };
