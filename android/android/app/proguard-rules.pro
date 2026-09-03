# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# 틈새움 네이티브 모듈은 @ReactMethod 리플렉션으로 등록되고, 리시버·액티비티는
# AlarmManager PendingIntent와 매니페스트에서 클래스 이름으로 참조된다.
# 앱 패키지는 작으니 통째로 유지해 R8 이름 변경으로 알람 체인이 끊기는 일을 막는다.
-keep class com.teum.app.** { *; }
-keepclassmembers class * extends com.facebook.react.bridge.BaseJavaModule {
  @com.facebook.react.bridge.ReactMethod <methods>;
}

# Add any project specific keep options here:
