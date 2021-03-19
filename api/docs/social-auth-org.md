# Development instructions

## Add a facebook authentication

There're many ways to implement facebook authentication on frontend side using open libraries.

### How to login with Facebook using Meritocracy API

#### 1. Register your organisation to Meritocracy system

Login to Meritocracy system and go to [Organisation List](https://ui.keycloak.dev.galaxias.io/client/list). By clicking **Add Client** button, you can add your organisation.

After register your organisation, by clicking **View Stats** button, you can get `appkey` of your organisation.

#### 2. How to get Facebook access token using Meritocracy

Here's the example of code snippet of using Meritocracy API.

```
	window.open(
		'https://api.keycloak.dev.galaxias.io/social/facebook/login/' + config.APP_KEY,
		'mywindow',
		'width=850,height=650',
	);
	// Create IE + others compatible event handler
	var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
	var eventer = window[eventMethod];
	var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
	// Listen to message from child window
	eventer(
		messageEvent,
		function(e) {
			// Facebook access token is stored as e.data
			callback(e.data);
		},
		false,
	);
```

On the above code, you can replace your APP_KEY with `config.APP_KEY`.

After getting facebook access token, you can use [login endpoint](https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/api/auth.md#user-content-login) or [signup endpoint](https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/api/auth.md#user-content-signup-with-facebook)

### Other ways

Here're possible ways to implement FB authentication on your react.js project.

- Facebook SDK

Please refer to https://developers.facebook.com/docs/facebook-login/web/

- react-facebook-login

Please refer to hthttps://www.npmjs.com/package/react-facebook-login

- react-facebook-auth

Please refer to https://www.npmjs.com/package/react-facebook-auth

- react-facebook

Please refer to https://www.npmjs.com/package/react-facebook
