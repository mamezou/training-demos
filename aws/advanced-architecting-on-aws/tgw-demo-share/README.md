# AWS Transit Gateway ハンズオンガイド

## 概要

このハンズオンでは、AWS Transit Gatewayを使用した複数VPC間の接続とセグメンテーション構成を実装・検証します。CDKを使用して環境を構築し、実際の動作を確認しながらTransit Gatewayの機能を学習できます。

### 学習内容
- Transit Gatewayによる複数VPC間の相互接続
- ルートテーブルを使用した環境分離（セグメンテーション）
- ハブ&スポーク構成の実装

## アーキテクチャ

### 構築する環境
```
┌─────────────────────────────────────────────────┐
│               Transit Gateway                    │
│                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────┐│
│  │   Dev VPC    │ │   Prod VPC   │ │ Shared   ││
│  │ 10.20.0.0/16 │ │ 10.21.0.0/16 │ │   VPC    ││
│  │              │ │              │ │10.22.0/16││
│  │  EC2 Instance│ │  EC2 Instance│ │EC2 Inst. ││
│  └──────────────┘ └──────────────┘ └──────────┘│
└─────────────────────────────────────────────────┘
```

## 前提条件

### 必要なツール
- Git
- Node.js (v18以降推奨)
- AWS CLI (設定済み)
- AWS CDK CLI

### AWS環境要件
- AWSアカウント
- 適切な権限（VPC、EC2、Transit Gateway、IAMの作成権限）
- リージョン: 任意（東京リージョン ap-northeast-1 推奨）

## セットアップ手順

### 1. リポジトリのクローンと準備

```bash
# リポジトリのクローン
git clone https://github.com/mamezou/tgw-demo-share.git
cd tgw-demo-share

# 依存関係のインストール
npm install

# CDKのBootstrap（初回のみ）
npx cdk bootstrap
```

### 2. 環境構築

```bash
# スタックのデプロイ
npx cdk deploy

# デプロイ完了後、出力される以下の情報をメモしておく
# - Transit Gateway ID
# - 各VPCのインスタンスID
# - 各インスタンスのプライベートIP
```

デプロイには約10-15分かかります。

## ハンズオン実習

### 実習1: 基本接続の確認（フルメッシュ構成）

#### 1.1 AWSコンソールでリソース確認

1. **VPCコンソール**にアクセス
   - 左メニュー「Transit Gateways」を選択
   - デプロイされたTransit Gatewayの詳細を確認

2. **Transit Gateway Attachments**を確認
   - 3つのVPCアタッチメントが作成されていることを確認
   - 各アタッチメントのステータスが「Available」であることを確認

3. **Transit Gateway Route Tables**を確認
   - デフォルトルートテーブルに全VPCへのルートが存在することを確認

#### 1.2 VPC間通信テスト

1. **EC2コンソール** → **インスタンス**を選択
2. Dev VPCのインスタンスを選択し、「接続」ボタンをクリック
3. 「Session Manager」タブを選択して接続

```bash
# 自分のIPアドレスを確認
ip addr show | grep "inet 10"

# Prod VPCへの通信確認（成功するはず）
ping -c 3 10.21.1.10  # Prod VPCインスタンスのIP

# Shared VPCへの通信確認（成功するはず）
ping -c 3 10.22.1.10  # Shared VPCインスタンスのIP
```

同様にProd VPCとShared VPCのインスタンスからも相互通信を確認します。

### 実習2: セグメンテーション実装（環境分離）

#### 2.1 新しいルートテーブル作成

1. **VPCコンソール** → **Transit Gateway Route Tables**
2. 「Create route table」をクリック

**Prodルートテーブル作成:**
- Name: `TGW-RT-Prod`
- Transit Gateway ID: デプロイしたTGWを選択
- 作成

**Devルートテーブル作成:**
- Name: `TGW-RT-Dev`
- Transit Gateway ID: デプロイしたTGWを選択
- 作成

#### 2.2 アタッチメントの再関連付け

1. **デフォルトルートテーブル**を選択
2. 「Associations」タブ → Prod VPCアタッチメントを選択 → 「Delete association」
3. 同様にDev VPCアタッチメントも削除（Shared VPCは残す）

4. **TGW-RT-Prod**を選択
   - 「Create association」
   - Prod VPCアタッチメントを選択して関連付け

5. **TGW-RT-Dev**を選択
   - 「Create association」
   - Dev VPCアタッチメントを選択して関連付け

#### 2.3 ルート設定

1. **TGW-RT-Prod** → 「Routes」タブ
   - 「Create route」
   - CIDR: `10.22.0.0/16`
   - Attachment: Shared VPCアタッチメントを選択

2. **TGW-RT-Dev** → 「Routes」タブ
   - 「Create route」
   - CIDR: `10.22.0.0/16`
   - Attachment: Shared VPCアタッチメントを選択

3. **デフォルトルートテーブル** → 「Routes」タブ
   - Prod VPC向けルート追加:
     - CIDR: `10.21.0.0/16`
     - Attachment: Prod VPCアタッチメント
   - Dev VPC向けルート追加:
     - CIDR: `10.20.0.0/16`
     - Attachment: Dev VPCアタッチメント

#### 2.4 分離効果の確認

Dev VPCインスタンスに再度接続:

```bash
# Dev → Prod（失敗するはず - タイムアウト）
ping -c 3 10.21.1.10

# Dev → Shared（成功するはず）
ping -c 3 10.22.1.10
```

Prod VPCインスタンスから確認:

```bash
# Prod → Dev（失敗するはず - タイムアウト）
ping -c 3 10.20.1.10

# Prod → Shared（成功するはず）
ping -c 3 10.22.1.10
```

### 実習3: 構成の理解とトラブルシューティング

#### 3.1 ルーティングの確認

各VPCのルートテーブルを確認して、Transit Gatewayへのルートが正しく設定されているか確認します。

1. VPCコンソール → Route tables
2. 各VPCのプライベートサブネットのルートテーブルを確認
3. 他VPC向けのトラフィックがTransit Gatewayに向いていることを確認

#### 3.2 セキュリティグループの確認

1. EC2コンソール → Security Groups
2. 各VPCのセキュリティグループで10.0.0.0/8からの通信が許可されていることを確認

## クリーンアップ

実習終了後は必ずリソースを削除してください：

```bash
# スタックの削除
npx cdk destroy

# 確認メッセージが表示されたら「y」を入力
```

削除には約5-10分かかります。

## トラブルシューティング

### よくある問題と解決方法

1. **pingが通らない場合**
   - セキュリティグループでICMPが許可されているか確認
   - ルートテーブルの設定が正しいか確認
   - Transit Gateway Route Tablesのアソシエーションを確認

2. **Session Managerで接続できない場合**
   - インスタンスにSSM用のIAMロールがアタッチされているか確認
   - VPCにインターネット接続（NAT Gateway）があるか確認

3. **CDKデプロイが失敗する場合**
   - AWS認証情報が正しく設定されているか確認
   - CDK bootstrapが完了しているか確認
   - リージョンが正しいか確認

※ 長時間の実行は避け、使用後は必ずクリーンアップを実行してください
