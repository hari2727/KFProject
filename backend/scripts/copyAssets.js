const { copy } = require("./fs");

(async () => {
    console.log('Copying static assets\n');

    // await copy('./src/modules/job/properties/data', './release/modules/job/properties');

})().catch(_ => process.exit(1)).then(_ => console.log(''));
