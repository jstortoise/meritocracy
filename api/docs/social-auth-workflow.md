# Social Authentication Workflow

## Facebook

### 1. Signup with Facebook

#### Get Facebook Access Token with Meritocracy API

By calling Meritocracy API on the frontend(Meritocracy, Legacy, Certified), you can get login to Facebook and get your Facebook access token.

For more details, please refer to [social-auth-org](https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/social-auth-org.md)

Now, you've got Facebook access token.

```
e.g. accessToken = "f8e7f8ej3k4ud8so3ku4u...."
```

#### Signup with Meritocracy API

Now, you can use Meritocracy API to signup with Facebook account.

Each system has different Meritocracy API to signup with Facebook.

##### Meritocracy System

Meritocracy frontend send request to the following Meritocracy API to signup.

Please refer to https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/api/auth.md#user-content-signup-with-facebook

```
POST /auth/facebook/signup
Host: api.keycloak.dev.galaxias.io
Content-Type: application/json
[...]
```

##### Legacy Organisation

- Legacy frontend send request to the following Legacy backend to signup.

Please refer to https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-organisation-api/blob/master/docs/api/auth.md#user-content-signup-with-facebook

- Legacy backend send request to the following Meritocracy API to signup.

Please refer to https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/api/legacy.md#user-content-signup-with-facebook

```
POST /legacy/facebook/signup
Host: api.keycloak.dev.galaxias.io
Content-Type: application/json
[...]
```

##### Certified Organisation

- Certified frontend send request to the following Certified backend to signup.

Please refer to https://gitlab.securesystemdesign.io/Meritocracy/certified-organisation-api/blob/master/docs/api/auth.md#user-content-signup-with-facebook

- Certified backend send request to the following Meritocracy API to signup.

Please refer to https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/api/certorg.md#user-content-signup-with-facebook

```
POST /cert/facebook/signup
Host: api.keycloak.dev.galaxias.io
Content-Type: application/json
[...]
```


### 2. Login with Facebook

#### Get Facebook Access Token with Meritocracy API

By calling Meritocracy API on the frontend(Meritocracy, Legacy, Certified), you can get login to Facebook and get your Facebook access token.

For more details, please refer to [social-auth-org](https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/keycloak.md)

Now, you've got Facebook access token.

```
e.g. accessToken = "f8e7f8ej3k4ud8so3ku4u...."
```

#### Login with Meritocracy API

Now, you can use Meritocracy API to login with Facebook account.

Each system has different Meritocracy API to login with Facebook.

##### Meritocracy System

Meritocracy frontend send request to the following Meritocracy API to login.

Please refer to https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/api/auth.md#user-content-login

```
POST /auth/login
Host: api.keycloak.dev.galaxias.io
Content-Type: application/json
[...]
```

##### Legacy Organisation

- Legacy frontend send request to the following Legacy backend to login.

Please refer to https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-organisation-api/blob/master/docs/api/auth.md#user-content-login

- Legacy backend send request to the following Meritocracy API to login.

Please refer to https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/api/legacy.md#user-content-login

```
POST /legacy/login
Host: api.keycloak.dev.galaxias.io
Content-Type: application/json
[...]
```

##### Certified Organisation

- Certified frontend send request to the following Certified backend to login.

Please refer to https://gitlab.securesystemdesign.io/Meritocracy/certified-organisation-api/blob/master/docs/api/auth.md#user-content-login

- Certified backend send request to the following Meritocracy API to login.

Please refer to https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/api/certorg.md#user-content-login

```
POST /cert/login
Host: api.keycloak.dev.galaxias.io
Content-Type: application/json
[...]
```
