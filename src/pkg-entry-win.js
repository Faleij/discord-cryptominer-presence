const path = require('path');

// make sure working dir is correct
process.chdir(path.dirname(process.execPath));

require('./systray');
require('./app');
