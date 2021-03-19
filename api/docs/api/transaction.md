## Transactions

### Get transaction list

```
POST /list
```

The endpoint gets all transaction list by a certain condition.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -d "{\"keyword\": \"asdf\", \"page_num\": \"1\", \"page_size\": \"10\"}" -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/transaction/list
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "File encrypted successfully",
    "data": {
        "transactions": [{...}],
        "total_count": 20
    }
}
```

### Get my transaction list

```
POST /list/me
```

The endpoint gets the current user's transaction list by a certain condition.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -d "{\"keyword\": \"asdf\", \"page_num\": \"1\", \"page_size\": \"10\"}" -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/transaction/list/me
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "File encrypted successfully",
    "data": {
        "transactions": [{...}],
        "total_count": 20
    }
}
```
