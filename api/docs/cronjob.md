## Cronjob

Cronjob is running every minute to update Meritocracy Members' rating.

Schedule time is set by manually and this will be updated in the future.
> There'll be GUI for scheduling time in the future.

By changing `schedule` value on [.env](https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/.env), you can change the `scheduling time` of cronjob.

```
{
    "schedule": "* * * * * *",
    "running": true
}
```

- *running* field

| value | description  |
| :---- | :----------- |
| true  | Run cronjob  |
| false | Stop cronjob |

- *schedule* field

| value       | description                       |
| :---------- | :-------------------------------- |
| 0 * * * * * | Run 0 second of every minute      |
| 0 0 * * * * | Run 0:0 (mm:ss) of every hour     |
| 0 0 0 * * * | Run 0:0:0 (hh:mm:ss) of every day |
| ...         | ...                               |

For more details, please refer to [here](https://www.npmjs.com/package/node-cron#user-content-cron-syntax)
