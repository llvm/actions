@echo off
setlocal

:: From https://github.com/microsoft/vswhere/wiki/Find-VC
for /f "usebackq tokens=*" %%i in (`"%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe" -latest -property installationPath`) do (
  set InstallDir=%%i
)

:: Setup environment
call "%InstallDir%\Common7\Tools\vsdevcmd.bat" %*

:: Echo all env vars as github runner commands, so they persist for subsequent steps.
for /f "tokens=1,2 delims==" %%a in ('set') do (
  echo ::set-env name=%%a::%%b
)
