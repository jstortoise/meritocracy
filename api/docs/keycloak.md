# Keycloak Server Installation Instruction

Please refer to [Keycloak Documentation](https://www.keycloak.org/docs/latest/server_installation/index.html)

## 1. System Requirements

These are the requirements to run the Keycloak authentication server:

Can run on any operating system that runs Java

- Java 8 JDK

- zip or gzip and tar

- At least 512M of RAM

- At least 1G of diskspace

- A shared external database like PostgreSQL, MySQL, Oracle, etc. Keycloak requires an external shared database if you want to run in a cluster. Please see the database configuration section of this guide for more information.

- Network multicast support on your machine if you want to run in a cluster. Keycloak can be clustered without multicast, but this requires a bunch of configuration changes. Please see the clustering section of this guide for more information.

- On Linux, it is recommended to use /dev/urandom as a source of random data to prevent Keycloak hanging due to lack of available entropy, unless /dev/random usage is mandated by your security policy. To achieve that on Oracle JDK 8 and OpenJDK 8, set the java.security.egd system property on startup to file:/dev/urandom.

## 2. Installing Distribution Files

The Keycloak Server has three downloadable distributions:

You can download from https://www.keycloak.org/downloads.html

- [keycloak-4.5.0.Final](https://downloads.jboss.org/keycloak/4.5.0.Final/keycloak-4.5.0.Final.tar.gz)

- [keycloak-overlay-4.5.0.Final](https://downloads.jboss.org/keycloak/4.5.0.Final/keycloak-overlay-4.5.0.Final.tar.gz)

- [keycloak-demo-4.5.0.Final]

The 'keycloak-4.5.0.Final.[zip|tar.gz]' file is the server only distribution. It contains nothing other than the scripts and binaries to run the Keycloak Server. To unpack this file just run your operating system’s unzip or gunzip and tar utilities.

The 'keycloak-overlay-4.5.0.Final.[zip|tar.gz]' file is a WildFly add-on that allows you to install Keycloak Server on top of an existing WildFly distribution. We do not support users that want to run their applications and Keycloak on the same server instance. To install the Keycloak Service Pack, just unzip it in the root directory of your WildFly distribution, open the bin directory in a shell and run ./jboss-cli.[sh|bat] --file=keycloak-install.cli.

The 'keycloak-demo-4.5.0.Final.[zip|tar.gz]' contains the server binaries, all documentation and all examples. It is preconfigured with both the OIDC and SAML client application adapters and can deploy any of the distribution examples out of the box with no configuration. This distribution is only recommended for those that want to test drive Keycloak. We do not support users that run the demo distribution in production.

To unpack of these files run the unzip or gunzip and tar utilities.

## 3. Unzip and Install on the Server

Please make sure that you already downloaded keycloak-4.5.0.Final.tar.gz on your server.

```
$ ssh -p2211 dev@185.185.24.8
...
$ tar -zxvf keycloak-4.5.0.Final.tar.gz
$ cd keycloak-4.5.0.Final
$ ./bin/standalone.sh
```

## 4. SSL Configuration for Keycloak

To connect Keycloak Admin console thru https domain, you should edit `../standalone/configuration/standalone.xml`.



```
<subsystem xmlns="urn:jboss:domain:undertow:8.0">
    ...
    <http-listener name="default" socket-binding="http"
        proxy-address-forwarding="true" redirect-socket="proxy-https"/>
    ...
</subsystem>

```

Add the redirect-socket attribute to the http-listener element. The value should be proxy-https which points to a socket binding you also need to define.

Then add a new socket-binding element to the socket-binding-group element:

```
<socket-binding-group name="standard-sockets" default-interface="public"
    port-offset="${jboss.socket.binding.port-offset:0}">
    ...
    <socket-binding name="proxy-https" port="443"/>
    ...
</socket-binding-group>
```

For more details, please refer to https://www.keycloak.org/docs/latest/server_installation/index.html#_setting-up-a-load-balancer-or-proxy

### Run/Stop/Restart Keycloak

#### Start

- Linux
```
$ ./bin/standalone.sh &
```
- Windows
```
> standalone.bat
```

#### Stop

- Linux
```
$ ./jboss-cli.sh --connect command=:shutdown
```
- Windows
```
> jboss-cli.bat --connect command=:shutdown
```

#### Restart

- Linux
```
$ ./jboss-cli.sh --connect command=:reload
```
- Windows
```
> jboss-cli.bat --connect command=:reload
```

For more details, please refer to https://bgasparotto.com/start-stop-restart-wildfly


## 5. Enable Social Authentication

### 1. Create Identify Provider

To enable social authentication on Keycloak, you should create an identity provider on the Keycloak admin console.

- First, login to [Keycloak admin console](https://keycloak.dev.galaxias.io/auth/admin/master/console/) with admin user.
- Next, go to Identity providers page by clicking on the left menu.
- Add facebook provider by clicking Add provider from the select list.
- Add *client_id* and *client_secret* fields. These are facebook app id and app secret.

### 2. Add Identity Provider URL to Facebook OAuth URIs list

- Copy *Redirect URI* field's value.
- Go to [Facebook developers page](https://developers.facebook.com/apps/817626591939019/fb-login/settings/), and add Redirect_URI to OAuth URIs list.

After all, save identity provider and logout admin console. There'll be Facebook with login button available.

For more details, please refer to [Keycloak docs](https://www.keycloak.org/docs/latest/server_admin/index.html#facebook)

Also, please check the following video for more details.

[enable_social_auth.mp4](https://gitlab.securesystemdesign.io/Meritocracy/Meritocracy-core-api/blob/master/docs/enable_social_auth.mp4)