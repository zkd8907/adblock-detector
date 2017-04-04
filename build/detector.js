/*
 * @Author: Kaidong Zhang 
 * @Date: 2017-04-04 16:08:25 
 * @Last Modified by: Kaidong Zhang
 * @Last Modified time: 2017-04-04 16:30:49
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    /**
     * AdBlock插件中通用的ClassName特征
     * @type {string} 特征类名
     */
    var _characteristic = ['ad-left-down', 'ad300left', 'gg_950', 'yd_ad2'].join(' ');

    var exports = {};

    if ((typeof define === 'undefined' ? 'undefined' : _typeof(define)) === 'object' && typeof define.cmd === 'function') {
        // TODO: Support CMD and AMD
    } else {
        window.adBlockDetector = exports;
    }

    /**
     * 创建DIV元素用于检测当前页面是否有启用AdBlock
     * @param className 特征类名
     * @returns {boolean} 返回一个布尔值，用于检测当前DIV是否创建成功
     */
    var _createDivForDetecting = function _createDivForDetecting(className, callback) {
        var div = document.createElement('div');
        div.className = className;
        div.style.cssText = 'width: 1px; height: 1px; position: absolute; left: -1px; top: -1px;';
        div.tabIndex = Number.MAX_SAFE_INTEGER;
        document.body.appendChild(div);
        (function (_div) {
            setTimeout(function () {
                var isBlocked = _div.offsetHeight === 0 && _div.offsetWidth === 0;

                document.body.removeChild(_div);
                callback(isBlocked);
            }, 100);
        })(div);
    };

    /**
     * 更新自定义特征库
     */
    exports.updateCharacteristic = function (newCharacteristic) {
        _characteristic = newCharacteristic;
    };

    /**
     * 检测当前浏览器是否启用AdBlock
     */
    exports.detect = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var threshold = 1,
            callback = void 0;
        if (args.length === 1) {
            callback = args[0];
        } else if (args.length === 2) {
            if (parseFloat(args[0].toString()) === args[0]) {
                threshold = args[0];
            }
            callback = args[1];
        }

        if (typeof callback !== 'function') {
            throw new Error('callback must be a function.');
        }
        var characteristicArray = _characteristic.split(' ').filter(function (str) {
            return str.length > 0;
        }),
            characteristicLength = characteristicArray.length,
            blockedCount = 0,
            i = 0;

        var waitSignalFunction = function waitSignalFunction(isBlocked) {
            if (isBlocked) {
                blockedCount++;
            }
            if (++i === characteristicLength) {
                _typeof(callback.apply(exports, [blockedCount / characteristicLength >= threshold]));
            }
        };

        characteristicArray.forEach(function (className) {
            _createDivForDetecting(className, waitSignalFunction);
        });
    };
})();