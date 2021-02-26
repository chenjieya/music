; (function (root) {


    // 渲染唱片
    function renderSongImg(src) {
        root.blurImg(src);  // 高斯模糊

        let img = document.querySelector('.songImg img');
        img.src = src;
    }
    // 歌曲、作者、专辑
    function renderSongInfo(info) {
        let song = document.querySelector('.songInfo .name');
        let singer = document.querySelector('.songInfo .singer');
        let album = document.querySelector('.songInfo .album');

        song.innerHTML = info.name;
        singer.innerHTML = info.singer;
        album.innerHTML = info.album;
    }

    // 渲染总时间
    function renderTimer(total) {
        let totalTime = document.querySelectorAll('.totalTime span');
        let minute = parseInt(total / 60);
        let second = parseInt(total % 60);
        minute = minute<10?'0'+minute:minute;
        second = second<10?'0'+second:second;

        totalTime[0].innerHTML = minute;
        totalTime[1].innerHTML = second;
        return total;
    }

    function renderControl(isLike) {
        let li = document.querySelectorAll('.control li')[0];
        isLike ? li.className = 'liking' : li.className = '';
    }


    root.render = function (data) {
        renderSongImg(data.image);
        renderSongInfo(data);
        renderControl(data.isLike);
        return renderTimer(data.duration);
    };
})(window.player || (window.player = {}))