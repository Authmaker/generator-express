var nconf = require('nconf');

//error if envornment is not set correctly
if (['production', 'staging', 'test', 'development'].indexOf(process.env.NODE_ENV) === -1) {
    throw new Error("NODE_ENV must be production, staging, test or development");
}

nconf.file('localOverrides', __dirname + '/' + process.env.NODE_ENV + '.json');

//common options
nconf.defaults({
    server: {
        run_port: 3000
    },
});

module.exports = nconf.get();
