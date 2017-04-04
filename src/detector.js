/*
 * @Author: Kaidong Zhang 
 * @Date: 2017-04-04 16:08:25 
 * @Last Modified by: Kaidong Zhang
 * @Last Modified time: 2017-04-04 16:30:49
 */
'use strict';

(function(){
    /**
     * AdBlock插件中通用的ClassName特征
     * @type {string} 特征类名
     */
    let _characteristic = [
        'ad-left-down',
        'ad300left',
        'gg_950',
        'yd_ad2',
    ].join(' ');

    const exports = {};

    if(typeof define === 'function' &&
        (define.amd !== 'undefined' || define.cmd !== 'undefined')){
        define(exports);
    }else{
        window.adBlockDetector = exports;
    }

    /**
     * 创建DIV元素用于检测当前页面是否有启用AdBlock
     * @param className 特征类名
     * @returns {boolean} 返回一个布尔值，用于检测当前DIV是否创建成功
     */
    const _createDivForDetecting = (className, callback) => {
        let div = document.createElement('div');
        div.className = className;
        div.style.cssText = 'width: 1px; height: 1px; position: absolute; left: -1px; top: -1px;';
        div.tabIndex = Number.MAX_SAFE_INTEGER;
        document.body.appendChild(div);
        ((_div)=>{
            setTimeout(() => {
                let isBlocked = _div.offsetHeight === 0 &&
                    _div.offsetWidth === 0;

                document.body.removeChild(_div);
                callback(isBlocked);
            }, 100);
        })(div);
    };

    /**
     * 更新自定义特征库
     */
    exports.updateCharacteristic = (newCharacteristic) => {
        _characteristic = newCharacteristic;
    };

    /**
     * 检测当前浏览器是否启用AdBlock
     */
    exports.detect = (...args) => {
        let threshold = 1,
            callback;
        if(args.length === 1){
            callback = args[0];
        }else if(args.length === 2){
            if(parseFloat(args[0].toString()) === args[0]){
                threshold = args[0];
            }
            callback = args[1];
        }

        if(typeof callback !== 'function'){
            throw new Error('callback must be a function.');
        }
        let characteristicArray = _characteristic.split(' ').filter(str => str.length > 0),
            characteristicLength = characteristicArray.length,
            blockedCount = 0,
            i = 0;

        const waitSignalFunction = (isBlocked) => {
            if(isBlocked) { blockedCount++; }
            if(++i === characteristicLength){
                typeof callback.apply(exports, [
                    (blockedCount / characteristicLength) >= threshold
                ]);
            }
        };

        characteristicArray.forEach((className) => {
            _createDivForDetecting(className, waitSignalFunction);
        });
    };
})();