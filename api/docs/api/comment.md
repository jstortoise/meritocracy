## Comment related requests

### Create comment

```
PUT /comment/:clientId/create
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request PUT 'http://localhost:4000/comment/3/create' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"rating": 5,
	"description": "Excellent"
}'
```

```
{
	"rating": 5,
	"description": "Excellent"
}
```

The response will contain a `success`-flag and optional `message`-field.

```
{
    "success": true,
    "message": "Commented successfully"
}
```

### Remove comment

```
DELETE /comment/:id/delete
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request DELETE 'http://localhost:4000/comment/1/delete' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

The response will contain a `success`-flag and optional `message`-field.

```
{
    "success": true,
    "message": "Comment removed successfully"
}
```

### Comment list

```
GET /comment/:clientId/list
```

The endpoint gets the list of comments of a specific organisation.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request GET 'http://localhost:4000/comment/3/list' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": [
        {
            "id": 2,
            "rating": 5,
            "description": "Excellent",
            "createdAt": "2020-02-27T15:43:33.000Z",
            "updatedAt": "2020-02-27T15:43:33.000Z",
            "clientId": 3,
            "userId": "0b10e976-1348-43d4-969b-523a16d8d2a7",
            "agoMonth": 0,
            "agoDay": 0,
            "agoHour": 0,
            "agoMinute": 1,
            "agoSecond": 6,
            "user.id": "0b10e976-1348-43d4-969b-523a16d8d2a7",
            "user.username": "test1",
            "user.password": "$2a$10$/9nOEXOwEHxq4ads2EU1y.ojeD/hr39AZpoe4i4sfI7FgI69KA1sq",
            "user.firstName": "Alex",
            "user.lastName": "Ben",
            "user.role": 3,
            "user.mid": "c6cb9b96ddb9f318",
            "user.privateKey": "-----BEGIN PGP PRIVATE KEY BLOCK-----...",
            "user.publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----...",
            "user.mpRating": null,
            "user.m2mRating": null,
            "user.status": 1,
            "user.createdAt": "2020-02-26T20:31:13.000Z",
            "user.updatedAt": "2020-02-27T14:04:17.000Z"
        }
    ]
}
```
