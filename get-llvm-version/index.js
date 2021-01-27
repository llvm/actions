const core = require('@actions/core');
const exec = require('child_process');
const srcdir = core.getInput('srcdir');
const cmd = "grep -o 'LLVM_VERSION_\(MAJOR\|MINOR\|PATCH\) [0-9]\+'" + srcdir + "/llvm/CMakeLists.txt"

exec(cmd, (error, stdout, stderr) => {
  stdout.split("\n").forEach(function(line) {
    data = line.split(" ");
    core.setOutput(data[0], data[1]);
  })
});
