/*:
 * @target     MZ
 * @plugindesc v1.1 随时跳出正在播放的影像，并可显示影像播放倒计时。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：在插件参数中设置好相应参数即可。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210927 v1.1
 *     增加了“是否触摸屏幕跳过”参数，修复了部分Android设备点击屏幕报错的Bug。
 * -- 20210919 v1.0
 *     实现插件基本功能。
 *
 * * 致谢说明：
 * 1、感谢B站用户 波了个板了个糖 关于Android设备点击屏幕报错的Bug反馈。
 *
 * |\      /|          _
 * |-\____/-|         //
 * |        |        //
 * |  O O   |_______//
 *  \__^___/         \
 *    |              |
 *    / __  ______   \
 *   / /  \ \    / /\ \
 *  /_/    \_\  /_/  \_\
 *
 * @param   isClickScreenSkip
 * @text    是否鼠标点击屏幕跳过
 * @type    boolean
 * @default true
 *
 * @param   isPressEscSkip
 * @text    是否敲击Esc按键跳过
 * @type    boolean
 * @default true
 *
 * @param   isOnTouchSkip
 * @text    是否触摸屏幕跳过（移动设备）
 * @type    boolean
 * @default true
 *
 * @param   isShowCountdownText
 * @text    是否显示视频倒计时
 * @type    boolean
 * @default true
 */

var P_2D_C = P_2D_C || {};

(() => {
    var params = PluginManager.parameters('2D_Cat_SkipMovieInTheGame');

    P_2D_C.isClickScreenSkip   = String(params.isClickScreenSkip)   === 'true';
    P_2D_C.isPressEscSkip      = String(params.isPressEscSkip)      === 'true';
    P_2D_C.isOnTouchSkip       = String(params.isOnTouchSkip)       === 'true';
    P_2D_C.isShowCountdownText = String(params.isShowCountdownText) === 'true';

    let countdownText = null;

    function createCountdownText() {
        countdownText                  = document.createElement('div');
        countdownText.id               = 'CountdownText';
        countdownText.textContent      = '';
        countdownText.style.zIndex     = '10';
        countdownText.style.position   = 'absolute';
        countdownText.style.color      = '#ffffff';
        countdownText.style.textShadow = '2px 2px 4px #000000';
        countdownText.style.fontSize   = '32px';
        countdownText.style.top        = '20px';
        countdownText.style.right      = '32px';

        document.body.appendChild(countdownText);
    }

    function hideVideoPlayArrow() {
        if (Video._element.poster !== '') Video._element.poster = '';
    }

    function registerCountdownProgressEvent() {
        Video._element.addEventListener('timeupdate', updateCountdownText);
    }

    function updateCountdownText() {
        countdownText.textContent = Math.floor(Video._element.duration - Video._element.currentTime);
    }

    function destroyCountdownText() {
        if (!countdownText) return;
        if (document.body.contains(countdownText)) document.body.removeChild(countdownText);
    }

    Video.finishPlaying = function() {
        this._element.currentTime = this._element.duration;
    };

    Video.clickScreenSkipPlaying = function() {
        Video.finishPlaying();
    };

    Video.pressEscSkipPlaying = function() {
        let e = event || window.event;
        if (e && e.keyCode == 27) Video.finishPlaying();
    };

    Video.onTouchSkipPlaying = function() {
        if (TouchInput.isRepeated()) Video.finishPlaying();
    };

    var _Video_onLoad = Video._onLoad;
    Video._onLoad = function() {
        _Video_onLoad.call(this);

        hideVideoPlayArrow();

        let thisIsNotAGameStartMovie        = P_2D_C.isGameStartMoviePluginLoaded && P_2D_C.isGameStartMovieFinished;
        let gameStartMoivePluginIsNotLoaded = !P_2D_C.isGameStartMoviePluginLoaded;
        if (thisIsNotAGameStartMovie || gameStartMoivePluginIsNotLoaded) {
            if (P_2D_C.isClickScreenSkip)   document.onmousedown = this.clickScreenSkipPlaying;
            if (P_2D_C.isPressEscSkip)      document.onkeydown   = this.pressEscSkipPlaying;
            if (P_2D_C.isOnTouchSkip)       Graphics.app.ticker.add(this.onTouchSkipPlaying);
            if (P_2D_C.isShowCountdownText) {
                createCountdownText();
                registerCountdownProgressEvent();
            }
        }
    };

    var _Video_onEnd = Video._onEnd;
    Video._onEnd = function() {
        _Video_onEnd.call(this);

        let thisIsNotAGameStartMovie        = P_2D_C.isGameStartMoviePluginLoaded && P_2D_C.isGameStartMovieFinished;
        let gameStartMoivePluginIsNotLoaded = !P_2D_C.isGameStartMoviePluginLoaded;
        if (thisIsNotAGameStartMovie || gameStartMoivePluginIsNotLoaded) {
            document.onmousedown = {};
            document.onkeydown   = {};
            Graphics.app.ticker.remove(this.onTouchSkipPlaying);
            destroyCountdownText();
        }
    };
})();