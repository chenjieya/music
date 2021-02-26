; (function (root) {
    function MusicManage() {
        this.audio = new Audio();
        this.status = 'pause'; //默认状态是暂停
    }
    MusicManage.prototype = {
        // 加载音乐
        load: function (src) {
            this.audio.src = src;
            this.audio.load();  //加载音乐
        },
        play: function () {
            this.audio.play(); // 播放音乐
            this.status = 'play';
        },
        pause: function () {
            this.audio.pause();  //暂停音乐
            this.status = 'pause';
        },
        // 音乐播放完成事件
        end: function (fn) {
            this.audio.onended = fn;
        },
        // 调到音乐的某个时间点
        playTo: function (time) {
            this.audio.currentTime = time;
        }
    }


    root.music = new MusicManage();


})(window.player || (window.player = {}))