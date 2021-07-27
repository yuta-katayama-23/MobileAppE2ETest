# Appium による E2E テスト

# 環境構築（ローカル）

appium-doctor で NG が出たのでその部分の環境構築

```shell
> appium-doctor

info AppiumDoctor Appium Doctor v.1.16.0
info AppiumDoctor ### Diagnostic for necessary dependencies starting ###
info AppiumDoctor  ✔ The Node.js binary was found at: C:\Program Files\nodejs\node.EXE
info AppiumDoctor  ✔ Node version is 14.16.0
WARN AppiumDoctor  ✖ ANDROID_HOME environment variable is NOT set!
WARN AppiumDoctor  ✖ JAVA_HOME environment variable is NOT set!
WARN AppiumDoctor  ✖ adb, android, emulator could not be found because ANDROID_HOME or ANDROID_SDK_ROOT is NOT set!
WARN AppiumDoctor  ✖ Cannot check %JAVA_HOME% requirements since the environment variable itself is not set
info AppiumDoctor ### Diagnostic for necessary dependencies completed, 4 fixes needed. ###
```

## JAVA_HOME にパスを通す

https://adoptopenjdk.net/ から openjdk11 をインストール<br>
※インストールの際、カスタムセットアップの画面で`Set JAVA_HOME variable`がデフォルトだと`×インストールしない`になっているので、`ローカルハードドライブにインストール`に変更する

インストール完了後、`javac --version`とコマンドプロンプトで実行しバージョンが表示されれば OK<br>
（バージョンが表示されない時は再起動して JAVA＿HOME のパスが windows に通るようにする）

上記実行後の`appium-doctor`の実行結果が以下。

```shell
info AppiumDoctor Appium Doctor v.1.16.0
info AppiumDoctor ### Diagnostic for necessary dependencies starting ###
info AppiumDoctor  ✔ The Node.js binary was found at: C:\Program Files\nodejs\node.EXE
info AppiumDoctor  ✔ Node version is 14.16.0
WARN AppiumDoctor  ✖ ANDROID_HOME environment variable is NOT set!
info AppiumDoctor  ✔ JAVA_HOME is set to: C:\Program Files\AdoptOpenJDK\jdk-11.0.11.9-hotspot\
WARN AppiumDoctor  ✖ adb, android, emulator could not be found because ANDROID_HOME or ANDROID_SDK_ROOT is NOT set!
info AppiumDoctor  ✔ 'bin' subfolder exists under 'C:\Program Files\AdoptOpenJDK\jdk-11.0.11.9-hotspot\'
info AppiumDoctor ### Diagnostic for necessary dependencies completed, 2 fixes needed. ###
```

## ANDROID_HOME にパスを通す

Android Studio（＋ SDK Tools）はインストール済みである場合は、その SDK がある場所を windows の環境変数に設定してパスを通す必要がある<br>
`C:\Users\user\AppData\Local\Android\Sdk`に SDK があったのでそれをそれぞれ、

- ANDROID_HOME : C:\Users\user\AppData\Local\Android\Sdk
- Path に以下の順でそれぞれ追加
  - %ANDROID_HOME%emulator
  - %ANDROID_HOME%tools
  - %ANDROID_HOME%platform-tools

※windows のシステム変数が編集できない時は[ここを参照](https://aprico-media.com/posts/5907)

設定完了後に（再起動を忘れずに行って）`appium-doctor`を実行し、上記で ✖ になっていた部分が ✔ になれば OK

```shell
info AppiumDoctor Appium Doctor v.1.16.0
info AppiumDoctor ### Diagnostic for necessary dependencies starting ###
info AppiumDoctor  ✔ The Node.js binary was found at: C:\Program Files\nodejs\node.EXE
info AppiumDoctor  ✔ Node version is 14.16.0
info AppiumDoctor  ✔ ANDROID_HOME is set to: C:\Users\user\AppData\Local\Android\Sdk
info AppiumDoctor  ✔ JAVA_HOME is set to: C:\Program Files\AdoptOpenJDK\jdk-11.0.11.9-hotspot\
info AppiumDoctor    Checking adb, android, emulator
info AppiumDoctor      'adb' is in C:\Users\user\AppData\Local\Android\Sdk\platform-tools\adb.exe
info AppiumDoctor      'android' is in C:\Users\user\AppData\Local\Android\Sdk\tools\android.bat
info AppiumDoctor      'emulator' is in C:\Users\user\AppData\Local\Android\Sdk\emulator\emulator.exe
info AppiumDoctor  ✔ adb, android, emulator exist: C:\Users\user\AppData\Local\Android\Sdk
info AppiumDoctor  ✔ 'bin' subfolder exists under 'C:\Program Files\AdoptOpenJDK\jdk-11.0.11.9-hotspot\'
info AppiumDoctor ### Diagnostic for necessary dependencies completed, no fix needed. ###
```
