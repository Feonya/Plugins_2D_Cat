/*:
 * @target     MZ
 * @plugindesc v1.0 基于区域编号自定义空气墙。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：在插件中设置好相对于主角或事件来说不可通行区域编号即可。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210922 v1.0
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
 * @param   regionIdBlockPlayerArr
 * @text    主角不可通行的区域编号
 * @type    number[]
 * @default ["10", "11"]
 *
 * @param   regionIdBlockEventsArr
 * @text    事件不可通行的区域编号
 * @type    number[]
 * @default ["10", "12"]
 */

(() => {
    var params = PluginManager.parameters('2D_Cat_RegionWall');

    var regionIdBlockPlayerArr = JSON.parse(params.regionIdBlockPlayerArr);
    var regionIdBlockEventsArr = JSON.parse(params.regionIdBlockEventsArr);

    Game_CharacterBase.prototype.canPassRegion = function(x, y, d) {
        let x2 = $gameMap.roundXWithDirection(x, d);
        let y2 = $gameMap.roundYWithDirection(y, d);

        let rId = $gameMap.regionId(x2, y2);
        if (this instanceof Game_Player) {
            for (let i = 0; i < regionIdBlockPlayerArr.length; i++) {
                if (rId === Number(regionIdBlockPlayerArr[i])) return false;
            }
        } else if (this instanceof Game_Event) {
            for (let i = 0; i < regionIdBlockEventsArr.length; i++) {
                if (rId === Number(regionIdBlockEventsArr[i])) return false;
            }
        }

        return true;
    }

    Game_CharacterBase.prototype.canPassDiagonallyRegion = function(x, y, horz, vert) {
        let x2 = $gameMap.roundXWithDirection(x, horz);
        let y2 = $gameMap.roundYWithDirection(y, vert);

        let rId = $gameMap.regionId(x2, y2);
        if (this instanceof Game_Player) {
            for (let i = 0; i < regionIdBlockPlayerArr.length; i++) {
                if (rId === Number(regionIdBlockPlayerArr[i])) return false;
            }
        } else if (this instanceof Game_Event) {
            for (let i = 0; i < regionIdBlockEventsArr.length; i++) {
                if (rId === Number(regionIdBlockEventsArr[i])) return false;
            }
        }

        return true;
    }

    var _Game_CharacterBase_prototype_canPass = Game_CharacterBase.prototype.canPass;
    Game_CharacterBase.prototype.canPass = function(x, y, d) {
        if (!this.canPassRegion(x, y, d)) return false;
        return _Game_CharacterBase_prototype_canPass.call(this, x, y, d);
    };

    var _Game_CharacterBase_prototype_canPassDiagonally = Game_CharacterBase.prototype.canPassDiagonally;
    Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
        if (!this.canPassDiagonallyRegion(x, y, horz, vert)) return false;
        return _Game_CharacterBase_prototype_canPassDiagonally.call(this, x, y, horz, vert);
    };
})();