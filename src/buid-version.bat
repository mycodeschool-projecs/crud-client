@echo off
call service_version_number.bat

if not defined SERVICE_VERSION (
    echo Error: SERVICE_VERSION is not defined in service_version_number.bat.
    exit /b 1
)

echo Building Docker image...
@REM docker build -f Dockerfile -t kube-client:%SERVICE_VERSION% .
docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile -t ion21/kube-client:%SERVICE_VERSION% --push .


echo Getting the new image ID...
@REM setlocal enabledelayedexpansion
@REM for /f "tokens=*" %%i in ('docker images -q kube-client:%SERVICE_VERSION%') do set IMAGE_ID=%%i
@REM echo New image ID: !IMAGE_ID!
@REM endlocal

echo Tagging the image...
@REM docker tag kube-client:%SERVICE_VERSION%  ion21/kube-client:%SERVICE_VERSION%

echo Pushing the tagged image...
@REM docker sh  ion21/kube-client:%SERVICE_VERSION%

echo Script completed.
pause
