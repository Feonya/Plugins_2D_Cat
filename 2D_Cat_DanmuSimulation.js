/*:
 * @target     MZ
 * @plugindesc v1.2 在游戏画面模拟弹幕效果。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：
 * 1、在任意事件中调用“开启弹幕”指令，并依次设置好相关参数即可。
 * 2、弹幕弹出时，可在任意事件中调用“立即关闭弹幕”，以消除所有弹幕。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210913 v1.2
 *     增加了“立即关闭弹幕”指令。
 * -- 20210907 v1.1
 *     修复了调出主菜单时崩溃的Bug，现在调出主菜单将会消除所有弹幕。
 *     新增字体轮廓颜色和大小设置。
 * -- 20210828 v1.0
 *     实现插件基本功能。
 *
 * * 致谢说明：
 * 感谢B站用户 靓点迷人 提供的Bug反馈，以及对本插件关于“立即关闭弹幕”功能的建议！
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
 * @command openDanmu
 * @text    开启弹幕
 *
 * @arg     danmuStrings
 * @text    弹幕文字
 * @type    string[]
 * @default ["666~~[5]", "跳的真好看！[4]", "老铁们，礼物刷起来啊~~！[3]", "哦耶~~[2]", "射射，已经谢了。。。[1]", "2333[5]"]
 * @desc    每行设置一条弹幕，中括号内表示该弹幕出现的权重（任意正数），越高出现概率越大，反之越小。中括号不能出现于其他地方。
 *
 * @arg     maxFontSize
 * @text    弹幕最大字号
 * @type    number
 * @default 36
 * @min     0
 *
 * @arg     minFontSize
 * @text    弹幕最小字号
 * @type    number
 * @default 24
 * @min     0
 *
 * @arg     maxMoveSpeed
 * @text    弹幕最大速度
 * @type    number
 * @default 300
 * @min     1
 *
 * @arg     minMoveSpeed
 * @text    弹幕最小速度
 * @type    number
 * @default 150
 * @min     1
 *
 * @arg     totalGenerateDuration
 * @text    总弹幕生成持续时间（毫秒）
 * @type    number
 * @default 10000
 * @min     0
 *
 * @arg     maxGenerateDuration
 * @text    每条弹幕生成最大间隔（毫秒）
 * @type    number
 * @default 100
 * @min     0
 *
 * @arg     minGenerateDuration
 * @text    每条弹幕生成最小间隔（毫秒）
 * @type    number
 * @default 0
 * @min     0
 *
 * @arg     colors
 * @text    色彩设置（带“#”的16进制值）
 * @type    string[]
 * @default ["#ffffff[5]", "#ff0000[2]", "#ff00ff[2]", "#0000ff[2]", "#00ff00[2]", "#fff000[2]"]
 * @desc    每行设置一种色彩，中括号内表示该颜色出现的权重（任意正数），越高出现概率越大，反之越小。中括号不能出现于其他地方。
 *
 * @arg     outlineColor
 * @text    轮廓颜色（带“#”的16进制值）
 * @type    string
 * @default #f5c0f3
 *
 * @arg     outlineThickness
 * @text    轮廓大小
 * @type    number
 * @default 4
 *
 * @arg     upPosY
 * @text    弹幕显示最高位置（px）
 * @type    number
 * @min     0
 * @default 0
 *
 * @arg     downPosY
 * @text    弹幕显示最低位置（px）
 * @type    number
 * @min     0
 * @default 550
 *
 * @command eliminateDanmu
 * @text    立即关闭弹幕
 */

(() => {
    class Danmu {
        constructor(str, fnSize, mvSpd, color) {
            this.str    = str;
            this.fnSize = fnSize;
            this.mvSpd  = mvSpd;
            this.color  = color;
            this.msg    = null; // Pixi的Text对象
        }
    }

    var danmusOnStage = [];  // 舞台上的所有弹幕

    var danmuStrs    = []; // [['弹幕1', '权重1'], ['弹幕2', '权重2'], ...]
    var maxFnSize    = 0;
    var minFnSize    = 0;
    var maxMvSpd     = 0;
    var minMvSpd     = 0;
    var totalGenDura = 0;
    var maxGenDura   = 0;
    var minGenDura   = 0;
    var colors       = []; // [['色彩1', '权重1'], ['色彩2', '权重2'], ...]
    var outlineColor = '';
    var outlineThk   = 0;
    var upPosY       = 0;
    var downPosY     = 0;

    var isOn          = false;
    var nextGenDura   = 0;
    var currTime      = 0; // 生成下一条弹幕之前的积累时间
    var currTotalTime = 0; // 结束所有弹幕之前的积累时间
    var waitForDone   = false;

    PluginManager.registerCommand('2D_Cat_DanmuSimulation', 'openDanmu', args => {
        if (isOn) return;
        isOn = true;

        danmuStrs    = parseStrArr(JSON.parse(args.danmuStrings));
        maxFnSize    = Number(args.maxFontSize);
        minFnSize    = Number(args.minFontSize);
        maxMvSpd     = Number(args.maxMoveSpeed);
        minMvSpd     = Number(args.minMoveSpeed);
        totalGenDura = Number(args.totalGenerateDuration);
        maxGenDura   = Number(args.maxGenerateDuration);
        minGenDura   = Number(args.minGenerateDuration);
        colors       = parseStrArr(JSON.parse(args.colors));
        outlineColor = String(args.outlineColor);
        outlineThk   = Number(args.outlineThickness);
        upPosY       = Number(args.upPosY);
        downPosY     = Number(args.downPosY);

        Graphics.app.ticker.add(gameLoop);
    });

    PluginManager.registerCommand('2D_Cat_DanmuSimulation', 'eliminateDanmu', () => {
        waitForDone = true;
        destoryAllDanmus();
        restoreDanmu();
    });

    var _Scene_Map_prototype_callMenu = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function() {
        destoryAllDanmus();
        restoreDanmu();
        _Scene_Map_prototype_callMenu.call(this);
    };

    function gameLoop() {
        // 判断是否生成新的弹幕
        if (!waitForDone) {
            currTime += Graphics.app.ticker.deltaMS;
            if (currTime >= nextGenDura) {
                GenADanmu();
                currTime    = 0;
                nextGenDura = Math.floor(Math.random() * (maxGenDura + 1 - minGenDura) + minGenDura);
            }
        }

        // 移动舞台上现有弹幕
        danmusOnStage.forEach(e => {
            e.msg.x -= e.mvSpd * (Graphics.app.ticker.deltaMS * 0.001);

            // 判断是否销毁弹幕
            if (e.msg.x + e.msg.width < 0) {
                let idx = danmusOnStage.indexOf(e);
                Graphics.app.stage.removeChild(danmusOnStage[idx].msg);
                danmusOnStage.splice(idx, 1);
            }
        });

        // 判断是否停止所有弹幕的生成
        currTotalTime += Graphics.app.ticker.deltaMS;
        if (currTotalTime >= totalGenDura) {
            waitForDone = true;
        }

        // 判断是否可以结束本次弹幕
        if (waitForDone && danmusOnStage.length === 0) {
            restoreDanmu();
        }
    }

    function destoryAllDanmus(){
        danmusOnStage.forEach(e => {
            Graphics.app.stage.removeChild(e.msg);
        });
    }

    function restoreDanmu() {
        Graphics.app.ticker.remove(gameLoop);
        isOn          = false;
        nextGenDura   = 0;
        currTime      = 0;
        currTotalTime = 0;
        waitForDone   = false;
        danmusOnStage = [];
    }

    function parseStrArr(oriArr) {
        let arr = [];
        oriArr.forEach(e => {
            let a = e.split('[');
            a[1]  = a[1].slice(0, -1); // 去掉']'
            arr.push(a);
        });

        return arr;
    }

    function randSelAStrFromArr(oriArr) {
        let strArr   = [];
        let weiArr   = [];
        let totalWei = 0;

        oriArr.forEach(e => {
            strArr.push(e[0]);
            let wei = Number(e[1]);
            weiArr.push(wei);
            totalWei += wei;
        });

        let randNum = Math.random() * totalWei;
        let weiAccumulating = 0;
        for (let i = 0; i < weiArr.length; i++) {
            weiAccumulating += weiArr[i];
            if (randNum < weiAccumulating) {
                return strArr[i];
            }
        }

        return strArr[strArr.length - 1];
    }

    function GenADanmu() {
        let danmu = new Danmu(
            randSelAStrFromArr(danmuStrs),
            Math.floor(Math.random() * (maxFnSize + 1 - minFnSize) + minFnSize),
            Math.floor(Math.random() * (maxMvSpd  + 1 - minMvSpd)  + minMvSpd),
            randSelAStrFromArr(colors)
        );

        danmu.msg = new PIXI.Text(danmu.str, new PIXI.TextStyle({fontSize: danmu.fnSize, fill: danmu.color}));
        danmu.msg.style.lineJoin        = 'round';
        danmu.msg.style.stroke          = outlineColor;
        danmu.msg.style.strokeThickness = outlineThk;
        danmu.msg.position.set(Graphics.app.stage.children[0].width, Math.random() * (downPosY - upPosY) + upPosY);
        danmusOnStage.push(danmu);
        Graphics.app.stage.addChild(danmu.msg);
    }
})();