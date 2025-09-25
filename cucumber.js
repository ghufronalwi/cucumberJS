module.exports = {
  default: `--require ./features/stepDefinitions/**/*.js \
            --require ./features/utils/hooks.js \
            --format progress \
            --format json:./reports/cucumber-report.json`
};
