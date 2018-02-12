#### `Run example`

From project root run through cli:
- `npm install`

For Android:
- `react-native run-android`

For iOS:
- `react-native run-ios`
#### `Release example`

For Android:
- `cd android; ./gradlew assembleRelease`

For iOS:
- `react-native bundle --entry-file index.ios.js --bundle-output ./ios/bundle/index.ios.jsbundle --platform ios --assets-dest ./ios/bundle --dev false`



react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/