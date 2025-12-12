const { exec } = require('child_process')

if (process.argv.length != 2) {
  console.error("usage: process.argv[0] process.argv[1]");
  process.exit(1);
}

var os = process.env.INPUT_OS.toLowerCase()
var cmd;

switch (os) {
  case "linux":
  case "ubuntu":
    cmd = 'sudo apt-get install -y ninja-build';
    break;
  case "windows":
    cmd = 'pip install ninja';
    break;
  case "macos":
    cmd = 'brew install ninja';
    break;
  default:
    console.error(`Unknown os: ${os}`);
    process.exit(1);
}

exec(cmd, (error, stdout, stderr) => {

  console.log(`${stdout}`);
  console.error(`${stderr}`);
  if (error) {
    process.exit(error.code);
  }
});
