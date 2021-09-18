/*:
 * @target     MZ
 * @plugindesc v1.0 在任意地图的任意处更改事件独立开关。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：在任意事件中调用本插件的“设置独立开关”指令，并依次设置好相关参数。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210823 v1.0
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
 * @command setSelfSwitch
 * @text    设置独立开关
 *
 * @arg     mapId
 * @type    number
 * @min     0
 * @default 0
 * @text    地图编号
 * @desc    0表示本地图；大于0表示对应编号的地图。
 *
 * @arg     eventId
 * @type    number
 * @min     1
 * @default 1
 * @text    事件编号
 * @desc    对应编号的事件。
 *
 * @arg     selfSwitchName
 * @type    combo
 * @default A
 * @option  A
 * @option  B
 * @option  C
 * @option  D
 * @text    独立开关名称
 *
 * @arg     selfSwitchVal
 * @type    boolean
 * @default true
 * @text    开/关
 */

(() => {
    PluginManager.registerCommand('2D_Cat_SetSelfSwitchAnywhere', 'setSelfSwitch', args => {
        let mapId          = Number(args.mapId > 0 ? args.mapId : $gameMap._mapId);
        let eventId        = Number(args.eventId);
        let selfSwitchName = String(args.selfSwitchName);
        let selfSwitchVal  = args.selfSwitchVal === 'true';

        $gameSelfSwitches.setValue([mapId, eventId, selfSwitchName], selfSwitchVal);
    });
})();