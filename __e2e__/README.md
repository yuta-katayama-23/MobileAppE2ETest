# CI

## CircleCi での E2E テスト

### 課題

- ~~テストが失敗でも CircleCi の job としては成功になっている~~<br>→Mocha を導入で対応（test に fail があれば job が失敗になるようになった）
- job の step の順番を入れ替えるとテストが失敗する（[この実装](https://github.com/yuta-katayama-23/MobileAppE2ETest/blob/2072a6b2b30debfbacaac93dd6591d4578ee6540/.circleci/config.yml)だと成功するが）<br>https://app.circleci.com/pipelines/github/yuta-katayama-23/MobileAppE2ETest/29/workflows/428d4f0c-11f1-4765-9352-99485e7931c1/jobs/31

## GitHub Actions での E2E テスト

### 課題

- ~~テストが失敗でも GitHub Actions の job としては成功になっている~~<br>→Mocha を導入で対応（test に fail があれば job が失敗になるようになった）
- ~~テストが失敗する事がある（[この job](https://github.com/yuta-katayama-23/MobileAppE2ETest/runs/3192139970?check_suite_focus=true)）~~<br>→emulator が boot するまで待機するで対応（emulator が boot するまで待機する事でテスト実行が環境要因で失敗しないようになった）
- ~~（テストが失敗する事があるに関連するかもしれないが）emulator の boot まで待機する処理がない~~<br>~~CircleCi で言うところの`circle-android wait-for-boot`~~<br>→emulator が boot するまで待機するで対応
