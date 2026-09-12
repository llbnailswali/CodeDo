#!/bin/bash
# Builds the app (npm run build + npx cap sync), builds the Android debug
# APK, and installs + launches it on the connected device.
#
# Note: this no longer touches git at all -- deciding which of the 3 repos
# (CodeDoJoyFull, CodeDo, CodeDoInspiro) is newest, pulling code between
# them, and committing/pushing is now handled by the repo-sync-dashboard
# (see /Users/apple/Desktop/PersonalProjects/repo-sync-dashboard). Run this
# script after using the dashboard, just to build/install its result.
#
# Usage (from Android Studio's Terminal, which opens inside android/):
#   ../sync-android.sh
# Or from a regular terminal:
#   /Users/apple/CodeDo/sync-android.sh

set -e  # stop immediately if any step fails, instead of silently continuing

cd "$(dirname "$0")"

echo "==> npm run build"
npm run build

echo "==> npx cap sync"
npx cap sync

cd android
chmod +x ./gradlew

# Gradle needs JDK 21+, but the system `java` here is JBR 17 -- so borrow
# Android Studio's own bundled JDK instead of relying on whatever's on PATH.
for studio_jbr in "/Applications/Android Studio"*.app/Contents/jbr/Contents/Home; do
  if [ -x "$studio_jbr/bin/java" ] && "$studio_jbr/bin/java" -version 2>&1 | grep -qE 'version "(2[1-9]|[3-9][0-9])'; then
    export JAVA_HOME="$studio_jbr"
    export PATH="$JAVA_HOME/bin:$PATH"
    break
  fi
done

echo "==> ./gradlew assembleDebug"
./gradlew assembleDebug

APK="app/build/outputs/apk/debug/app-debug.apk"
APP_ID="com.codedo.app"

echo "==> adb install -r"
adb install -r "$APK"

echo "==> adb launch"
adb shell am force-stop "$APP_ID"
adb shell am start -n "$APP_ID/.MainActivity"

echo "==> Done. Latest build is running on the connected device."
