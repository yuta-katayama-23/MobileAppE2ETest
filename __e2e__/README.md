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

## emulator コマンドで AVD を起動できるようにする

以下のコマンドで AVD の名前を確認してその名前で AVD をコマンドプロンプトから起動できる<br>
※環境変数にパスが通っている事が前提

```cmd
C:\Users\user>emulator -list-avds
Pixel_3_XL_API_28

C:\Users\user>emulator @Pixel_3_XL_API_28
```

# シンプルなやり方で E2E テストを実装してみる

webdriverio を用いて appium client から appium server へ接続する部分を実装<br>
https://appium.io/docs/en/about-appium/getting-started/index.html#running-your-first-test<br>
`__e2e__/index.js`

## capabilities

以下を見ると分かる<br>
今回の`index.js`の各キーの値は以下を参考にしている<br>
https://appium.io/docs/en/writing-running-appium/caps/index.html

# CircleCi での E2E テスト

基本的にはローカルでエミュレータ起動・Appium Server の起動を行い、その後テスト実行を行う手順と同じ事をコマンドで行えば、CircleCi 上でも E2E テストが実行できる<br>
CircleCi のパイプラインを実装した yaml は以下<br>
`.circleci/config.yml`

## エミュレータ

今どきは以下のような便利なもの（Android のアプリを動かすために必要なものが入っているコンテナ）があるのでそれに乗っかり AVD 作成・エミュレータ起動を実装<br>
https://github.com/CircleCI-Public/android-image-preview-docs

## 手動トリガー

GitHub Actions から手動で実行できるようにし、push 時に自動的に E2E テストが走らないように実装<br>
※push 時に自動的に E2E テストを走らせるには、GitHub Actions のトリガーに push などを追加する形を想定して作成

## 課題

- テストが失敗でも CircleCi の job としては成功になっている
- job の step の順番を入れ替えるとテストが失敗する（[この実装](https://github.com/yuta-katayama-23/MobileAppE2ETest/blob/2072a6b2b30debfbacaac93dd6591d4578ee6540/.circleci/config.yml)だと成功するが）<br>https://app.circleci.com/pipelines/github/yuta-katayama-23/MobileAppE2ETest/29/workflows/428d4f0c-11f1-4765-9352-99485e7931c1/jobs/31
