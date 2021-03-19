## Tip APIs

### Get Tip Options

```
GET /options/:appkey
```

The endpoint generate the cryptocurrency wallet address for your acocunt.
The endpoint requires the tokens within the `appkey` and `referer` -header to be set.

```
curl -H "Content-Type: application/json; appkey: <APP_KEY>; referer: https://blogs.dev.galaxias.io" https://api.keycloak.dev.galaxias.io/tip/options/<client_appkey>"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": {
        "btc": 0,
        "bch": 0,
        "eth": 1,
        "glx": 0,
    }
}
```

### Get Tip Options By APP_ID

```
POST /options/:client_id
```

The endpoint generate the cryptocurrency wallet address for your acocunt.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/tip/options/<APP_ID>"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": {
        "btc": 0,
        "bch": 0,
        "eth": 1,
        "glx": 0,
    }
}
```

### Update Tip Options

```
PUT /options/:appkey
```

The endpoint generate the cryptocurrency wallet address for your acocunt.
The endpoint requires the tokens within the `appkey` and `referer` -header to be set.

```
curl -d "{\"tip_btc\": \"0\",\"tip_bch\": \"0\",\"tip_eth\": \"1\",\"tip_glx\": \"0\"}" -H "Content-Type: application/json; x-token: <token>;" -X PUT https://api.keycloak.dev.galaxias.io/tip/options/<client_appkey>"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "Updated tip options successfully"
}
```
