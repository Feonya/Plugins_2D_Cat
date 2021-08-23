/*:
 * @target MZ
 * @plugindesc 显示相对于目标位置偏移后的气泡动画。v_1.0
 * @author 2D_猫
 * @url https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：请在“显示气泡图标”事件指令前调用本插件的“设置坐标偏移量”插件指令，
 * 只会对最近一次“显示气泡图标”事件指令生效。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * @command setPosOffset
 * @text 设置坐标偏移量
 *
 * @arg posXOffset
 * @type number
 * @min -99999
 * @max 99999
 * @default 0
 * @text X坐标偏移量
 * @desc 小于0向左偏移，大于0向右偏移。
 *
 * @arg posYOffset
 * @type number
 * @min -99999
 * @max 99999
 * @default 0
 * @text Y坐标偏移量
 * @desc 小于0向上偏移，大于0向下偏移。
 */

(() => {
    let preCalled = false;

    let posXOffset = 0;
    let posYOffset = 0;

    PluginManager.registerCommand('2D_Cat_BalloonPosOffset', 'setPosOffset', args => {
        preCalled = true;

        posXOffset = Number(args.posXOffset);
        posYOffset = Number(args.posYOffset);
    });

    var _Sprite_Balloon_prototype_setup = Sprite_Balloon.prototype.setup;
    Sprite_Balloon.prototype.setup = function(targetSprite, balloonId) {
        _Sprite_Balloon_prototype_setup.call(this, targetSprite, balloonId);

        if (preCalled) {
            preCalled = false;
            this.posXOffset = posXOffset;
            this.posYOffset = posYOffset;
        }
        else {
            this.posXOffset = 0;
            this.posYOffset = 0;
        }
    };

    var _Sprite_Balloon_prototype_updatePosition = Sprite_Balloon.prototype.updatePosition;
    Sprite_Balloon.prototype.updatePosition = function() {
        _Sprite_Balloon_prototype_updatePosition.call(this);

        this.x += this.posXOffset;
        this.y += this.posYOffset;
    };
})();