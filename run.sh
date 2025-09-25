#!/bin/bash

# List of supported browsers
BROWSERS=("chromium" "firefox" "webkit")

show_help() {
  echo "Usage: $0 [-b browser1,browser2,...] [-s slowMo] [--headed] [featureFilesOrFolders]"
  echo ""
  echo "Options:"
  echo "  -b <list>   Run tests only in the specified browsers (comma separated)"
  echo "  -s <ms>     SlowMo in milliseconds (default: 0)"
  echo "  --headed    Run browsers in headed mode (default: headless)"
  echo "  -h          Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0                            # run all browsers on all features in headless mode and default slowMo"
  echo "  $0 -b chromium                # run only chromium on all features in headless mode and default slowMo"
  echo "  $0 -b chromium,firefox features/login.feature"
  echo "  $0 -b webkit features/cart/"
  echo "  $0 -s 200 --headed            # run all browsers slowMo=2 seconds, headed"
  echo "  $0 -b chromium -s 100         # run chromium only, slowMo=1 second, headless"
  echo "  $0 -b firefox,webkit --headed # run firefox + webkit headed"
  echo ""
  echo "Supported browsers: ${BROWSERS[*]}"
  exit 0
}

# defaults
SLOWMO=0
HEADLESS=true

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    -b) SELECTED_BROWSERS="$2"; shift 2 ;;
    -s) SLOWMO="$2"; shift 2 ;;
    --headed) HEADLESS=false; shift ;;
    -h) show_help ;;
    *) FEATURE_PATHS="$FEATURE_PATHS $1"; shift ;;
  esac
done

mkdir -p reports

if [ -n "$SELECTED_BROWSERS" ]; then
  IFS=',' read -ra CHOSEN <<< "$SELECTED_BROWSERS"
  for BROWSER in "${CHOSEN[@]}"; do
    if [[ " ${BROWSERS[*]} " =~ " ${BROWSER} " ]]; then
      echo "============================"
      echo " Running tests in $BROWSER (slowMo=$SLOWMO, headless=$HEADLESS)"
      echo "============================"
      REPORT_FILE="reports/cucumber-report-${BROWSER}.html"
      BROWSER=$BROWSER SLOWMO=$SLOWMO HEADLESS=$HEADLESS npx cucumber-js $FEATURE_PATHS \
        --format html:${REPORT_FILE} --format progress
    else
      echo "❌ Browser '${BROWSER}' is not supported."
      echo "Supported browsers are: ${BROWSERS[*]}"
      exit 1
    fi
  done
else
  for BROWSER in "${BROWSERS[@]}"; do
    echo "============================"
    echo " Running tests in $BROWSER (slowMo=$SLOWMO, headless=$HEADLESS)"
    echo "============================"
    REPORT_FILE="reports/cucumber-report-${BROWSER}.html"
    BROWSER=$BROWSER SLOWMO=$SLOWMO HEADLESS=$HEADLESS npx cucumber-js $FEATURE_PATHS \
      --format html:${REPORT_FILE} --format progress
  done
fi
