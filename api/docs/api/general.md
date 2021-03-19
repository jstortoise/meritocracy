## General

### Api requests

Params and data should be submitted as `application/json`.

Please provide the correct `Content-Type`-header within the request. If you are providing the data directly within the body as `json-encoded`-string please set the header as `Content-Type: application/json`.

#### Headers

Generally, all enpoints requires to be set the following headers except login/signup endpoints.

- Headers
```
{
    "Content-Type": "application/json"
    "x-token": "..."
}
```

If `x-token` is expired or empty, it'll send the following response.

```
{
    "success": false,
    "message": "error message"
}
```

| message         |
| :-------------- |
| Token expired   |
| Token undefined |

### Api responses

Api responses will contain a `success`-flag and optional `data`- and `message`-field.
In general the api returns the following response-structure:

```
{
    "success": true,
    "data": {   
        [...]
    },
    "message":"'..."
}
```

The `data`-array is only present if there is any data to return. The `message`-field is only present if there are any errors. There may be special routes which doesn't expose any errors (e.g. login) to prevent further analysis mechanisms for security purposes.

Furthermore the api make use of various messages to return general status-message:

| success  | Description                   |
| :------- | :---------------------------- |
| true     | **OK**: Everything is fine    |
| false    | **Failed**: Failed to process |

API always returns **Status code=200**.