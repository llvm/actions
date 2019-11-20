const { execSync } = require('child_process');
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const process = require('process');

function run_command(cmd) {
  var p;
  console.log(`${cmd}`)
  execSync(cmd, (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.error(`${stderr}`);
    if (error) {
      process.exit(error.code);
    }
  });
  return null;
}

function run_command_async(cmd) {
  p = spawn(cmd, { shell : true});

  p.stdout.on('data', (data) => {
    process.stdout.write(data.toString());
  });

  p.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  p.on('error', (code) => {
    process.exit(code);
  });

  return p
}

function get_action_cmd(action) {
  return 'node ' + path.join(__dirname, '..', action, 'main.js');
}

function handle_errors(code, signal) {
  if (code) {
    process.exit(code);
  }
  if (signal) {
    console.error(`Process exited: ${signal}`);
    process.exit(1);
  }
}

var commit = process.env.INPUT_REF;
var repo = process.env.INPUT_REPO;

const tar_file = 'llvm-project.tar.gz'
const url = `http://github.com/${repo}/tarball/${commit}/${tar_file}`;
const curl_cmd = `curl -L -O ${url}`

console.log(curl_cmd);
p = run_command_async(curl_cmd);
p.on('exit', (code, signal) => {
  if (code || signal) {
    handle_errors(code, signal);
  }
  const tar_cmd = `tar --strip-components=1 -xzf ${tar_file}`;
  console.log(tar_cmd);
  p = run_command(tar_cmd);
  fs.unlinkSync(tar_file)
});
