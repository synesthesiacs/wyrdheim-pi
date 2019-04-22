## Install NodeJS on the Pi
1. `curl -sL https://deb.nodesource.com/setup_10.x|sudo -E bash -`
2. `sudo apt-get install -y nodejs`
3. `curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
4. `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
5. `sudo apt-get update && sudo apt-get install yarn`

## Install git, and clone the repo
1. `sudo apt-get install git`
2. `git clone https://github.com/Continuities/wyrdheim-pi.git`
3. `cd wrydheim-pi`

## Install ALSA audio backend
1. `sudo apt-get install libasound2-dev`
2. `sudo amixer cset numid=1 100%`

## Build and run the damn thing!
1. `yarn`
2. `yarn start`
