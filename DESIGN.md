---
version: alpha
name: momo frontend
description: "A Taiwan ecommerce demo with a pink search-led shell and a lilac sports editorial."
colors:
  primary: "#d62872"
  primary-dark: "#ad1558"
  primary-soft: "#fcf0f5"
  ink: "#302b32"
  muted: "#716973"
  border: "#e9e5e9"
  surface: "#ffffff"
  background: "#f6f5f7"
  image-background: "#f8f8f7"
  plum: "#4c3459"
  plum-muted: "#715c79"
  hero: "#eee4f0"
  hero-circle: "#e0cfe6"
  hero-word: "#c1a8ce"
  blue-soft: "#e9eff5"
  blue-ink: "#3c5268"
  peach-soft: "#f6e8df"
  peach-ink: "#79533c"
  scroll-thumb: "#b7aab3"
  scroll-hover: "#8d7b87"
  scroll-active: "#6c5665"
typography:
  body:
    fontFamily: '"Microsoft JhengHei", "PingFang TC", system-ui, sans-serif'
  numeric:
    fontFamily: "Arial, sans-serif"
rounded:
  DEFAULT: "7px"
  control: "4px"
spacing:
  page-max: "1200px"
  section-gap: "40px"
components:
  search:
    height: "46px"
  card:
    padding: "16px"
---

# momo frontend Design System

## Overview

台灣繁體中文電商展示，主題為日常運動選物。首頁混合品牌探索，搜尋與商品頁以任務清楚為主。維持momo熟悉的粉紅搜尋列及密集商品資訊，自製淡紫運動主視覺是主要表現；不加入交易或官方優惠承諾。

目前有首頁、搜尋、商品詳情與頁內tabs／推薦／歷史。圖像皆為原創SVG，英文小標是視覺輔助，主要操作／訊息／無障礙名稱使用中文；沒有日本市場或日文locale需求。

Runtime token owner為src/app/global.css，frontmatter鏡映其值：primary→--brand、primary-dark→--brand-dark、primary-soft→--brand-soft、border→--line、background→--page，其餘顏色同名。UI使用變數；SVG illustration palette屬圖像配色，不是另一套主題。修改系統tokens需同步文件與runtime。

## Colors

白色header/card、淺灰頁面、粉紅搜尋／主動作／價格。紫色主要用於首頁與商品介紹；藍及杏色用於次要活動。錯誤需文字與語意，不單靠顏色。沒有dark theme；forced-colors保留系統可操作捲軸及selected-tab提示。

全域scrollbar tokens包含thumb／hover／active與track，使用標準屬性及WebKit fallback；局部導覽可水平捲動，但不讓整頁溢出。

## Typography

正文優先Microsoft JhengHei／PingFang TC／system-ui；價格使用Arial，沒有外部字型。常用標題24–39px、商品名稱15px、卡片價格27px；詳情價格較大。以實際CSS為準，不隱藏商品重要資訊；長名稱可換行。formatPrice只產生數字部分，UI負責$與可讀價格文案，價格單位為新台幣元。

## Layout

頁寬上限1200px，桌面左右24px、700px以下14px。首頁分類／主視覺／側促銷於窄版逐步收起；導覽在1000px以下可局部捲動。一般商品網格4/3/2欄；Discovery另採4欄、900px以下2欄。

商品詳情桌面左右圖集／選購，750px以下單欄。圖片固定viewBox及比例。詳情之後依序為資訊tabs、推薦、瀏覽紀錄；自然document捲動，沒有fixed-height app shell或假分頁。

## Elevation & Depth

細邊框及表面色建立層級；卡片hover只有輕量陰影，主視覺鞋圖可表現性投影。沒有modal、toast或高階overlay；持續錯誤與選購確認放在擁有該流程的區域。

## Shapes

一般容器7px、動作4px；相關搜尋pill、配色圓點與radio有各自用途。搜尋列高46px。商品card是article中的完整Link，提供focus-visible；不做可點div。hover不替代鍵盤或觸控操作，disabled按鈕保有明確外觀。

## Components

| 能力 | Canonical owner | 主要驗證 |
|---|---|---|
| Header／容器 | components/layout/SiteHeader、PageShell | App及browser smoke |
| 搜尋 | components/search/SearchForm | src/app/App.test.tsx |
| 商品card／圖像／清單狀態 | components/product/ProductCard、Artwork、Results | App及browser smoke |
| 圖集 | components/product/ProductGallery | src/app/ProductPage.test.tsx |
| 選購表單 | components/product/ProductPurchase | ProductPage及Business rules tests |
| 資訊tabs | components/product/ProductInfoTabs | ProductInfoTabs、ProductExperience tests |
| 推薦／歷史呈現 | components/product/ProductDiscovery | ProductDiscovery、ProductExperience tests |
| 捲軸／tokens | app/global.css | browser computed style |

Business hooks與規則歸libs/store/products；資料與storage adapters歸libs/apiservices/products。詳細所有權見 [架構](docs/architecture.md)，不在UI重新實作同一組資料規則。

搜尋草稿／IME／focus留UI，URL擁有已提交查詢。商品選購使用fieldset/legend及原生radio，隱藏input仍能focus，由label focus-within呈現輪廓。換色清尺寸，選項／數量改變清除舊確認；submit驗證失敗有alert及焦點，成功有具名status。無select/listbox套件或交易按鈕。

Tabs有tablist/tab/tabpanel與aria關聯；單一Tab停駐點，左右鍵／Home／End自動啟用並移動焦點。只有目前panel可操作，換商品回介紹；切換不改URL。推薦最多4件、歷史不預填假紀錄；兩者沿用卡片，清除歷史即時更新。

載入為app-owned spinner或區域status，錯誤有重試，無商品與請求失敗分開。資料狀態由Business管理，UI不解析response。動作hover及圖集transition不超過250ms；prefers-reduced-motion停用非必要transition／animation。

## Do's and Don'ts

- 保持三頁同一shell、商品卡、價格與狀態語言，使用既有tokens及owner。
- 明確說明示範商品、價格及選購；本機紀錄只存商品ID，可清除。
- 不下載官方圖像、捏造折扣／庫存／交易能力或加入無作用按鈕。
- 不宣稱pixel parity、完整WCAG驗證或未執行的工具通過；已知缺口見 [comparison](docs/comparison.md)。
