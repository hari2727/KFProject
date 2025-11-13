const { getDefaultCypherService } = require("../src/_shared/cypher/cypher");

console.log(getDefaultCypherService(process.argv[3]).encryptValue(process.argv[2]));
