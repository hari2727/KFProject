const { copy, move } = require('./fs');

(async () => {
    console.log('Pre-Compodoc:\n');

    await copy('./vendor/compodoc/index.js', './node_modules/@compodoc/compodoc/dist');
    await copy('./vendor/compodoc/unit-test-report.hbs', './node_modules/@compodoc/compodoc/src/templates/partials');
    await copy('./vendor/compodoc/overview.hbs', './node_modules/@compodoc/compodoc/src/templates/partials');

    await move('./coverage', './documentation');
    await move('./jest-html-reporters-attach', './documentation');
    await move('./jest_html_reporters.html', './documentation');

})().catch(_ => process.exit(1)).then(_ => console.log(''));
