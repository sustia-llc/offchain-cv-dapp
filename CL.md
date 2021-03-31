npm install -g @ceramicstudio/idx-cli
npm install -g @ceramicnetwork/cli

ceramic daemon
telnet localhost 7007
idx bootstrap

create bootstrap.js document on root

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

SEED=<your seed from above> node ./bootstrap.js

TODO: 
create contract and add address to context

Questions for Joel:
1) After a proposal has been triggered and paid out, is it listed in the conviction state document? Or is it moved to a second document.