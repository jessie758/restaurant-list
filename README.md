# 我的餐廳清單

這是一個可以瀏覽各式餐廳的網站。

## 功能

- 使用者可以瀏覽全部餐廳，或是單一餐廳的詳細資訊。
- 使用者可以新增、編輯餐廳的資訊，或是刪除特定餐廳的資料。

## 安裝

1. clone 本專案並 cd 至專案資料夾。

2. 執行以下命令安裝相關套件。

```
npm install
```

3. 至 `config/config.json` 檔案調整資料庫相關設定，並執行以下命令進行資料庫環境建置。

```
npx sequelize db:migrate;
npx sequelize db:seed:all;
```

4. 使用以下命令來執行本專案。

```
npm run start
```

5. 啟動伺服器後，開啟瀏覽器連線至網頁 http://localhost:3000。

## 開發工具

- Node.js v18
- MySQL server v8
- express v4.18.3
- express-handlebars v7.1.2
- sequelize v6.37.1
- mysql2 v3.9.2
- method-override v3.0.0
- bootstrap v5.2.1
- font-awesome v5.8.1
