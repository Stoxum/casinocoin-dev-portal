# Install and configure casinocoind

Ubuntu 16.04 is recommended and can be downloaded from: [https://www.ubuntu.com/download/server](https://www.ubuntu.com/download/server)

## Secure WebSockets
Secure WebSockets should be used for the production wallet server. This will require a SSL certificate. In this example we are using Let's Encrypt, but other SSL certificates will also work. They should be placed in
```
ssl_key = /etc/casinocoind/ssl/privkey.pem
ssl_cert = /etc/casinocoind/ssl/cert.pem
ssl_chain = /etc/casinocoind/ssl/fullchain.pem
```
The location can be changed, but changes need to be reflected in the config file.


## Important Information
- The daemon is _NOT_ a wallet<br>
- Configuration takes place in `/etc/casinocoind/casinocoind.cfg`<br>
- Servers should be secured by setting strict firewall rules and allow SSH key-based authentication only<br>


## Daemon Setup
Commands need to be executed via the command line and can be used to create a script.

```bash
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get dist-upgrade -y
sudo  timedatectl set-timezone Etc/UTC
sleep 10
sudo apt-get install ufw -y
sudo ufw allow ssh
sudo ufw allow to any port 17771
sudo ufw enable
sudo ufw status
sleep 10
sudo apt-get install htop -y
mkdir $HOME/src
cd $HOME/src
sudo apt install python-software-properties curl git scons ctags cmake pkg-config protobuf-compiler libprotobuf-dev libssl-dev python-software-properties libboost-all-dev -y
sudo git clone https://github.com/casinocoin/casinocoind.git
cd casinocoind
sudo scons
sudo strip build/casinocoind
sudo cp build/casinocoind /usr/bin
sudo mkdir /var/log/casinocoind
sudo mkdir /etc/casinocoind
sudo mkdir -p /var/lib/casinocoind/db
sudo adduser casinocoin
sudo groupadd casinocoin
sudo chown ubuntu:casinocoin /var/log/casinocoind
sudo chown -R ubuntu:casinocoin /var/lib/casinocoind
sudo chown ubuntu:casinocoin /var/log/casinocoind
sudo cp $HOME/src/casinocoind/doc/casinocoind-example.cfg /etc/casinocoind/casinocoind.cfg
sudo cp $HOME/src/casinocoind/doc/validators-example.txt /etc/casinocoind/validators.txt
sudo cp $HOME/src/casinocoind/doc/casinocoind-example.service /etc/systemd/system/casinocoind.service
sleep 10
sudo usermod -aG casinocoin ubuntu
sudo usermod -aG casinocoin casinocoin
sudo chown -R ubuntu:casinocoin /var/lib/casinocoind/db
sudo chmod -R 774 /var/lib/casinocoind/db
sudo systemctl enable casinocoind.service
```