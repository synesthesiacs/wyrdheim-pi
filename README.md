## Install NodeJS on the Pi
1. `curl -sL https://deb.nodesource.com/setup_10.x|sudo -E bash -`
2. `sudo apt-get install -y nodejs`
3. `curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
4. `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
5. `sudo apt-get update && sudo apt-get install yarn`

## Install git, and clone the repo
1. `sudo apt-get install git`
2. `git clone https://github.com/Continuities/wyrdheim-pi.git`

## Install omxplayer
1. `sudo apt-get install omxplayer`

## Run the damn thing!
1. `yarn start`