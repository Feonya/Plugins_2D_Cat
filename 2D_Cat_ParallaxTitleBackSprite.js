/*:
 * @target     MZ
 * @plugindesc v1.1 实现主界面背景视差效果。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：
 * 1、插件设置参数中的“游戏屏幕宽度”和“游戏屏幕高度”，请设置为与数据库中“系统2-
 * 进阶设置-画面宽度/高度”相同的数值。
 * 2、插件设置参数中的“视差偏移像素”表示鼠标移动至游戏画面边缘时，背景画面最多偏
 * 移多少个像素。
 * 3、待使用主界面背景图片应放置在img/titles1目录下，而后在数据库中“系统1-标题
 * 画面-图像”中选择，该图片宽度应大于“游戏屏幕宽度+视差偏移像素”，高度应大于“游
 * 戏屏幕高度+视差偏移像素”，否则主界面背景偏移时会出现黑边。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 * 
 * * 更新日志：
 * -- 20220620 v1.1
 *     修复了启动后黑屏Bug。
 * 
 * * 致谢说明：
 * 1、感谢B站用户 偽受睏吿 提供关于启动后产生黑屏的Bug反馈！
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
 * @param   gameScreenWidth
 * @text    游戏屏幕宽度
 * @type    number
 * @min     0
 * @default 1280
 * 
 * @param   gameScreenHeight
 * @text    游戏屏幕高度
 * @type    number
 * @min     0
 * @default 720
 * 
 * @param   parallaxIntensity
 * @text    视差偏移像素
 * @type    number
 * @min     0
 * @default 100
 */

var P_2D_C = P_2D_C || {};
P_2D_C.offsetTitlePicX = 0;
P_2D_C.offsetTitlePicY = 0;

(() => {
    var params = PluginManager.parameters('2D_Cat_ParallaxTitleBackSprite');

    P_2D_C.titleBackSpriteX  = Number(params.gameScreenWidth)  * 0.5;
    P_2D_C.titleBackSpriteY  = Number(params.gameScreenHeight) * 0.5;
    P_2D_C.ParallaxIntensity = Number(params.parallaxIntensity);
    
    function SetParallaxTitleBackSprite() {
        document.onmousemove = function(event) {
            let facX = P_2D_C.ParallaxIntensity / window.innerWidth;
            let facY = P_2D_C.ParallaxIntensity / window.innerHeight;

            let mx = event.clientX;
            let my = event.clientY;
            if (mx < 0) mx = 0;
            else if (mx > window.innerWidth) mx = window.innerWidth;
            if (my < 0) my = 0;
            else if (my > window.innerHeight) my = window.innerHeight;

            let omx = mx - P_2D_C.titleBackSpriteX * (window.innerWidth / Graphics.width);
            let omy = my - P_2D_C.titleBackSpriteY * (window.innerHeight / Graphics.height);

            P_2D_C.offsetTitlePicX = -omx * facX;
            P_2D_C.offsetTitlePicY = -omy * facY;
        }
    }

    var _Scene_Title_prototype_createBackground = Scene_Title.prototype.createBackground;
    Scene_Title.prototype.createBackground = function() {
        _Scene_Title_prototype_createBackground.call(this);

        SetParallaxTitleBackSprite();
    }

    var _Scene_Title_prototype_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_prototype_update.call(this);

        this._backSprite1.x = P_2D_C.titleBackSpriteX + P_2D_C.offsetTitlePicX;
        this._backSprite1.y = P_2D_C.titleBackSpriteY + P_2D_C.offsetTitlePicY;
    }
})();
