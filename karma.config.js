module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        plugins: [
            require('karma-mocha'),
            require('karma-chai'),
            require('karma-chrome-launcher')
        ],
        files: [
            'tests/test.js',
            'dist/mhtml2html.js',
            {
                pattern: 'tests/templates/**/*.mhtml',
                included: false,
                served: true,
                watched: false,
                nocache: true
            }
        ],
        proxies: {
            "/templates/": "/base/tests/templates/"
        },
        reporters: ['progress'],
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        concurrency: Infinity
    });
};
