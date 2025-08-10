# Cabin Check

Cabin Check helps students quickly find professors and check their real-time availability in their cabins, ensuring efficient campus communication. It also allows professors to check their schedules, add calender events, send reminders to students.

This is a Flutter and React Project with Express.js and Node.js for backend and MongoDB Atlas for database. Currently it is made with the goal of helping students and professors of IIIT Kottayam.

## Installtion

NOTE: API Keys and their instructions are mentioned in api_keys.pdf

### Website(Student)

1. Run `npm install`

2. Use vscode search function to find local ip (eg. 172.16.204.118) and replace with your own local IPv4

3. Run `npm run dev`

4. Open http://localhost:5173/ on browser (might be opened automatically).

### App (Teacher)

Note 1: Make sure to run `npm run dev` first to start the backend server.

**Prerequisites**
<ul>
  <li>Flutter SDK</li>
  <li>Java JDK</li>
  <li>Android SDK (command-line tools for abd method or via Android Studio)</li>
  <li>USB Debugging enabled on your Android device</li>
  <li>`adb` added to your system PATH (comes with Android SDK's platform-tools)</li>
</ul>

**ADB Method**

1. Connect Android Phone and enable USB Debugging(Verify connection using `adb devices` or `flutter devices`)

2. Run `flutter clean` and `flutter pub get` in project folder.

3. Build or run APK using `flutter build apk --debug` or `flutter run`

Note: It might throw error saying build not found because it searches for the APK in `build/app/outputs/flutter-apk/` but the APK was generated in `android/app/build/outputs/apk/debug/app-debug.apk`. So copy the apk to the correct folder and run `flutter run` again.

**Android Studio Method**

1. Open project folder in Android Studio.

2. Either start an emulator from AVD Manager or connect your Android phone with USB Debugging enabled.

3. Click the green Run button (or Shift + F10). Android Studio will build the app and install it to the selected device