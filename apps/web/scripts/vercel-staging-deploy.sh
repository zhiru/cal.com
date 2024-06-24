#!/bin/bash

if [ "$SKIP_APP_DIR" == "1" ]; then
  echo "Skipping app directory build"
  rm -rf \
    app/future/event-types\
    app/future/apps/installed\
    app/future/apps/\[slug\]\
    app/future/apps/\[slug\]/setup\
    app/future/apps/categories\
    app/future/apps/categories/\[category\]\
    app/future/workflows\
    app/future/settings/teams\
    app/future/getting-started\
    app/future/apps\
    app/future/bookings\
    app/future/video\
    app/future/teams\
    app/future/[user]\
    app/future/auth\
    app/future/booking\
    app/future/connect-and-join\
    app/future/d\
    app/future/enterprise\
    app/future/insights\
    app/future/maintenance\
    app/future/more\
    app/future/org\
    app/future/payment\
    app/future/reschedule\
    app/future/routing-forms\
    app/future/signup\
    app/future/team
fi
if [ "$VERCEL_ENV" == "preview" ]; then exit 1; else exit 0; fi
