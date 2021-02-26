; (function () {
    function Music() {

        // this.currentSing = 0;  // 当前第几首歌曲
        this.dataList = [];
        this.rotateTimer = null;
        this.maskObj = null;  //切歌列表
        this.toggleIndex = null;  //切歌对象，里面的index属性就是当前播放的索引

        this.curIndex = 0;  //储存当前歌曲的索引值
        this.dragTimer = null;   //进度条
    }

    Music.prototype = {
        // 初始化函数
        init: function () {
            this.getData('../mock/data.json');
            this.getDom();
            this.bindEvent();
            this.over();
        },
        // 发送请求
        getData: function (url) {
            const _self = this;
            $.ajax({
                url: url,
                method: 'get',
                success: function (data) {
                    _self.dataList = data;
                    _self.maskObj = player.list(data); //歌单列表返回的操作
                    _self.listPlay();   //切歌
                    _self.toggleIndex = new player.toggle(data.length); //切换歌曲返回的操作
                    _self.loadMusic(_self.toggleIndex.index);  //加载歌曲
                },
                error: function () {
                    console.log('数据请求失败');
                }
            })
        },

        // 获取dom元素
        getDom: function () {
            this.songImg = document.querySelector('.songImg');
            this.arrow_l = document.querySelector('.control li:nth-child(2)');
            this.arrow_m = document.querySelector('.control li:nth-child(3)');
            this.arrow_r = document.querySelector('.control li:nth-child(4)');
            this.list = document.querySelector('.control li:nth-child(5)');
            this.close = document.querySelector('.close');
            this.progress = document.querySelector('.drag');
            this.currentTime = document.querySelector('.currentTime');
            this.frontBg = document.querySelector('.frontBg');
            this.circle = document.querySelector('.circle');
        },

        // 加载音乐
        loadMusic: function (now) {
            const _self = this;
            // 渲染图片等信息
            this.totalTime = player.render(this.dataList[now]);

            // 加载音乐
            window.player.music.load(this.dataList[now].audioSrc);

            if (window.player.music.status == 'play') {
                window.player.music.play();
                this.arrow_m.className = 'playing';
                this.list.className = 'active';
                // 旋转图片
                this.imgRotate(0);
                this.drag(now);


            }

            this.maskObj.changeSelect(now);  // 每一次切完歌就改变一下列表里默认的样式
            this.curIndex = now;   //储存当前歌曲的索引值

        },

        // 绑定事件
        bindEvent: function () {
            const _self = this;
            this.arrow_l.addEventListener('touchend', function () {
                // 切换上一首
                window.player.music.status = 'play';
                _self.loadMusic(_self.toggleIndex.prev());
            })

            this.arrow_m.addEventListener('touchend', function () {
                // 播放，暂停
                if (window.player.music.status == 'play') {
                    player.music.pause();
                    this.className = '';
                    _self.list.className = '';
                    clearInterval(_self.rotateTimer);
                    clearInterval(_self.dragTimer);
                } else {
                    player.music.play();
                    this.className = 'playing';
                    _self.list.className = 'active';
                    let deg = _self.songImg.dataset.rotate || 0;
                    _self.imgRotate(deg);
                    _self.drag(_self.toggleIndex.index);
                }
            })


            this.arrow_r.addEventListener('touchend', function () {
                // 切换下一首
                window.player.music.status = 'play';
                _self.loadMusic(_self.toggleIndex.next());
            })

            this.list.addEventListener('touchend', function () {
                // 歌单列表划上来
                _self.maskObj.slideUp();
            })

            this.close.addEventListener('touchend', function () {
                _self.maskObj.slideDown();
            })

            this.progress.addEventListener('touchstart', function (e) {
                // 点击进度条，调节歌曲进度
                let width = this.offsetWidth;
                let clickWidth = e.touches[0].pageX - this.offsetLeft;
                let targetTime = clickWidth / width * _self.totalTime;
                player.music.playTo(targetTime);

                _self.drag(_self.toggleIndex.index);

            })

        },

        // 旋转图片
        imgRotate: function (deg) {
            const _self = this;
            clearInterval(this.rotateTimer);
            this.rotateTimer = setInterval(function () {
                deg = +deg + 0.2;
                _self.songImg.style.transform = `rotate(${deg}deg)`;
                // 设置一个自定义属性，来存储当前转的角度
                _self.songImg.dataset.rotate = deg;
            }, 1000 / 60);
        },

        // 列表切换歌
        listPlay: function () {
            const _self = this;
            this.maskObj.musicList.forEach(function (item, index) {
                item.addEventListener('touchend', function () {
                    if (_self.curIndex == index) {   //如果点击的当前歌曲，不做任何处理
                        return;
                    }
                    player.music.status = 'play';
                    _self.toggleIndex.index = index; //更新一下当前歌曲的索引值
                    _self.loadMusic(index);
                    _self.maskObj.slideDown(); //点击完让列表页下拉
                })
            })
        },

        // 进度条
        drag: function (index) {
            const _self = this;
            clearInterval(this.dragTimer);
            this.dragTimer = setInterval(function () {
                let total = _self.dataList[index].duration;
                let nowTime = player.music.audio.currentTime;
                let minute = parseInt(nowTime / 60);
                let second = parseInt(nowTime % 60);
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                _self.currentTime.innerHTML = minute + ':' + second;
                let prosWidth = nowTime / total * _self.progress.offsetWidth;
                _self.frontBg.style.width = prosWidth + 'px';
                // 因为一开始的left是-3vw，当我们的长度是0的时候，他们之间会有一个距离
                _self.circle.style.left = prosWidth - 8 + 'px';
            }, 1000);
        },

        //播放完成
        over: function () {
            const _self = this;
            // 播放完成
            player.music.end(function () {
                clearInterval(_self.rotateTimer); //清除图片定时器
                clearInterval(_self.dragTimer);  // 清除进度条定时器
            })
        }
    }


    new Music().init();

})()