'use strict';

try{if(!exports){exports = {};} }catch(e){var exports = {}};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var ValidUtils = /** @class */ (function () {
    function ValidUtils() {
    }
    ValidUtils.isNullOrUndefined = function (data) {
        if (data == null || undefined === data) {
            return true;
        }
        else {
            return false;
        }
    };
    ValidUtils.isNull = function (data) {
        if (data == null) {
            return true;
        }
        else {
            return false;
        }
    };
    ValidUtils.isArray = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object Array]';
        }
    };
    ValidUtils.isNumber = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object Number]';
        }
    };
    ValidUtils.isString = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object String]';
        }
    };
    ValidUtils.isFunction = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object Function]';
        }
        // if (typeof object_o === 'function') {
        //     return true;
        // }else {
        //     return false;
        // }
    };
    ValidUtils.isObject = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object Object]';
        }
    };
    ValidUtils.isMap = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object Map]';
        }
    };
    return ValidUtils;
}());

var RandomUtils = /** @class */ (function () {
    function RandomUtils() {
    }
    RandomUtils.random = function (min, max) {
        if (ValidUtils.isNullOrUndefined(min)) {
            return Math.random();
        }
        else if (!ValidUtils.isNullOrUndefined(min) && ValidUtils.isNullOrUndefined(max)) {
            return Math.random() * (min || 0);
        }
        else {
            return Math.random() * ((max || 0) - (min || 0)) + (min || 0);
        }
    };
    RandomUtils.uuid = function (format) {
        if (format === void 0) { format = 'xxxx-xxxx-xxxx-xxxx'; }
        return format.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    RandomUtils.getRandomColor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    // (Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now()
    RandomUtils.getRandomString = function (len) {
        var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        var color = '';
        for (var i = 0; i < len; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    };
    RandomUtils.d = '';
    return RandomUtils;
}());

var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    StringUtils.deleteEnter = function (data) {
        return data.replace(/\r?\n/g, '');
    };
    StringUtils.regexExec = function (regex, text) {
        var varExec = regex.exec(text);
        var usingVars = [];
        while (varExec) {
            usingVars.push(varExec);
            varExec = regex.exec(varExec.input);
        }
        return usingVars;
    };
    // public static betweenRegexpStr(start: string, end: string, data: string, flag = 'gm') {
    //     const startEspace = StringUtils.escapeSpecialCharacterRegExp(start);
    //     const reg = RegExp(`(${start}(?:(${start})??[^${startEspace}]*?${end}))`,flag);
    //     return StringUtils.regexExec(reg, data);
    // }
    // public static betweenRegexpStrGroup(start: string, end: string, data: string, flag = 'gm') {
    //     const startEspace = StringUtils.escapeSpecialCharacterRegExp(start);
    //     const reg = RegExp(`(?:${start}(?:((?:${start})??[^${startEspace}]*?)${end}))`,flag);
    //     return StringUtils.regexExec(reg, data);
    // }
    // public static between(start: string, end: string, data: string, flag = 'gm') {
    //     // (\$\{(?:\[??[^\[]*?\})), (\$\{(?:(\$\{)??[^\$\{]*?\}))
    //     start = StringUtils.escapeSpecialCharacterRegExp(start);
    //     end = StringUtils.escapeSpecialCharacterRegExp(end);
    //     const reg = RegExp(`(${start}(?:(${start})??[^${start}]*?${end}))`,flag);
    //     return StringUtils.regexExec(reg, data);
    // }
    StringUtils.escapeSpecialCharacterRegExp = function (data) {
        return data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
    return StringUtils;
}());

var ScriptUtils = /** @class */ (function () {
    function ScriptUtils() {
    }
    ScriptUtils.getVariablePaths = function (script) {
        var usingVars = new Set();
        var GetDetectProxy = /** @class */ (function () {
            function GetDetectProxy(prefix) {
                this.prefix = prefix;
                this.usingVars = usingVars;
            }
            GetDetectProxy.prototype.set = function (target, p, value, receiver) {
                return true;
            };
            GetDetectProxy.prototype.get = function (target, p, receiver) {
                var items;
                if (typeof p === 'string' && isNaN(Number(p))) {
                    items = this.prefix ? this.prefix + '.' + p : p;
                    this.usingVars.add(items);
                }
                else if (typeof p === 'string' && !isNaN(Number(p))) {
                    items = this.prefix ? this.prefix + '[' + p + ']' : p;
                    this.usingVars.add(items);
                }
                return new Proxy(function () {
                }, new GetDetectProxy(items));
            };
            return GetDetectProxy;
        }());
        var destUser = new Proxy(function () {
        }, new GetDetectProxy());
        try {
            // eslint-disable-next-line no-new-func,no-unused-expressions
            Function("\"use strict\"; ".concat(script, "; ")).bind(destUser)();
        }
        catch (e) {
            console.error(e);
        }
        // console.log('------->', usingVars);
        return usingVars;
    };
    ScriptUtils.evalReturn = function (script, thisTarget) {
        // if (!script.startsWith('this.')) {
        //     script = 'this.' + script;
        // }
        return this.eval('return ' + script + ';', thisTarget);
    };
    ScriptUtils.eval = function (script, thisTarget) {
        // eslint-disable-next-line no-new-func,no-unused-expressions
        return Function("\"use strict\"; ".concat(script, " ")).bind(thisTarget)();
    };
    ScriptUtils.loadElement = function (name, attribute, document) {
        return new Promise(function (resolve, reject) {
            var tag = document.createElement(name);
            tag.onload = resolve;
            tag.onerror = reject;
            for (var _i = 0, _a = Object.entries(attribute); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                tag.setAttribute(key, value);
            }
            document.head.append(tag);
        });
    };
    ScriptUtils.loadStyleSheet = function (href, attribute, document) {
        if (attribute === void 0) { attribute = {}; }
        // const tag = document.createElement('link');
        // tag.type = 'text/css';
        // tag.setAttribute('rel', 'stylesheet');
        // tag.href = href;
        // for (const [key, value] of Object.entries(attribute)) {
        //     tag.setAttribute(key, value);
        // }
        // target.append(tag)
        attribute.type = 'text/css';
        attribute.rel = 'stylesheet';
        attribute.href = href;
        return ScriptUtils.loadElement('link', attribute, document);
    };
    ScriptUtils.loadScript = function (src, attribute, document) {
        if (attribute === void 0) { attribute = {}; }
        attribute.type = 'text/javascript';
        attribute.src = src;
        return ScriptUtils.loadElement('script', attribute, document);
    };
    return ScriptUtils;
}());

var DomUtils = /** @class */ (function () {
    function DomUtils() {
    }
    DomUtils.selectorElements = function (selector, element) {
        if (element === void 0) { element = document; }
        return Array.prototype.slice.call(element.querySelectorAll(selector));
    };
    DomUtils.selectorNodes = function (selector, element) {
        if (element === void 0) { element = document; }
        return element.querySelectorAll(selector);
    };
    DomUtils.removeAttribute = function (result, attrs) {
        attrs.forEach(function (it) {
            result.removeAttribute(it);
        });
    };
    DomUtils.setAttribute = function (result, attrs) {
        attrs.forEach(function (it) {
            result.setAttribute(it, '');
        });
    };
    DomUtils.setAttributeAttr = function (result, attrs) {
        attrs.forEach(function (it) {
            result.setAttribute(it.name, it.value);
        });
    };
    DomUtils.getAttributeToObject = function (input) {
        var attribute = {};
        input.getAttributeNames().forEach(function (ait) {
            attribute[ait] = input.getAttribute(ait);
        });
        return attribute;
    };
    DomUtils.getStyleToObject = function (input) {
        var style = {};
        for (var i = 0; i < input.style.length; i++) {
            var key = input.style[i];
            style[key] = input.style[key];
        }
        return style;
    };
    return DomUtils;
}());

// within rangeResult.ts
// @ts-ignore
var RangeResult = /** @class */ (function () {
    function RangeResult(value, done) {
        this.done = done;
        this.value = value !== null && value !== void 0 ? value : 0;
    }
    return RangeResult;
}());
var RangeIterator = /** @class */ (function () {
    function RangeIterator(first, last, step) {
        this._current = this._first = first;
        this._last = last;
        this._step = step;
    }
    RangeIterator.prototype.next = function (value) {
        var r;
        if (this._first < this._last && this._current < this._last) {
            r = new RangeResult(this._current, false);
            this._current += this._step;
        }
        else if (this._first > this._last && this._current > this._last) {
            r = new RangeResult(this._current, false);
            this._current -= this._step;
        }
        else {
            r = new RangeResult(undefined, true);
        }
        return r;
    };
    return RangeIterator;
}());
var Range = /** @class */ (function () {
    function Range(first, last, step) {
        if (step === void 0) { step = 1; }
        this.first = first;
        this.last = last;
        this.step = step;
        this.isRange = true;
    }
    Range.prototype[Symbol.iterator] = function () {
        return new RangeIterator(this.first, this.last, this.step);
    };
    Range.range = function (first, last, step) {
        if (step === void 0) { step = 1; }
        if (typeof first === 'number' && last === undefined) {
            return new Range(0, first, step);
        }
        else if (typeof first === 'string') {
            var _a = first.split('..'), _first = _a[0], _b = _a[1], _last = _b === void 0 ? '0' : _b;
            var _c = _last.split(','), __last = _c[0], _d = _c[1], _step = _d === void 0 ? '1' : _d;
            return new Range(Number(_first.trim()), Number(__last.trim()), Number(_step.trim()));
        }
        else {
            return new Range(first, last !== null && last !== void 0 ? last : 0, step);
        }
    };
    return Range;
}());

var Shield = /** @class */ (function () {
    function Shield() {
    }
    return Shield;
}());
var DomRenderFinalProxy = /** @class */ (function () {
    function DomRenderFinalProxy() {
    }
    DomRenderFinalProxy.prototype.set = function (target, p, value, receiver) {
        target[p] = value;
        return true;
    };
    DomRenderFinalProxy.prototype.get = function (target, p, receiver) {
        return target[p];
    };
    DomRenderFinalProxy.final = function (obj) {
        obj._DomRender_isFinal = true;
        return obj;
    };
    DomRenderFinalProxy.isFinal = function (obj) {
        return '_DomRender_isFinal' in obj;
    };
    DomRenderFinalProxy.unFinal = function (obj) {
        delete obj._DomRender_isFinal;
        return obj;
    };
    DomRenderFinalProxy.prototype.has = function (target, p) {
        return p === '_DomRender_isFinal' || p in target;
    };
    return DomRenderFinalProxy;
}());

var EventManager = /** @class */ (function () {
    function EventManager() {
        var _this = this;
        this.eventNames = [
            'click', 'mousedown', 'mouseup', 'dblclick', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'contextmenu',
            'keyup', 'keydown', 'keypress',
            'change', 'input', 'submit', 'resize', 'focus', 'blur'
        ];
        this.eventParam = EventManager.attrPrefix + 'event';
        this.attrNames = [
            EventManager.valueAttrName,
            EventManager.valueLinkAttrName,
            EventManager.attrAttrName,
            EventManager.styleAttrName,
            EventManager.classAttrName,
            EventManager.attrPrefix + 'window-event-' + EventManager.WINDOW_EVENT_POPSTATE,
            EventManager.attrPrefix + 'window-event-' + EventManager.WINDOW_EVENT_RESIZE,
            EventManager.onInitAttrName,
            this.eventParam
        ];
        this.bindScript = "\n        const ".concat(EventManager.VALUE_VARNAME, " = this.__render.value;\n        const ").concat(EventManager.SCRIPTS_VARNAME, " = this.__render.scripts;\n        const ").concat(EventManager.RANGE_VARNAME, " = this.__render.range;\n        const ").concat(EventManager.ELEMENT_VARNAME, " = this.__render.element;\n        const ").concat(EventManager.TARGET_VARNAME, " = this.__render.target;\n        const ").concat(EventManager.EVENT_VARNAME, " = this.__render.event;\n    ");
        this.eventNames.forEach(function (it) {
            _this.attrNames.push(EventManager.attrPrefix + 'event-' + it);
        });
        if (typeof window !== 'undefined') {
            EventManager.WINDOW_EVENTS.forEach(function (eventName) {
                window === null || window === void 0 ? void 0 : window.addEventListener(eventName, function (event) {
                    var targetAttr = "dr-window-event-".concat(eventName);
                    document.querySelectorAll("[".concat(targetAttr, "]")).forEach(function (it) {
                        var _a;
                        var script = it.getAttribute(targetAttr);
                        if (script) {
                            var obj = it.obj;
                            var config = (_a = obj === null || obj === void 0 ? void 0 : obj._DomRender_proxy) === null || _a === void 0 ? void 0 : _a.config;
                            ScriptUtils.eval("".concat(_this.bindScript, " ").concat(script, " "), Object.assign(obj, {
                                __render: Object.freeze({
                                    target: DomRenderFinalProxy.final(event.target),
                                    element: it,
                                    event: event,
                                    range: Range.range,
                                    scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj)
                                })
                            }));
                        }
                    });
                });
            });
        }
    }
    // // 순환참조때문에 우선 여기에 뺴놓는다.
    // public DomrenderProxyFinal(obj: any) {
    //     (obj as any)._DomRender_isFinal = true;
    //     return obj;
    // }
    EventManager.prototype.findAttrElements = function (fragment, config) {
        var _a, _b;
        // const datas: {name: string, value: string | null, element: Element}[] = [];
        var elements = new Set();
        var addAttributes = (_b = (_a = config === null || config === void 0 ? void 0 : config.applyEvents) === null || _a === void 0 ? void 0 : _a.map(function (it) { return it.attrName; })) !== null && _b !== void 0 ? _b : [];
        addAttributes.concat(this.attrNames).forEach(function (attrName) {
            fragment === null || fragment === void 0 ? void 0 : fragment.querySelectorAll("[".concat(attrName, "]")).forEach(function (it) {
                elements.add(it);
            });
        });
        return elements;
    };
    // eslint-disable-next-line no-undef
    EventManager.prototype.applyEvent = function (obj, childNodes, config) {
        var _this = this;
        // console.log('eventManager applyEvent==>', obj, childNodes, config)
        // Node.ELEMENT_NODE = 1
        // event
        // childNodes.forEach(it => {
        //     if (it instanceof Element) {
        //         it.setAttribute('dr-thieVariableName', 'this')
        //     }
        // })
        this.eventNames.forEach(function (it) {
            _this.addDrEvents(obj, it, childNodes, config);
        });
        this.addDrEventPram(obj, this.eventParam, childNodes, config);
        // value
        this.procAttr(childNodes, EventManager.valueAttrName, function (it, attribute) {
            var script = attribute;
            if (script) {
                var data = ScriptUtils.evalReturn(script, obj);
                if (it.value !== data) {
                    it.value = data;
                }
            }
        });
        // window event
        EventManager.WINDOW_EVENTS.forEach(function (it) {
            _this.procAttr(childNodes, EventManager.attrPrefix + 'window-event-' + it, function (it, attribute) {
                it.obj = obj;
            });
        });
        // on-init event
        this.procAttr(childNodes, EventManager.onInitAttrName, function (it, attribute) {
            var script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (script) {
                ScriptUtils.eval("".concat(_this.bindScript, "; ").concat(script, " "), Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }));
                // console.log('onInit--->', obj, varName, it)
                // if (typeof this.getValue(obj, varName) === 'function') {
                //     this.getValue(obj, varName)(it);
                // } else {
                //     this.setValue(obj, varName, it);
                // }
            }
        });
        // value-link event
        this.procAttr(childNodes, EventManager.valueLinkAttrName, function (it, varName) {
            if (varName) {
                var ownerVariablePathName = it.getAttribute(EventManager.ownerVariablePathAttrName);
                var mapScript_1 = it.getAttribute("".concat(EventManager.valueLinkAttrName, ":map"));
                // const inMapScript = it.getAttribute(`${valueLinkAttrName}:in-map`);
                var bindObj_1 = obj;
                if (ownerVariablePathName) {
                    bindObj_1 = ScriptUtils.evalReturn(ownerVariablePathName, obj);
                }
                var getValue = _this.getValue(obj, varName, bindObj_1);
                // 아래 나중에 리팩토링 필요함
                if (typeof getValue === 'function' && getValue) {
                    var setValue = it.value;
                    if (mapScript_1) {
                        setValue = ScriptUtils.eval("".concat(_this.bindScript, " return ").concat(mapScript_1), Object.assign(bindObj_1, { __render: Object.freeze({ element: it, target: bindObj_1, range: Range.range, value: setValue, scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj) }) }));
                    }
                    getValue(setValue);
                    // 여기서 value가 먼저냐 value-link가 먼저냐 선을 정해야되는거네...
                }
                else if (getValue) {
                    var setValue = getValue;
                    if (mapScript_1) {
                        setValue = ScriptUtils.eval("".concat(_this.bindScript, " return ").concat(mapScript_1), Object.assign(bindObj_1, { __render: Object.freeze({ element: it, target: bindObj_1, range: Range.range, value: setValue, scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj) }) }));
                    }
                    it.value = setValue;
                    // this.setValue(obj, varName, setValue)
                }
                // } else if (getValue) { // 이구분이 있어야되나?? 없어도될것같은데..
                //     let setValue = getValue;
                //     if (inMapScript) {
                //         setValue = ScriptUtils.eval(`${this.bindScript} return ${inMapScript}`, Object.assign(bindObj, {__render: Object.freeze({element: it, target: bindObj, range: Range.range, value: setValue,  scripts: EventManager.setBindProperty(config?.scripts, obj)})}));
                //     }
                //     this.setValue(obj, varName, setValue)
                // } else {
                //     let setValue = it.value;
                //     if (mapScript) {
                //         setValue = ScriptUtils.eval(`${this.bindScript} return ${mapScript}`, Object.assign(bindObj, {__render: Object.freeze({element: it, target: bindObj, range: Range.range, value: setValue,  scripts: EventManager.setBindProperty(config?.scripts, obj)})}));
                //     }
                //     this.setValue(obj, varName, setValue)
                // }
                it.addEventListener('input', function (event) {
                    var value = it.value;
                    if (mapScript_1) {
                        value = ScriptUtils.eval("".concat(_this.bindScript, " return ").concat(mapScript_1), Object.assign(bindObj_1, {
                            __render: Object.freeze({
                                event: event,
                                element: it,
                                target: event.target,
                                range: Range.range,
                                scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj)
                            })
                        }));
                    }
                    if (typeof _this.getValue(obj, varName, bindObj_1) === 'function') {
                        _this.getValue(obj, varName, bindObj_1)(value, event);
                    }
                    else {
                        _this.setValue(obj, varName, value);
                    }
                });
            }
        });
        this.changeVar(obj, childNodes, undefined, config);
        // console.log('eventManager-applyEvent-->', config?.applyEvents)
        var elements = Array.from(childNodes).filter(function (it) { return it.nodeType === 1; }).map(function (it) { return it; });
        elements.forEach(function (it) {
            var _a;
            (_a = config === null || config === void 0 ? void 0 : config.applyEvents) === null || _a === void 0 ? void 0 : _a.filter(function (ta) { return it.getAttribute(ta.attrName); }).forEach(function (ta) { return ta.callBack(it, it.getAttribute(ta.attrName), obj); });
        });
    };
    // eslint-disable-next-line no-undef
    EventManager.prototype.changeVar = function (obj, elements, varName, config) {
        var _this = this;
        // console.log('-changeVar-->', obj, elements, varName)
        // value-link event
        this.procAttr(elements, EventManager.valueLinkAttrName, function (it, attribute) {
            var ownerVariablePathName = it.getAttribute(EventManager.ownerVariablePathAttrName);
            var bindObj = obj;
            if (ownerVariablePathName) {
                bindObj = ScriptUtils.evalReturn(ownerVariablePathName, obj);
            }
            var mapScript = it.getAttribute("".concat(EventManager.valueLinkAttrName, ":map"));
            if (attribute && attribute === varName) {
                var getValue = _this.getValue(obj, attribute, bindObj);
                if (typeof getValue === 'function' && getValue) {
                    var setValue = it.value;
                    if (mapScript) {
                        setValue = ScriptUtils.eval("".concat(_this.bindScript, " return ").concat(mapScript), Object.assign(bindObj, { __render: Object.freeze({ element: it, target: bindObj, range: Range.range, value: setValue, scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj) }) }));
                    }
                    getValue(setValue);
                }
                else { //  if (getValue !== undefined && getValue !== null)
                    var setValue = getValue;
                    if (mapScript) {
                        setValue = ScriptUtils.eval("".concat(_this.bindScript, " return ").concat(mapScript), Object.assign(bindObj, { __render: Object.freeze({ element: it, target: bindObj, range: Range.range, value: setValue, scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj) }) }));
                    }
                    it.value = setValue;
                }
            }
        });
        // attribute
        this.procAttr(elements, EventManager.attrAttrName, function (it, attribute) {
            var script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (_this.isUsingThisVar(script, varName) || varName === undefined) {
                var data = ScriptUtils.eval("const $element = this.__render.element; ".concat(script, " "), Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }));
                if (typeof data === 'string') {
                    data.split(',').forEach(function (sit) {
                        var _a = sit.split('='), key = _a[0], value = _a[1];
                        var s = value.trim();
                        var k = key.trim();
                        if (s === 'null') {
                            it.removeAttribute(k);
                        }
                        else {
                            it.setAttribute(k, s);
                        }
                    });
                }
                else if (Array.isArray(data)) {
                    data.forEach(function (sit) {
                        var _a = sit.split('='), key = _a[0], value = _a[1];
                        var s = value.trim();
                        var k = key.trim();
                        if (s === 'null') {
                            it.removeAttribute(k);
                        }
                        else {
                            it.setAttribute(k, s);
                        }
                    });
                }
                else {
                    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
                        var _b = _a[_i], key = _b[0], value = _b[1];
                        if (value === null) {
                            it.removeAttribute(key);
                        }
                        else {
                            it.setAttribute(key, String(value));
                        }
                    }
                }
            }
        });
        // style
        this.procAttr(elements, EventManager.styleAttrName, function (it, attribute) {
            var script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (_this.isUsingThisVar(script, varName) || varName === undefined) {
                var data = ScriptUtils.eval("const $element = this.__render.element;  ".concat(script, " "), Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }));
                if (typeof data === 'string') {
                    it.setAttribute('style', data);
                }
                else if (Array.isArray(data)) {
                    it.setAttribute('style', data.join(';'));
                }
                else {
                    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
                        var _b = _a[_i], key = _b[0], value = _b[1];
                        if (it instanceof HTMLElement) {
                            it.style[key] = String(value);
                        }
                    }
                }
            }
        });
        // class
        this.procAttr(elements, EventManager.classAttrName, function (it, attribute) {
            var script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (_this.isUsingThisVar(script, varName) || varName === undefined) {
                var data = ScriptUtils.eval("const $element = this.element;  ".concat(script, " "), Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }));
                if (typeof data === 'string') {
                    it.setAttribute('class', data);
                }
                else if (Array.isArray(data)) {
                    it.setAttribute('class', data.join(' '));
                }
                else {
                    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
                        var _b = _a[_i], key = _b[0], value = _b[1];
                        if (it instanceof HTMLElement) {
                            if (value) {
                                it.classList.add(key);
                            }
                            else {
                                it.classList.remove(key);
                            }
                        }
                    }
                }
            }
        });
    };
    // eslint-disable-next-line no-undef
    EventManager.prototype.addDrEvents = function (obj, eventName, elements, config) {
        var _this = this;
        var attr = EventManager.attrPrefix + 'event-' + eventName;
        this.procAttr(elements, attr, function (it, attribute) {
            var script = attribute;
            it.addEventListener(eventName, function (event) {
                var filter = true;
                var filterScript = it.getAttribute("".concat(attr, ":filter"));
                var thisTarget = Object.assign(obj, {
                    __render: Object.freeze({
                        event: event,
                        element: it,
                        target: event.target,
                        range: Range.range,
                        scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj)
                    })
                });
                if (filterScript) {
                    filter = ScriptUtils.eval("".concat(_this.bindScript, " return ").concat(filterScript), thisTarget);
                }
                if (filter) {
                    ScriptUtils.eval("".concat(_this.bindScript, " ").concat(script, " "), thisTarget);
                }
            });
        });
    };
    EventManager.prototype.addDrEventPram = function (obj, attr, elements, config) {
        var _this = this;
        this.procAttr(elements, attr, function (it, attribute, attributes) {
            var bind = attributes[attr + ':bind'];
            if (bind) {
                var script_1 = attribute;
                var params_1 = {};
                var prefix_1 = attr + ':';
                Object.entries(attributes).filter(function (_a) {
                    var k = _a[0]; _a[1];
                    return k.startsWith(prefix_1);
                }).forEach(function (_a) {
                    var k = _a[0], v = _a[1];
                    params_1[k.slice(prefix_1.length)] = v;
                });
                bind.split(',').forEach(function (eventName) {
                    it.addEventListener(eventName.trim(), function (event) {
                        ScriptUtils.eval("const $params = this.__render.params; ".concat(_this.bindScript, "  ").concat(script_1, " "), Object.assign(obj, {
                            __render: Object.freeze({
                                event: event,
                                element: it,
                                target: event.target,
                                range: Range.range,
                                scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj),
                                params: params_1
                            })
                        }));
                    });
                });
            }
        });
    };
    // eslint-disable-next-line no-undef
    EventManager.prototype.procAttr = function (elements, attrName, callBack) {
        if (elements === void 0) { elements = new Set(); }
        var sets = new Set();
        elements.forEach(function (it) {
            // console.log('--->type', it, it.nodeType)
            if (!it) {
                return;
            }
            // Node.ELEMENT_NODE = 1
            if (it.nodeType === 1) {
                var e = it;
                sets.add(e);
                e.querySelectorAll("[".concat(attrName, "]")).forEach(function (it) {
                    sets.add(it);
                });
            }
        });
        sets.forEach(function (it) {
            var attr = it.getAttribute(attrName);
            var attrs = DomUtils.getAttributeToObject(it);
            if (attr) {
                callBack(it, attr, attrs);
            }
        });
    };
    EventManager.prototype.getValue = function (obj, name, bindObj) {
        // let r = obj[name];
        var r = ScriptUtils.evalReturn(name, obj);
        if (typeof r === 'function') {
            r = r.bind(bindObj !== null && bindObj !== void 0 ? bindObj : obj);
        }
        return r;
    };
    EventManager.prototype.setValue = function (obj, name, value) {
        name = name.replaceAll('this.', 'this.this.');
        ScriptUtils.eval("".concat(name, " = this.value;"), {
            this: obj,
            value: value
        });
    };
    EventManager.prototype.isUsingThisVar = function (raws, varName) {
        // console.log('isUsingV', raws)
        // console.log('isUsingV', raws, varName, ScriptUtils.getVariablePaths(raws ?? ''))
        if (varName && raws) {
            if (varName.startsWith('this.')) {
                varName = varName.replace(/this\./, '');
            }
            EventManager.VARNAMES.forEach(function (it) {
                // raws = raws!.replace(RegExp(it.replace('$', '\\$'), 'g'), `this?.___${it}`);
                raws = raws.replace(RegExp(it.replace('$', '\\$'), 'g'), "this.___".concat(it));
            });
            var variablePaths = ScriptUtils.getVariablePaths(raws !== null && raws !== void 0 ? raws : '');
            return variablePaths.has(varName);
        }
        return false;
    };
    EventManager.setBindProperty = function (scripts, obj) {
        if (scripts) {
            // const newScripts = Object.assign({}, scripts)
            var newScripts = Object.assign({}, scripts);
            for (var _i = 0, _a = Object.entries(newScripts); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (typeof value === 'function') {
                    newScripts[key] = value.bind(obj);
                }
            }
            return newScripts;
        }
    };
    EventManager.ownerVariablePathAttrName = 'dr-owner-variable-path';
    EventManager.attrPrefix = 'dr-';
    EventManager.onInitAttrName = EventManager.attrPrefix + 'on-init';
    EventManager.valueAttrName = EventManager.attrPrefix + 'value';
    EventManager.valueLinkAttrName = EventManager.attrPrefix + 'value-link';
    EventManager.attrAttrName = EventManager.attrPrefix + 'attr';
    EventManager.styleAttrName = EventManager.attrPrefix + 'style';
    EventManager.classAttrName = EventManager.attrPrefix + 'class';
    EventManager.VALUE_VARNAME = '$value';
    EventManager.SCRIPTS_VARNAME = '$scripts';
    EventManager.FAG_VARNAME = '$fag';
    EventManager.RAWSET_VARNAME = '$rawset';
    EventManager.RANGE_VARNAME = '$range';
    EventManager.ELEMENT_VARNAME = '$element';
    EventManager.TARGET_VARNAME = '$target';
    EventManager.EVENT_VARNAME = '$event';
    EventManager.VARNAMES = [EventManager.SCRIPTS_VARNAME, EventManager.FAG_VARNAME, EventManager.RAWSET_VARNAME, EventManager.RANGE_VARNAME, EventManager.ELEMENT_VARNAME, EventManager.TARGET_VARNAME, EventManager.EVENT_VARNAME];
    EventManager.WINDOW_EVENT_POPSTATE = 'popstate';
    EventManager.WINDOW_EVENT_RESIZE = 'resize';
    EventManager.WINDOW_EVENTS = [EventManager.WINDOW_EVENT_POPSTATE, EventManager.WINDOW_EVENT_RESIZE];
    return EventManager;
}());
var eventManager = new EventManager();

// export interface Valid<T = any, E = Element> {
//     valid(value?: T, target?: E, event?: Event): boolean;
// }
var Validator = /** @class */ (function () {
    function Validator(_value, target, event, autoValid, autoValidAction) {
        if (autoValid === void 0) { autoValid = true; }
        if (autoValidAction === void 0) { autoValidAction = true; }
        this._value = _value;
        this.setTarget(target);
        this.setEvent(event);
        this.setAutoValid(autoValid);
        this.setAutoValidAction(autoValidAction);
    }
    Validator.prototype.getValidAction = function () {
        return this._validAction;
    };
    Validator.prototype.setValidAction = function (value) {
        this._validAction = value;
        return this;
    };
    Validator.prototype.getAutoValid = function () {
        return this._autoValid;
    };
    Validator.prototype.setAutoValid = function (autoValid) {
        this._autoValid = autoValid;
        return this;
    };
    Validator.prototype.getAutoValidAction = function () {
        return this._autoValidAction;
    };
    Validator.prototype.setAutoValidAction = function (autoValid) {
        this._autoValidAction = autoValid;
        return this;
    };
    Validator.prototype.getEvent = function () {
        return this._event;
    };
    Validator.prototype.setEvent = function (event) {
        if (event) {
            this._event = this.domRenderFinal(event);
        }
        return this;
    };
    Validator.prototype.getTarget = function () {
        return this._target;
    };
    Validator.prototype.targetFocus = function () {
        var _a, _b;
        (_b = (_a = this._target) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    Validator.prototype.targetReset = function () {
        var _a, _b;
        (_b = (_a = this._target) === null || _a === void 0 ? void 0 : _a.reset) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    Validator.prototype.targetDispatchEvent = function (event) {
        var _a;
        return (_a = this._target) === null || _a === void 0 ? void 0 : _a.dispatchEvent(event);
    };
    Validator.prototype.setTarget = function (target) {
        if (target) {
            this._target = this.domRenderFinal(target);
        }
        return this;
    };
    Validator.prototype.domRenderFinal = function (obj) {
        obj._DomRender_isFinal = true;
        return obj;
    };
    Object.defineProperty(Validator.prototype, "value", {
        get: function () {
            var _a;
            if (this._value === undefined || this._value === null) {
                this._value = (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.value;
            }
            return this._value;
        },
        set: function (value) {
            // console.log('---?set?', value, this)
            this._value = value;
            this.tickValue(value);
        },
        enumerable: false,
        configurable: true
    });
    Validator.prototype.tickValue = function (value) {
        this.changeValue(value);
        var target = this.getTarget();
        if (target && (target === null || target === void 0 ? void 0 : target.value) !== undefined && (target === null || target === void 0 ? void 0 : target.value) !== null) {
            try {
                target.value = this._value;
            }
            catch (e) {
                console.log('set value function is blocked ');
            }
        }
        if (this.getAutoValidAction()) {
            this.validAction();
        }
        else if (this.getAutoValid()) {
            this.valid();
        }
    };
    Validator.prototype.set = function (value, target, event) {
        this.setTarget(target);
        this.setEvent(event);
        this.value = value;
    };
    Validator.prototype.changeValue = function (value) {
    };
    Object.defineProperty(Validator.prototype, "checked", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.checked) !== null && _b !== void 0 ? _b : false;
        },
        set: function (checked) {
            var target = this.getTarget();
            if (target) {
                target.checked = checked;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Validator.prototype, "selectedIndex", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.selectedIndex) !== null && _b !== void 0 ? _b : -1;
        },
        set: function (selectedIndex) {
            var target = this.getTarget();
            if (target) {
                target.selectedIndex = selectedIndex;
            }
        },
        enumerable: false,
        configurable: true
    });
    Validator.prototype.querySelector = function (selector) {
        var _a;
        return (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.querySelector(selector);
    };
    Validator.prototype.querySelectorALL = function (selector) {
        var _a;
        return (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector);
    };
    Validator.prototype.validAction = function () {
        var _a;
        var valid = this.valid();
        (_a = this.getValidAction()) === null || _a === void 0 ? void 0 : _a(valid, this.value, this.getTarget(), this.getEvent());
        return valid;
    };
    Validator.prototype.inValid = function () {
        return !this.valid();
    };
    Validator.prototype.allValid = function () {
        return this.valid() && this.childInValid();
    };
    Validator.prototype.allValidAction = function () {
        return this.validAction() && this.childInValidAction();
    };
    Validator.prototype.allInValid = function () {
        return !this.allValid();
    };
    Validator.prototype.allInValidAction = function () {
        return !this.allValidAction();
    };
    Validator.prototype.childValid = function () {
        return !this.childInValid();
    };
    Validator.prototype.childValue = function () {
        var data = {};
        this.childValidators().filter(function (_a) {
            var k = _a[0], v = _a[1];
            data[k] = v.value;
        });
        return data;
    };
    Validator.prototype.childValidAction = function () {
        return !this.childInValidAction();
    };
    Validator.prototype.childInValid = function () {
        var inValid = this.childValidators().filter(function (_a) {
            _a[0]; var v = _a[1];
            return !v.valid();
        });
        return inValid.length > 0;
    };
    Validator.prototype.childInValidValidator = function () {
        var inValid = this.childValidators().filter(function (_a) {
            _a[0]; var v = _a[1];
            return !v.valid();
        });
        return inValid;
    };
    Validator.prototype.childInValidAction = function () {
        var inValid = this.childValidators().filter(function (_a) {
            _a[0]; var v = _a[1];
            return !v.validAction();
        });
        return inValid.length > 0;
    };
    Validator.prototype.childValidator = function (name) {
        var _a;
        return (_a = Object.entries(this).find(function (_a) {
            var k = _a[0], v = _a[1];
            return (k === name && (v instanceof Validator));
        })) === null || _a === void 0 ? void 0 : _a[1];
    };
    Validator.prototype.childValidators = function () {
        return Object.entries(this).filter(function (_a) {
            _a[0]; var v = _a[1];
            return (v instanceof Validator);
        });
    };
    Validator.prototype.childValidValidator = function () {
        return this.childValidators().filter(function (it) { return it[1].valid(); });
    };
    Validator.prototype.syncValue = function () {
        var _a;
        this.value = (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.value;
    };
    Validator.prototype.allSyncValue = function () {
        this.childValidators().forEach(function (_a) {
            _a[0]; var e = _a[1];
            e.syncValue();
        });
    };
    Object.defineProperty(Validator.prototype, "length", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.value) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    return Validator;
}());

var NonPassValidator = /** @class */ (function (_super) {
    __extends(NonPassValidator, _super);
    function NonPassValidator(value, target, event, autoValid) {
        if (autoValid === void 0) { autoValid = true; }
        return _super.call(this, value, target, event, autoValid) || this;
    }
    NonPassValidator.prototype.valid = function () {
        return false;
    };
    return NonPassValidator;
}(Validator));

var ValidatorArray = /** @class */ (function (_super) {
    __extends(ValidatorArray, _super);
    function ValidatorArray(value, target, event, autoValid) {
        if (autoValid === void 0) { autoValid = true; }
        var _this = _super.call(this, value, target, event, autoValid) || this;
        _this._makeValidatorFactory = function (value, target, event) {
            return new NonPassValidator(value, target, event);
        };
        return _this;
    }
    ValidatorArray.prototype.getMakeValidatorFactory = function () {
        return this._makeValidatorFactory;
    };
    ValidatorArray.prototype.setMakeValidatorFactory = function (value) {
        this._makeValidatorFactory = value;
        return this;
    };
    ValidatorArray.prototype.setArrayValue = function (target, value, event) {
        var _a;
        (_a = this.value) === null || _a === void 0 ? void 0 : _a.filter(function (it) {
            if (it.getTarget()) {
                return it.getTarget() === target;
            }
            else {
                return false;
            }
        }).forEach(function (it) {
            it.set(value, target, event);
        });
        this.tickValue(this.value);
    };
    ValidatorArray.prototype.addValidator = function (value, target, event) {
        var _a, _b;
        if (!this.value) {
            this.value = [];
        }
        if (value instanceof Validator) {
            (_a = this.value) === null || _a === void 0 ? void 0 : _a.push(value);
        }
        else {
            (_b = this.value) === null || _b === void 0 ? void 0 : _b.push(this.makeValidator(value, target, event));
        }
        this.tickValue(this.value);
    };
    ValidatorArray.prototype.allChecked = function (checked) {
        var _a;
        this.checked = checked;
        (_a = this.value) === null || _a === void 0 ? void 0 : _a.forEach(function (it) {
            it.checked = checked;
        });
    };
    ValidatorArray.prototype.getValidators = function () {
        return this._value;
    };
    ValidatorArray.prototype.getValidator = function (e) {
        var _a;
        return (_a = this.value) === null || _a === void 0 ? void 0 : _a.filter(function (it) { return it.getTarget() === e; })[0];
    };
    ValidatorArray.prototype.getValidatorByValue = function (value) {
        var validatorByValue = this.getValidatorByValues(value)[0];
        return validatorByValue;
    };
    ValidatorArray.prototype.getValidatorByValues = function (value) {
        var _a, _b;
        return (_b = (_a = this.value) === null || _a === void 0 ? void 0 : _a.filter(function (it) { return it.value === value; })) !== null && _b !== void 0 ? _b : [];
    };
    ValidatorArray.prototype.removeElement = function (e) {
        var value = this.value;
        if (value) {
            this.value = value.filter(function (it) { return it.getTarget() !== e; });
        }
    };
    ValidatorArray.prototype.makeValidator = function (value, target, event) {
        return this._makeValidatorFactory(value, target, event);
    };
    return ValidatorArray;
}(Validator));

var RawSet = /** @class */ (function () {
    function RawSet(uuid, point, fragment, data) {
        if (data === void 0) { data = {}; }
        this.uuid = uuid;
        this.point = point;
        this.fragment = fragment;
        this.data = data;
    }
    Object.defineProperty(RawSet.prototype, "isConnected", {
        get: function () {
            return this.point.start.isConnected && this.point.end.isConnected;
        },
        enumerable: false,
        configurable: true
    });
    RawSet.prototype.getUsingTriggerVariables = function (config) {
        var usingTriggerVariables = new Set();
        this.fragment.childNodes.forEach(function (cNode, key) {
            var _a, _b, _c;
            var script = '';
            if (cNode.nodeType === Node.TEXT_NODE) {
                script = "`".concat((_a = cNode.textContent) !== null && _a !== void 0 ? _a : '', "`");
            }
            else if (cNode.nodeType === Node.ELEMENT_NODE) {
                var element_1 = cNode;
                var targetAttrNames = ((_c = (_b = config === null || config === void 0 ? void 0 : config.targetAttrs) === null || _b === void 0 ? void 0 : _b.map(function (it) { return it.name; })) !== null && _c !== void 0 ? _c : []).concat(RawSet.DR_ATTRIBUTES);
                script = targetAttrNames.map(function (it) { return (element_1.getAttribute(it)); }).filter(function (it) { return it; }).join(';');
            }
            if (script) {
                // script = script.replace('}$','}');
                // console.log('----------->', script)
                EventManager.VARNAMES.forEach(function (it) {
                    // script = script.replace(RegExp(it.replace('$', '\\$'), 'g'), `this?.___${it}`);
                    // script = script.replace(RegExp(it.replace('$', '\\$'), 'g'), `this.___${it}`);
                    script = script.replace(RegExp(it.replace('$', '\\$'), 'g'), "this.___".concat(it));
                });
                // console.log('----------', script);
                Array.from(ScriptUtils.getVariablePaths(script)).filter(function (it) { return !it.startsWith("___".concat(EventManager.SCRIPTS_VARNAME)); }).forEach(function (it) { return usingTriggerVariables.add(it); });
            }
        });
        // console.log('usingTriggerVariable----------->', usingTriggerVariables)
        return usingTriggerVariables;
    };
    RawSet.prototype.render = function (obj, config) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var genNode = config.window.document.importNode(this.fragment, true);
        var raws = [];
        var onAttrInitCallBack = [];
        var onElementInitCallBack = [];
        var drAttrs = [];
        genNode.childNodes.forEach(function (cNode, key) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
            var __render = Object.freeze({
                rawset: _this,
                scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj),
                range: Range.range,
                element: cNode,
                bindScript: "\n                    const ".concat(EventManager.SCRIPTS_VARNAME, " = this.__render.scripts;\n                    const ").concat(EventManager.RAWSET_VARNAME, " = this.__render.rawset;\n                    const ").concat(EventManager.ELEMENT_VARNAME, " = this.__render.element;\n                    const ").concat(EventManager.RANGE_VARNAME, " = this.__render.range;\n            ")
                // eslint-disable-next-line no-use-before-define
            });
            var fag = config.window.document.createDocumentFragment();
            if (cNode.nodeType === Node.TEXT_NODE && cNode.textContent) {
                var textContent = cNode.textContent;
                var runText = RawSet.exporesionGrouops(textContent)[0][1];
                // console.log('--->', textContent,runText, runText[0][1])
                var n = void 0;
                if (textContent === null || textContent === void 0 ? void 0 : textContent.startsWith('#')) {
                    var r = ScriptUtils.eval("".concat(__render.bindScript, " return ").concat(runText), Object.assign(obj, { __render: __render }));
                    var template = config.window.document.createElement('template');
                    template.innerHTML = r;
                    n = template.content;
                }
                else {
                    var r = ScriptUtils.eval("".concat(__render.bindScript, "  return ").concat(runText), Object.assign(obj, { __render: __render }));
                    n = config.window.document.createTextNode(r);
                }
                (_a = cNode.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(n, cNode);
            }
            else if (cNode.nodeType === Node.ELEMENT_NODE) {
                var element_2 = cNode;
                var drAttr_1 = {
                    dr: _this.getAttributeAndDelete(element_2, RawSet.DR),
                    drIf: _this.getAttributeAndDelete(element_2, RawSet.DR_IF_NAME),
                    drFor: _this.getAttributeAndDelete(element_2, RawSet.DR_FOR_NAME),
                    drForOf: _this.getAttributeAndDelete(element_2, RawSet.DR_FOR_OF_NAME),
                    drRepeat: _this.getAttributeAndDelete(element_2, RawSet.DR_REPEAT_NAME),
                    drThis: _this.getAttributeAndDelete(element_2, RawSet.DR_THIS_NAME),
                    drForm: _this.getAttributeAndDelete(element_2, RawSet.DR_FORM_NAME),
                    drPre: _this.getAttributeAndDelete(element_2, RawSet.DR_PRE_NAME),
                    drInnerHTML: _this.getAttributeAndDelete(element_2, RawSet.DR_INNERHTML_NAME),
                    drInnerText: _this.getAttributeAndDelete(element_2, RawSet.DR_INNERTEXT_NAME),
                    drItOption: _this.getAttributeAndDelete(element_2, RawSet.DR_IT_OPTIONNAME),
                    drVarOption: _this.getAttributeAndDelete(element_2, RawSet.DR_VAR_OPTIONNAME),
                    drAfterOption: _this.getAttributeAndDelete(element_2, RawSet.DR_AFTER_OPTIONNAME),
                    drBeforeOption: _this.getAttributeAndDelete(element_2, RawSet.DR_BEFORE_OPTIONNAME),
                    drCompleteOption: _this.getAttributeAndDelete(element_2, RawSet.DR_COMPLETE_OPTIONNAME),
                    drStripOption: _this.getAttributeAndDelete(element_2, RawSet.DR_STRIP_OPTIONNAME)
                };
                drAttrs.push(drAttr_1);
                if (drAttr_1.drPre != null) {
                    return;
                }
                if (drAttr_1.dr !== null && drAttr_1.dr.length >= 0) {
                    var itRandom = RawSet.drItOtherEncoding(element_2);
                    var vars = RawSet.drVarEncoding(element_2, (_b = drAttr_1.drVarOption) !== null && _b !== void 0 ? _b : '');
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval("\n                        ".concat(__render.bindScript, "\n                        const n = $element.cloneNode(true);\n                        var destIt = ").concat(drAttr_1.drItOption, ";\n                        if (destIt !== undefined) {\n                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt)))\n                            // console.log('----', n.innerHTML);\n                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);\n                            // console.log('----', n.innerHTML);\n                        }\n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }"), Object.assign(obj, {
                        __render: Object.freeze(__assign({ fag: newTemp, drStripOption: drAttr_1.drStripOption }, __render))
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_c = element_2.parentNode) === null || _c === void 0 ? void 0 : _c.replaceChild(fag, element_2);
                    raws.push.apply(raws, rr);
                }
                if (drAttr_1.drIf) {
                    var itRandom = RawSet.drItOtherEncoding(element_2);
                    var vars = RawSet.drVarEncoding(element_2, (_d = drAttr_1.drVarOption) !== null && _d !== void 0 ? _d : '');
                    var newTemp = config.window.document.createElement('temp');
                    // Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drIf' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v)); <-- 이부분은 다른 attr에도 적용을 할지말지 생각해야됨  엘리먼트 존재유무에 따라서 적용을 할지말지 결정해야됨
                    ScriptUtils.eval("\n                    ".concat(__render.bindScript, "\n                    ").concat((_e = drAttr_1.drBeforeOption) !== null && _e !== void 0 ? _e : '', "\n                    if(").concat(drAttr_1.drIf, ") {\n                        const n = $element.cloneNode(true);\n                        Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drIf' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v));\n                        var destIt = ").concat(drAttr_1.drItOption, ";\n                        if (destIt !== undefined) {\n                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt)))\n                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);\n                        }\n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }\n                    }\n                    ").concat((_f = drAttr_1.drAfterOption) !== null && _f !== void 0 ? _f : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ fag: newTemp, drAttr: drAttr_1, drAttrsOriginName: RawSet.drAttrsOriginName, drStripOption: drAttr_1.drStripOption }, __render))
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    var bypass = ((_g = newTemp.innerHTML) !== null && _g !== void 0 ? _g : '').trim().length <= 0;
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_h = element_2.parentNode) === null || _h === void 0 ? void 0 : _h.replaceChild(fag, element_2);
                    raws.push.apply(raws, rr);
                    if (bypass) {
                        return;
                    }
                }
                if (drAttr_1.drThis) {
                    var r = ScriptUtils.evalReturn(drAttr_1.drThis, obj);
                    if (r) {
                        fag.append(RawSet.drThisCreate(element_2, drAttr_1.drThis, (_j = drAttr_1.drVarOption) !== null && _j !== void 0 ? _j : '', drAttr_1.drStripOption, obj, config));
                        var rr = RawSet.checkPointCreates(fag, config);
                        (_k = element_2.parentNode) === null || _k === void 0 ? void 0 : _k.replaceChild(fag, element_2);
                        raws.push.apply(raws, rr);
                    }
                    else {
                        cNode.remove();
                    }
                }
                if (drAttr_1.drForm) {
                    RawSet.drFormOtherMoveAttr(element_2, 'name', 'temp-name', config);
                    var data = ScriptUtils.evalReturn("".concat(drAttr_1.drForm), obj);
                    var childs = Array.from(element_2.querySelectorAll('[name]'));
                    var fromName = ScriptUtils.evalReturn((_l = element_2.getAttribute('dr-form:name')) !== null && _l !== void 0 ? _l : '', obj);
                    var thisName = fromName !== null && fromName !== void 0 ? fromName : element_2.getAttribute('name');
                    // console.log('dr-form:name', thisName, element.getAttribute('dr-form:name'), obj, element);
                    // // 자기자신이 Input 대상일때
                    if (childs.length <= 0 && thisName) {
                        childs.push(element_2);
                    }
                    else {
                        if (data instanceof Validator) {
                            data.setTarget(element_2);
                        }
                    }
                    childs.forEach(function (it) {
                        var _a, _b, _c, _d, _e;
                        var eventName = (_a = it.getAttribute('dr-form:event')) !== null && _a !== void 0 ? _a : 'change';
                        var validatorName = it.getAttribute('dr-form:validator');
                        var attrEventName = EventManager.attrPrefix + 'event-' + eventName;
                        var varpath = (_c = ScriptUtils.evalReturn((_b = element_2.getAttribute('dr-form:name')) !== null && _b !== void 0 ? _b : '', obj)) !== null && _c !== void 0 ? _c : it.getAttribute('name');
                        if (varpath != null) {
                            if (validatorName) {
                                ScriptUtils.eval("\n                                    ".concat(__render.bindScript, "\n                                    const validator = typeof ").concat(validatorName, " ==='function' ?  new  ").concat(validatorName, "() : ").concat(validatorName, ";\n                                    ").concat(drAttr_1.drForm, "['").concat(varpath, "'] = validator;\n                                "), Object.assign(obj, {
                                    __render: Object.freeze(__assign({ drStripOption: drAttr_1.drStripOption }, __render))
                                }));
                            }
                            varpath = "".concat(drAttr_1.drForm, "['").concat(varpath, "']");
                            var data_1 = ScriptUtils.evalReturn("".concat(varpath), obj);
                            if (data_1 instanceof ValidatorArray) {
                                it.setAttribute(attrEventName, "".concat(varpath, ".setArrayValue($target, $target.value, $event); ").concat((_d = it.getAttribute(attrEventName)) !== null && _d !== void 0 ? _d : '', ";"));
                                data_1.addValidator(it.value, it);
                            }
                            else if (data_1 instanceof Validator) {
                                // varpath += (varpath ? '.value' : 'value');
                                // varpath = drAttr.drForm + '.' + varpath;
                                // it.setAttribute(attrEventName, `${varpath} = $target.value; ${target}=$target; ${event}=$event;`);
                                it.setAttribute(attrEventName, "".concat(varpath, ".set($target.value, $target, $event); ").concat((_e = it.getAttribute(attrEventName)) !== null && _e !== void 0 ? _e : '', ";"));
                                data_1.setTarget(it);
                                data_1.value = it.value;
                            }
                            else {
                                it.setAttribute(attrEventName, "".concat(varpath, " = $target.value;"));
                            }
                        }
                    });
                    RawSet.drFormOtherMoveAttr(element_2, 'temp-name', 'name', config);
                    raws.push.apply(raws, RawSet.checkPointCreates(element_2, config));
                }
                if (drAttr_1.drInnerText) {
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval(" \n                        ".concat(__render.bindScript, "\n                        const n = $element.cloneNode(true);  \n                        ").concat((_m = drAttr_1.drBeforeOption) !== null && _m !== void 0 ? _m : '', "\n                        n.innerText = ").concat(drAttr_1.drInnerText, ";\n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }\n                        ").concat((_o = drAttr_1.drAfterOption) !== null && _o !== void 0 ? _o : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ drStripOption: drAttr_1.drStripOption, fag: newTemp }, __render))
                    }));
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_p = element_2.parentNode) === null || _p === void 0 ? void 0 : _p.replaceChild(fag, element_2);
                    raws.push.apply(raws, rr);
                }
                if (drAttr_1.drInnerHTML) {
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval("\n                        ".concat(__render.bindScript, "\n                        const n = $element.cloneNode(true);\n                        ").concat((_q = drAttr_1.drBeforeOption) !== null && _q !== void 0 ? _q : '', "\n                        n.innerHTML = ").concat(drAttr_1.drInnerHTML, ";\n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }\n                        ").concat((_r = drAttr_1.drAfterOption) !== null && _r !== void 0 ? _r : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ drStripOption: drAttr_1.drStripOption, fag: newTemp }, __render
                        // eslint-disable-next-line no-use-before-define
                        ))
                    }));
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_s = element_2.parentNode) === null || _s === void 0 ? void 0 : _s.replaceChild(fag, element_2);
                    raws.push.apply(raws, rr);
                }
                if (drAttr_1.drFor) {
                    var itRandom = RawSet.drItOtherEncoding(element_2);
                    var vars = RawSet.drVarEncoding(element_2, (_t = drAttr_1.drVarOption) !== null && _t !== void 0 ? _t : '');
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval("\n                    ".concat(__render.bindScript, "\n                    ").concat((_u = drAttr_1.drBeforeOption) !== null && _u !== void 0 ? _u : '', "\n                    for(").concat(drAttr_1.drFor, ") {\n                        const n = this.__render.element.cloneNode(true);\n                        var destIt = ").concat(drAttr_1.drItOption, ";\n                        if (destIt !== undefined) {\n                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearForIt\\#/g, destIt).replace(/\\#nearForIndex\\#/g, destIt))) \n                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt).replace(/\\#index\\#/g, destIt);\n                        }\n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }\n                    }\n                    ").concat((_v = drAttr_1.drAfterOption) !== null && _v !== void 0 ? _v : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ fag: newTemp, drStripOption: drAttr_1.drStripOption }, __render))
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_w = element_2.parentNode) === null || _w === void 0 ? void 0 : _w.replaceChild(fag, element_2);
                    raws.push.apply(raws, rr);
                }
                if (drAttr_1.drForOf) {
                    var itRandom = RawSet.drItOtherEncoding(element_2);
                    var vars = RawSet.drVarEncoding(element_2, (_x = drAttr_1.drVarOption) !== null && _x !== void 0 ? _x : '');
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval("\n                    ".concat(__render.bindScript, "\n                    ").concat((_y = drAttr_1.drBeforeOption) !== null && _y !== void 0 ? _y : '', "\n                    var i = 0; \n                    const forOf = ").concat(drAttr_1.drForOf, ";\n                    const forOfStr = `").concat(drAttr_1.drForOf, "`.trim();\n                    if (forOf) {\n                        for(const it of forOf) {\n                            var destIt = it;\n                            if (/\\[(.*,?)\\],/g.test(forOfStr)) {\n                                if (typeof it === 'string') {\n                                    destIt = it;\n                                } else {\n                                    destIt = forOfStr.substring(1, forOfStr.length-1).split(',')[i];\n                                }\n                            } else if (forOf.isRange) {\n                                    destIt = it;\n                            }  else {\n                                destIt = forOfStr + '[' + i +']'\n                            }\n                            const n = this.__render.element.cloneNode(true);\n                            Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drForOf' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v));\n                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearForOfIt\\#/g, destIt).replace(/\\#it\\#/g, destIt).replace(/\\#nearForOfIndex\\#/g, i)))\n                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt).replace(/\\#index\\#/g, i);\n                            if (this.__render.drStripOption === 'true') {\n                                Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                            } else {\n                                this.__render.fag.append(n);\n                            }\n                            i++;\n                        }\n                    }\n                    ").concat((_z = drAttr_1.drAfterOption) !== null && _z !== void 0 ? _z : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ drStripOption: drAttr_1.drStripOption, drAttr: drAttr_1, drAttrsOriginName: RawSet.drAttrsOriginName, fag: newTemp }, __render
                        // eslint-disable-next-line no-use-before-define
                        ))
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_0 = element_2.parentNode) === null || _0 === void 0 ? void 0 : _0.replaceChild(fag, element_2);
                    //const rrr = rr.flatMap(it => it.render(obj, config));// .flat();
                    raws.push.apply(raws, rr);
                }
                if (drAttr_1.drRepeat) {
                    var itRandom = RawSet.drItOtherEncoding(element_2);
                    var vars = RawSet.drVarEncoding(element_2, (_1 = drAttr_1.drVarOption) !== null && _1 !== void 0 ? _1 : '');
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval("\n                    ".concat(__render.bindScript, "\n                    ").concat((_2 = drAttr_1.drBeforeOption) !== null && _2 !== void 0 ? _2 : '', "\n                    var i = 0; \n                    const repeat = ").concat(drAttr_1.drRepeat, ";\n                    const repeatStr = `").concat(drAttr_1.drRepeat, "`;\n                    let range = repeat;\n                    if (typeof repeat === 'number') {\n                        range = ").concat(EventManager.RANGE_VARNAME, "(repeat);\n                    } \n                    for(const it of range) {\n                        var destIt = it;\n                        if (range.isRange) {\n                            destIt = it;\n                        }  else {\n                            destIt = repeatStr + '[' + i +']'\n                        }\n                        const n = this.__render.element.cloneNode(true);\n                        n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearRangeIt\\#/g, destIt).replace(/\\#nearRangeIndex\\#/g, destIt)))\n                        n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt).replace(/\\#index\\#/g, destIt);\n                        \n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }\n                        i++;\n                    }\n                    ").concat((_3 = drAttr_1.drAfterOption) !== null && _3 !== void 0 ? _3 : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ fag: newTemp, drStripOption: drAttr_1.drStripOption }, __render))
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_4 = element_2.parentNode) === null || _4 === void 0 ? void 0 : _4.replaceChild(fag, element_2);
                    raws.push.apply(raws, rr);
                }
                // config detecting
                // console.log('config targetElement-->', config?.targetElements)
                var targetElement = (_5 = config === null || config === void 0 ? void 0 : config.targetElements) === null || _5 === void 0 ? void 0 : _5.find(function (it) { return (!drAttr_1.drForOf && !drAttr_1.drFor && !drAttr_1.drRepeat) && it.name.toLowerCase() === element_2.tagName.toLowerCase(); });
                if (targetElement) {
                    var documentFragment = targetElement.callBack(element_2, obj, _this);
                    // console.log('target-->',name, documentFragment)
                    if (documentFragment) {
                        // fag.append(documentFragment)
                        var rr = RawSet.checkPointCreates(documentFragment, config);
                        (_6 = element_2.parentNode) === null || _6 === void 0 ? void 0 : _6.replaceChild(documentFragment, element_2);
                        raws.push.apply(raws, rr);
                        onElementInitCallBack.push({
                            name: targetElement.name.toLowerCase(),
                            obj: obj,
                            targetElement: targetElement,
                            creatorMetaData: targetElement.__creatorMetaData
                        });
                        (_7 = targetElement === null || targetElement === void 0 ? void 0 : targetElement.complete) === null || _7 === void 0 ? void 0 : _7.call(targetElement, element_2, obj, _this);
                    }
                }
                // config?.targetElements?.forEach(it => {
                //     const name = it.name;
                //     if (name.toLowerCase() === element.tagName.toLowerCase() && (!drAttr.drForOf && !drAttr.drFor && !drAttr.drRepeat)) {
                //         const documentFragment = it.callBack(element, obj, this);
                //         // console.log('target-->',name, documentFragment)
                //         if (documentFragment) {
                //             // fag.append(documentFragment)
                //             const rr = RawSet.checkPointCreates(documentFragment, config)
                //             element.parentNode?.replaceChild(documentFragment, element);
                //             raws.push(...rr);
                //             onElementInitCallBack.push({
                //                 name,
                //                 obj,
                //                 targetElement: it,
                //                 creatorMetaData: it.__creatorMetaData as CreatorMetaData
                //             });
                //             it?.complete?.(element, obj, this);
                //         }
                //     }
                // })
                var attributeNames_1 = _this.getAttributeNames(element_2);
                var targetAttr = (_8 = config === null || config === void 0 ? void 0 : config.targetAttrs) === null || _8 === void 0 ? void 0 : _8.find(function (it) { return (!drAttr_1.drForOf && !drAttr_1.drFor && !drAttr_1.drRepeat) && attributeNames_1.includes(it.name); });
                if (targetAttr) {
                    var attrName = targetAttr.name;
                    var attrValue = _this.getAttributeAndDelete(element_2, attrName);
                    if (attrValue && attrName && (!drAttr_1.drForOf && !drAttr_1.drFor && !drAttr_1.drRepeat)) {
                        var documentFragment = targetAttr.callBack(element_2, attrValue, obj, _this);
                        if (documentFragment) {
                            var rr = RawSet.checkPointCreates(documentFragment, config);
                            (_9 = element_2.parentNode) === null || _9 === void 0 ? void 0 : _9.replaceChild(documentFragment, element_2);
                            raws.push.apply(raws, rr);
                            onAttrInitCallBack.push({
                                attrName: attrName,
                                attrValue: attrValue,
                                obj: obj
                            });
                            (_10 = targetAttr === null || targetAttr === void 0 ? void 0 : targetAttr.complete) === null || _10 === void 0 ? void 0 : _10.call(targetAttr, element_2, attrValue, obj, _this);
                        }
                    }
                }
                // config?.targetAttrs?.forEach(it => {
                //     const attrName = it.name;
                //     const attrValue = this.getAttributeAndDelete(element, attrName)
                //     // console.log('?????attrValue', attrName, attrValue)
                //     if (attrValue && attrName && (!drAttr.drForOf && !drAttr.drFor && !drAttr.drRepeat)) {
                //         const documentFragment = it.callBack(element, attrValue, obj, this);
                //         if (documentFragment) {
                //             // fag.append(documentFragment);
                //             const rr = RawSet.checkPointCreates(documentFragment, config)
                //             element.parentNode?.replaceChild(documentFragment, element);
                //             raws.push(...rr);
                //             onAttrInitCallBack.push({
                //                 attrName,
                //                 attrValue,
                //                 obj
                //             });
                //             it?.complete?.(element, attrValue, obj, this);
                //         }
                //     }
                // })
            }
        });
        this.applyEvent(obj, genNode, config);
        this.replaceBody(genNode);
        drAttrs.forEach(function (it) {
            if (it.drCompleteOption) {
                // genNode.childNodes
                ScriptUtils.eval("\n                const ".concat(EventManager.FAG_VARNAME, " = this.__render.fag;\n                const ").concat(EventManager.SCRIPTS_VARNAME, " = this.__render.scripts;\n                const ").concat(EventManager.RAWSET_VARNAME, " = this.__render.rawset;\n                ").concat(it.drCompleteOption, "\n                "), Object.assign(obj, {
                    __render: Object.freeze({
                        rawset: _this,
                        fag: genNode,
                        scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj)
                    })
                }));
            }
        });
        for (var _i = 0, onElementInitCallBack_1 = onElementInitCallBack; _i < onElementInitCallBack_1.length; _i++) {
            var it_1 = onElementInitCallBack_1[_i];
            (_d = (_c = (_b = (_a = it_1.targetElement) === null || _a === void 0 ? void 0 : _a.__render) === null || _b === void 0 ? void 0 : _b.component) === null || _c === void 0 ? void 0 : _c.onInitRender) === null || _d === void 0 ? void 0 : _d.call(_c, { render: (_e = it_1.targetElement) === null || _e === void 0 ? void 0 : _e.__render, creatorMetaData: (_f = it_1.targetElement) === null || _f === void 0 ? void 0 : _f.__creatorMetaData });
            (_g = config === null || config === void 0 ? void 0 : config.onElementInit) === null || _g === void 0 ? void 0 : _g.call(config, it_1.name, obj, this, it_1.targetElement);
        }
        for (var _j = 0, onAttrInitCallBack_1 = onAttrInitCallBack; _j < onAttrInitCallBack_1.length; _j++) {
            var it_2 = onAttrInitCallBack_1[_j];
            (_h = config === null || config === void 0 ? void 0 : config.onAttrInit) === null || _h === void 0 ? void 0 : _h.call(config, it_2.attrName, it_2.attrValue, obj, this);
        }
        return raws;
    };
    RawSet.prototype.applyEvent = function (obj, fragment, config) {
        if (fragment === void 0) { fragment = this.fragment; }
        eventManager.applyEvent(obj, eventManager.findAttrElements(fragment, config), config);
    };
    RawSet.prototype.getAttributeNames = function (element) {
        return element.getAttributeNames();
    };
    RawSet.prototype.getAttribute = function (element, attr) {
        var data = element.getAttribute(attr);
        return data;
    };
    RawSet.prototype.getAttributeAndDelete = function (element, attr) {
        var data = element.getAttribute(attr);
        element.removeAttribute(attr);
        return data;
    };
    RawSet.prototype.replaceBody = function (genNode) {
        var _a;
        this.childAllRemove();
        (_a = this.point.start.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(genNode, this.point.start.nextSibling);
    };
    RawSet.checkPointCreates = function (element, config) {
        var _a, _b, _c, _d;
        var thisVariableName = element.__domrender_this_variable_name;
        // console.log('checkPointCreates thisVariableName', thisVariableName);
        var nodeIterator = config.window.document.createNodeIterator(element, NodeFilter.SHOW_ALL, {
            acceptNode: function (node) {
                var _a, _b, _c, _d, _e;
                if (node.nodeType === Node.TEXT_NODE) {
                    // console.log('????????', node.parentElement, node.parentElement?.getAttribute('dr-pre'));
                    // console.log('???????/',node.textContent, node.parentElement?.getAttribute('dr-pre'))
                    // 나중에
                    // const between = StringUtils.betweenRegexpStr('[$#]\\{', '\\}', StringUtils.deleteEnter((node as Text).data ?? ''))
                    var between = RawSet.exporesionGrouops(StringUtils.deleteEnter((_a = node.data) !== null && _a !== void 0 ? _a : ''));
                    // console.log('bbbb', between)
                    return (between === null || between === void 0 ? void 0 : between.length) > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    // return /\$\{.*?\}/g.test(StringUtils.deleteEnter((node as Text).data ?? '')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    // return /[$#]\{.*?\}/g.test(StringUtils.deleteEnter((node as Text).data ?? '')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
                else if (node.nodeType === Node.ELEMENT_NODE) {
                    var element_3 = node;
                    var isElement = ((_c = (_b = config.targetElements) === null || _b === void 0 ? void 0 : _b.map(function (it) { return it.name.toLowerCase(); })) !== null && _c !== void 0 ? _c : []).includes(element_3.tagName.toLowerCase());
                    var targetAttrNames_1 = ((_e = (_d = config.targetAttrs) === null || _d === void 0 ? void 0 : _d.map(function (it) { return it.name; })) !== null && _e !== void 0 ? _e : []).concat(RawSet.DR_ATTRIBUTES);
                    var isAttr = element_3.getAttributeNames().filter(function (it) { return targetAttrNames_1.includes(it.toLowerCase()); }).length > 0;
                    return (isAttr || isElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        });
        var pars = [];
        var currentNode;
        var _loop_1 = function () {
            if (currentNode.nodeType === Node.TEXT_NODE) {
                var text = (_a = currentNode.textContent) !== null && _a !== void 0 ? _a : '';
                var template_1 = config.window.document.createElement('template');
                // const a = StringUtils.regexExec(/\$\{.*?\}/g, text);
                // const a = StringUtils.regexExec(/[$#]\{.*?\}/g, text);
                // const a = StringUtils.betweenRegexpStr('[$#]\\{', '\\}', text); // <--나중에..
                var a = RawSet.exporesionGrouops(text); // <--나중에..
                var map = a.map(function (it) {
                    return {
                        uuid: RandomUtils.uuid(),
                        content: it[0],
                        regexArr: it
                    };
                });
                var lasterIndex_1 = 0;
                map.forEach(function (it) {
                    var regexArr = it.regexArr;
                    var preparedText = regexArr.input.substring(lasterIndex_1, regexArr.index);
                    var start = config.window.document.createComment("start text ".concat(it.uuid));
                    var end = config.window.document.createComment("end text ".concat(it.uuid));
                    // layout setting
                    template_1.content.append(document.createTextNode(preparedText)); // 사이사이값.
                    template_1.content.append(start);
                    template_1.content.append(end);
                    // content
                    var fragment = config.window.document.createDocumentFragment();
                    fragment.append(config.window.document.createTextNode(it.content));
                    pars.push(new RawSet(it.uuid, {
                        start: start,
                        end: end,
                        thisVariableName: thisVariableName
                    }, fragment));
                    lasterIndex_1 = regexArr.index + it.content.length;
                });
                template_1.content.append(config.window.document.createTextNode(text.substring(lasterIndex_1, text.length)));
                (_b = currentNode === null || currentNode === void 0 ? void 0 : currentNode.parentNode) === null || _b === void 0 ? void 0 : _b.replaceChild(template_1.content, currentNode);
            }
            else {
                // console.log('------------->', currentNode)
                var uuid = RandomUtils.uuid();
                var fragment = config.window.document.createDocumentFragment();
                var start = config.window.document.createComment("start ".concat(uuid));
                var end = config.window.document.createComment("end ".concat(uuid));
                //console.log('start--', uuid)
                (_c = currentNode === null || currentNode === void 0 ? void 0 : currentNode.parentNode) === null || _c === void 0 ? void 0 : _c.insertBefore(start, currentNode);
                (_d = currentNode === null || currentNode === void 0 ? void 0 : currentNode.parentNode) === null || _d === void 0 ? void 0 : _d.insertBefore(end, currentNode.nextSibling);
                fragment.append(currentNode);
                pars.push(new RawSet(uuid, {
                    start: start,
                    end: end,
                    thisVariableName: thisVariableName
                }, fragment));
            }
        };
        // eslint-disable-next-line no-cond-assign
        while (currentNode = nodeIterator.nextNode()) {
            _loop_1();
        }
        // console.log('check-->', pars)
        return pars;
    };
    RawSet.prototype.childAllRemove = function () {
        var next = this.point.start.nextSibling;
        while (next) {
            if (next === this.point.end) {
                break;
            }
            next.remove();
            next = this.point.start.nextSibling;
        }
    };
    RawSet.drItOtherEncoding = function (element) {
        var random = RandomUtils.uuid();
        var regex = /#it#/g;
        element.querySelectorAll("[".concat(RawSet.DR_IT_OPTIONNAME, "], [").concat(RawSet.DR_FOR_OF_NAME, "], [").concat(RawSet.DR_REPEAT_NAME, "]")).forEach(function (it) {
            it.innerHTML = it.innerHTML.replace(regex, random);
        });
        return random;
    };
    RawSet.drItOtherDecoding = function (element, random) {
        element.querySelectorAll("[".concat(RawSet.DR_IT_OPTIONNAME, "], [").concat(RawSet.DR_FOR_OF_NAME, "], [").concat(RawSet.DR_REPEAT_NAME, "]")).forEach(function (it) {
            it.innerHTML = it.innerHTML.replace(RegExp(random, 'g'), '#it#');
        });
    };
    // public static drDVarEncoding(element: Element, drVarOption: string) {
    //     const vars = (drVarOption?.split(',') ?? []).map(it => {
    //         const s = it.trim().split('=');
    //         return {
    //             name: s[0],
    //             value: s[1],
    //             regex: RegExp('(?<!(dr-|\\.))var\\.' + s[0] + '(?=.?)', 'g'),
    //             random: RandomUtils.uuid()
    //         }
    //     })
    //     element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
    //         vars.filter(vit => vit.value && vit.name).forEach(vit => {
    //             it.innerHTML = it.innerHTML.replace(vit.regex, vit.random);
    //         })
    //     });
    //     vars.filter(vit => vit.value && vit.name).forEach(vit => {
    //         element.innerHTML = element.innerHTML.replace(vit.regex, vit.value);
    //     })
    //     return vars;
    // }
    //
    // public static drDVarDecoding(element: Element, vars: { name: string, value: string, regex: RegExp, random: string }[]) {
    //     element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
    //         vars.filter(vit => vit.value && vit.name).forEach(vit => {
    //             it.innerHTML = it.innerHTML.replace(RegExp(vit.random, 'g'), vit.value);
    //         })
    //     });
    // }
    RawSet.drThisEncoding = function (element, drThis) {
        var thisRandom = RandomUtils.uuid();
        // const thisRegex = /(?<!(dr-|\.))this(?=.?)/g;
        // const thisRegex = /[^(dr\-)]this(?=.?)/g;
        // const thisRegex = /[^(dr\-)]this\./g;
        // safari 때문에 전위 검색 regex가 안됨 아 짜증나서 이걸로함.
        // element.querySelectorAll(`[${RawSet.DR_PRE_NAME}]`).forEach(it => {
        //     let message = it.innerHTML;
        // })
        // console.log('-----?', `[${RawSet.DR_THIS_NAME}], :not([${RawSet.DR_PRE_NAME}])`)
        element.querySelectorAll("[".concat(RawSet.DR_PRE_NAME, "]")).forEach(function (it) {
            it.innerHTML = it.innerHTML.replace(/this/g, thisRandom);
        });
        element.querySelectorAll("[".concat(RawSet.DR_THIS_NAME, "]")).forEach(function (it) {
            var message = it.innerHTML;
            StringUtils.regexExec(/([^(dr\-)])?this(?=.?)/g, message).reverse().forEach(function (it) {
                var _a;
                message = message.substr(0, it.index) + message.substr(it.index).replace(it[0], "".concat((_a = it[1]) !== null && _a !== void 0 ? _a : '').concat(drThis));
            });
            it.innerHTML = message;
        });
        var message = element.innerHTML;
        StringUtils.regexExec(/([^(dr\-)])?this(?=.?)/g, message).reverse().forEach(function (it) {
            var _a;
            message = message.substr(0, it.index) + message.substr(it.index).replace(it[0], "".concat((_a = it[1]) !== null && _a !== void 0 ? _a : '').concat(drThis));
        });
        element.innerHTML = message;
        return thisRandom;
    };
    RawSet.drThisDecoding = function (element, thisRandom) {
        element.querySelectorAll("[".concat(RawSet.DR_PRE_NAME, "]")).forEach(function (it) {
            it.innerHTML = it.innerHTML.replace(RegExp(thisRandom, 'g'), 'this');
        });
        element.querySelectorAll("[".concat(RawSet.DR_THIS_NAME, "]")).forEach(function (it) {
            it.innerHTML = it.innerHTML.replace(RegExp(thisRandom, 'g'), 'this');
        });
    };
    RawSet.drFormOtherMoveAttr = function (element, as, to, config) {
        element.querySelectorAll("[".concat(RawSet.DR_FORM_NAME, "]")).forEach(function (subElement) {
            var _a;
            var nodeIterator = config.window.document.createNodeIterator(subElement, NodeFilter.SHOW_ELEMENT, {
                acceptNode: function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        var element_4 = node;
                        return element_4.hasAttribute(as) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    }
                    else {
                        return NodeFilter.FILTER_REJECT;
                    }
                }
            });
            var node;
            // eslint-disable-next-line no-cond-assign
            while (node = nodeIterator.nextNode()) {
                var element_5 = node;
                element_5.setAttribute(to, (_a = element_5.getAttribute(as)) !== null && _a !== void 0 ? _a : '');
                element_5.removeAttribute(as);
            }
        });
    };
    RawSet.drVarEncoding = function (element, drVarOption) {
        var _a;
        var vars = ((_a = drVarOption === null || drVarOption === void 0 ? void 0 : drVarOption.split(',')) !== null && _a !== void 0 ? _a : []).map(function (it) {
            var _a, _b;
            var s = it.trim().split('=');
            var name = (_a = s[0]) === null || _a === void 0 ? void 0 : _a.trim();
            var value = (_b = s[1]) === null || _b === void 0 ? void 0 : _b.trim();
            return {
                name: name,
                value: value,
                // regex: RegExp('(?<!(dr-|\\.))var\\.' + s[0] + '(?=.?)', 'g'),
                regex: RegExp('\\$var\\.' + name + '(?=.?)', 'g'),
                random: RandomUtils.uuid()
            };
        });
        // element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
        element.querySelectorAll("[".concat(RawSet.DR_VAR_OPTIONNAME, "]")).forEach(function (it) {
            vars.filter(function (vit) { return vit.value && vit.name; }).forEach(function (vit) {
                it.innerHTML = it.innerHTML.replace(vit.regex, vit.random);
            });
        });
        vars.filter(function (vit) { return vit.value && vit.name; }).forEach(function (vit) {
            element.innerHTML = element.innerHTML.replace(vit.regex, vit.value);
        });
        return vars;
    };
    RawSet.drVarDecoding = function (element, vars) {
        element.querySelectorAll("[".concat(RawSet.DR_THIS_NAME, "]")).forEach(function (it) {
            vars.filter(function (vit) { return vit.value && vit.name; }).forEach(function (vit) {
                it.innerHTML = it.innerHTML.replace(RegExp(vit.random, 'g'), vit.value);
            });
        });
    };
    RawSet.drThisCreate = function (element, drThis, drVarOption, drStripOption, obj, config) {
        var fag = config.window.document.createDocumentFragment();
        var n = element.cloneNode(true);
        n.querySelectorAll(eventManager.attrNames.map(function (it) { return "[".concat(it, "]"); }).join(',')).forEach(function (it) {
            it.setAttribute(EventManager.ownerVariablePathAttrName, 'this');
        });
        var thisRandom = this.drThisEncoding(n, drThis);
        var vars = this.drVarEncoding(n, drVarOption);
        this.drVarDecoding(n, vars);
        this.drThisDecoding(n, thisRandom);
        if (drStripOption && (drStripOption === true || drStripOption === 'true')) {
            Array.from(n.childNodes).forEach(function (it) { return fag.append(it); });
        }
        else {
            fag.append(n);
        }
        fag.__domrender_this_variable_name = drThis;
        // console.log('set __domrender_this_variable_name', (fag as any).__domrender_this_variable_name)
        return fag;
    };
    RawSet.createComponentTargetAttribute = function (name, getThisObj, factory) {
        var targetAttribute = {
            name: name,
            callBack: function (element, attrValue, obj, rawSet) {
                var _a;
                var thisObj = getThisObj(element, attrValue, obj, rawSet);
                var data = factory(element, attrValue, obj, rawSet);
                rawSet.point.thisVariableName = data.__domrender_this_variable_name;
                if (thisObj) {
                    var i = thisObj['__domrender_component_new'] = ((_a = thisObj['__domrender_component_new']) !== null && _a !== void 0 ? _a : new Proxy({}, new DomRenderFinalProxy()));
                    i.thisVariableName = rawSet.point.thisVariableName;
                    i.rawSet = rawSet;
                    i.innerHTML = element.innerHTML;
                    i.rootCreator = new Proxy(obj, new DomRenderFinalProxy());
                    i.creator = new Proxy(rawSet.point.thisVariableName ? ScriptUtils.evalReturn(rawSet.point.thisVariableName, obj) : obj, new DomRenderFinalProxy());
                }
                return data;
            }
        };
        return targetAttribute;
    };
    RawSet.createComponentTargetElement = function (name, objFactory, template, styles, scripts, 
    // complete: (element: Element, obj: any, rawSet: RawSet) => void  | undefined,
    config) {
        if (template === void 0) { template = ''; }
        if (styles === void 0) { styles = []; }
        var targetElement = {
            name: name,
            styles: styles,
            template: template,
            callBack: function (element, obj, rawSet) {
                var _a, _b, _c;
                // console.log('callback------->')
                if (!obj.__domrender_components) {
                    obj.__domrender_components = {};
                }
                var domrenderComponents = obj.__domrender_components;
                var componentKey = '_' + RandomUtils.getRandomString(20);
                // console.log('callback settttt---a-->', componentKey, objFactory, objFactory(element, obj, rawSet))
                domrenderComponents[componentKey] = objFactory(element, obj, rawSet);
                var instance = domrenderComponents[componentKey];
                var onCreate = element.getAttribute('dr-on-create');
                var createParam = undefined;
                if (onCreate) {
                    //     const script = `var $component = this.__render.component; var $element = this.__render.element; var $innerHTML = this.__render.innerHTML; var $attribute = this.__render.attribute;  ${onCreate} `;
                    //     const script = `${onCreate} `;
                    createParam = ScriptUtils.evalReturn(onCreate, obj);
                }
                (_a = instance === null || instance === void 0 ? void 0 : instance.onCreateRender) === null || _a === void 0 ? void 0 : _a.call(instance, createParam);
                // console.log('callback settttt---b-->', obj.__domrender_components, instance)
                var attribute = {};
                element.getAttributeNames().forEach(function (it) {
                    attribute[it] = element.getAttribute(it);
                });
                var render = Object.freeze({
                    component: instance,
                    element: element,
                    innerHTML: element.innerHTML,
                    attribute: attribute,
                    rawset: rawSet,
                    componentKey: componentKey,
                    scripts: EventManager.setBindProperty(scripts, obj)
                    // eslint-disable-next-line no-use-before-define
                });
                this.__render = render;
                var i = instance['__domrender_component_new'] = ((_b = instance['__domrender_component_new']) !== null && _b !== void 0 ? _b : new Proxy({}, new DomRenderFinalProxy()));
                i.thisVariableName = rawSet.point.thisVariableName;
                i.thisFullVariableName = "this.__domrender_components.".concat(componentKey);
                i.rawSet = rawSet;
                i.innerHTML = element.innerHTML;
                i.rootCreator = new Proxy(obj, new DomRenderFinalProxy());
                i.creator = new Proxy(rawSet.point.thisVariableName ? ScriptUtils.evalReturn(rawSet.point.thisVariableName, obj) : obj, new DomRenderFinalProxy());
                this.__creatorMetaData = i;
                var applayTemplate = element.innerHTML;
                if (applayTemplate) {
                    if (rawSet.point.thisVariableName) {
                        applayTemplate = applayTemplate.replace(/this\./g, 'this.__domrender_component_new.rootCreator.');
                    }
                    // applayTemplate = applayTemplate.replace(/\$component\./g, 'this.');
                    applayTemplate = applayTemplate.replace(/#component#/g, 'this');
                }
                applayTemplate = template.replace(/#innerHTML#/g, applayTemplate);
                var oninit = element.getAttribute(EventManager.onInitAttrName);
                // console.log('oninit', oninit)
                if (oninit) {
                    var script = "var $component = this.__render.component; var $element = this.__render.element; var $innerHTML = this.__render.innerHTML; var $attribute = this.__render.attribute;  ".concat(oninit, " ");
                    // console.log('--->onInit--?', oninit, script, obj)
                    ScriptUtils.eval(script, Object.assign(obj, {
                        __render: render
                    }));
                }
                var innerHTML = ((_c = styles === null || styles === void 0 ? void 0 : styles.map(function (it) { return "<style>".concat(it, "</style>"); })) !== null && _c !== void 0 ? _c : []).join(' ') + (applayTemplate !== null && applayTemplate !== void 0 ? applayTemplate : '');
                element.innerHTML = innerHTML;
                var data = RawSet.drThisCreate(element, "this.__domrender_components.".concat(componentKey), '', true, obj, config);
                return data;
            },
            // complete
        };
        return targetElement;
    };
    RawSet.exporesionGrouops = function (data) {
        // const reg = /(?:[$#]\{(?:(([$#]\{)??[^$#]*?)\}[$#]))/g;
        var reg = /(?:[$#]\{(?:(([$#]\{)??[^$#]?[^{]*?)\}[$#]))/g;
        return StringUtils.regexExec(reg, data);
    };
    RawSet.DR = 'dr';
    RawSet.DR_IF_NAME = 'dr-if';
    RawSet.DR_FOR_NAME = 'dr-for';
    RawSet.DR_FOR_OF_NAME = 'dr-for-of';
    RawSet.DR_REPEAT_NAME = 'dr-repeat';
    RawSet.DR_THIS_NAME = 'dr-this';
    RawSet.DR_FORM_NAME = 'dr-form';
    RawSet.DR_PRE_NAME = 'dr-pre';
    RawSet.DR_INNERHTML_NAME = 'dr-inner-html';
    RawSet.DR_INNERTEXT_NAME = 'dr-inner-text';
    RawSet.DR_DETECT_NAME = 'dr-detect';
    RawSet.DR_IT_OPTIONNAME = 'dr-it';
    RawSet.DR_VAR_OPTIONNAME = 'dr-var';
    RawSet.DR_AFTER_OPTIONNAME = 'dr-after';
    RawSet.DR_BEFORE_OPTIONNAME = 'dr-before';
    RawSet.DR_COMPLETE_OPTIONNAME = 'dr-complete';
    RawSet.DR_STRIP_OPTIONNAME = 'dr-strip';
    RawSet.drAttrsOriginName = {
        dr: RawSet.DR,
        drIf: RawSet.DR_IF_NAME,
        drFor: RawSet.DR_FOR_NAME,
        drForOf: RawSet.DR_FOR_OF_NAME,
        drRepeat: RawSet.DR_REPEAT_NAME,
        drThis: RawSet.DR_THIS_NAME,
        drForm: RawSet.DR_FORM_NAME,
        drPre: RawSet.DR_PRE_NAME,
        drInnerHTML: RawSet.DR_INNERHTML_NAME,
        drInnerText: RawSet.DR_INNERTEXT_NAME,
        drItOption: RawSet.DR_IT_OPTIONNAME,
        drVarOption: RawSet.DR_VAR_OPTIONNAME,
        drAfterOption: RawSet.DR_AFTER_OPTIONNAME,
        drBeforeOption: RawSet.DR_BEFORE_OPTIONNAME,
        drCompleteOption: RawSet.DR_COMPLETE_OPTIONNAME,
        drStripOption: RawSet.DR_STRIP_OPTIONNAME,
    };
    RawSet.DR_TAGS = [];
    RawSet.DR_ATTRIBUTES = [RawSet.DR, RawSet.DR_IF_NAME, RawSet.DR_FOR_OF_NAME, RawSet.DR_FOR_NAME, RawSet.DR_THIS_NAME, RawSet.DR_FORM_NAME, RawSet.DR_PRE_NAME, RawSet.DR_INNERHTML_NAME, RawSet.DR_INNERTEXT_NAME, RawSet.DR_REPEAT_NAME, RawSet.DR_DETECT_NAME];
    return RawSet;
}());

var excludeGetSetPropertys = ['onBeforeReturnGet', 'onBeforeReturnSet', '__domrender_components', '__render', '_DomRender_isFinal', '_domRender_ref', '_rawSets', '_domRender_proxy', '_targets', '_DomRender_origin', '_DomRender_ref', '_DomRender_proxy'];
var DomRenderProxy = /** @class */ (function () {
    function DomRenderProxy(_domRender_origin, target, config) {
        this._domRender_origin = _domRender_origin;
        this.config = config;
        this._domRender_ref = new Map();
        this._rawSets = new Map();
        this._targets = new Set();
        if (target) {
            this._targets.add(target);
        }
    }
    DomRenderProxy.unFinal = function (obj) {
        return DomRenderFinalProxy.unFinal(obj);
    };
    DomRenderProxy.final = function (obj) {
        return DomRenderFinalProxy.final(obj);
    };
    DomRenderProxy.isFinal = function (obj) {
        return DomRenderFinalProxy.isFinal(obj);
    };
    DomRenderProxy.prototype.run = function (objProxy) {
        var _this = this;
        this._domRender_proxy = objProxy;
        var obj = objProxy._DomRender_origin;
        if (obj) {
            Object.keys(obj).forEach(function (it) {
                var _a, _b;
                // console.log('key-------->', it)
                var target = obj[it];
                if (target !== undefined && target !== null && typeof target === 'object' && !DomRenderProxy.isFinal(target) && !Object.isFrozen(target) && !(obj instanceof Shield)) {
                    // console.log('target-------->', it, target);
                    // console.count('target')
                    // console.log('target-------->')
                    var filter = (_b = (_a = _this.config.proxyExcludeTyps) === null || _a === void 0 ? void 0 : _a.filter(function (it) { return target instanceof it; })) !== null && _b !== void 0 ? _b : [];
                    if (filter.length === 0) {
                        var proxyAfter = _this.proxy(objProxy, target, it);
                        obj[it] = proxyAfter;
                    }
                }
            });
        }
        this._targets.forEach(function (target) {
            _this.initRender(target);
        });
    };
    DomRenderProxy.prototype.initRender = function (target) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g;
        var onCreate = (_b = (_a = target).getAttribute) === null || _b === void 0 ? void 0 : _b.call(_a, 'dr-on-create');
        var createParam = undefined;
        if (onCreate) {
            createParam = ScriptUtils.evalReturn(onCreate, this._domRender_proxy);
        }
        (_d = (_c = this._domRender_proxy) === null || _c === void 0 ? void 0 : _c.onCreateRender) === null || _d === void 0 ? void 0 : _d.call(_c, createParam);
        var innerHTML = (_e = target.innerHTML) !== null && _e !== void 0 ? _e : '';
        this._targets.add(target);
        var rawSets = RawSet.checkPointCreates(target, this.config);
        eventManager.applyEvent(this._domRender_proxy, eventManager.findAttrElements(target, this.config), this.config);
        rawSets.forEach(function (it) {
            var variables = it.getUsingTriggerVariables(_this.config);
            if (variables.size <= 0) {
                _this.addRawSet('', it);
            }
            else {
                variables.forEach(function (sit) {
                    _this.addRawSet(sit, it);
                });
            }
        });
        this.render(this.getRawSets());
        var render = { target: target };
        var creatorMetaData = {
            creator: this._domRender_proxy,
            rootCreator: this._domRender_proxy,
            innerHTML: innerHTML,
        };
        (_g = (_f = this._domRender_proxy) === null || _f === void 0 ? void 0 : _f.onInitRender) === null || _g === void 0 ? void 0 : _g.call(_f, { render: render, creatorMetaData: creatorMetaData });
    };
    DomRenderProxy.prototype.getRawSets = function () {
        var set = new Set();
        this._rawSets.forEach(function (v, k) {
            v.forEach(function (it) { return set.add(it); });
        });
        return Array.from(set);
    };
    DomRenderProxy.prototype.render = function (raws) {
        var _this = this;
        var removeRawSets = [];
        (raws !== null && raws !== void 0 ? raws : this.getRawSets()).forEach(function (it) {
            it.getUsingTriggerVariables(_this.config).forEach(function (path) { return _this.addRawSet(path, it); });
            if (it.point.start.isConnected && it.point.start.isConnected) {
                var rawSets = it.render(_this._domRender_proxy, _this.config);
                if (rawSets && rawSets.length > 0) {
                    _this.render(rawSets);
                }
            }
            else {
                removeRawSets.push(it);
                // this.removeRawSet(it)
            }
        });
        if (removeRawSets.length > 0) {
            this.removeRawSet.apply(this, removeRawSets);
        }
    };
    DomRenderProxy.prototype.root = function (paths, value, lastDoneExecute) {
        var _this = this;
        if (lastDoneExecute === void 0) { lastDoneExecute = true; }
        // console.log('root--->', paths, value, this._domRender_ref, this._domRender_origin);
        var fullPaths = [];
        if (this._domRender_ref.size > 0) {
            this._domRender_ref.forEach(function (it, key) {
                if ('_DomRender_isProxy' in key) {
                    it.forEach(function (sit) {
                        var _a;
                        var items = (_a = key._DomRender_proxy) === null || _a === void 0 ? void 0 : _a.root(paths.concat(sit), value, lastDoneExecute);
                        fullPaths.push(items.join(','));
                    });
                }
            });
        }
        else {
            var strings = paths.reverse();
            // const fullPathStr = strings.join('.');
            var fullPathStr_1 = strings.map(function (it) { return isNaN(Number(it)) ? '.' + it : "[".concat(it, "]"); }).join('').slice(1);
            if (lastDoneExecute) {
                var iterable = this._rawSets.get(fullPathStr_1);
                // array check
                var front = strings.slice(0, strings.length - 1).map(function (it) { return isNaN(Number(it)) ? '.' + it : "[".concat(it, "]"); }).join('');
                // front = front.replace(/\.\[/g, '[');
                // const front = strings.slice(0, strings.length - 1).join('.');
                // front = front.replace(/\.\[/g, '[');
                var last = strings[strings.length - 1];
                // console.log('root-else-->', fullPathStr, iterable, front, last)
                // if (!isNaN(Number(last)) && Array.isArray(ScriptUtils.evalReturn('this' + front, this._domRender_proxy))) {
                if (last === 'length' && Array.isArray(ScriptUtils.evalReturn('this' + front, this._domRender_proxy))) {
                    var aIterable = this._rawSets.get(front.slice(1));
                    if (aIterable) {
                        this.render(Array.from(aIterable));
                    }
                }
                else if (iterable) {
                    this.render(Array.from(iterable));
                }
                this._targets.forEach(function (it) {
                    if (it.nodeType === Node.DOCUMENT_FRAGMENT_NODE || it.nodeType === Node.ELEMENT_NODE) {
                        var targets = eventManager.findAttrElements(it, _this.config);
                        eventManager.changeVar(_this._domRender_proxy, targets, "this.".concat(fullPathStr_1), _this.config);
                    }
                });
            }
            fullPaths.push(fullPathStr_1);
        }
        return fullPaths;
    };
    DomRenderProxy.prototype.set = function (target, p, value, receiver) {
        var _a, _b, _c;
        if (typeof p === 'string' && p !== '__domrender_components' && excludeGetSetPropertys.includes(p)) {
            target[p] = value;
            return true;
        }
        // console.log('set proxy-->', target, p, value, this._rawSets, this._domRender_ref)
        // if (typeof p === 'string' && '__render' === p) {
        //     (target as any)[p] = value;
        //     return true;
        // }
        // console.log('set--?', p, target, value);
        if (typeof p === 'string') {
            value = this.proxy(receiver, value, p);
        }
        target[p] = value;
        var fullPath;
        if (typeof p === 'string') {
            fullPath = this.root([p], value);
        }
        if (('onBeforeReturnSet' in receiver) && typeof p === 'string' && !((_a = this.config.proxyExcludeOnBeforeReturnSets) !== null && _a !== void 0 ? _a : []).concat(excludeGetSetPropertys).includes(p)) {
            (_c = (_b = receiver) === null || _b === void 0 ? void 0 : _b.onBeforeReturnSet) === null || _c === void 0 ? void 0 : _c.call(_b, p, value, fullPath);
        }
        return true;
    };
    DomRenderProxy.prototype.get = function (target, p, receiver) {
        var _a, _b, _c;
        // console.log('get-->', target, p, receiver);
        if (p === '_DomRender_origin') {
            return this._domRender_origin;
        }
        else if (p === '_DomRender_ref') {
            return this._domRender_ref;
        }
        else if (p === '_DomRender_proxy') {
            return this;
        }
        else {
            // Date라던지 이런놈들은-_-프록시가 이상하게 동작해서
            // console.log('--->', p, target, target.bind, 'bind' in target)
            // if ((p in target) && ('bind' in target)) {
            //     try{
            //     return (target as any)[p].bind(target);
            //     }catch (e) {
            //         console.error(e)
            //     }
            // } else {
            //     return (target as any)[p]
            // }
            // return (p in target) ? (target as any)[p].bind(target) : (target as any)[p]
            // console.log('-->', p, Object.prototype.toString.call((target as any)[p]), (target as any)[p])
            // return (target as any)[p]
            var it_1 = target[p];
            if (it_1 && typeof it_1 === 'object' && ('_DomRender_isProxy' in it_1) && Object.prototype.toString.call(it_1._DomRender_origin) === '[object Date]') {
                it_1 = it_1._DomRender_origin;
            }
            if (('onBeforeReturnGet' in receiver) && typeof p === 'string' && !((_a = this.config.proxyExcludeOnBeforeReturnGets) !== null && _a !== void 0 ? _a : []).concat(excludeGetSetPropertys).includes(p)) {
                (_c = (_b = receiver) === null || _b === void 0 ? void 0 : _b.onBeforeReturnGet) === null || _c === void 0 ? void 0 : _c.call(_b, p, it_1, this.root([p], it_1, false));
            }
            return it_1;
        }
    };
    DomRenderProxy.prototype.has = function (target, p) {
        return p === '_DomRender_isProxy' || p in target;
    };
    DomRenderProxy.prototype.proxy = function (parentProxy, obj, p) {
        var _a, _b;
        var proxyTarget = ((_b = (_a = this.config.proxyExcludeTyps) === null || _a === void 0 ? void 0 : _a.filter(function (it) { return obj instanceof it; })) !== null && _b !== void 0 ? _b : []).length <= 0;
        if (proxyTarget && obj !== undefined && obj !== null && typeof obj === 'object' && !('_DomRender_isProxy' in obj) && !DomRenderProxy.isFinal(obj) && !Object.isFrozen(obj) && !(obj instanceof Shield)) {
            var domRender = new DomRenderProxy(obj, undefined, this.config);
            domRender.addRef(parentProxy, p);
            var proxy = new Proxy(obj, domRender);
            domRender.run(proxy);
            return proxy;
        }
        if (proxyTarget && obj !== undefined && obj !== null && typeof obj === 'object' && ('_DomRender_isProxy' in obj) && !DomRenderProxy.isFinal(obj) && !Object.isFrozen(obj) && !(obj instanceof Shield)) {
            var d = obj._DomRender_proxy;
            d.addRef(this._domRender_proxy, p);
            return obj;
        }
        else {
            return obj;
        }
    };
    DomRenderProxy.prototype.addRef = function (parent, path) {
        var _a;
        if (!this._domRender_ref.get(parent)) {
            this._domRender_ref.set(parent, new Set());
        }
        (_a = this._domRender_ref.get(parent)) === null || _a === void 0 ? void 0 : _a.add(path);
    };
    DomRenderProxy.prototype.addRawSetAndRender = function (path, rawSet) {
        this.addRawSet(path, rawSet);
        this.render([rawSet]);
    };
    DomRenderProxy.prototype.addRawSet = function (path, rawSet) {
        var _a;
        // console.log('addRawSet-->', path, rawSet)
        if (!this._rawSets.get(path)) {
            this._rawSets.set(path, new Set());
        }
        (_a = this._rawSets.get(path)) === null || _a === void 0 ? void 0 : _a.add(rawSet);
    };
    // public removeRawSet(...raws: RawSet[]) {
    //     this._rawSets.forEach(it => {
    //         raws.forEach(sit => it.delete(sit));
    //     })
    //     this.garbageRawSet();
    // }
    DomRenderProxy.prototype.removeRawSet = function () {
        var raws = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            raws[_i] = arguments[_i];
        }
        this._rawSets.forEach(function (it) {
            it.forEach(function (sit) {
                if (!sit.isConnected) {
                    it.delete(sit);
                }
                else if (raws.includes(sit)) {
                    it.delete(sit);
                }
            });
        });
        this.targetGarbageRawSet();
    };
    DomRenderProxy.prototype.targetGarbageRawSet = function () {
        var _this = this;
        this._targets.forEach(function (it) {
            if (!it.isConnected) {
                _this._targets.delete(it);
            }
        });
    };
    DomRenderProxy.prototype.garbageRawSet = function () {
        var _this = this;
        this._targets.forEach(function (it) {
            if (!it.isConnected) {
                _this._targets.delete(it);
            }
        });
        this._rawSets.forEach(function (it) {
            it.forEach(function (sit) {
                if (!sit.isConnected) {
                    it.delete(sit);
                }
            });
        });
    };
    return DomRenderProxy;
}());

var DomRender = /** @class */ (function () {
    function DomRender() {
    }
    DomRender.run = function (obj, target, config) {
        var robj = obj;
        if ('_DomRender_isProxy' in obj) {
            if (target) {
                obj._DomRender_proxy.initRender(target);
            }
            robj = obj;
            return robj;
        }
        if (!config) {
            config = { window: window };
        }
        var domRender = new DomRenderProxy(obj, target, config);
        var dest = new Proxy(obj, domRender);
        robj = dest;
        domRender.run(robj);
        return robj;
    };
    return DomRender;
}());
// export default DomRender;

exports.DomRender = DomRender;
//# sourceMappingURL=bundle.js.map
