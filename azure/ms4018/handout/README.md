# MS-4018 ラボ手順書 (受講者向け)

この手順書は、MS-4018「Draft, analyze, and present with Microsoft 365 Copilot」のラボを、
受講者各自の Microsoft 365 環境で安全に実施するための日本語ガイドです。

**仮想環境 (画面の右側にラボの指示が出ている) を使う方は、画面右側の指示で進めてください。**

各ラボは 1 つのファイルで完結します。授業内で行う必須パートと、講義後に行う発展パート
(公式の全手順) が同じファイルに並びます。

- [MS-4018 Lab Exercises (公式・英語・最新)](https://microsoftlearning.github.io/MS-4018-Draft-analyze-present-Microsoft-365-Copilot/)
- [公式の日本語リポジトリ (2026 年 5 月版)](https://github.com/MicrosoftLearning/MS-4018-Draft-analyze-present-Microsoft-365-Copilot.ja-jp)

### 公式の日本語版 (5 月版) との違い

ラボ環境からリンクされるのは公式の日本語版で、2026 年 5 月時点の内容です。
その後に英語版の演習が入れ替わっており、次の 6 つの機能が 5 月版に入っていません。

Idea Coach / Writing Coach / チャネルの要約 / Facilitator / Python / Analyst エージェント

| ラボ | 5 月版 | 現行 (本手順書) |
| --- | --- | --- |
| Lab 1 Copilot Chat | 演習 6 本。演習 5 は FAQ 作成、演習 6 は Outlook で感謝メール | 演習 6 本。演習 5 は Copilot ページ保存、演習 6 は Copilot Chat でお礼の下書き |
| Lab 2 PowerPoint | 演習 5 本。Word 文書から作成、スライド追加、画像挿入、テキスト編集、整理 | 演習 5 本すべて別内容。Idea Coach、複数参照元、スピーカー ノート、グラフ確認、コーチング |
| Lab 3 Word | 演習 3 本。下書き、表に変換、要約 | 演習 4 本。下書き、セクションの書き直し、表に変換、Writing Coach |
| Lab 4 コラボレーション | 演習 2 本。メッセージ作成、Outlook で会議設定 | 演習 4 本。チャネル メッセージ、スレッド要約、Facilitator、Outlook で会議準備 |
| Lab 5 Excel | 演習 6 本。演習 4-6 は合計計算、分析情報の生成、チームへ送信 | 演習 6 本。演習 4-6 は Python、Analyst エージェント、洞察の生成 |

講義で説明する機能と揃うのは現行版です。自分の環境で進める方は本手順書を使ってください。
仮想環境を使う方は、画面右側の 5 月版の指示で進めてください。混ぜて読むと手順が食い違います。

## 出典とライセンス

この手順書は、公式ラボ手順 [MS-4018 Lab Exercises](https://github.com/MicrosoftLearning/MS-4018-Draft-analyze-present-Microsoft-365-Copilot)
(MicrosoftLearning、MIT ライセンス) にもとづく日本語訳と補足です。元のライセンス文は
[LICENSE](LICENSE) に置いています。

## ラボ一覧

当日の実施順に並んでいます。ファイル名の番号は作成時の通し番号で、実施順とは一致しません。

| 実施順 | ラボ | 対象モジュール | 公式ラボ | 必須パートの目安 |
| ---: | --- | --- | --- | --- |
| 1 | [ラボ：Chat](lab1-copilot-chat.md) | M02 | Lab 1 | 25 分 |
| 2 | [ラボ：資料作成](lab2-content-creation.md) | M03・M04 | Lab 2・Lab 3 | 30 分 |
| 3 | [ラボ：Excel](lab4-excel.md) | M06 | Lab 5 | 20 分 |
| 4 | [ラボ：会議とメール](lab3-collaboration.md) | M05・M07 | Lab 4 | 30 分 |

各ラボは「必須パート」(授業内で行う範囲) と「発展パート」(講義後に各自で行う範囲) に
分かれています。必須パートには「ここで停止」の位置を明記しています。時間内に終わらない
場合は停止位置まで進め、残りは講義後に続けてください。

## 自分の環境を確認する

ラボを始める前に、次のどの環境に該当するかを確認してください。

| 環境 | 状態 | ラボでの進め方 |
| --- | --- | --- |
| A: Microsoft 365 Copilot ライセンスあり | 職場または学校アカウントでサインインし、Word・PowerPoint・Excel・Teams・Outlook の各アプリ内に Copilot が表示される | 手順どおりに実施します |
| B: Copilot Chat など一部の機能が使える | [m365.cloud.microsoft](https://m365.cloud.microsoft) の Copilot Chat は使えるが、各アプリ内の Copilot が表示されない | 各ラボの「環境 B の場合」の案内に従い、使える操作を実施します。使えない操作は講師の画面共有を見てください |
| C: 職場アカウントで Microsoft 365 を使えない | 職場または学校アカウントを持たない、または組織のポリシーで Copilot を利用できない | 観察版です。講師の画面共有を見ながら、手順書を読んで操作の流れと確認観点を把握してください |

環境 B・C の受講者も、手順書には必須パートの全手順を記載しています。画面の表示名や
生成される内容を確認する資料として使ってください。

## 共通の事前準備

「ラボ：資料作成」と「ラボ：Excel」では、公式が提供するサンプルファイルを使います。
事前に OneDrive へアップロードしてください (公式手順: [Lab 0 setup](https://microsoftlearning.github.io/MS-4018-Draft-analyze-present-Microsoft-365-Copilot/Instructions/Labs/Lab_00_setup.html))。

公式手順の `go.microsoft.com/fwlink` のリンクは `raw.githubusercontent.com` へ転送されます。
組織のネットワークで塞がれている場合に開けないため、MS-4018 公式リポジトリ内の同じファイルへ
差し替えています。

1. 次の 3 ファイルをダウンロードします。
   - [Promotion Plan for Chai Tea in Latin America.docx](https://github.com/MicrosoftLearning/MS-4018-Draft-analyze-present-Microsoft-365-Copilot/raw/master/Allfiles/Promotion%20Plan%20for%20Chai%20Tea%20in%20Latin%20America%20(2).docx)
   - [Market Analysis Report for Mystic Spice Premium Chai Tea.docx](https://github.com/MicrosoftLearning/MS-4018-Draft-analyze-present-Microsoft-365-Copilot/raw/master/Allfiles/Market%20Analysis%20Report%20for%20Mystic%20Spice%20Premium%20Chai%20Tea.docx)
   - [Contoso Chai Tea market trends.xlsx](https://github.com/MicrosoftLearning/MS-4018-Draft-analyze-present-Microsoft-365-Copilot/raw/master/Allfiles/Contoso%20Chai%20Tea%20market%20trends.xlsx)
2. ブラウザーで OneDrive を開き、職場または学校アカウントでサインインします。
3. 「作成またはアップロード」→「ファイルのアップロード」で 3 ファイルをアップロードします。
4. アップロードした各ファイルを OneDrive 上で一度開きます。Copilot がファイルを
   参照候補として表示するために必要です (最近使用したファイルの一覧に載せる操作です)。
   Copilot が参照できるのは OneDrive または SharePoint 上のファイルであり、PC 内の
   ローカルファイルは参照できません。

## 全ラボ共通のルール

- **実在の人物・取引先・社内情報をプロンプトへ入力しないでください。** ラボで使う名前と
  組織名は、手順書が指定する架空のものに限ります。
- **メールの送信、会議招待の送信、ファイルやチャネルの外部共有は行いません。** 手順書に
  「送信前で停止」とある操作では、生成された下書きを確認した時点で終えます。
- **生成された内容を他の受講者へ画面共有しないでください。** 自分のメールやファイルを
  参照した結果には個人情報が含まれる場合があります。
- Copilot の応答は実行のたびに変わります。手順書の例と同じ結果にならなくても、指示した
  目的を満たしていれば先に進んでかまいません。
- ボタン名・機能名は日本語 UI の表記で記載し、必要に応じて英語名を括弧内に併記しています。
  画面が英語表示の場合は括弧内の英語名を参照してください。「(要確認)」と付けた名称は、
  執筆時点で日本語 UI 上の表記を確認できていない機能です。

## うまくいかないとき (全ラボ共通)

- **サインインできない**: ブラウザーのプライベート ウィンドウを開き、職場または学校
  アカウントでサインインし直してください。個人用の Microsoft アカウントが残っていると、
  別のアカウントでサインインされた状態になることがあります。
- **Copilot のアイコンやペインが表示されない**: ライセンス割り当てと組織のポリシーが
  必要です。環境 B・C に該当する可能性が高いので、講師に知らせてください。
- **参照したいファイルが候補に出ない**: OneDrive 上で対象ファイルを一度開き、数分待って
  から再試行してください。
- **応答が返らない、途中で止まる**: チャットを新規作成して同じプロンプトを再度実行して
  ください。
- **上記で解決しない**: 講師に知らせてください。観察版 (講師の画面を見る + 手順書を読む)
  でラボへ参加できます。
