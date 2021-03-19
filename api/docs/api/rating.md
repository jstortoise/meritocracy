### Rating History

```
POST /rating/search
```

The endpoint gets all rating history list according to the params.

The endpoint requires the tokens within the `x-token`-header to be set.

```
curl --location --request POST 'http://localhost:4000/rating/search' \
--header 'x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
--header 'Content-Type: application/json' \
--data-raw '{
	"userId": "f2ccd657-0284-4bcd-8301-dfebdf7b320e",
	"keyword": "123",
	"filterClient": true,
	"clientName": "test1",
	"sortBy": "rating",
	"ascDesc": "ASC",
	"pageNum": 1,
	"pageSize": 10
}'
```

The response will contain a `success`-flag and optional `data`, `total` and `message`-field.

```
{
    "success": true,
    "data": [{
        "rating": "-1",
        "clientId": "organistion name",
        "updatedAt": "..."
        ...
    }, {
        ...
    }],
    "totalCount": "10"
}
```