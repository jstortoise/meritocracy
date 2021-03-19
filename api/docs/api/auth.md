## Authentication

### Signup

```
POST /auth/signup
```

The signup requires the user informations which can be submitted as `application/json` within the body as `json-encoded`-string (see also [general.md](general.md)).

```
curl --location --request POST 'https://api.keycloak.dev.galaxias.io/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
	"firstName": "Alex",
	"lastName": "Ben",
	"username": "test1",
	"password": "123",
	"email": "test1@gmail.com"
}'
```

```
{
	"firstName": "Alex",
	"lastName": "Ben",
	"username": "test1",
	"password": "123",
	"email": "test1@gmail.com"
}
```

The response will contain a `success`-flag and `message`-fields.

```
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
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

### Signup with Facebook

```
POST /auth/facebook/signup
```

Signup with Facebook requires Facebook access token from the client.

```
curl --location --request POST 'https://api.keycloak.dev.galaxias.io/auth/facebook/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
	"fbToken": "EAAl7OF0Mwf8BAN86tmeFZBpq..."
}'
```

```
{
    "fbToken": "EAAl7OF0Mwf8BAN86tmeFZBpq..."
}
```

The response will contain a `success`-flag and optional `data` and `message` -field:

```
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
    },
    "message": "Sign up with Facebook success",
}
```

| **message**                                |
| :----------------------------------------- |
| Facebook authentication failed             |
| The email is already in use on Meritocracy |
| User name is empty                         |
| Email is empty                             |
| Password is empty                          |
| Username already exists                    |
| Email already exists                       |
| Unknown organisation                       |

### Login

```
POST /auth/login
```

The login requires the params `username` and `password` which can be submitted as `application/json` within the body as `json-encoded`-string (see also [general.md](general.md)).

```
curl --location --request POST 'https://api.keycloak.dev.galaxias.io/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
	"username": "test1",
	"password": "123"
}'
```

```
{
    "username": "test1",
    "password": "123"
}
```

The response will contain a `success`-flag and optional `data`-array. If the login succeeds the `data`- contains a `token` and some account information:

```
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
    }
}
```

Currently the `token` has a lifetime of **1 day**. After this you need to perform a re-authentication.

### Login with Facebook

```
POST /auth/login
```

The login with facebook requires the params `fbToken` which can be submitted as `application/json` within the body as `json-encoded`-string (see also [general.md](general.md)).

```
curl --location --request POST 'https://api.keycloak.dev.galaxias.io/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
	"fbToken": "EAAl7OF0Mwf8BAN86tmeFZBpq..."
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
        "email": "test1@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
    }
}
```

### Logout

```
GET /auth/logout
```

The logout requires the tokens within the `x-token`-header to be set.
On logout the token will be invalidated and further actions on behalf of this token aren't possible anymore. The response will contains the success-flag for the logout-action:

```
curl --location --request GET 'https://api.keycloak.dev.galaxias.io/auth/logout' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5...' \
--header 'Content-Type: application/json'
```

```
{
    "success": true,
    "message": "Logout success"
}
```

### Get Recaptcha

```
GET /auth/captcha
```

```
curl --location --request GET 'https://api.keycloak.dev.galaxias.io/auth/logout' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json'
```

```
{
    "success": true,
    "data": {
        text: "eiPb",
        data: "<svg ...>...</svg>"
    }
}
```

### Get Reset Password Link

```
GET /auth/forgot/:email
```

```
curl --location --request GET 'https://api.keycloak.dev.galaxias.io/auth/forgot/gablaupat@outlook.com'
```

```
{
    "success": true,
    "data": "Password reset request has been sent. Please check your email."
}
```

### Verify Reset Password Link

```
GET /auth/reset/:resetId
```

```
curl --location --request GET 'http://localhost:4000/auth/reset/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

```
{
    "success": true,
    "message": "Valid link"
}
```

### Reset Password

```
POST /auth/reset/:resetId
```

```
curl --location --request POST 'http://localhost:4000/auth/reset/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"email": "gablaupat@outlook.com",
	"password": "123"
}'
```

```
{
    "success": true,
    "message": "Reset password success"
}
```

### Send Verification Email

```
GET /auth/verify/send/:email
```

```
curl --location --request GET 'http://localhost:4000/auth/verify/send/gablaupat@outlook.com' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

```
{
    "success": true,
    "message": "Sent verification email successfully"
}
```

### Verify Email

```
GET /auth/verify/email/:verifyId
```


```
curl --location --request GET 'http://localhost:4000/auth/verify/email/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

```
{
    "success": true,
    "message": "Your email is successfully verified"
}
```

### Add Social Account on Chrome Extension

```
POST /auth/social/:social_type/add
```

Add social account to current logged in user.

```
curl -d "{\"o_token\": \"...\", \"origin_id\": \"123\"}" -H "Content-Type: application/json" https://api.keycloak.dev.galaxias.io/auth/social/2/add
```

```
{
    "o_token": "...",
    "origin_id": "123"
}
```

```
- social_type
1: Google
2: Facebook
3: Twitter
4: Instagram
```

```
{
    "success": true
}
```

### Identify Social Account on Chrome Extension

```
POST /auth/social/:email/:social_type/identify
```

Identify social account to current logged in user.

```
curl -d "{\"origin_id\": \"123\"}" -H "Content-Type: application/json" https://api.keycloak.dev.galaxias.io/auth/social/test1@gmail.com/2/identify
```

```
{
    "origin_id": "123"
}
```

```
- social_type
1: Google
2: Facebook
3: Twitter
4: Instagram
```

```
{
    "success": true
}
```

### Get Keycloak Realm Settings

```
GET /auth/settings
```

Get all settings from Keycloak realm.

```
curl -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/auth/settings
```

```
{
    "success": true,
    "data": {
        ...
    }
}
```


### Identify Social Account on Chrome Extension

```
POST /auth/settings
```

Update Keycloak realm settings

```
curl -d "{\"accessTokenLifespan\": \"3600\"}" -H "Content-Type: application/json" https://api.keycloak.dev.galaxias.io/auth/settings
```

```
{
    "accessTokenLifespan": "3600",
    ...
}
```

```
{
    "success": true
}
```


### Search Profiles and Organisations

```
POST /auth/search
```

Search all users and organisations by search filters

```
curl -d "{\"keyword\": \"test\"}" -H "Content-Type: application/json" https://api.keycloak.dev.galaxias.io/auth/search
```

- Requeset parameters

```
{
    "keyword": "3600",
    ...
}
```

- Paramter details

| Field               | Description                                           |
| :------------------ | :---------------------------------------------------- |
| keyword             | Search keyword                                        |
| filter              | -1: any, 0: people profiles, 1: organisations         |
| organisation_filter | -1: all, 0: legacy, 1: certified, 2: my organisations |
| profile_filter      | -1: all, 3: users, 2: moderators, 1: admins           |
| source              | -1: all, 0: you, 1: your friends, 2: admins           |
| date                | -1: any, year of date (e.g. 2019)                     |
| date_from           | Created date filter (e.g. 2019-09-01)                 |
| date_to             | Created date filter (e.g. 2019-09-01)                 |
| join_date_from      | Join date filter (e.g. 2019-09-01)                    |
| join_date_to        | Join date filter (e.g. 2019-09-01)                    |
| mp_range_from       | Merit point range filter (e.g. 110)                   |
| mp_range_to         | Merit point range filter (e.g. 110)                   |
| organisation        | Organisation appkey for search filter                 |

- Response

```
{
    "success": true,
    "data": {
        "users": [...],
        "clients": [...]
    }
}
```


### Send tokens

```
POST /auth/token/send
```

Send tokens to a user.

```
curl -d "{\"token_amount\": \"100\", \"user_id\": \"user_mid_here\"}" -H "Content-Type: application/json" https://api.keycloak.dev.galaxias.io/auth/token/send
```

- Requeset parameters

```
{
    "token_amount": "100",
    "user_id": "<user_mid_here>"
}
```

- Response

```
{
    "success": true
}
```

### Organisation Logout

```
GET /auth/org/logout
```

The organisation logout requires the token and appkey within the `x-token` and `appkey`-header to be set.
On logout the token will be invalidated and further actions on behalf of this token aren't possible anymore. The response will contains the success-flag for the logout-action:

```
curl -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/auth/org/logout"
```

```
{
    "success": true
}
```
