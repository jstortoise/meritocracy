## Notification related requests

### Notification list

```
GET /notification/list/:isRead
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request GET 'http://localhost:4000/notification/list/-1' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

The response will contain a `success`-flag and optional `message`-field.

```
{
    "success": true,
    "data": [
        {
            "id": 2,
            "type": 1,
            "description": "The verification email has been sent. Please verify your email in order to unlock x Merit Points and get full features access.",
            "isRead": 0,
            "createdAt": "2020-02-26T20:31:17.000Z",
            "updatedAt": "2020-02-26T20:31:17.000Z",
            "userId": "0b10e976-1348-43d4-969b-523a16d8d2a7"
        }, { ... }
    ]
}
```

### Update notification

```
PUT /notification/:id/update
```

The endpoint gets the list of comments of a specific organisation.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request PUT 'http://localhost:4000/notification/2/update' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"isRead": 1
}'
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "Notification updated successfully"
}
```

### Remove notification

```
DELETE /notification/:id/delete
```

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request DELETE 'http://localhost:4000/notification/2/delete' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

The response will contain a `success`-flag and optional `message`-field.

```
{
    "success": true,
    "message": "Notification removed successfully"
}
```
