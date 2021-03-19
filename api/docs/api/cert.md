## Certified Organisation Requests

### Signup

```
POST /cert/signup
```

The signup requires the `appkey`-header to be set.

```
curl --location --request POST 'http://localhost:4000/cert/signup' \
--header 'appkey: 0fbc9153-0bb0-44c3-bfee-9e0e40e0247e' \
--header 'Content-Type: application/json' \
--data-raw '{
	"firstName": "Alan",
	"lastName": "Bake",
	"username": "cert1",
	"password": "123",
	"email": "cert1@gmail.com"
}'
```

```
{
    "username": "test1",
    "password": "123",
    "email": "test1@gmail.com",
    "firstname": "Alex",
    "lastname": "Sanchez"
}
```

The response will contain a `success`-flag and `message` -field:

```
{
    "success": true,
    "data": {
        "user": {
            "id": "b51b9777-3077-4c8a-8651-99c1715eb4d7",
            "username": "cert1",
            "password": "123",
            "firstName": "Alan",
            "lastName": "Bake",
            "mid": "8325d98fdbffd304",
            "privateKey": "-----BEGIN PGP PRIVATE KEY BLOCK-----...",
            "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----...",
            "role": 2,
            "status": 1,
            "email": "cert1@gmail.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "Sign up success"
}
```

| **message**                     |
| :------------------------------ |
| First name is empty             |
| Last name is empty              |
| User name is empty              |
| Email is empty                  |
| Password is empty               |
| Username already exists         |
| Email already exists            |
| Unknown organisation            |

### Signup with Facebook

```
POST /cert/facebook/signup
```

The signup requires the `appkey`-header to be set.

```
curl --location --request POST 'http://localhost:4000/cert/facebook/signup' \
--header 'appkey: 0fbc9153-0bb0-44c3-bfee-9e0e40e0247e' \
--header 'Content-Type: application/json' \
--data-raw '{
	"fbToken": "EAAl7OF0Mwf8BAN86tmeFZB..."
}'
```

```
{
    "fbToken": "EAAl7OF0Mwf8BAN86tmeFZB..."
}
```

The response will contain a `success`-flag and optional `data` and `message` -field:

```
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "Sign up with Facebook success"
}
```

### Login
```
POST /cert/login
```

The login requires the `appkey`-header to be set.

```
curl --location --request POST 'http://localhost:4000/cert/login' \
--header 'Content-Type: application/json' \
--header 'appkey: 0fbc9153-0bb0-44c3-bfee-9e0e40e0247e' \
--data-raw '{
	"username": "cert1",
	"password": "123"
}'
```

```
{
	"username": "cert1",
	"password": "123"
}
```

The response will contain a `success`-flag and optional `data` and `message` fields. If the login succeeds the `data`-field contains a `tokens` and some account information:

```
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

Currently the `token` has a lifetime of **1 day**. After this you need to perform a re-authentication.

### Login with Facebook

```
POST /cert/login
```

The login with facebook requires the params `fbToken` which can be submitted as `application/json` within the body as `json-encoded`-string (see also [general.md](general.md)).

```
curl --location --request POST 'http://localhost:4000/cert/login' \
--header 'appkey: 0fbc9153-0bb0-44c3-bfee-9e0e40e0247e' \
--header 'Content-Type: application/json' \
--data-raw '{
	"fbToken": "EAAl7OF0Mwf8BAN86tmeFZBpqosDy..."
}'
```

```
{
    "fbToken": "EAAl7OF0Mwf8BAN86tmeFZBpq..."
}
```

The response will contain a `success`-flag and optional `data`-array. If the login succeeds the `data`- contains a `token` and some account information:

```
{
    "success": true,
    "data": {
        "email": "cert1@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
    }
}
```

### Update test scores

```
POST /cert/score/update
```

The endpoint requires the token and appkey within the `x-token` and `appkey`-header to be set.

```
curl --location --request POST 'http://localhost:4000/cert/score/update' \
--header 'appkey: 0fbc9153-0bb0-44c3-bfee-9e0e40e0247e' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"key": "php",
	"value": "3.5"
}'
```

```
{
	"key": "php",
	"value": "3.5"
}
```

The response will contain a `success`-flag.

```
{
    "success": true,
    "message": "Score updated scucessfully"
}
```

### Get test score details

```
GET /cert/score/detail
```

The endpoint requires the token and appkey within the `x-token` and `appkey`-header to be set.

```
curl --location --request GET 'http://localhost:4000/cert/score/detail' \
--header 'appkey: 0fbc9153-0bb0-44c3-bfee-9e0e40e0247e' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

The response will contain a `success`-flag.

```
{
    "success": true,
    "data": [
        {
            "id": 1,
            "key": "php",
            "value": 3.5,
            "createdAt": "2020-02-27T13:48:04.000Z",
            "updatedAt": "2020-02-27T13:55:40.000Z",
            "clientId": 4,
            "userId": "b51b9777-3077-4c8a-8651-99c1715eb4d7"
        }
    ]
}
```

### Update M2M rating

```
POST /cert/calcm2m
```
The endpoint requires the token and appkey within the `x-token` and `appkey`-header to be set.

```
curl --location --request POST 'http://localhost:4000/cert/calcm2m' \
--header 'appkey: 0fbc9153-0bb0-44c3-bfee-9e0e40e0247e' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"ratings": [{
		"username": "recruiter1",
		"rating": 5
	}, {
		"username": "freelancer1",
		"rating": 4
	}]
}'
```

```
{
    "ratings": [{
        "username": "recruiter1",
        "rating": 4
    }, {
        "username": "freelancer1",
        "rating": 5
    }]
}
```

The response will contain a `success`-flag.

```
{
    "success": true,
    "message": "Received successfully"
}
```

