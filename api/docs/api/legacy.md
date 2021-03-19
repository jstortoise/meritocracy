## Legacy Organisation Requests

### Signup
```
POST /legacy/signup
```

The signup requires the user informations which can be submitted as `application/json` within the body as `json-encoded`-string (see also [general.md](general.md)).

```
curl --location --request POST 'http://localhost:4000/legacy/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
	"username": "legacy1",
    "password": "123",
    "email": "legacy1@gmail.com",
    "firstName": "Alen",
    "lastName": "Sanchez",
    "appkey": "23c2e74b-3a2d-40d6-9713-444d0555605f"
}'
```

```
{
	"username": "legacy1",
    "password": "123",
    "email": "legacy1@gmail.com",
    "firstName": "Alen",
    "lastName": "Sanchez",
    "appkey": "23c2e74b-3a2d-40d6-9713-444d0555605f"
}
```

The response will contain a `success`-flag and optional `mid` and `message`-fields.

```
{
    "success": true,
    "data": {
        "user": {
            "id": "f2ccd657-0284-4bcd-8301-dfebdf7b320e",
            "username": "legacy1",
            "password": "123",
            "firstName": "Alen",
            "lastName": "Sanchez",
            "mid": "e2970cfe68b5cade",
            "privateKey": "-----BEGIN PGP PRIVATE KEY BLOCK-----...",
            "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----...",
            "role": 2,
            "status": 1,
            "email": "legacy1@gmail.com"
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
POST /legacy/facebook/signup
```

Signup with Facebook requires Facebook access token from the client.

```
curl --location --request POST 'http://localhost:4000/legacy/facebook/signup' \
--header 'Content-Type: application/json' \
--header 'appkey: 23c2e74b-3a2d-40d6-9713-444d0555605f' \
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
POST /legacy/login
```

The login requires the params `username`, `password` and `appkey` of the legacy organisation which can be submitted as `application/json` within the body as `json-encoded`-string (see also [general.md](general.md)).

```
curl --location --request POST 'http://localhost:4000/legacy/login' \
--header 'Content-Type: application/json' \
--header 'appkey: 23c2e74b-3a2d-40d6-9713-444d0555605f' \
--data-raw '{
	"username": "legacy1",
	"password": "123",
	"appkey": "23c2e74b-3a2d-40d6-9713-444d0555605f"
}'
```

```
{
	"username": "legacy1",
	"password": "123",
	"appkey": "23c2e74b-3a2d-40d6-9713-444d0555605f"
}
```

The response will contain a `success`-flag and optional `data`-array. If the login succeeds the `data`-array contains a `token` and some account information:

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
POST /legacy/login
```

The login with facebook requires the params `fbToken` which can be submitted as `application/json` within the body as `json-encoded`-string (see also [general.md](general.md)).

```
curl --location --request POST 'http://localhost:4000/legacy/login' \
--header 'Content-Type: application/json' \
--header 'appkey: 23c2e74b-3a2d-40d6-9713-444d0555605f' \
--data-raw '{
	"fbToken": "EAAl7OF0Mwf8BAN86tmeFZBpqosDyGQO...",
	"appkey": "23c2e74b-3a2d-40d6-9713-444d0555605f"
}'
```

```
{
	"fbToken": "EAAl7OF0Mwf8BAN86tmeFZBpqosDyGQO...",
	"appkey": "23c2e74b-3a2d-40d6-9713-444d0555605f"
}
```

The response will contain a `success`-flag and optional `data`-array. If the login succeeds the `data`- contains a `token` and some account information:

```
{
    "success": true,
    "data": {
        "email": "legacy1@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```
