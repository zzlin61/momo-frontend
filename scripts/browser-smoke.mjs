import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin = 'http://127.0.0.1:5174';
const targets = await (await fetch('http://127.0.0.1:9224/json')).json();
const target = targets.find(item => item.type === 'page');
assert(target, 'Isolated Chrome page is available');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let sequence = 0;
const pending = new Map();
const errors = [];
const requests = [];
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const waiter = pending.get(message.id);
    if (waiter) { pending.delete(message.id); message.error ? waiter.reject(message.error) : waiter.resolve(message.result); }
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url);
});
function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)); }, 10000);
    pending.set(id, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  assert(!response.exceptionDetails, JSON.stringify(response.exceptionDetails));
  return response.result.value;
}
async function until(expression) {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await evaluate(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  console.error(await evaluate('JSON.stringify({url:location.href,input:document.querySelector(' + JSON.stringify('input') + ')?.value,text:document.body.innerText.slice(0,1200)})'));
  throw new Error('Condition not met: ' + expression);
}
async function navigate(path) {
  await call('Page.navigate', { url: origin + path });
  await until("document.readyState === 'complete' && !!document.querySelector('main h1')");
}
async function screenshot(name) {
  await evaluate('document.fonts.ready');
  const image = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/screenshots/' + name + '.png', Buffer.from(image.data, 'base64'));
}
async function noOverflow() {
  assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'No page-wide horizontal overflow: ' + await evaluate('innerWidth + " / " + document.documentElement.scrollWidth'));
}
await call('Page.enable');
await call('Runtime.enable');
await call('Network.enable');
await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
await navigate('/');
await until('document.querySelectorAll("article").length === 12');
await noOverflow();
await screenshot('home-desktop');
// Real keyboard submission through Chrome input events.
await evaluate('document.querySelector("input[type=search]").focus()');
await call('Input.insertText', { text: '  asics  ' });
await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13 });
await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
await until('location.pathname === "/search/asics" && document.querySelectorAll("article").length === 8');
assert.equal(await evaluate('document.querySelector("input[type=search]").value'), 'asics');
await noOverflow();
await screenshot('search-desktop');
await evaluate('[...document.querySelectorAll("button")].find(button => button.textContent === "價格由低到高").click()');
await until('location.search.includes("sort=price-asc") && [...document.querySelectorAll("[data-price]")].every((node,index,nodes) => index === 0 || Number(nodes[index-1].dataset.price) <= Number(node.dataset.price))');
const prices = await evaluate('[...document.querySelectorAll("[data-price]")].map(node => Number(node.dataset.price))');
assert.deepEqual(prices, [...prices].sort((a,b) => a-b));
await navigate('/search/ascis');
await until('document.body.textContent.includes("找不到符合「ascis」的商品")');
await screenshot('empty-desktop');
await evaluate('document.querySelector("[aria-label=清除搜尋]").click()');
await until('location.pathname === "/"');
assert.equal(await evaluate('document.activeElement.id'), 'product-search');
await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await navigate('/');
await until('document.querySelectorAll("article").length === 12');
await noOverflow();
await screenshot('home-mobile');
await navigate('/search/asics');
await until('document.querySelectorAll("article").length === 8');
await noOverflow();
await screenshot('search-mobile');
const accessibility = await call('Accessibility.getFullAXTree');
assert(accessibility.nodes.some(node => node.role?.value === 'button' && node.name?.value === '搜尋'), 'Mobile search button has an accessible name');
for (const width of [320, 701, 768, 1024]) {
  await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
  await navigate('/search/asics');
  await until('document.querySelectorAll("article").length === 8');
  await noOverflow();
  await navigate('/');
  await until('document.querySelectorAll("article").length === 12');
  await noOverflow();
}
await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
await navigate('/product/15745582?Area=search&kw=asics');
await until('document.querySelector("main h1")?.textContent === "ASICS 輕量跑鞋"');
await noOverflow();
const productUrlBeforeTabs = await evaluate('location.pathname + location.search + location.hash');
await evaluate('document.querySelector("[role=tab][id]").click()');
await evaluate('[...document.querySelectorAll("[role=tab]")].find(tab => tab.textContent === "商品規格").click()');
assert.equal(await evaluate('location.pathname + location.search + location.hash'), productUrlBeforeTabs);
assert(await evaluate('document.querySelector("[role=tabpanel]:not([hidden])").textContent.includes("商品規格")'));
await evaluate('[...document.querySelectorAll("[role=tab]")].find(tab => tab.textContent === "商品規格").focus()');
await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
assert(await evaluate('document.activeElement.getAttribute("role") === "tab" && document.activeElement.textContent === "選購說明"'));
assert.equal(await evaluate('location.pathname + location.search + location.hash'), productUrlBeforeTabs);
await evaluate('const tab = [...document.querySelectorAll("[role=tab]")].find(tab => tab.textContent === "商品介紹"); tab.click(); tab.focus()');
await evaluate('scrollTo(0,0)');
await screenshot('product-desktop');
await evaluate('document.querySelector("[role=tablist]").scrollIntoView()');
await until('document.querySelector("section[aria-label=商品推薦] article") !== null');
await screenshot('product-tabs-discovery-desktop');
await evaluate('scrollTo(0,0)');
await evaluate('[...document.querySelectorAll("button")].find(button => button.textContent.startsWith("確認選購")).click()');
assert(await evaluate('document.querySelector("[role=alert]")?.textContent.includes("請選擇尺寸")'));
assert(await evaluate('document.activeElement?.name === "product-size"'));
await evaluate('[...document.querySelectorAll("input[name=product-size]")].find(input => input.value === "26").click()');
await evaluate('document.querySelector("[aria-label=增加數量]").click()');
await evaluate('[...document.querySelectorAll("button")].find(button => button.textContent.startsWith("確認選購")).click()');
await until('document.querySelector("[aria-label=選購確認]")?.textContent.includes("4,980")');
await evaluate('document.querySelector("input[name=product-color][value=chalk]").click()');
assert(await evaluate('!document.querySelector("input[name=product-size]:checked") && !document.querySelector("[aria-label=選購確認]")'));
assert(await evaluate('[...document.querySelectorAll("input[name=product-size]")].find(input => input.value === "23.5").disabled'));
await evaluate('document.querySelector("input[name=product-color]:checked").focus()');
await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 });
await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 });
await until('document.querySelector("input[name=product-color]:checked").value === "graphite"');
await evaluate('document.querySelector("[aria-label=查看俯視圖]").click()');
assert.equal(await evaluate('document.querySelector("[aria-label=查看俯視圖]").getAttribute("aria-pressed")'), 'true');
await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await navigate('/product/15745582');
await until('document.querySelector("main h1")?.textContent === "ASICS 輕量跑鞋"');
await noOverflow();
await screenshot('product-mobile');
await evaluate('document.querySelector("[aria-label=商品選購資訊]").scrollIntoView()');
await screenshot('product-mobile-options');
const productAccessibility = await call('Accessibility.getFullAXTree');
assert(productAccessibility.nodes.some(node => node.role?.value === 'radio' && node.name?.value === '26 CM'));
assert(productAccessibility.nodes.some(node => node.role?.value === 'button' && node.name?.value === '確認選購（示範）'));
for (const width of [320, 701, 768, 1024]) {
  await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
  await noOverflow();
}
await navigate('/search/asics?sort=price-desc&brand=ASICS');
await until('document.querySelectorAll("article").length === 8');
await evaluate('[...document.querySelectorAll("article a")].find(link => link.getAttribute("href") === "/product/15745582").click()');
await until('document.querySelector("main h1")?.textContent === "ASICS 輕量跑鞋"');
await evaluate('[...document.querySelectorAll("a")].find(link => link.textContent === "返回商品列表").click()');
await until('location.pathname === "/search/asics" && location.search.includes("price-desc") && location.search.includes("brand=ASICS")');
await navigate('/product/15745582');
await until('document.querySelector("main h1")?.textContent === "ASICS 輕量跑鞋"');
await until('document.querySelector("section[aria-label=商品推薦] article a") !== null');
assert(await evaluate('![...document.querySelectorAll("section[aria-label=商品推薦] article a")].some(link => link.getAttribute("href") === "/product/15745582")'));
await evaluate('[...document.querySelectorAll("section[aria-label=商品推薦] article a")].find(link => link.getAttribute("href") === "/product/demo-asics-02").click()');
await until('document.querySelector("main h1")?.textContent === "ASICS 緩震慢跑鞋"');
await until('[...document.querySelectorAll("section[aria-label=瀏覽紀錄] article a")].some(link => link.getAttribute("href") === "/product/15745582")');
await navigate('/product/demo-asics-02');
await until('document.querySelector("main h1")?.textContent === "ASICS 緩震慢跑鞋"');
await until('[...document.querySelectorAll("section[aria-label=瀏覽紀錄] article a")].some(link => link.getAttribute("href") === "/product/15745582")');
await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await evaluate('document.querySelector("[role=tablist]").scrollIntoView()');
await noOverflow();
await screenshot('product-tabs-discovery-mobile');
await evaluate('document.querySelector("section[aria-label=瀏覽紀錄]").scrollIntoView()');
await screenshot('product-history-mobile');
await evaluate('[...document.querySelectorAll("section[aria-label=瀏覽紀錄] button")].find(button => button.textContent === "清除瀏覽紀錄").click()');
await until('document.querySelectorAll("section[aria-label=瀏覽紀錄] article").length === 0');
assert.equal(await evaluate('JSON.parse(localStorage.getItem("momo.recent-products.v1") ?? "[]").length'), 0);
await navigate('/product/missing');
await until('document.querySelector("main h1")?.textContent === "找不到這項商品"');
assert(await evaluate('document.title.includes("找不到商品")'));
await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
assert.equal(await evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches'), true);
assert.notEqual(await evaluate('getComputedStyle(document.documentElement).scrollbarColor'), 'auto');
assert.deepEqual(errors, [], 'No browser runtime exceptions');
const external = requests.filter(url => /^https?:/.test(url) && !url.startsWith(origin));
assert.deepEqual(external, [], 'No external HTTP requests');
await call('Emulation.setEmulatedMedia', { features: [] });
const report = { date: new Date().toISOString(), browser: 'Chrome headless via CDP', checks: ['home 12 products','keyboard search and URL restoration','asics 8 results','price sort','ascis empty','clear focus','home/search no overflow at 320,390,701,768,1024,1440px','mobile search accessibility tree name','reduced motion','scrollbar token','no runtime errors','no external HTTP','product direct URL and legacy query','selection validation, color reset and quantity','gallery controls','product mobile accessibility and responsive layout','return to sorted/filtered search','unknown product distinct state','tabs preserve complete URL and keyboard focus','recommendations exclude current product','recent products persist after reload and clear'], screenshots: ['home-desktop','search-desktop','empty-desktop','home-mobile','search-mobile','product-desktop','product-mobile','product-mobile-options','product-tabs-discovery-desktop','product-tabs-discovery-mobile','product-history-mobile'], errors, external };
await writeFile('docs/browser-smoke.json', JSON.stringify(report,null,2) + '\n');
console.log(JSON.stringify(report,null,2));
socket.close();
