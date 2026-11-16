# 董建一 個人品牌網站
純 HTML/CSS/JS + JSON 內容 + GitHub Pages + Pages CMS。

## 結構
`index.html`、`styles/main.css`、`scripts/`（畫面與資料載入）、`data/*.json`（所有內容）、`assets/images/`（照片）、`.pages.yml`（CMS 設定）。

## 本機預覽
`python3 -m http.server 8000`，開 http://localhost:8000 （直接雙擊 index.html 會因 fetch 被瀏覽器擋住）。

## 部署
1. 建立 GitHub repo，把本資料夾內容放在根目錄 push。
2. Settings → Pages → Source 選 `main` / root。
3. 網址、網域、Email 之後確定再改：Email 與社群連結在 `data/site-settings.json`（或後台「網站設定」）；上線後把 `robots.txt`、`sitemap.xml` 的 YOUR-DOMAIN 換成正式網址，並在 `index.html` 加上 canonical 與 og:image，另更新 `llms.txt` 的聯絡資訊。

## 後台（Pages CMS）
1. 到 https://app.pagescms.org 用 GitHub 登入並授權此 repo，會讀取 `.pages.yml`。
2. 集合：網站設定、關於我、核心職能、人生與職涯歷程、商業創構、生活與探索。
3. 頁尾「管理者登入」只是連結，安全性來自 GitHub 授權。請啟用 GitHub MFA。
4. 狀態：`draft` 與 `unpublished` 不顯示，只顯示 `published`；順序看 `sort_order`（小的在前）。CMS 刪除沒有二次確認，重要內容請改用 `unpublished`。
5. `.pages.yml` 未能連線實測，若 CMS 報欄位錯誤，請對照 https://pagescms.org/docs/configuration/ 調整。

## 照片
- 個人照片：後台「網站設定」→ photo，或直接換 `assets/images/avatar.jpg`。
- 生活照片：後台「生活與探索」，每類放 3–5 張（最多顯示 5 張），4:3 橫式最佳，WebP、寬度 ≤1600px，務必填 alt。
- 未上傳時顯示單色漸層示意圖。上傳前請移除 EXIF（拍攝日期與 GPS），並確認他人已同意公開。

## 備份與復原
每月一次 `git clone` 整個 repo 另存；復原時 push 到新 repo 並重設 Pages。Git 歷史不是唯一備份。

## 已知限制
- 內容由 JavaScript 載入；`index.html` 內的 noscript 區塊提供基本文字給不執行 JS 的爬蟲，更完整的做法是上線前預先渲染。
- 後台新增全新區塊時，需同步在 `scripts/main.js` 補上渲染。
