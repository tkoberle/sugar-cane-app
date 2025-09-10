  Quick Commands Summary:

  # Set environment variables (add to your ~/.zshrc or ~/.bash_profile)
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools

  # Start emulator
  $ANDROID_HOME/emulator/emulator -avd Medium_Phone_API_36.0

  # Or with alias (recommended)
  alias emulator="$ANDROID_HOME/emulator/emulator"
  emulator -avd Medium_Phone_API_36.0

  # Check if emulator is running
  adb devices

  Once emulator is fully booted, run your app:

  # In your project directory
  npx expo run:android
  # or
  npx expo start --android