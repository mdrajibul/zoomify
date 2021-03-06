(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.window = global.window || {}));
}(this, (function (exports) { 'use strict';

    /**

    A simple utility class to zoomify background image
    @param container - HTMLElement
    @param autoStop - Set true to stop automatically when use mouse out. false to control from outside
    @returns IMagnifyImage */
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var Zoomify = /** @class */ (function () {
        function Zoomify(container, autoStop) {
            if (autoStop === void 0) { autoStop = false; }
            this.imageUrl = '';
            this.imageWidth = 0;
            this.imageHeight = 0;
            this.ratio = 0;
            this.isLoaded = false;
            this.container = container;
            this.autoStop = autoStop;
            var imageCss = window.getComputedStyle(container);
            if (imageCss.backgroundImage) {
                this.imageUrl = imageCss.backgroundImage.slice(4, -1).replace(/['"]/g, '');
            }
            this.imageSrc = new Image();
        }
        /**
         * static function to start zoomify immediately
         * @param container  - A html element where to load
         * @returns Promise<IZoomifyImage>
         */
        Zoomify.run = function (container) {
            var _this = this;
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var zoomify;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            zoomify = new Zoomify(container, true);
                            return [4 /*yield*/, zoomify.start()];
                        case 1:
                            _a.sent();
                            resolve(zoomify);
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        /**
         * Initialize image
         * @returns Promise<boolean>
         */
        Zoomify.prototype.init = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.imageSrc.onload = function () {
                    _this.imageWidth = _this.imageSrc.naturalWidth;
                    _this.imageHeight = _this.imageSrc.naturalHeight;
                    _this.ratio = _this.imageHeight / _this.imageWidth;
                    var percentage = _this.ratio * 100 + '%';
                    _this.container.style.paddingBottom = percentage;
                    _this.isLoaded = true;
                };
                _this.imageSrc.src = _this.imageUrl;
                resolve(_this.isLoaded);
            });
        };
        /**
         * Start zoomify. Useful method to control from outside
         */
        Zoomify.prototype.start = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.isLoaded) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.init()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            this.afterLoad();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Stop zoomify. Useful to control from outside
         */
        Zoomify.prototype.stop = function () {
            this.reset();
            this.container.onmousemove = null;
            this.container.onmouseout = null;
        };
        Zoomify.prototype.afterLoad = function () {
            var _this = this;
            this.container.style.cursor = 'crosshair';
            this.container.onmousemove = function (ev) { return _this.move(ev, _this.ratio, _this.imageWidth); };
            if (this.autoStop) {
                this.container.onmouseout = function () { return _this.reset(); };
            }
        };
        Zoomify.prototype.move = function (event, ratio, imageWidth) {
            var scrollLeft = this.container.scrollLeft > 0
                ? this.container.scrollLeft
                : this.container.parentElement && this.container.parentElement.scrollLeft > 0
                    ? this.container.parentElement.scrollLeft
                    : 0;
            var scrollTop = this.container.scrollTop > 0
                ? this.container.scrollTop
                : this.container.parentElement && this.container.parentElement.scrollTop > 0
                    ? this.container.parentElement.scrollTop
                    : 0;
            var boxWidth = this.container.clientWidth, x = event.pageX - this.container.offsetLeft, y = event.pageY - this.container.offsetTop, xPercent = (x + scrollLeft) / (boxWidth / 100) + '%', yPercent = (y + scrollTop) / ((boxWidth * ratio) / 100) + '%';
            Object.assign(this.container.style, {
                backgroundPosition: xPercent + ' ' + yPercent,
                backgroundSize: imageWidth + 'px',
            });
        };
        Zoomify.prototype.reset = function () {
            Object.assign(this.container.style, {
                backgroundPosition: 'top',
                backgroundSize: 'cover',
                cursor: 'default',
            });
        };
        return Zoomify;
    }());

    exports.Zoomify = Zoomify;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=zoomify.js.map
