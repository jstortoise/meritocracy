
### Get All Vote Status of a Organisation

```
GET /client/:appkey/vote
```

The endpoint gets the all votes status of a post.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/client/client_appkey_here/vote"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": [{
        "client_appkey": "client_appkey_here",
        "owner_id": "test1",
        "post_id": 1,
        "vote": -1,
        "user_id": "test2"
    }, ... {
        ...
    }]
}
```


### Get Vote Status of a Post

```
GET /client/:appkey/vote/:post_id
```

The endpoint gets the vote status of a specific post.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/client/client_appkey_here/vote/post_id_here"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true,
    "data": {
        "client_appkey": "client_appkey_here",
        "owner_id": "test1",
        "post_id": 1,
        "vote": -1,
        "user_id": "test2"
    }
}
```


### Cancel Vote

```
GET /client/:appkey/vote/:post_id/cancel
```

The endpoint cancels the vote of a specific post.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/client/client_appkey_here/vote/post_id_here/cancel"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true
}
```


### UpVote / DownVote

```
GET /client/:appkey/vote/:post_id/:up_down
```

The endpoint upvote/downvote a specific post.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl -H "Content-Type: application/json; x-token: <token>;" https://api.keycloak.dev.galaxias.io/client/client_appkey_here/vote/post_id_here/1"
```

The response will contain a `success`-flag and optional `data` and `message`-field.

```
{
    "success": true
}
```

| up_down | description            |
| :------ | :--------------------- |
| -1      | Downvote               |
| 1       | Upvote                 |


