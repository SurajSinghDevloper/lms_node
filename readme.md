-------------------To Run Vcall Feature -------------------

# System Dependencies on Linux

Coturn (TURN server for NAT traversal): Install Coturn on your system:

bash Copy code
sudo apt update
sudo apt install coturn
SSL Certificate (for secure WebSocket): Install Certbot for Let's Encrypt SSL:

bash Copy code
sudo apt install certbot
Generate SSL certificates:

bash Copy code
sudo certbot certonly --standalone -d <YOUR_DOMAIN>

# System Dependencies on Windows

1. Coturn (TURN Server for NAT Traversal)
   While Coturn is primarily used on Linux, you can run it on Windows using WSL (Windows Subsystem for Linux) or a Docker container.

Option 1: Use WSL

Install WSL:

bash
Copy code
wsl --install
Restart your system after installation.

Install a Linux distribution from the Microsoft Store (e.g., Ubuntu).

Open your Linux terminal and install Coturn:

bash
Copy code
sudo apt update
sudo apt install coturn
Configure Coturn as described earlier in turnserver.conf.

Option 2: Use Docker

Install Docker Desktop for Windows.
Run a Coturn Docker container:
bash
Copy code
docker run -d --network host coturn/coturn
Map the configuration files and ports as needed.

ADD a docker image to your system:
docker run -d --name coturn-server \
 -p 3478:3478 \
 -p 3478:3478/udp \
 -p 5349:5349 \
 -p 5349:5349/udp \
 -p 49152-65535:49152-65535/udp \
 coturn/coturn
