#!/bin/bash

# List of supported browsers
# BROWSERS=("chromium" "firefox" "webkit")
BROWSERS=("chrome" "brave")

show_help() {
  echo "Usage: $0 [-b browser1,browser2,...] [featureFilesOrFolders]"
  echo ""
  echo "Options:"
  echo "  -b <list>   Run tests only in the specified browsers (comma separated)"
  echo "  -h          Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0                   # run all browsers on all features"
  echo "  $0 -b chromium       # run only chromium"
  echo "  $0 -b chromium,firefox features/login.feature"
  echo "  $0 -b webkit features/cart/"
  echo ""
  echo "Supported browsers: ${BROWSERS[*]}"
  exit 0
}

# Parse args
while getopts "b:h" opt; do
  case $opt in
    b) SELECTED_BROWSERS=$OPTARG ;;
    h) show_help ;;
    *) show_help ;;
  esac
done

# Remove parsed options so only feature paths remain
shift $((OPTIND-1))

FEATURE_PATHS="$@"
mkdir -p reports

# If -b is passed, split it into an array
if [ -n "$SELECTED_BROWSERS" ]; then
  IFS=',' read -ra CHOSEN <<< "$SELECTED_BROWSERS"
  for BROWSER in "${CHOSEN[@]}"; do
    if [[ " ${BROWSERS[*]} " =~ " ${BROWSER} " ]]; then
      echo "============================"
      echo " Running tests in $BROWSER "
      echo "============================"
      REPORT_FILE="reports/cucumber-report-${BROWSER}.html"
      BROWSER=$BROWSER npx cucumber-js $FEATURE_PATHS \
        --format html:${REPORT_FILE} --format progress
    else
      echo "❌ Browser '${BROWSER}' is not supported."
      echo "Supported browsers are: ${BROWSERS[*]}"
      exit 1
    fi
  done
else
  # Otherwise run all browsers
  for BROWSER in "${BROWSERS[@]}"; do
    echo "============================"
    echo " Running tests in $BROWSER "
    echo "============================"
    REPORT_FILE="reports/cucumber-report-${BROWSER}.html"
    BROWSER=$BROWSER npx cucumber-js $FEATURE_PATHS \
      --format html:${REPORT_FILE} --format progress
  done
fi
