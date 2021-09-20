/*:
 * @target     MZ
 * @plugindesc v1.0 角色移动时添加晃动身体的效果。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 已知问题：目前本插件存在角色移动时头顶会出现杂线的问题，未来将会尝试修复。
 *
 * * 使用方法：在插件中设置好相应参数即可。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 202109020 v1.0
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
 * @param   enableOnlyDash
 * @text    是否仅冲刺时激活
 * @type    boolean
 * @default false
 */

(() => {
    var params = PluginManager.parameters('2D_Cat_BodyShakeMove');

    var enableOnlyDash = String(params.enableOnlyDash) === 'true';
    var partySprites   = [];
    var shakeFreqHori  = 0.1;
    var shakeAmpHori   = 7;
    var shakeFreqVert  = 0.08;
    var shakeAmpVert   = 4;

    var isAddedToTicker = false;
    var timeCount       = 0;
    var isActualStopped = 0; // 最大值为2的增量，等于2时确定停止

    function regainPartySprites() {
        partySprites = [];
        let cs = SceneManager._scene._spriteset._characterSprites;
        cs.forEach(e => {
            if ((e._character instanceof Game_Player) || (e._character instanceof Game_Follower))
                partySprites.push(e);
        });
    }

    function dynamicMove(deltaTime) {
        if ($gamePlayer.isStopping() && isActualStopped < 2) {
            isActualStopped++;
            if (isActualStopped >= 2) fixPartyAngle();
        } else if ($gamePlayer.isStopping() && isActualStopped >= 2) {
            return;
        }

        if ($gamePlayer.isMoving()) {
            if (isActualStopped !== 0) isActualStopped = 0;
            timeCount += deltaTime;
            if (enableOnlyDash) {
                if ($gamePlayer.isDashing()) {
                    partySprites.forEach(e => {
                        processingDynamicDashingMove(timeCount, e);
                    });
                }
            } else {
                if ($gamePlayer.isDashing()) {
                    partySprites.forEach(e => {
                        processingDynamicDashingMove(timeCount, e);
                    });
                } else {
                    partySprites.forEach(e => {
                        processingDynamicMove(timeCount, e);
                    });
                }
            }
        }
    }

    function fixPartyAngle() {
        timeCount = 0;
        partySprites.forEach(e => {
            e.angle = 0;
        });
    }

    function processingDynamicMove(timeCount, charSpr) {
        if (charSpr._character.direction() === 4) {
            charSpr.angle = -Math.abs(Math.sin(timeCount * shakeFreqHori) * shakeAmpHori);
        } else if (charSpr._character.direction() === 6) {
            charSpr.angle = Math.abs(Math.sin(timeCount * shakeFreqHori) * shakeAmpHori);
        } else {
            charSpr.angle = Math.sin(timeCount * shakeFreqVert * 2) * shakeAmpVert;
        }
    }

    function processingDynamicDashingMove(timeCount, charSpr) {
        if (charSpr._character.direction() === 4) {
            charSpr.angle = -Math.abs(Math.sin(timeCount * shakeFreqHori * 2) * shakeAmpHori);
        } else if (charSpr._character.direction() === 6) {
            charSpr.angle = Math.abs(Math.sin(timeCount * shakeFreqHori * 2) * shakeAmpHori);
        } else {
            charSpr.angle = Math.sin(timeCount * shakeFreqVert * 4) * shakeAmpVert;
        }
    }

    var _Scene_Map_prototype_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_prototype_start.call(this);

        regainPartySprites();
        if (!isAddedToTicker) {
            Graphics.app.ticker.add(dynamicMove);
            isAddedToTicker = true;
        }
    }
})();