module.exports = {
  default: `--require ./features/stepDefinitions/**/*.js \
            --require ./features/utils/hooks.js \
            --format progress \
            --format html:./reports/cucumber-report.html \
            --format json:./reports/cucumber-report.json`
};
