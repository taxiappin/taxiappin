#!/bin/bash
set -e

echo "=== TaxiApp Android Mobile APK Builder ==="
echo "Package: com.taxiapp.users"
echo "Version: 2.0.4 (code 1)"

# Check/Install portable JDK 17 if not available
if ! command -v javac &> /dev/null; then
  if [ -f /usr/lib/jvm/java-17-openjdk-amd64/bin/javac ]; then
    export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
    export PATH=$JAVA_HOME/bin:$PATH
  elif [ -f /opt/jdk-17/bin/javac ]; then
    export JAVA_HOME=/opt/jdk-17
    export PATH=$JAVA_HOME/bin:$PATH
  fi
fi

# Detect ANDROID_HOME
if [ -z "$ANDROID_HOME" ] || [ ! -d "$ANDROID_HOME" ]; then
  if [ -d "$PWD/tools/android-sdk" ]; then
    export ANDROID_HOME="$PWD/tools/android-sdk"
  elif [ -d "/tools/android-sdk" ]; then
    export ANDROID_HOME="/tools/android-sdk"
  elif [ -d "/opt/android-sdk" ]; then
    export ANDROID_HOME="/opt/android-sdk"
  fi
fi
echo "sdk.dir=$ANDROID_HOME" > capacitor/android/local.properties

chmod +x capacitor/android/gradlew

echo "Building Release APK..."
./capacitor/android/gradlew -p capacitor/android assembleRelease --stacktrace --no-daemon

echo "Building Debug APK..."
./capacitor/android/gradlew -p capacitor/android assembleDebug --stacktrace --no-daemon

mkdir -p dist/mobile
cp capacitor/android/app/build/outputs/apk/release/app-release.apk dist/mobile/taxiapp-v2.0.4-release.apk 2>/dev/null || true
cp capacitor/android/app/build/outputs/apk/debug/app-debug.apk dist/mobile/taxiapp-v2.0.4-debug.apk 2>/dev/null || true

echo "=== Build Complete ==="
ls -la dist/mobile/
