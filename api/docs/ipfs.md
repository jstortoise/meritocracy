# Install IPFS

Download the latest release of IPFS Desktop for your OS, below.

| Platform | Download link | Download count
|---------:|---------------|---------------
| **Windows**  | [ipfs-desktop-setup-0.10.0.exe](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.10.0/ipfs-desktop-setup-0.10.0.exe) | [![](https://img.shields.io/github/downloads-pre/ipfs-shipyard/ipfs-desktop/v0.10.0/ipfs-desktop-setup-0.10.0.exe.svg?style=flat-square)](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.10.0/ipfs-desktop-setup-0.10.0.exe)
| **Mac**    | [ipfs-desktop-0.9.7.dmg](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.9.7/ipfs-desktop-0.9.7.dmg) | [![](https://img.shields.io/github/downloads-pre/ipfs-shipyard/ipfs-desktop/v0.9.7/ipfs-desktop-0.9.7.dmg.svg?style=flat-square)](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.9.7/ipfs-desktop-0.9.7.dmg)

We build out multiple installers for **Linux**

| Package | Download link | Download count
|---------:|---------------|---------------
| AppImage | [ipfs-desktop-0.10.0-linux-x86_64.AppImage](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.10.0/ipfs-desktop-0.10.0-linux-x86_64.AppImage) | [![](https://img.shields.io/github/downloads-pre/ipfs-shipyard/ipfs-desktop/v0.10.0/ipfs-desktop-0.10.0-linux-x86_64.AppImage.svg?style=flat-square)](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.10.0/ipfs-desktop-0.10.0-linux-x86_64.AppImage)
| tar | [ipfs-desktop-0.10.0-linux-x64.tar.xz](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.10.0/ipfs-desktop-0.10.0-linux-x64.tar.xz) | [![](https://img.shields.io/github/downloads-pre/ipfs-shipyard/ipfs-desktop/v0.10.0/ipfs-desktop-0.10.0-linux-x64.tar.xz.svg?style=flat-square)](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.10.0/ipfs-desktop-0.10.0-linux-x64.tar.xz)
| deb | [ipfs-desktop-0.10.0-linux-amd64.deb](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.10.0/ipfs-desktop-0.10.0-linux-amd64.deb) | [![](https://img.shields.io/github/downloads-pre/ipfs-shipyard/ipfs-desktop/v0.10.0/ipfs-desktop-0.10.0-linux-amd64.deb.svg?style=flat-square)](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.10.0/ipfs-desktop-0.10.0-linux-amd64.deb)
| rpm | [ipfs-desktop-0.10.0-linux-x86_64.rpm](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.10.0/ipfs-desktop-0.10.0-linux-x86_64.rpm) | [![](https://img.shields.io/github/downloads-pre/ipfs-shipyard/ipfs-desktop/v0.10.0/ipfs-desktop-0.10.0-linux-x86_64.rpm.svg?style=flat-square)](https://github.com/ipfs-shipyard/ipfs-desktop/releases/download/v0.10.0/ipfs-desktop-0.10.0-linux-x86_64.rpm)

Or you can use your favorite package manager:

- **Homebrew** - `brew cask install ipfs`
- **Chocolatey** - `choco install ipfs-desktop`
- **Snap** - `snap install ipfs-desktop`
- **AUR** - [`ipfs-desktop` package](https://aur.archlinux.org/packages/ipfs-desktop/) maintained by @alexhenrie

> Using package managers? Please head to [our package managers page](https://github.com/ipfs-shipyard/ipfs-desktop/issues/691) and help us add support for yours!

You can find releases notes and older versions on the [releases](https://github.com/ipfs-shipyard/ipfs-desktop/releases) page.

### Install from Source

To install it from source you need [Node.js](https://nodejs.org/en/) `>=10.4.0` and
need [npm](npmjs.org) `>=6.1.0` installed. This uses [`node-gyp`](https://github.com/nodejs/node-gyp) so **you must take a look** at their [platform specific dependencies](https://github.com/nodejs/node-gyp#installation).

Then the follow the steps below to clone the source code, install the dependencies and run it the app:

```bash
git clone https://github.com/ipfs-shipyard/ipfs-desktop.git
cd ipfs-desktop
npm install
npm start
```

The IPFS Desktop app will launch and should appear in your OS menu bar.

### Configure IPFS daemon PORT

```
export EDITOR=$EDITOR
ipfs config edit
```

```
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/9001
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
```

For more details, please refer to [here](https://github.com/ipfs-shipyard/ipfs-desktop/blob/master/README.md)

### Start IPFS daemon

```
ipfs daemon
```

Uploaded/Encrypted file will be saved on `https://gateway.ipfs.io/ipfs/<your_hash_code>`