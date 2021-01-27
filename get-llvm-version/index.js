const core = require('@actions/core');
const { exec } = require('child_process');
const srcdir = core.getInput('srcdir');
const cmd = "grep -o 'LLVM_VERSION_\(MAJOR\|MINOR\|PATCH\) [0-9]\+'" + srcdir + "/llvm/CMakeLists.txt"

console.log(cmd);
exec(cmd, (error, stdout, stderr) => {
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  stdout.split("\n").forEach(function(line) {
    data = line.split(" ");
    core.setOutput(data[0], data[1]);
  });
});
