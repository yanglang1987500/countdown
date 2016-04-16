/**
 * Created by sniyve on 2016/4/16.
 * 倒计时小插件
 */
(function(){
    var Events = {},
        toBeNotify = [],
        EVENT_PREFIX = 'TEMPORARYEVENT';//临时事件名称前缀，后缀为_+时间缀

    var Event = window.Event = {
        /**
         * 触发一个事件
         * @method notify
         * @param eventName 事件名称
         * @param data 事件数据 PS：现在支持变参，除了eventName,data以外还可以添加任意参数
         * @returns {AppInterface}
         */
        notify: function (eventName, data) {
            var eventList = Events[eventName], i = 0;
            if (eventList) {
                var len = eventList.length;
                for (; i < len; i++) {
                    eventList[i].apply(this, toBeNotify.slice.call(arguments, 1));
                }
            } else {
                toBeNotify.push({
                    eventName: eventName,
                    data: toBeNotify.slice.call(arguments, 1),
                    scope: this
                });//暂时存入待触发列表
            }
            //若为临时事件，则通知一次之后马上注销
            if (new RegExp('^' + EVENT_PREFIX + '(_\\d+)$').test(eventName))
                this.unsubscribe(eventName);
            return this;
        },
        /**
         * 给定作用域触发一个事件
         * @param eventName 事件名称
         * @param scope 作用域
         * @param data 事件数据，支持变参
         */
        notifyWith: function (eventName, scope, data) {
            if (arguments.length < 2)
                throw new TypeError('按作用域触发事件请提供事件名称与作用域');
            this.notify.apply(scope, [eventName].concat(toBeNotify.slice.call(arguments, 2)));
        },
        /**
         * 订阅一个事件
         * @method subscribe
         * @param eventName 事件名称
         * @param callback 事件回调
         */
        subscribe: function (eventName, callback) {
            var i = 0, len = toBeNotify.length;
            if (arguments.length < 2)
                throw new TypeError('订阅事件请提供事件名称与事件回调');

            var eventList = Events[eventName] ? Events[eventName] : (Events[eventName] = []);
            eventList = Object.prototype.toString.call(callback) === '[object Array]' ? eventList.concat(callback) : eventList.push(callback);
            for (; i < len; i++) {
                if (toBeNotify[i].eventName === eventName) {
                    //移除并触发之前已准备触发的事件
                    this.notify.apply(toBeNotify[i].scope, [eventName].concat(toBeNotify[i].data));
                    toBeNotify.splice(i, 1);
                    break;
                }
            }
            return this;
        },
        /**
         * 取消订阅事件
         * @method unsubscribe
         * @param eventName 事件名称
         */
        unsubscribe: function (eventName, callback) {
            if (callback) {
                var callbacks = Events[eventName];
                for (var i = 0; i < callbacks.length; i++) {
                    if (callbacks[i] === callback) {
                        callbacks.splice(i--, 1);
                    }
                }
            } else
                delete Events[eventName];
            return this;
        }
    };

    var timer = null;

    /**
     * 绑定在jQuery对象上的countDown方法
     * @param deadline 截止时间
     * @param domParam dom对象参数包
     */
    $.countDown = function(deadline,domParam){
        var that = this,MILLS_OFFSET = 15;
        function CountDown(){
            this.deadline = deadline;
            this.domParam = domParam;
        };
        CountDown.prototype = {
            /**
             * 在单位数前补0
             * @param n
             * @returns {string}
             */
            zero: function(n){
                var n = parseInt(n, 10);
                return n > 0?
                    n <= 9?('0'+n):(n+''):'00';
            },
            /**
             * 计算时差
             * @returns {{sec: string, mini: string, hour: string, day: string, month: string, year: string}}
             */
            caculate: function(){
                var now = new Date();
                var dur = Math.round((this.deadline - now.getTime()) / 1000), pms = {
                    sec: "00",
                    mini: "00",
                    hour: "00",
                    day: "00",
                    month: "00",
                    year: "0"
                };
                if(dur > 0){
                    pms.sec = this.zero(dur % 60);
                    pms.mini = Math.floor((dur / 60)) > 0? this.zero(Math.floor((dur / 60)) % 60) : "00";
                    pms.hour = Math.floor((dur / 3600)) > 0? this.zero(Math.floor((dur / 3600)) % 24) : "00";
                    pms.day = Math.floor((dur / 86400)) > 0? this.zero(Math.floor((dur / 86400)) % 30) : "00";
                    pms.month = Math.floor((dur / 2629744)) > 0? this.zero(Math.floor((dur / 2629744)) % 12) : "00";
                    pms.year = Math.floor((dur / 31556926)) > 0? Math.floor((dur / 31556926)) : "0";
                }
                return pms;
            },
            /**
             * 刷新界面
             */
            refresh: function(){
                (this.domParam.sec)&&$(this.domParam.sec).html(this.caculate().sec);
                (this.domParam.mini)&&$(this.domParam.mini).html(this.caculate().mini);
                (this.domParam.hour)&&$(this.domParam.hour).html(this.caculate().hour);
                (this.domParam.day)&&$(this.domParam.day).html(this.caculate().day);
                (this.domParam.month)&&$(this.domParam.month).html(this.caculate().month);
                (this.domParam.year)&&$(this.domParam.year).html(this.caculate().year);
            }
        };
        var countDown = new CountDown();

        /**
         * 启动定时器
         * @param first 是否首次进入
         */
        function startTimer(first){
            !first&&Event.notify('TIMER');
            //若是首次进入，则根据当前时间的毫秒数进行纠偏，延迟1000-当前毫秒数达到整数秒后开始更新UI
            //否则直接1秒后更新UI
            //若当前毫秒数大于MILLS_OFFSET 15，则修正延时数值与系统时间同步
            mills = new Date().getMilliseconds();
            timer = setTimeout(arguments.callee,first?(1000 -mills):(mills>MILLS_OFFSET?(1000-mills):1000));
            console.log(new Date().getMilliseconds());
        }

        /**
         * 订阅一次事件
         */
        Event.subscribe('TIMER',countDown.refresh.bind(countDown));

        //首次初始化时启动定时器
        !timer && startTimer(true);

    };
})();
