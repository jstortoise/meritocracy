## Organisation requests

### Create organisation

```
PUT /client/create
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request PUT 'http://localhost:4000/client/create' \
--header 'Content-Type: application/json' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--data-raw '{
	"name": "test1",
	"type": 0,
	"rootUrl": "http://localhost:3001",
	"ownerId": "5f15b971-7630-4e86-9396-2ada4147e95c"
}'
```

```
{
	"name": "test1",
	"type": 0,
	"rootUrl": "http://localhost:3001",
	"ownerId": "5f15b971-7630-4e86-9396-2ada4147e95c"
}
```

| type | description            |
| :--- | :--------------------- |
| 0    | Legacy Organisation    |
| 1    | Certified Organisation |
| 2    | Public Organisation    |

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": {
        "secret": "ada9fccd-057d-4af9-afca-8ac85156e8ae"
    },
    "message": "Successfully added"
}
```

### Update organisation

```
PUT /client/:id/update
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request PUT 'http://localhost:4000/client/2/update' \
--header 'Content-Type: application/json' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--data-raw '{
	"name": "legacy1",
	"rootUrl": "http://localhost:3001"
}'
```

```
{
	"name": "legacy1",
	"rootUrl": "http://localhost:3001"
}
```

| type | description            |
| :--- | :--------------------- |
| 0    | Legacy Organisation    |
| 1    | Certified Organisation |
| 2    | Public Organisation    |

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "Organsation updated successfully"
}
```

### Organisation detail

```
GET /client/:id/detail
```

The endpoint gets the information of a specific organisation.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request GET 'http://localhost:4000/client/2/detail' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": {
        "id": 2,
        "name": "legacy1",
        "secret": "ada9fccd-057d-4af9-afca-8ac85156e8ae",
        "type": 0,
        "protocol": "openid-connect",
        "rootUrl": "http://localhost:3001",
        "enabled": 1,
        "meritPoint": 0,
        "oldPoint": 0,
        "createdAt": "2020-02-27T10:53:32.000Z",
        "updatedAt": "2020-02-27T11:03:18.000Z",
        "ownerId": "5f15b971-7630-4e86-9396-2ada4147e95c",
        "creatorId": "5f15b971-7630-4e86-9396-2ada4147e95c",
        "memberCount": 1,
        "creatorUsername": "admin",
        "creatorFullname": "Gabriel Laurentiu",
        "ownerUsername": "admin",
        "ownerFullname": "Gabriel Laurentiu",
        "sessions": []
    }
}
```

### Requested organisation detail

```
GET /client/me
```

The endpoint gets the information of the requested organisation.

The endpoint requires the headers with the `x-token` and `appkey` to be set.

```
curl --location --request GET 'http://localhost:4000/client/me' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'appkey: ada9fccd-057d-4af9-afca-8ac85156e8ae'
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": {
        "id": 2,
        "name": "legacy1",
        "secret": "ada9fccd-057d-4af9-afca-8ac85156e8ae",
        "type": 0,
        "protocol": "openid-connect",
        "rootUrl": "http://localhost:3001",
        "enabled": 1,
        "meritPoint": 0,
        "oldPoint": 0,
        "createdAt": "2020-02-27T10:53:32.000Z",
        "updatedAt": "2020-02-27T11:03:18.000Z",
        "ownerId": "5f15b971-7630-4e86-9396-2ada4147e95c",
        "creatorId": "5f15b971-7630-4e86-9396-2ada4147e95c"
    }
}
```

### Remove organisation

```
DELETE /:id/delete
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request DELETE 'http://localhost:4000/client/2/delete' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "Successfully removed"
}
```

### Organisation list

```
POST /client/list
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request POST 'http://localhost:4000/client/list' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"type": 0,
	"keyword": "test",
	"pageNum": 1,
	"pageSize": 10,
	"sortBy": "name",
	"ascDesc" : "asc"
}'
```

```
{
	"type": 0,
	"keyword": "test",
	"pageNum": 1,
	"pageSize": 10,
	"sortBy": "name",
	"ascDesc" : "asc"
}
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": [
        {
            "id": 3,
            "name": "test1",
            "secret": "23c2e74b-3a2d-40d6-9713-444d0555605f",
            "type": 0,
            "protocol": "openid-connect",
            "rootUrl": "http://localhost:3001",
            "enabled": 1,
            "meritPoint": 0,
            "oldPoint": 0,
            "createdAt": "2020-02-27T10:20:15.000Z",
            "updatedAt": "2020-02-27T10:20:15.000Z",
            "ownerId": "5f15b971-7630-4e86-9396-2ada4147e95c",
            "creatorId": "0b10e976-1348-43d4-969b-523a16d8d2a7",
            "creatorName": "test1",
            "ownerName": "admin",
            "totalUsers": 1,
            "adminCount": "1",
            "managerCount": "0"
        }
    ],
    "totalCount": 1
}
```

### Organisation list of current account

```
POST /client/list/me
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request POST 'http://localhost:4000/client/list/me' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"type": 0,
	"keyword": "test",
	"pageNum": 1,
	"pageSize": 10,
	"sortBy": "name",
	"ascDesc" : "asc"
}'
```

```
{
	"type": 0,
	"keyword": "test",
	"pageNum": 1,
	"pageSize": 10,
	"sortBy": "name",
	"ascDesc" : "asc"
}
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": [
        {
            "id": 3,
            "name": "test1",
            "secret": "23c2e74b-3a2d-40d6-9713-444d0555605f",
            "type": 0,
            "protocol": "openid-connect",
            "rootUrl": "http://localhost:3001",
            "enabled": 1,
            "meritPoint": 0,
            "oldPoint": 0,
            "createdAt": "2020-02-27T10:20:15.000Z",
            "updatedAt": "2020-02-27T10:20:15.000Z",
            "ownerId": "5f15b971-7630-4e86-9396-2ada4147e95c",
            "creatorId": "0b10e976-1348-43d4-969b-523a16d8d2a7",
            "totalUsers": 1,
            "adminCount": "1",
            "managerCount": "0"
        }, {...}
    ],
    "totalCount": 1
}
```

### Organisation list of a user

```
GET /client/:userId/list
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request GET 'http://localhost:4000/client/5f15b971-7630-4e86-9396-2ada4147e95c/list' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": [
        {
            "id": 2,
            "testScore": 0,
            "mpRating": 0,
            "m2mRating": 0,
            "consistency": null,
            "isCommented": 0,
            "createdAt": "2020-02-27T10:53:32.000Z",
            "updatedAt": "2020-02-27T10:53:32.000Z",
            "clientId": null,
            "userId": "5f15b971-7630-4e86-9396-2ada4147e95c",
            "clientName": null,
            "creatorId": null,
            "ownerId": null,
            "client.name": null,
            "client.creatorId": null,
            "client.ownerId": null
        }, { ... }
    ]
}
```
