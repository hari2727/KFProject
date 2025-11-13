#!/usr/bin/env bash
if [ -d node_modules ]; then
    echo "Removing node_modules"
    rm -rf node_modules
fi
if [ -d release_temp ]; then
    echo "Removing release_temp"
    rm -rf release_temp
fi
if [ -d release ]; then
    echo "Removing release"
    rm -rf release
fi
if [ -d dist ]; then
    echo "Removing dist"
    rm -rf dist
fi
if [ -d .angular ]; then
    echo "Removing .angular"
    rm -rf .angular
fi
npm install
npm install jsontool@7.0.2
npm run build:all tarc ci-invoker no-sourcemap
npm run ci-put-local -- --input deploy/prod-beijing.json --only app manual-languges --target release_temp --auto
RELEASE_FOLDER="release-$(date -u '+%m%d%H%M%S')"
mv release_temp "${RELEASE_FOLDER}"
echo "----------------------------------------------------"
echo "  NOW "
echo ""
echo "- Go check '${RELEASE_FOLDER}/' folder"
echo "- Upload files to s3 bucket responsively"
echo "- Do not forget to make uploaded files public"
echo "- Hit CF cache"
echo ""
echo ""
