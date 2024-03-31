"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Gcapi_instances, _Gcapi_base_url, _Gcapi_options, _Gcapi_hash, _Gcapi_jar, _Gcapi_http, _Gcapi_qr, _Gcapi_isLogged, _Gcapi_getHash, _Gcapi_getQr, _Gcapi_checkLogged, _Gcapi_loadCookie;
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const jsqr_1 = __importDefault(require("jsqr"));
const jimp_1 = __importDefault(require("jimp"));
const promises_1 = __importDefault(require("fs/promises"));
const events_1 = __importDefault(require("events"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const tough_cookie_1 = require("tough-cookie");
const axios_1 = __importDefault(require("axios"));
const random_useragent_1 = __importDefault(require("random-useragent"));
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const tough_cookie_file_store_1 = require("tough-cookie-file-store");
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
class Gcapi extends events_1.default {
    constructor(options) {
        var _a;
        super();
        _Gcapi_instances.add(this);
        _Gcapi_base_url.set(this, 'https://web.getcontact.com');
        _Gcapi_options.set(this, void 0);
        _Gcapi_hash.set(this, void 0);
        _Gcapi_jar.set(this, void 0);
        _Gcapi_http.set(this, void 0);
        _Gcapi_qr.set(this, void 0);
        _Gcapi_isLogged.set(this, false);
        __classPrivateFieldSet(this, _Gcapi_options, options, "f");
        __classPrivateFieldGet(this, _Gcapi_options, "f").cookiePath = ((_a = __classPrivateFieldGet(this, _Gcapi_options, "f")) === null || _a === void 0 ? void 0 : _a.cookiePath) || `${os_1.default.tmpdir()}/cookie.json`;
        __classPrivateFieldSet(this, _Gcapi_jar, new tough_cookie_1.CookieJar(new tough_cookie_file_store_1.FileCookieStore(__classPrivateFieldGet(this, _Gcapi_options, "f").cookiePath)), "f");
        __classPrivateFieldSet(this, _Gcapi_http, (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({
            jar: __classPrivateFieldGet(this, _Gcapi_jar, "f"),
            headers: { 'User-Agent': random_useragent_1.default.getRandom((ua) => ua.browserName === 'Chrome') },
        })), "f");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldSet(this, _Gcapi_hash, yield __classPrivateFieldGet(this, _Gcapi_instances, "m", _Gcapi_getHash).call(this), "f");
            if (__classPrivateFieldGet(this, _Gcapi_isLogged, "f")) {
                return;
            }
            if (__classPrivateFieldGet(this, _Gcapi_options, "f").showQr) {
                this.on('qrcode', (qr) => {
                    qrcode_terminal_1.default.generate(qr, { small: true });
                });
            }
            yield Promise.all([__classPrivateFieldGet(this, _Gcapi_instances, "m", _Gcapi_getQr).call(this), __classPrivateFieldGet(this, _Gcapi_instances, "m", _Gcapi_checkLogged).call(this)]);
        });
    }
    find(countryCode, phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Gcapi_instances, "m", _Gcapi_checkLogged).call(this);
            const browser = yield puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)()).launch(__classPrivateFieldGet(this, _Gcapi_options, "f").puppeteer);
            const page = yield browser.newPage();
            yield __classPrivateFieldGet(this, _Gcapi_instances, "m", _Gcapi_loadCookie).call(this, page);
            yield page.goto(`${__classPrivateFieldGet(this, _Gcapi_base_url, "f")}`);
            yield page.waitForSelector('[name="phoneNumber"]');
            yield page.evaluate((countryCode, phoneNumber) => {
                const country = document.querySelector('[name="countryCode"]');
                const phone = document.querySelector('[name="phoneNumber"]');
                const submit = document.querySelector('#submitButton');
                country.value = countryCode;
                phone.value = String(phoneNumber);
                submit.click();
            }, countryCode, phoneNumber);
            try {
                yield page.waitForSelector('.box.r-profile-box', { timeout: 0 });
                const profile = yield page.evaluate(() => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    const name = ((_b = (_a = document.querySelector('.rpbi-info h1')) === null || _a === void 0 ? void 0 : _a.innerHTML) === null || _b === void 0 ? void 0 : _b.trim()) || null;
                    const detail = (_d = (_c = document.querySelector('.rpbi-info em')) === null || _c === void 0 ? void 0 : _c.innerHTML) === null || _d === void 0 ? void 0 : _d.split('-');
                    const provider = ((_e = detail === null || detail === void 0 ? void 0 : detail[0]) === null || _e === void 0 ? void 0 : _e.trim()) || null;
                    const country = ((_f = detail === null || detail === void 0 ? void 0 : detail[1]) === null || _f === void 0 ? void 0 : _f.trim()) || null;
                    const img = /url\('([^']+)'\)/.exec(((_g = document.querySelector('.rpbi-img')) === null || _g === void 0 ? void 0 : _g.innerHTML) || '');
                    const picture = img ? img[1] : null;
                    return { name, provider, country, picture, tags: null };
                });
                yield browser.close();
                if (!profile.provider && !profile.country) {
                    return null;
                }
                const data = new URLSearchParams();
                data.append('hash', __classPrivateFieldGet(this, _Gcapi_hash, "f") || '');
                data.append('phoneNumber', encodeURI(`+${phoneNumber}`));
                data.append('countryCode', countryCode);
                const response = yield __classPrivateFieldGet(this, _Gcapi_http, "f").post(`${__classPrivateFieldGet(this, _Gcapi_base_url, "f")}/list-tag`, data, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Origin': __classPrivateFieldGet(this, _Gcapi_base_url, "f"),
                        'Referer': __classPrivateFieldGet(this, _Gcapi_base_url, "f") + '/search',
                        'Te': 'trailers',
                    },
                });
                if (!response.data || response.data.status !== 'success') {
                    return profile;
                }
                return Object.assign(Object.assign({}, profile), { tags: response.data.tags.map(({ tag }) => tag) });
            }
            catch (error) {
                yield browser.close();
                this.emit('error', error);
                return null;
            }
        });
    }
}
_Gcapi_base_url = new WeakMap(), _Gcapi_options = new WeakMap(), _Gcapi_hash = new WeakMap(), _Gcapi_jar = new WeakMap(), _Gcapi_http = new WeakMap(), _Gcapi_qr = new WeakMap(), _Gcapi_isLogged = new WeakMap(), _Gcapi_instances = new WeakSet(), _Gcapi_getHash = function _Gcapi_getHash() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield __classPrivateFieldGet(this, _Gcapi_http, "f").get(__classPrivateFieldGet(this, _Gcapi_base_url, "f")).then((res) => res.data);
        const before = result.match(/hash: '([a-fA-F0-9]+)'/);
        const after = result.match(/<input type="hidden" name="hash" value="([^"]+)"\/>/);
        if (before) {
            __classPrivateFieldSet(this, _Gcapi_isLogged, false, "f");
            __classPrivateFieldSet(this, _Gcapi_hash, before[1] || null, "f");
        }
        if (after) {
            __classPrivateFieldSet(this, _Gcapi_isLogged, true, "f");
            __classPrivateFieldSet(this, _Gcapi_hash, after[1] || null, "f");
        }
        this.emit('logged', __classPrivateFieldGet(this, _Gcapi_isLogged, "f"));
        return __classPrivateFieldGet(this, _Gcapi_hash, "f");
    });
}, _Gcapi_getQr = function _Gcapi_getQr() {
    return __awaiter(this, void 0, void 0, function* () {
        if (__classPrivateFieldGet(this, _Gcapi_isLogged, "f")) {
            return;
        }
        const buffer = yield __classPrivateFieldGet(this, _Gcapi_http, "f").get(`${__classPrivateFieldGet(this, _Gcapi_base_url, "f")}/get-qr-code`, {
            responseType: 'arraybuffer',
        });
        const image = yield jimp_1.default.read(buffer.data);
        const qr = (0, jsqr_1.default)(new Uint8ClampedArray(image.bitmap.data), image.bitmap.width, image.bitmap.height);
        const result = (qr === null || qr === void 0 ? void 0 : qr.data) || null;
        if (__classPrivateFieldGet(this, _Gcapi_qr, "f") !== result) {
            this.emit('qrcode', result);
        }
        __classPrivateFieldSet(this, _Gcapi_qr, result, "f");
        return new Promise((resolve) => {
            const timeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield __classPrivateFieldGet(this, _Gcapi_instances, "m", _Gcapi_getQr).call(this);
            }), 100000);
            this.on('logged', (logged) => {
                if (logged) {
                    clearTimeout(timeout);
                    resolve();
                }
            });
        });
    });
}, _Gcapi_checkLogged = function _Gcapi_checkLogged() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (__classPrivateFieldGet(this, _Gcapi_isLogged, "f")) {
            return;
        }
        const data = new URLSearchParams();
        data.append('hash', __classPrivateFieldGet(this, _Gcapi_hash, "f") || '');
        const response = yield __classPrivateFieldGet(this, _Gcapi_http, "f").post(`${__classPrivateFieldGet(this, _Gcapi_base_url, "f")}/check-qr-code`, data, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': __classPrivateFieldGet(this, _Gcapi_base_url, "f"),
                'Referer': __classPrivateFieldGet(this, _Gcapi_base_url, "f") + '/',
                'Te': 'trailers',
            },
        });
        if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.checkResult) || false) {
            __classPrivateFieldSet(this, _Gcapi_isLogged, true, "f");
            this.emit('logged', __classPrivateFieldGet(this, _Gcapi_isLogged, "f"));
            return;
        }
        yield new Promise((resolve) => setTimeout(resolve, 2000));
        yield __classPrivateFieldGet(this, _Gcapi_instances, "m", _Gcapi_checkLogged).call(this);
    });
}, _Gcapi_loadCookie = function _Gcapi_loadCookie(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const string = yield promises_1.default.readFile(__classPrivateFieldGet(this, _Gcapi_options, "f").cookiePath, { encoding: 'utf8' });
        const cookies = Object.values(JSON.parse(string)).flatMap((domain) => Object.values(domain).flatMap((path) => Object.values(path).map((cookie) => ({
            name: cookie.key,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            expires: cookie.expires ? Date.parse(cookie.expires) / 1000 : undefined,
            size: JSON.stringify(cookie).length,
            httpOnly: cookie.httpOnly || false,
            secure: cookie.secure || false,
            session: cookie.expires === undefined,
            priority: 'Medium',
            sameParty: false,
            sourceScheme: 'Secure',
        }))));
        yield page.setCookie(...cookies);
    });
};
exports.default = Gcapi;
