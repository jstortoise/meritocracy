# Session Expiration Work Flow

## Set timeout on admin page

Admin can change session timeout. This value is `accessTokenLifespan` on Keycloak.

```
e.g. accessTokenLifespan = 1 minute(s)
```

To check user activity, `react-idle-timer` runs on Frontend UI background. Idle timeout will be set as `accessTokenLifespan` (1 minute).

- If user is inactive for a certain timeout (1 min), Frontend forces user log out and show `Session Expired` page.

- If user is active, it'll work as normal. Nothing happens on both of Frontend, Backend and Keycloak. If current token is expired, it'll be refreshed by Backend and Keycloak.

> ssoMaxIdleTimeout is for refresh token lifespan. This value is currently set as 1 day as discussed before.

## What is different between session expiration and logout?

- If user logout manually, the Frontend removes token from cookie and the session will be also logged out from Backend and Keycloak.

- If user is forced logout by session expiration, the Frontend doesn't remove token from cookie and the session will be logged out from Backend and Keycloak. So, if user tries to redirect to normal pages by inputing url on a browser, it'll use old token and the Backend will response with `token expired`.