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
await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
assert.equal(await evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches'), true);
assert.notEqual(await evaluate('getComputedStyle(document.documentElement).scrollbarColor'), 'auto');
assert.deepEqual(errors, [], 'No browser runtime exceptions');
const external = requests.filter(url => /^https?:/.test(url) && !url.startsWith(origin));
assert.deepEqual(external, [], 'No external HTTP requests');
await call('Emulation.setEmulatedMedia', { features: [] });
const report = { date: new Date().toISOString(), browser: 'Chrome headless via CDP', checks: ['home 12 products','keyboard search and URL restoration','asics 8 results','price sort','ascis empty','clear focus','home/search no overflow at 320,390,701,768,1024,1440px','mobile search accessibility tree name','reduced motion','scrollbar token','no runtime errors','no external HTTP'], screenshots: ['home-desktop','search-desktop','empty-desktop','home-mobile','search-mobile'], errors, external };
await writeFile('docs/browser-smoke.json', JSON.stringify(report,null,2) + '\n');
console.log(JSON.stringify(report,null,2));
socket.close();
