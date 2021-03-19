## Wallet APIs

### Create Wallet

```
GET /:coinType/create
```

The endpoint generate the cryptocurrency wallet address for your acocunt.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/wallet/1/create"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": {
        "address": "...",
    },
    "message": "Your eth wallet is generated successfully"
}
```

### Get Balance

```
GET /:coinType/balance
```

The endpoint gets the balance of a specific coin on your account.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/wallet/1/balance"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": {
        "balance": "0.5",
    }
}
```

### Withdraw coin

```
POST /:coinType/withdraw
```

The endpoint withdraw a certain amount of coins from your wallet to external wallet.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -d "{\"address\": \"<eth_address>\", \"amount\": \"0.5\"}" -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/wallet/1/withdraw"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": {
        "txHash": <transaction_hash>,
    },
    "message": "Withdraw success"
}
```

### Send Tips

```
POST /tip/:coinType
```

The endpoint generate the cryptocurrency wallet address for your acocunt.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -d "{\"clientId\": \"test1\",\"amount\": \"1.5\"}" -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/send/1"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true
}
```
