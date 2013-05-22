require.config({
	paths: {
		jquery: 'lib/jquery.min',
		transit: 'lib/jquery.transit.min'
	},
	shim: {
		transit: ['jquery']
	}
});

require(['src/app', 'lib/array.indexof'], function(App) {
	var app = new App();
	app.init();
});
