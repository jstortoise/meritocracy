## File Requests

### Encrypt file

```
POST /file/encrypt
```

The endpoint encrypts file and returns encrypted file hash id on IPFS.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -d "{\"file_url\": \"https://bitcoin.org/bitcoin.pdf\"}" -H "Content-Type: application/json; appkey: <certified_appkey>; x-token: <token>;" https://api.keycloak.dev.galaxias.io/file/encrypt
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "File encrypted successfully",
    "data": {
        "user_id": "<your_user_id>"
        "path": "http://185.185.24.8:9001/ipfs/QmQTfXZJejBJz45kbeGGDsM9f4w6iHDeFzPP6tSjPXmeWi",
        "hash": "QmQTfXZJejBJz45kbeGGDsM9f4w6iHDeFzPP6tSjPXmeWi",
        "size": 184420
    }
}
```

### Decrypt file

```
POST /file/decrypt
```

The endpoint decrypts file and returns encrypted file hash id on IPFS.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -d "{\"hash_code\": \"QmQTfXZJejBJz45kbeGGDsM9f4w6iHDeFzPP6tSjPXmeWi\"}" -H "Content-Type: application/json; appkey: <certified_appkey>; x-token: <token>;" https://api.keycloak.dev.galaxias.io/file/encrypt
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "File decrypted successfully",
    "data": {
        "user_id": "<your_user_id>",
        "public_key": "<your_public_key>",
        "path": "http://185.185.24.8:9001/ipfs/QmQTfXZJejBJz45kbeGGDsM9f4w6iHDeFzPP6tSjPXmeWi",
        "hash": "QmQTfXZJejBJz45kbeGGDsM9f4w6iHDeFzPP6tSjPXmeWi",
        "size": 184420
    }
}
```

### Sign file

```
POST /file/sign
```

The endpoint sign file and returns signed file hash id on IPFS.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -d "{\"file_url\": \"https://bitcoin.org/bitcoin.pdf\"}" -H "Content-Type: application/json; appkey: <certified_appkey>; x-token: <token>;" https://api.keycloak.dev.galaxias.io/file/sign
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "File signed successfully",
    "data": {
        "user_id": "<your_user_id>"
        "path": "http://185.185.24.8:9001/ipfs/QmQTfXZJejBJz45kbeGGDsM9f4w6iHDeFzPP6tSjPXmeWi",
        "hash": "QmQTfXZJejBJz45kbeGGDsM9f4w6iHDeFzPP6tSjPXmeWi",
        "size": 184420
    }
}
```

### Verify file

```
POST /file/verify
```

The endpoint verify file and returns verified file hash id on IPFS.
The endpoint requires the tokens within the `x-token` -header to be set.

```
curl -d "{\"hash_code\": \"QmQTfXZJejBJz45kbeGGDsM9f4w6iHDeFzPP6tSjPXmeWi\"}" -H "Content-Type: application/json; appkey: <certifed_appkey>; x-token: <token>;" https://api.keycloak.dev.galaxias.io/file/verify
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "message": "File verified successfully",
    "data": {
        "user_id": "<your_user_id>",
        "public_key": "<your_public_key>",
        "path": "http://185.185.24.8:9001/ipfs/QmQTfXZJejBJz45kbeGGDsM9f4w6iHDeFzPP6tSjPXmeWi",
        "hash": "QmQTfXZJejBJz45kbeGGDsM9f4w6iHDeFzPP6tSjPXmeWi",
        "size": 184420
    }
}
```