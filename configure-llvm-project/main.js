const { spawn } = require('child_process')

if (process.argv.length != 2) {
  console.error("usage: process.argv[0] process.argv[1]");
  process.exit(1);
}

var os = process.env.INPUT_OS.toLowerCase()
var cmake_args = "";

switch (os) {
  case "linux":
  case "ubuntu":
    break;
  case "windows":
    // The GitHub virtual environment has MinGW installed and in PATH, so
    // CMake will choose gcc by default.  This causes build failures, so
    // change the default to MSVC.  Users will be able to override this
    // if they want.
    cmake_args += "-DCMAKE_C_COMPILER=cl -DCMAKE_CXX_COMPILER=cl "
    break;
  case "macos":
    // The go binding tests fail on macos:
    // _cgo_export.c:3:10: fatal error: 'stdlib.h' file not found
    cmake_args += "-DLLVM_INCLUDE_GO_TESTS=OFF "
    // There appears to be a race condition that causes
    // llvm/test/ThinLTO/X86/cache.ll to fail on MacOS.  Disabling threads in
    // lit fixes this.
    cmake_args += "-DLLVM_LIT_ARGS=-svj1 "
    break;
  default:
    console.error("Unknown os: ${os}");
    process.exit(1);
}

if (process.env.INPUT_CMAKE_ARGS) {
  cmake_args += process.env.INPUT_CMAKE_ARGS
}

cmd = 'cmake ' + cmake_args
console.log(`${cmd}`)

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

p.on('exit', (code, signal) => {
  if (signal) {
    console.error(`Process exited: ${signal}`);
    process.exit(1);
  }
  process.exit(code);
});
