# Installation Instruction

## Download Repository from Gitlab

```
$ git clone https://gitlab.securesystemdesign.io/Meritocracy/meritocracy-core-ui-update.git
$ cd meritocracy-core-ui-update
```

## Install pacakges
```
$ npm install
```

## Start project on development mode

```
$ npm run dev
```

## Build project

```
$ npm run build
$ PORT=3000 npm start
```

## Deploy with Nginx

Add reverse proxy to your next app inside default location block in Nginx's site configuration

```
location / {
  # default port, could be changed if you use next with custom server
  proxy_pass http://localhost:3000;

  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
  
  # if you have try_files like this, remove it from our block
  # otherwise next app will not work properly
  # try_files $uri $uri/ =404;
}
```

Restart nginx server

```
$ sudo service nginx restart
```

After this, please go to `http://localhost:3000` on your web browser.