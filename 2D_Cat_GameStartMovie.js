/*:
 * @target     MZ
 * @plugindesc 设置游戏启动影像。v1.1
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：请在插件参数中设置好相应参数，启动游戏会自动加载movies目录下的目
 * 标影像文件。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210827 v1.1
 *     修正游戏启动时点击鼠标发生错误的bug。
 * -- 20210823 v1.0
 *     实现插件基本功能。
 *
 * @param   movieName
 * @type    fileName
 * @default default name
 * @text    影像文件名（.webm）
 * @desc    放在movies目录下的影像文件名，不输入其扩展名。
 *
 * @param   moviePlayDuration
 * @type    number
 * @default 0
 * @text    影像播放时长（毫秒）
 * @desc    若要播放完整影像，请确保本参数值等于或略大于影像实际时长。
 *
 * @param   touchSkip
 * @type    boolean
 * @default true
 * @text    是否点击屏幕跳过
 */

(() => {
    var params = PluginManager.parameters('2D_Cat_GameStartMovie');

    let isMoviePlayed = false;
    let playDuration  = params.moviePlayDuration;
    let touchSkip     = params.touchSkip === 'true';

    var _Scene_Boot_prototype_startNormalGame = Scene_Boot.prototype.startNormalGame;
    Scene_Boot.prototype.startNormalGame = function() {
        Video.play('movies/' + params.movieName + '.webm');

        setTimeout(() => {
            if (!isMoviePlayed) {
                isMoviePlayed        = true;
                document.onmousedown = function() {};

                _Scene_Boot_prototype_startNormalGame.call(this);
            }
        }, playDuration);
    }

    document.onmousedown = function() {
        if (isMoviePlayed || !touchSkip) return;
        if (!$dataSystem)                return;

        isMoviePlayed        = true;
        document.onmousedown = function() {};

        let video         = document.getElementById('gameVideo');
        video.currentTime = playDuration;

        _Scene_Boot_prototype_startNormalGame.call(Scene_Boot.prototype);
    }
})();