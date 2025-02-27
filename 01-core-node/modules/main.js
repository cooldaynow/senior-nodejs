const module1 = require('./module1');
const module2 = require('./module1');
console.log(`module1 === module2 (${module1 === module2})`);
console.log(require.cache);
