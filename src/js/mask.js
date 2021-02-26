; (function (root) {

    // 动态创建dd标签(歌曲列表)
    function list(data) {
        const mask = document.querySelector('.mask');
        const dl = document.querySelector('.mask dl');
        const musicList = [];

        // 动态创建歌单列表
        data.forEach(function (item) {
            let dd = document.createElement('dd');
            dd.innerHTML = item.name;
            dl.appendChild(dd);
            musicList.push(dd);
        })

        changeSelect(0);  //默认第一个选中

        // 切换选中的元素
        function changeSelect(index) {
            for (let i = 0; i < musicList.length; i++) {
                musicList[i].className = '';
            }
            musicList[index].className = 'activeColor';
        }

        // 上拉样式
        function slideUp() {
            mask.style.transition = '.2s';
            mask.style.transform = `translate(0)`;
        }

        // 下滑样式
        function slideDown() {
            mask.style.transition = '.2s';
            mask.style.transform = `translateY(100%)`;
        }

        return {
            musicList,
            changeSelect,
            slideUp,
            slideDown
        }
    }


    root.list = list;

})(window.player || (window.player = {}))    