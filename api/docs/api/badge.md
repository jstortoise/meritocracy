## Badge APIs

### Get Base Data

```
GET /badge/list
```

The endpoint gets the badge list you earned.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/badge/list"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": [{
        "badge_type": 0,
        "description": "Email verified Badge"
    }, ..., {
        ...
    }]
}
```