; (function (root) {
    function Toggle(len) {
        this.index = 0;  //默认是第一手歌
        this.len = len;  //用户传进来的歌的个数  0,1,2,3
    }

    Toggle.prototype = {
        // 上一首
        prev() {
            return this.get(-1);
        },
        next() {
            return this.get(1);
        },
        get(val) {
            // 小技巧(0  -  长度-1 之间)
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }

    root.toggle = Toggle;


})(window.player || (window.player = {}))