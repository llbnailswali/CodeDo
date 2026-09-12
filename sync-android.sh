#!/bin/bash
# Commits and pushes any local changes, then figures out which of the three
# sibling repos (CodeDoJoyFull, CodeDo, CodeDoInspiro) has the newest commit
# and pulls its code in here (via rsync, preserving this repo's own git
# history), refreshes the Android project, then builds a debug APK and
# installs + launches it on the connected device -- so running this alone is
# enough to see the latest changes (from here or elsewhere, e.g. AI Studio)
# on your phone.
#
# Usage (from Android Studio's Terminal, which opens inside android/):
#   ../sync-android.sh
# Or from a regular terminal:
#   /Users/apple/CodeDo/sync-android.sh

set -e  # stop immediately if any step fails, instead of silently continuing

cd "$(dirname "$0")"

echo "==> git add & commit & push (local changes)"
git add -A
if git diff --cached --quiet; then
  echo "    no local changes to commit"
else
  git commit -m "chore: sync local changes $(date '+%Y-%m-%d %H:%M:%S')"
  git push origin main
fi

# --- Determine which of the 3 repos has the newest commit, and pull it in ---

OTHER_REPOS=(
  "joyfull|https://github.com/joyfulkids001-crypto/CodeDoJoyFull.git|CodeDoJoyFull"
  "inspiro|https://github.com/InspiroApp/CodeDoInspiro.git|CodeDoInspiro"
)

SYNC_WORKDIR="$(mktemp -d /tmp/codedo-sync.XXXXXX)"
trap 'rm -rf "$SYNC_WORKDIR"' EXIT

echo "==> Checking commit timestamps across CodeDoJoyFull, CodeDo, CodeDoInspiro"

BEST_NAME="codedo"
BEST_LABEL="CodeDo"
BEST_TS=$(git log -1 --format=%ct)
echo "    CodeDo (local)  last commit: $(date -r "$BEST_TS")"

for entry in "${OTHER_REPOS[@]}"; do
  name="${entry%%|*}"
  rest="${entry#*|}"
  url="${rest%%|*}"
  label="${rest#*|}"

  clone_dir="$SYNC_WORKDIR/$name"
  git clone --quiet --branch main "$url" "$clone_dir"
  ts=$(git -C "$clone_dir" log -1 --format=%ct)
  echo "    $label last commit: $(date -r "$ts")"

  if [[ "$ts" -gt "$BEST_TS" ]]; then
    BEST_TS="$ts"
    BEST_NAME="$name"
    BEST_LABEL="$label"
  fi
done

echo "==> Newest: $BEST_LABEL"

if [[ "$BEST_NAME" == "codedo" ]]; then
  echo "==> CodeDo is already the newest -- git pull to be safe"
  git pull origin main
else
  echo "==> Pulling in $BEST_LABEL's code (rsync, keeping CodeDo's own git history)"
  rsync -a --delete --exclude='.git' "$SYNC_WORKDIR/$BEST_NAME/" ./

  git add -A
  if git diff --cached --quiet; then
    echo "    no changes to commit -- already up to date with $BEST_LABEL"
  else
    git commit -m "Sync code from $BEST_LABEL

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
    git push origin main
  fi
fi

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
