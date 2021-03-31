const path = require('path');

// looks like in the latest import version of ipfs-http-client,
// we don't need to explicitly specify those node modules bellow
module.exports = {
  node: {
    child_process: "empty",
    fs: "empty",
    crypto: true,
    path: true,
    os: true,
    stream: true,
    buffer: true,
  },

};
