# Install and configure stoxumd

Ubuntu 16.04 is recommended and can be downloaded from: [https://www.ubuntu.com/download/server](https://www.ubuntu.com/download/server)

## Secure WebSockets
Secure WebSockets should be used for the production wallet server. This will require a SSL certificate. In this example we are using Let's Encrypt, but other SSL certificates will also work. They should be placed in
```
ssl_key = /etc/stoxumd/ssl/privkey.pem
ssl_cert = /etc/stoxumd/ssl/cert.pem
ssl_chain = /etc/stoxumd/ssl/fullchain.pem
```
The location can be changed, but changes need to be reflected in the config file.


## Important Information
- The daemon is _NOT_ a wallet<br>
- Configuration takes place in `/etc/stoxumd/stoxumd.cfg`<br>
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
sudo git clone https://github.com/stoxum/stoxumd.git
cd stoxumd
sudo scons
sudo strip build/stoxumd
sudo cp build/stoxumd /usr/bin
sudo mkdir /var/log/stoxumd
sudo mkdir /etc/stoxumd
sudo mkdir -p /var/lib/stoxumd/db
sudo adduser stoxum
sudo groupadd stoxum
sudo chown ubuntu:stoxum /var/log/stoxumd
sudo chown -R ubuntu:stoxum /var/lib/stoxumd
sudo chown ubuntu:stoxum /var/log/stoxumd
sudo cp $HOME/src/stoxumd/doc/stoxumd-example.cfg /etc/stoxumd/stoxumd.cfg
sudo cp $HOME/src/stoxumd/doc/validators-example.txt /etc/stoxumd/validators.txt
sudo cp $HOME/src/stoxumd/doc/stoxumd-example.service /etc/systemd/system/stoxumd.service
sleep 10
sudo usermod -aG stoxum ubuntu
sudo usermod -aG stoxum stoxum
sudo chown -R ubuntu:stoxum /var/lib/stoxumd/db
sudo chmod -R 774 /var/lib/stoxumd/db
sudo systemctl enable stoxumd.service
```