const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');

module.exports = withCss(withSass({
    serverRuntimeConfig: {
    },
    publicRuntimeConfig: {
		// Will be available on both server and client
		staticFolder: '/static',
		API_URL: 'https://api.keycloak.dev.galaxias.io',
		// API_URL: 'http://localhost:4000',
    },
    webpack: (config, options) => {
      	config.module.rules.push({
			test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
			loader: 'url-loader?limit=100000'
		});
		return config;
    }
}));