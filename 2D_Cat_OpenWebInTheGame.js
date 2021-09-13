/*:
 * @target     MZ
 * @plugindesc v1.0 在游戏内打开网站页面。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：在任意事件中调用本插件的“打开网页”指令，并设置好网页地址等相关参
 * 数。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210827 v1.0
 *     实现插件基本功能。
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
 * @command openWeb
 * @text    打开网页
 *
 * @arg     url
 * @text    网页地址
 * @type    string
 * @default https://space.bilibili.com/137028995
 *
 * @arg     left
 * @text    水平位置（%）
 * @type    number
 * @default 50
 * @desc    以页面中心为原点，在游戏窗口宽度百分之几的位置处。
 *
 * @arg     top
 * @text    垂直位置（%）
 * @type    number
 * @default 50
 * @desc    以页面中心为原点，在游戏窗口高度百分之几的位置处。
 *
 * @arg     width
 * @text    页面宽度（px）
 * @type    number
 * @default 640
 *
 * @arg     height
 * @text    页面高度（px）
 * @type    number
 * @default 480
 *
 * @arg     bgOpacity
 * @text    游戏场景亮度
 * @type    number
 * @min     0
 * @max     1
 * @default 0.4
 * @decs    页面打开时，游戏场景的亮度，0为纯黑，1为正常亮度。
 */

(() => {
    var _Game_Player_prototype_canMove = Game_Player.prototype.canMove;

    var frameElem    = null;
    var closeBtnElem = null;

    PluginManager.registerCommand('2D_Cat_OpenWebInTheGame', 'openWeb', args => {
        createFrame(args);
        createCloseFrameBtn();
    });

    var createFrame = function(args) {
        $gamePlayer.canMove = () => { return false; };
        document.getElementById('gameCanvas').style.opacity = Number(args.bgOpacity);

        frameElem                 = document.createElement('iframe');
        frameElem.id              = 'WebFrame';
        frameElem.style.zIndex    = '10';
        frameElem.style.position  = 'absolute';
        frameElem.style.border    = 'none';
        frameElem.style.transform = 'translate(-50%, -50%)';
        frameElem.style.left      = String(args.left)   + '%';
        frameElem.style.top       = String(args.top)    + '%';
        frameElem.style.width     = String(args.width)  + 'px';
        frameElem.style.height    = String(args.height) + 'px';
        frameElem.src             = String(args.url);

        document.body.appendChild(frameElem);
    };

    var createCloseFrameBtn = function() {
        closeBtnElem                = document.createElement('button');
        closeBtnElem.textContent    = '关闭页面';
        closeBtnElem.style.zIndex   = '11';
        closeBtnElem.style.position = 'absolute';
        closeBtnElem.style.right    = '10px';
        closeBtnElem.style.top      = '10px';
        closeBtnElem.style.width    = '70px';
        closeBtnElem.style.height   = '30px';
        closeBtnElem.onclick        = onCloseBtnClicked;

        document.body.appendChild(closeBtnElem);
    };

    var onCloseBtnClicked = function() {
        document.body.removeChild(frameElem);
        document.body.removeChild(closeBtnElem)

        $gamePlayer.canMove = _Game_Player_prototype_canMove;
        document.getElementById('gameCanvas').style.opacity = 1;
    };
})();