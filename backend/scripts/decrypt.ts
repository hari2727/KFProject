const { getDefaultCypherService } = require("../src/_shared/cypher/cypher");

console.log(getDefaultCypherService(process.argv[3]).decryptValue(process.argv[2]));
