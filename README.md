# 我的餐廳清單

這是一個可以瀏覽各式餐廳的網站。

## 功能

- 瀏覽全部餐廳，或是單一餐廳的詳細資訊。
- 新增、編輯餐廳的資訊，或是刪除特定餐廳的資料。
- 可透過餐廳地址 URL 連結到 Google 地圖。
- 可透過名稱或類別搜尋餐廳。
- 可按照指定順序排序餐廳。

## 環境要求

- Node.js v18
- MySQL v8

## 安裝

1. clone 本專案後 cd 至專案資料夾，並執行以下命令安裝相關套件。

```
npm install
```

2. 至 `config/config.json` 檔案調整資料庫相關設定，並執行以下命令進行資料庫環境建置。

```
npm run db_setup
```

3. 依照 .env.example 範例創建 .env 檔。

4. 設置環境變數 NODE_ENV=development，並使用以下命令來執行本專案。

```
npm run start
```

5. 啟動伺服器後，開啟瀏覽器連線至網頁 http://localhost:3000。

## 開發工具

- Node.js v18
- MySQL v8
- express v4.18.3
- express-handlebars v7.1.2
- sequelize v6.37.1
- mysql2 v3.9.2
- method-override v3.0.0
- express-session v1.18.0
- connect-flash v0.1.1
- dotenv v16.4.5
- bootstrap v5.2.1
- font-awesome v5.8.1
