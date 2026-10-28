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

繁體中文台灣電商展示，來源為 IMPLEMENTATION_PLAN.md 與使用者「切版完成後討論」指示。首頁為品牌／探索混合，搜尋頁為商品探索產品介面。沒有交易或會員流程，無日本市場需求。

Agent 提案：以 momo 粉紅搜尋列與密集分類導覽保留電商辨識度，主視覺採淡紫運動選物提案、放大自製鞋圖。此為待人類檢視的設計決策，不宣稱人類已核准個別顏色或與真站一致。

取捨：精確複製真站需獲授權的資產與逐畫面比較；本批採原創視覺加熟悉資訊架構，不做獨立品牌重設計，也不做黑色 SaaS 或大面積空白企業站。

Runtime ownership: src/app/global.css 為 canonical token source；此 frontmatter 鏡映其語意值，primary → --brand、primary-dark → --brand-dark、primary-soft → --brand-soft、border → --line、background → --page，其餘顏色對應同名 CSS 變數。元件使用變數，不複製主題值。SVG illustration palettes 為原創圖像顏色，不是 UI tokens。

## Colors

白色 header/card、淺灰頁面、粉紅搜尋／主要按鈕／價格；紫色只用於首頁主視覺。藍與杏色為右側次要促銷。無深色模式；forced-colors 使用系統捲軸。粉紅不單獨代表錯誤，錯誤需明確文案及 alert。

## Typography

繁體中文優先微軟正黑體、蘋方，不依賴外部字型。標題 24–39px、商品 15px、資料價格 27px Arial。英文小標僅作輔助，主要操作與無障礙名稱均用中文。商品資訊完整保留，不以截斷隱藏關鍵值。

## Layout

頁寬上限 1200px；桌面左右 24px，700px 以下 14px。首頁桌面 196px 分類側欄／主視覺／228px 促銷；1100px 收起促銷，750px 收起側欄。搜尋側欄於700px收起，主要搜尋仍可使用。商品 grid 4/3/2 欄，650px 以下兩欄。全頁自然捲動，導覽列可獨立水平捲動，不讓整頁橫向溢出。SVG 固定 viewBox、商品圖片區保留比例。小型固定資料集一次渲染，無假分頁。

## Elevation & Depth

卡片以細邊框分隔，hover 僅微量陰影；無高階浮層，無 modal/toast。主視覺鞋圖可使用表現性投影。

## Shapes

容器 7px、動作 4px；相關搜尋詞為 pill，radio 以圓形表示。搜尋欄高46px。所有互動提供 focus-visible 與 hover；商品卡為article內的完整Link，保留可讀商品資訊與鍵盤focus，連至本機詳情頁。

## Components

Canonical ownership: SearchForm → components/search；ProductArtwork/ProductCard/ProductResults → components/product；useProducts → libs/store/products；SiteHeader/PageShell → components/layout；App → app composition。沒有 screen-local search 或結果元件副本。

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Form | components/search/SearchForm.tsx | AGENTS.md URL and UX contract | explicit submit / clear | src/app/App.test.tsx |
| Product selection | components/product/ProductPurchase.tsx | AGENTS.md product detail contract | native radio / quantity stepper | src/app/ProductPage.test.tsx |
| Scrollbar | app/global.css | DESIGN.md | system forced-colors | browser smoke |

搜尋提交 trim 後導航，空白與 IME composition 不導航；clear 立即清空、返回首頁並保留輸入焦點。pathname 是 keyword 唯一來源，表單同步回填。排序與品牌存在 URL query，legacy query 不影響搜尋。排序採按鈕，不需 Select/Listbox。無其他未實作的可點擊假功能。

loading 為固定區域 app spinner；error 提供重試；empty 提供 asics 建議與返回首頁。useProducts effect cleanup 阻止舊回應覆寫；清除離開搜尋頁時失效。首頁及搜尋頁共用相同卡片、狀態元件與 repository。NTD 使用 zh-TW 數字格式，不顯示假折扣、庫存或配送承諾。

主視覺輕微 hover 不超過250ms；reduced-motion 取消 transition 與旋轉。SVG 圖為裝飾，article 名稱與商品資訊提供可讀內容。

## Do's and Don'ts

- 維持首頁與搜尋頁同一個 shell、卡片、搜尋與狀態文案。
- 使用本機 SVG，不下載商標或真實商品資產；文字 momo 僅為作業展示辨識。
- 不新增假 cart、登入、輪播或無作用按鈕。
- 不宣稱像素一致、真實優惠或官方交易能力。


## 商品詳情擴充

/product/:productId由人類本次授權新增，使用與首頁／搜尋相同shell。桌面上半部左右圖集／選購資訊，750px以下單欄；商品圖保留比例。下方商品介紹、規格、說明以錨點導覽，沒有假tab或無作用交易按鈕。

ProductGallery與ProductPurchase歸components/product，ProductPage只連接路由、狀態與頁面組合。原生fieldset/legend/radio保有Tab及方向鍵操作；隱藏radio仍可focus，label以focus-within呈現輪廓。錯誤有alert與欄位說明，確認有具名status；選項或數量改變時清除過期確認。未使用select、modal或新的互動套件。

顏色／尺寸／數量為UI草稿，Business驗證是否可選與數量範圍並計算確認總價；不建立cart、付款或訂單。圖集僅自製SVG的示意視角，不是官方產品照片。參考頁只用於資訊結構，不宣稱逐像素一致或真實報價。
