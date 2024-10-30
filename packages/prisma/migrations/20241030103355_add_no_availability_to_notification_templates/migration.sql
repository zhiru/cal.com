-- This is an empty migration.
INSERT INTO
  "NotificationTemplate" (
    id,
    title,
    description,
    "triggerEvent",
    "isSystem",
    "createdAt",
    "updatedAt"
  )
VALUES
  (
    gen_random_uuid(),
    'no_availability_notification_title',
    'no_availability_notification_description',
    'NO_SLOTS_FOR_TEAM',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
