## Account requests


### Get Current User Details

```
GET /user/me
```


```
curl --location --request GET 'http://localhost:4000/user/me' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

```
{
    "success": true,
    "data": {
        "id": "0b10e976-1348-43d4-969b-523a16d8d2a7",
        "username": "test1",
        "password": "$2a$10$/9nOEXOwEHxq4ads2EU1y.ojeD/hr39AZpoe4i4sfI7FgI69KA1sq",
        "firstName": "Alex",
        "lastName": "Ben",
        "role": 3,
        "mid": "c6cb9b96ddb9f318",
        "privateKey": "-----BEGIN PGP PRIVATE KEY BLOCK-----...",
        "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----...",
        "mpRating": null,
        "m2mRating": null,
        "status": 1,
        "createdAt": "2020-02-26T20:31:13.000Z",
        "updatedAt": "2020-02-27T14:04:17.000Z",
        "meritPoint": null,
        "emails": [
            {
                "id": 6,
                "email": "test1@gmail.com",
                "isPrimary": 1,
                "isVerified": 0,
                "isActive": 1,
                "isResetPwd": 0,
                "createdAt": "2020-02-26T20:31:13.000Z",
                "updatedAt": "2020-02-26T20:31:13.000Z",
                "userId": "0b10e976-1348-43d4-969b-523a16d8d2a7"
            }
        ],
        "socialEmails": [],
        "notifications": []
    }
}
```

### Get User Details

```
GET /user/:id/detail
```

Get details of a specific user.

```
curl --location --request GET 'http://localhost:4000/user/0b10e976-1348-43d4-969b-523a16d8d2a7/detail' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

```
{
    "success": true,
    "data": {
        "id": "0b10e976-1348-43d4-969b-523a16d8d2a7",
        "username": "test1",
        "password": "$2a$10$/9nOEXOwEHxq4ads2EU1y.ojeD/hr39AZpoe4i4sfI7FgI69KA1sq",
        "firstName": "Alex",
        "lastName": "Ben",
        "role": 3,
        "mid": "c6cb9b96ddb9f318",
        "privateKey": "-----BEGIN PGP PRIVATE KEY BLOCK-----...",
        "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----...",
        "mpRating": null,
        "m2mRating": null,
        "status": 1,
        "createdAt": "2020-02-26T20:31:13.000Z",
        "updatedAt": "2020-02-27T14:04:17.000Z",
        "meritPoint": null,
        "emails": [
            {
                "id": 6,
                "email": "test1@gmail.com",
                "isPrimary": 1,
                "isVerified": 0,
                "isActive": 1,
                "isResetPwd": 0,
                "createdAt": "2020-02-26T20:31:13.000Z",
                "updatedAt": "2020-02-26T20:31:13.000Z",
                "userId": "0b10e976-1348-43d4-969b-523a16d8d2a7"
            }
        ],
        "socialEmails": [],
        "notifications": []
    }
}
```

### User detail with social originId

```
POST /user/detail
```

Get details of a specific user which has social account and identified.

```
curl --location --request POST 'http://localhost:4000/user/detail' \
--header 'Content-Type: application/json' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--data-raw '{
	"socialType": 2,
	"originId": "123"
}'
```

```
{
	"socialType": 2,
	"originId": "123"
}
```

```
{
    "success": true,
    "data": {
        "id": "e21f75e7-4634-41f2-a48e-283e9719afa1",
        "username": "gablaupat@outlook.com",
        "password": "$2a$10$QUUjNP4P6inD7setEp9qqOdKxdbcAcltxL3l5dBvPqW77c.azo/x2",
        "firstName": "Gabriel",
        "lastName": "Pat",
        "role": 2,
        "mid": "1732b7040eec5013",
        "privateKey": "-----BEGIN PGP PRIVATE KEY BLOCK-----...",
        "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----...",
        "mpRating": 0,
        "m2mRating": 0,
        "status": 1,
        "createdAt": "2020-02-27T15:14:49.000Z",
        "updatedAt": "2020-02-27T15:14:49.000Z",
        "meritPoint": 0,
        "emails": [
            {
                "id": 20,
                "email": "gablaupat@outlook.com",
                "isPrimary": 1,
                "isVerified": 1,
                "isActive": 1,
                "isResetPwd": 0,
                "createdAt": "2020-02-27T15:14:49.000Z",
                "updatedAt": "2020-02-27T15:14:49.000Z",
                "userId": "e21f75e7-4634-41f2-a48e-283e9719afa1"
            }
        ],
        "socialEmails": [],
        "notifications": [],
        "currentEmail": "gablaupat@outlook.com"
    }
}
```

### User List

```
POST /user/list
```

The endpoint gets all accounts except `Super Administrators`.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request POST 'http://localhost:4000/user/list' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"keyword": "test",
	"sortBy": "mpRating",
	"ascDesc": "DESC",
	"pageNum": 1,
	"pageSize": 10
}'
```

```
{
	"keyword": "test",
	"sortBy": "mpRating",
	"ascDesc": "DESC",
	"pageNum": 1,
	"pageSize": 10
}
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": [
        {
            "id": "0b10e976-1348-43d4-969b-523a16d8d2a7",
            "username": "test1",
            "password": "$2a$10$/9nOEXOwEHxq4ads2EU1y.ojeD/hr39AZpoe4i4sfI7FgI69KA1sq",
            "firstName": "Alex",
            "lastName": "Ben",
            "role": 3,
            "mid": "c6cb9b96ddb9f318",
            "privateKey": "-----BEGIN PGP PRIVATE KEY BLOCK-----...",
            "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----...",
            "mpRating": null,
            "m2mRating": null,
            "status": 1,
            "createdAt": "2020-02-26T20:31:13.000Z",
            "updatedAt": "2020-02-27T14:04:17.000Z"
        }
    ]
}
```

### User Search

```
POST /user/search
```

The endpoint gets all user list according to the params.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request POST 'http://localhost:4000/user/search' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"keyword": "t",
	"tags": ["g", "a"],
	"sortBy": "username",
	"ascDesc": "DESC",
	"pageNum": 1,
	"pageSize": 10
}'
```

```
{
	"keyword": "t",
	"tags": ["g", "a"],
	"sortBy": "username",
	"ascDesc": "DESC",
	"pageNum": 1,
	"pageSize": 10
}
```

The response will contain a `success`-flag and optional `data`, `total` and `message`-field.

```
{
    "success": true,
    "data": [
        {
            "id": "0b10e976-1348-43d4-969b-523a16d8d2a7",
            "username": "test1",
            "password": "$2a$10$/9nOEXOwEHxq4ads2EU1y.ojeD/hr39AZpoe4i4sfI7FgI69KA1sq",
            "firstName": "Alex",
            "lastName": "Ben",
            "role": 3,
            "mid": "c6cb9b96ddb9f318",
            "privateKey": "-----BEGIN PGP PRIVATE KEY BLOCK-----...",
            "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----...",
            "mpRating": null,
            "m2mRating": null,
            "status": 1,
            "createdAt": "2020-02-26T18:31:13.000Z",
            "updatedAt": "2020-02-27T12:04:17.000Z",
            "clients": []
        }, { ... }
    ],
    "totalCount": {
        "totalCount": 4
    }
}
```

### Create user  

```
PUT /user/create
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request PUT 'http://localhost:4000/user/create' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"firstName": "Ally",
	"lastName": "Coh",
	"username": "test2",
	"password": "123",
	"email": "test2@gmail.com",
	"role": 2
}'
```

```
{
	"firstName": "Ally",
	"lastName": "Coh",
	"username": "test2",
	"password": "123",
	"email": "test2@gmail.com",
	"role": 2
}
```

| role | description          |
| :--- | :------------------- |
| 0    | Super Administrator  |
| 1    | Administrators       |
| 2    | Organisation Members |
| 3    | Members              |

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "User created successfully"
}
```

### Update user  

```
PUT /user/update
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request PUT 'http://localhost:4000/user/15ea2f0a-6804-4688-95dc-bd084fab540d/update' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"firstName": "Ali",
	"lastName": "Deck"
}'
```

```
{
	"firstName": "Ali",
	"lastName": "Deck"
}
```

The response will contain a `success`-flag and optional `message`-field.

```
{
    "success": true,
    "message": "Updated successfully"
}
```

### Remove user

```
DELETE /user/:id/delete
```

The endpoint gets all ratings of a specific account.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request DELETE 'http://localhost:4000/user/15ea2f0a-6804-4688-95dc-bd084fab540d/delete' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json'
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "Removed successfully"
}
```

### User scores detail

```
GET /user/:userId/scores/:clientId
```

The endpoint gets all scores of a specific user of a specific organisation.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request GET 'http://localhost:4000/user/b51b9777-3077-4c8a-8651-99c1715eb4d7/scores/4' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

The response will contain a `success`-flag and optional `data`, `total` and `message`-field.

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
    ],
    "total": 3.5
}
```
