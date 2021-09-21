/*:
 * @target     MZ
 * @plugindesc v1.1 让角色或事件进行翻滚跳跃，并且跳的更高。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：请在某个角色或事件跳跃前，在任意事件中调用本插件的“设置翻滚跳跃”
 * 插件指令，只会对最近一次跳跃的角色或事件生效。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210921 v1.1
 *     修复了翻滚跳跃时调出菜单返回报错的Bug。
 * -- 20210918 v1.0
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
 * @command setRollingJump
 * @text    设置翻滚跳跃
 *
 * @arg     rollingNum
 * @text    翻滚圈数
 * @type    number
 * @min     1
 * @default 3
 *
 * @arg     jumpingScaleOut
 * @text    跳跃持续时间和高度增加倍数
 * @type    string
 * @default 2
 * @desc    大于1的实数，注意过大的增加倍数会导致人物跳出屏幕边界。
 */

var P_2D_C = P_2D_C || {};

(() => {
    var isPreCalled = false;

    PluginManager.registerCommand('2D_Cat_RollingJump', 'setRollingJump', args => {
        if (!isPreCalled) {
            P_2D_C.rollingNum = Number(args.rollingNum);
            P_2D_C.jumpingScaleOut = Number(args.jumpingScaleOut);
            if (String(P_2D_C.jumpingScaleOut) === 'NaN') P_2D_C.jumpingScaleOut = 2;
            else if   (P_2D_C.jumpingScaleOut < 1)        P_2D_C.jumpingScaleOut = 1;
            isPreCalled = true;
        }
    });

    var _Game_CharacterBase_prototype_initialize = Game_CharacterBase.prototype.initialize;
    Game_CharacterBase.prototype.initialize = function() {
        _Game_CharacterBase_prototype_initialize.call(this);
        this.onFixingRolling = false;
    }

    Game_CharacterBase.prototype.fixRollingAnchor = function() {
        if (this.sprite) {
            this.sprite.z = 10;
            if (this.onFixingRolling) {
                this.sprite.anchor.set(0.5, 0.5);
            } else {
                this.onFixingRolling = true;
            }
        }
    };

    Game_CharacterBase.prototype.getSprite = function() {
        let sprites = SceneManager._scene._spriteset._characterSprites;
        if (this instanceof Game_Player && !(this instanceof Game_Follower)) {
            for (let i = 0; i < sprites.length; i++) {
                if (sprites[i]._character instanceof Game_Player) return sprites[i];
            }
        } else {
            for (let i = 0; i < sprites.length; i++) {
                if      (sprites[i]._character.eventId   === undefined)     continue;
                else if (sprites[i]._character.eventId() === this._eventId) return sprites[i];
            }
        }
        return null;
    };

    Game_CharacterBase.prototype.rolling = function() {
        if (this._direction === 4) {        // 左
            this.sprite.angle -= this.rollingIncrement;
        } else if (this._direction === 6) { // 右
            this.sprite.angle += this.rollingIncrement;
        } else if (this._direction === 2) { // 下
            this.sprite.angle -= this.rollingIncrement;
        } else {                            // 上
            this.sprite.angle += this.rollingIncrement;
        }
    };

    var _Game_CharacterBase_prototype_jump = Game_CharacterBase.prototype.jump;
    Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
        _Game_CharacterBase_prototype_jump.call(this, xPlus, yPlus);
        if (isPreCalled) {
            this._jumpPeak  *= P_2D_C.jumpingScaleOut;
            this._jumpCount *= P_2D_C.jumpingScaleOut;
            if (!this.sprite) this.sprite = this.getSprite();
            this.rollingIncrement = 360 * P_2D_C.rollingNum / this._jumpCount;
        }
    };

    var _Game_CharacterBase_prototype_updateJump = Game_CharacterBase.prototype.updateJump;
    Game_CharacterBase.prototype.updateJump = function() {
        _Game_CharacterBase_prototype_updateJump.call(this);

        if (isPreCalled && this.sprite) {
            if (!this.sprite.anchor) this.sprite = this.getSprite();
            this.fixRollingAnchor(this.sprite);

            this.rolling();

            if (this._jumpCount === 0) {
                this.sprite.angle = 0;
                this.sprite.anchor.set(0.5, 1);
                this.sprite.z     = 3;
                this.onFixingRolling = false;
                isPreCalled = false;
            }
        }
    };
})();