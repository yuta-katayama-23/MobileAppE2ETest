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
参考：https://github.com/CircleCI-Public/android-image-preview-docs

## 手動トリガー

GitHub Actions から手動で実行できるようにし、push 時に自動的に E2E テストが走らないように実装<br>
※push 時に自動的に E2E テストを走らせるには、GitHub Actions のトリガーに push などを追加する形を想定して作成

手動トリガーを作るにあたり参考にした[API リファレンス](https://circleci.com/docs/api/v2/#operation/triggerPipeline)

## 課題

- テストが失敗でも CircleCi の job としては成功になっている
- job の step の順番を入れ替えるとテストが失敗する（[この実装](https://github.com/yuta-katayama-23/MobileAppE2ETest/blob/2072a6b2b30debfbacaac93dd6591d4578ee6540/.circleci/config.yml)だと成功するが）<br>https://app.circleci.com/pipelines/github/yuta-katayama-23/MobileAppE2ETest/29/workflows/428d4f0c-11f1-4765-9352-99485e7931c1/jobs/31

# GitHub Actions での E2E テスト

GitHub Actions も CircleCi と考え方は同じで、基本的にはローカルでエミュレータ起動・Appium Server の起動を行い、その後テスト実行を行う手順と同じ事をコマンドで行えば、GitHub Actions 上でも E2E テストが実行できる<br>
ただ、CircleCi と違って GitHub Actions には Android 向けの Runner(コンテナ)がないのでは・・・？（＝ self-hosted runners でないなら 1 から色々入れる必要がある？）<br>と思ったがそれは早とちりで、 GitHub Actions の Runner `ubuntu-latest` に[元々インストール済み](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu2004-README.md)のものを見ると、Android のアプリ Build・E2E テストに必要なものはほぼ初めからインストール済みで、自分でインストールする必要があるのは appium だけ

※ちなみに、GitHub Actions の Runner 一覧は[ここ](https://github.com/actions/virtual-environments#available-environments)

## トラブルシューティング

### `sdkmanager`, `avdmanager`コマンド

`sdkmanager`は`android_sdk/cmdline-tools/version/bin/`にあるので、``<br>
参考：[Android SDK コマンドライン ツール](https://developer.android.com/studio/command-line?hl=ja#tools-sdk)

パスについての話 https://github.com/actions/virtual-environments/issues/60

job：https://github.com/yuta-katayama-23/MobileAppE2ETest/runs/3188836735?check_suite_focus=true

## ライセンスへの同意

https://qiita.com/akym03/items/7646732b220412b085b7

### `emulator`コマンド

`emulator`は`android_sdk/emulator/`にあるようなので<br>
※ちなみに、emulator 起動時に引数に色々オプションを付けられるが、それぞれ以下の通り

ここに表を描く

参考：[Android エミュレータ](https://developer.android.com/studio/command-line?hl=ja#tools-emulator)
参考：[コマンドラインからのエミュレータの起動](https://developer.android.com/studio/run/emulator-commandline)

### エラー『emulator: ERROR: x86 emulation currently requires hardware acceleration!』

以下の log に出ているように、単純に KVM が必要

https://github.com/yuta-katayama-23/MobileAppE2ETest/runs/3189440630?check_suite_focus=true

```
emulator: CPU Acceleration: DISABLED
emulator: CPU Acceleration status: KVM requires a CPU that supports vmx or svm
emulator: ERROR: x86 emulation currently requires hardware acceleration!
CPU acceleration status: KVM requires a CPU that supports vmx or svm
More info on configuring VM acceleration on Linux:
https://developer.android.com/studio/run/emulator-acceleration#vm-linux
General information on acceleration: https://developer.android.com/studio/run/emulator-acceleration.
```

> Linux ベースのシステムは、[KVM ソフトウェア パッケージ](https://www.linux-kvm.org/page/Main_Page)を介して VM アクセラレーションをサポートしています。 Linux システムに KVM をインストールする手順を行い、KVM が有効になっていることを確認します。Ubuntu システムについては、[Ubuntu KVM のインストール](https://help.ubuntu.com/community/KVM/Installation)の説明をご覧ください。

https://developer.android.com/studio/run/emulator-acceleration#vm-linux

以降は[Ubuntu KVM のインストール](https://help.ubuntu.com/community/KVM/Installation)のサイトに従ってやっていく。

```
sudo apt-get install cpu-checker
sudo /usr/sbin/kvm-ok
```

でチェックすると、、、

```
INFO: Your CPU does not support KVM extensions
KVM acceleration can NOT be used
```

え、使えないの・・・となるが、以下のような注意書きがあり、**今**使える/使えないを示してるだけなので、install すれば OK

> NOTE: You may see a message like "KVM acceleration can/can NOT be used". This is misleading and only means if KVM is _currently_ available (i.e. "turned on"), _not_ if it is supported.

Ubuntu-は`Cosmic (18.10) or later`なので、`sudo apt-get install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils`を実行すればいい
https://ja.wikipedia.org/wiki/Ubuntu%E3%81%AE%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E5%B1%A5%E6%AD%B4

# ディレクトリ構成

```
cd /usr/local/lib/android/sdk
ls -al

drwxrwxrwx 14 root root 4096 Jul 18 04:12 .
drwxr-xr-x  3 root root 4096 Jul 18 04:07 ..
-rw-r--r--  1 root root   16 Jul 18 04:12 .knownPackages
drwxrwxrwx  2 root root 4096 Jul 18 04:11 .temp
drwxrwxrwx 19 root root 4096 Jul 18 04:11 build-tools
drwxrwxrwx  4 root root 4096 Jul 18 04:10 cmake
drwxrwxrwx  3 root root 4096 Jul 18 04:07 cmdline-tools
drwxrwxrwx  7 root root 4096 Jul 18 04:07 emulator
drwxrwxrwx  4 root root 4096 Jul 18 04:10 extras
drwxrwxrwx  2 root root 4096 Jul 18 04:07 licenses
drwxrwxrwx  4 root root 4096 Jul 18 04:11 ndk
lrwxrwxrwx  1 root root   43 Jul 18 04:07 ndk-bundle -> /usr/local/lib/android/sdk/ndk/21.4.7075529
drwxrwxrwx  3 root root 4096 Jul 18 04:07 patcher
drwxrwxrwx  5 root root 4096 Jul 18 04:07 platform-tools
drwxrwxrwx  7 root root 4096 Jul 18 04:10 platforms
drwxrwxrwx  6 root root 4096 Jul 18 04:07 tools
```
