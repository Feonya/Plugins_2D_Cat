/*:
 * @target     MZ
 * @plugindesc v1.1 在对话框文字打印时，添加动画以及声音效果。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：
 * 1、在插件设置参数中，依次设置好动画编号、动画间隔字符数、声音间隔字符数，并
 *    确保默认禁用为关闭，之后所有对话框文字打印时，都会出现此时设置的动画效果。
 * 2、可以在任意事件中调用本插件的“更改（开启）动画”指令，以改变动画效果。若调
 *    用本指令时已禁用动画，则会激活动画。
 * 3、预调用动画需提前在编辑器数据库中设置好，包括声音在内。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210927 v1.1
 *     修正了进入战斗时发生错误的Bug。
 * -- 20210901 v1.0
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
 * @param   animationId
 * @text    动画编号
 * @type    number
 * @default 1
 * @min     1
 *
 * @param   animationInterval
 * @text    动画间隔字符数
 * @type    number
 * @default 2
 * @min     1
 *
 * @param   soundInterval
 * @text    声音间隔字符数
 * @type    number
 * @default 6
 * @min     1
 *
 * @param   defaultDisable
 * @text    默认禁用
 * @type    boolean
 * @default false
 *
 * @command changeAnimation
 * @text    更改（开启）动画
 * @desc    若动画已禁用，则同时激活动画。
 *
 * @arg     newAnimationId
 * @text    新动画编号
 * @type    number
 * @default 2
 * @min     1
 *
 * @arg     newAnimationInterval
 * @text    新动画间隔字符数
 * @type    number
 * @default 3
 * @min     1
 *
 * @arg     newSoundInterval
 * @text    新发声间隔字符数
 * @type    number
 * @default 5
 * @min     1
 *
 * @command disableAnimation
 * @text    禁用动画
 */

(() => {
    var params  = PluginManager.parameters('2D_Cat_MsgTextPrintAnim');

    var animId       = Number(params.animationId);
    var animInterval = Number(params.animationInterval);
    var sndInterval  = Number(params.soundInterval);

    var isNullTarget       = false;
    var animPos            = new Point();
    var currChCountForAnim = 0;
    var currChCountForSnd  = 0;
    var readyToPlaySnd     = false;
    var msgWinPos          = new Point();

    var isDisabled;
    if (String(params.defaultDisable) === 'true') isDisabled = true;
    else                                          isDisabled = false;

    PluginManager.registerCommand('2D_Cat_MsgTextPrintAnim', 'changeAnimation', args => {
        if (isDisabled) isDisabled = false;
        animId       = Number(args.newAnimationId);
        animInterval = Number(args.newAnimationInterval);
        sndInterval  = Number(args.newSoundInterval);
    });

    PluginManager.registerCommand('2D_Cat_MsgTextPrintAnim', 'disableAnimation', () => {
        isDisabled = true;
    })

    var _Game_Temp_prototype_requestAnimation = Game_Temp.prototype.requestAnimation;
    Game_Temp.prototype.requestAnimation = function(targets, animationId, mirror = false) {
        if (targets[0] === null) {
            isNullTarget = true;
            // msgWinPos    = Graphics.app.stage._messageWindow.getGlobalPosition();
            msgWinPos    = SceneManager._scene._messageWindow.getGlobalPosition();
            _Game_Temp_prototype_requestAnimation.call(this, [$gamePlayer], animationId, mirror);
        } else {
            isNullTarget = false;
            _Game_Temp_prototype_requestAnimation.call(this, targets      , animationId, mirror);
        }
    };

    Sprite_Animation.prototype.targetPosition = function(renderer) {
        if (isNullTarget) {
            return animPos;
        } else {
            const pos = new Point();
            if (this._animation.displayType === 2) {
                pos.x = renderer.view.width  / 2;
                pos.y = renderer.view.height / 2;
            } else {
                for (const target of this._targets) {
                    const tpos = this.targetSpritePosition(target);
                    pos.x += tpos.x;
                    pos.y += tpos.y;
                }
                pos.x /= this._targets.length;
                pos.y /= this._targets.length;
            }
            return pos;
        }
    };

    var _Sprite_Animation_prototype_update = Sprite_Animation.prototype.update;
    Sprite_Animation.prototype.update = function() {
        if (isNullTarget) {
            Sprite.prototype.update.call(this);
            if (this._delay > 0) {
                this._delay--;
            } else if (this._playing) {
                if (!this._started && this.canStart()) {
                    if (this._effect) {
                        if (this._effect.isLoaded) {
                            this._handle  = Graphics.effekseer.play(this._effect);
                            this._started = true;
                        } else {
                            EffectManager.checkErrors();
                        }
                    } else {
                        this._started = true;
                    }
                }
                if (this._started) {
                    this.updateEffectGeometry();
                    this.updateMain();
                    // this.updateFlash();
                }
            }
        } else {
            _Sprite_Animation_prototype_update.call(this);
        }
    };

    var _Bitmap_prototype_drawText = Bitmap.prototype.drawText;
    Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
        _Bitmap_prototype_drawText.call(this, text, x, y, maxWidth, lineHeight, align);

        if (isDisabled || text.length > 1) return;

        if ($gameMessage.isBusy()) {
            if (currChCountForAnim <= 0 && text != '') {
                animPos.x = x + msgWinPos.x;
                animPos.y = y + msgWinPos.y + lineHeight;
                $gameTemp.requestAnimation([null], animId);
            }
            if (text != '') {
                currChCountForAnim++;
                if (!readyToPlaySnd) currChCountForSnd++;
            }
            if (currChCountForAnim >= animInterval) currChCountForAnim = 0;
            if (currChCountForSnd  >=  sndInterval) {
                readyToPlaySnd    = true;
                currChCountForSnd = 0;
            }
        }
    };

    var _Sprite_Animation_prototype_processSoundTimings = Sprite_Animation.prototype.processSoundTimings;
    Sprite_Animation.prototype.processSoundTimings = function() {
        if (isNullTarget) {
            for (const timing of this._animation.soundTimings) {
                if (timing.frame === this._frameIndex && currChCountForSnd <= 0) {
                    let randPitch   = Math.random() * (115 - 85) + 85;
                    timing.se.pitch = randPitch;
                    AudioManager.playSe(timing.se);
                    readyToPlaySnd  = false;
                }
            }
        } else {
            _Sprite_Animation_prototype_processSoundTimings.call(this);
        }
    };

    Spriteset_Base.prototype.createAnimationSprite = function(targets, animation, mirror, delay) {
        const mv            = this.isMVAnimation(animation);
        const sprite        = new (mv ? Sprite_AnimationMV : Sprite_Animation)();
        const targetSprites = this.makeTargetSprites(targets);
        const baseDelay     = this.animationBaseDelay();
        const previous      = delay > baseDelay ? this.lastAnimationSprite() : null;
        if (this.animationShouldMirror(targets[0])) {
            mirror = !mirror;
        }
        sprite.targetObjects = targets;
        sprite.setup(targetSprites, animation, mirror, delay, previous);

        if (isNullTarget) {
            Graphics.app.stage._messageWindow.addChild(sprite);
        } else {
            this._effectsContainer.addChild(sprite);
        }

        this._animationSprites.push(sprite);
    };

    Spriteset_Base.prototype.removeAnimation = function(sprite) {
        this._animationSprites.remove(sprite);

        if (isNullTarget) {
            Graphics.app.stage._messageWindow.removeChild(sprite);
        } else {
            this._effectsContainer.removeChild(sprite);
        }

        for (const target of sprite.targetObjects) {
            if (target.endAnimation) {
                target.endAnimation();
            }
        }
        sprite.destroy();
    };
})();