# Cabin Check

**Cabin Check** is a campus communication platform designed to help students quickly locate professors and view their real-time cabin availability. The system streamlines meeting requests, notifications, and availability updates, improving overall academic coordination.

The platform supports:
- Real-time professor availability tracking.
- Student-to-professor meeting requests with approval and scheduling.
- Broadcast notifications from professors to specific years or batches.
- Push notification to app when new meeting is requested.
Cabin Check is built as a cross-platform system, with a web interface for students and a mobile application for professors.

## Tech Stack

**Frontend**
- React (Web – Students)
- Flutter (Android App – Professors)

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas

## Screenshots

Dashboard with dark and light mode
<p align="center">
  <img src="assets/DashboardDark.png" width="600"/>
  <img src="assets/DashboardLight.png" width="600"/>
</p>
Adjusted UI and for mobile device
![MobileDashboard](<assets/MobileDashboard.png>)
![MobileSidebar](<assets/MobileSidebar.png>)
Profile Page with Year and Department auto adjusted from college email
![ProfilePage](<assets/ProfilePage.png>)
Status Page with Searching and Requesting meeting function
![StatusPage](<assets/StatusPage.png>)
![SearchFunction](<assets/SearchFunction.png>)
![CreatingRequest](<assets/CreatingRequest.png>)
Meeting Request Page
![MeetingRequestPage](<assets/MeetingRequestPage.png>)

## Installation

### Website(Student)

1. Run `npm install` to install dependencies

2. Create an environment file:
- Rename env to .env
- Set MONGO_URI and VITE_BASE_URL to your IPv4 address(optional) in .env

3. Run `npm run dev` to start development server.

### App (Teacher)

**Important:** Ensure the backend server is running `npm run dev` before launching the app..

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

**Known Issue:** It might throw error stating build not found since flutter searches for the APK in `build/app/outputs/flutter-apk/` but the APK was generated in `android/app/build/outputs/apk/debug/app-debug.apk`. If it occurs, copy the apk to the expected directory and run `flutter run` again.

**Android Studio Method**

1. Open project folder in Android Studio.

2. Either start an emulator from AVD Manager or connect your Android phone with USB Debugging enabled.

3. Click the green Run button (or Shift + F10). Android Studio will build the app and install it to the selected device