/*:
 * @target     MZ
 * @plugindesc v1.0 更改事件或主角的色调、灰度、亮度、色相、缩放比例以及斜切弧度。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：在任意事件中调用“更改XXX”指令，设置好目标事件或主角的对应编号参
 * 数 ，以及其他所需更改的参数即可。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210921 v1.0
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
 * @command changeColorTone
 * @text    更改色调（RGB）
 *
 * @arg     eventId1
 * @text    事件编号
 * @type    number
 * @default 0
 * @min     0
 * @desc    待更改事件的编号，0表示主角
 *
 * @arg     redValue
 * @text    红色通道值（0~255）
 * @type    number
 * @default 0
 * @min     0
 * @max     255
 *
 * @arg     greenValue
 * @text    绿色通道值（0~255）
 * @type    number
 * @default 0
 * @min     0
 * @max     255
 *
 * @arg     blueValue
 * @text    蓝色通道值（0~255）
 * @type    number
 * @default 0
 * @min     0
 * @max     255
 *
 * @command changeGrey
 * @text    更改灰度
 *
 * @arg     eventId2
 * @text    事件编号
 * @type    number
 * @default 0
 * @min     0
 * @desc    待更改事件的编号，0表示主角
 *
 * @arg     greyValue
 * @text    灰度值（-255~255）
 * @type    number
 * @default 0
 * @min     -255
 * @max     255
 *
 * @command changeBrightness
 * @text    更改亮度
 *
 * @arg     eventId3
 * @text    事件编号
 * @type    number
 * @default 0
 * @min     0
 * @desc    待更改事件的编号，0表示主角
 *
 * @arg     brightnessValue
 * @text    亮度值（0~510）
 * @type    number
 * @default 255
 * @min     0
 * @max     510
 *
 * @command changeHue
 * @text    更改色相
 *
 * @arg     eventId4
 * @text    事件编号
 * @type    number
 * @default 0
 * @min     0
 * @desc    待更改事件的编号，0表示主角
 *
 * @arg     hueValue
 * @text    色相值（-255~255）
 * @type    number
 * @default 0
 * @min     -255
 * @max     255
 *
 * @command changeScale
 * @text    更改缩放比例
 *
 * @arg     eventId5
 * @text    事件编号
 * @type    number
 * @default 0
 * @min     0
 * @desc    待更改事件的编号，0表示主角
 *
 * @arg     scaleX
 * @text    x轴缩放比例（-100~100）
 * @type    string
 * @default 1
 *
 * @arg     scaleY
 * @text    y轴缩放比例（-100~100）
 * @type    string
 * @default 1
 *
 * @command changeSkew
 * @text    更改斜切弧度
 *
 * @arg     eventId6
 * @text    事件编号
 * @type    number
 * @default 0
 * @min     0
 * @desc    待更改事件的编号，0表示主角
 *
 * @arg     skewX
 * @text    x轴斜切弧度（-6.2831852~6.2831852）
 * @type    string
 * @default 0
 *
 * @arg     skewY
 * @text    y轴斜切弧度（-6.2831852~6.2831852）
 * @type    string
 * @default 0
 */

(() => {
    PluginManager.registerCommand('2D_Cat_EventFeatureModify', 'changeColorTone', args => {
        let eventId    = Number(args.eventId1);
        let redValue   = Number(args.redValue);
        let greenValue = Number(args.greenValue);
        let blueValue  = Number(args.blueValue);

        let sprite = eventId === 0 ? getPlayerSprite() : getEventSprite(eventId);
        if (sprite) sprite.setColorTone([redValue, greenValue, blueValue, sprite._colorTone[3]]);
    });

    PluginManager.registerCommand('2D_Cat_EventFeatureModify', 'changeGrey', args => {
        let eventId   = Number(args.eventId2);
        let greyValue = Number(args.greyValue);

        let sprite = eventId === 0 ? getPlayerSprite() : getEventSprite(eventId);
        if (sprite) sprite.setColorTone([sprite._colorTone[0], sprite._colorTone[1], sprite._colorTone[2], greyValue]);
    });

    PluginManager.registerCommand('2D_Cat_EventFeatureModify', 'changeBrightness', args => {
        let eventId         = Number(args.eventId3);
        let brightnessValue = Number(args.brightnessValue);

        let sprite = eventId === 0 ? getPlayerSprite() : getEventSprite(eventId);
        if (sprite) {
            if (!sprite._colorFilter) sprite._createColorFilter();
            sprite._colorFilter.setBrightness(brightnessValue);
        }
    });

    PluginManager.registerCommand('2D_Cat_EventFeatureModify', 'changeHue', args => {
        let eventId  = Number(args.eventId4);
        let hueValue = Number(args.hueValue);

        let sprite = eventId === 0 ? getPlayerSprite() : getEventSprite(eventId);
        if (sprite) {
            if (!sprite._colorFilter) sprite._createColorFilter();
            sprite._colorFilter.setHue(hueValue);
        }
    });

    PluginManager.registerCommand('2D_Cat_EventFeatureModify', 'changeScale', args => {
        let eventId = Number(args.eventId5);
        let scaleX  = Number(args.scaleX);
        let scaleY  = Number(args.scaleY);

        if (String(scaleX) === 'NaN') scaleX = 1;
        else if   (scaleX < -100)     scaleX = -100;
        else if   (scaleX > 100)      scaleX = 100;
        if (String(scaleY) === 'NaN') scaleY = 1;
        else if   (scaleY < -100)     scaleY = -100;
        else if   (scaleY > 100)      scaleY = 100;

        let sprite = eventId === 0 ? getPlayerSprite() : getEventSprite(eventId);
        if (sprite) sprite.scale.set(scaleX, scaleY);
    });

    PluginManager.registerCommand('2D_Cat_EventFeatureModify', 'changeSkew', args => {
        let eventId = Number(args.eventId6);
        let skewX   = Number(args.skewX);
        let skewY   = Number(args.skewY);

        if (String(skewX) === 'NaN')   skewX = 0;
        else if   (skewX < -6.2831852) skewX = -6.2831852;
        else if   (skewX > 6.2831852)  skewX = 6.2831852;
        if (String(skewY) === 'NaN')   skewY = 0;
        else if   (skewY < -6.2831852) skewY = -6.2831852;
        else if   (skewY > 6.2831852)  skewY = 6.2831852;

        let sprite = eventId === 0 ? getPlayerSprite() : getEventSprite(eventId);
        if (sprite) sprite.skew.set(skewX, skewY);
    });


    function getEventSprite(eventId) {
        let sprites = SceneManager._scene._spriteset._characterSprites;
        for (let i = 0; i < sprites.length; i++) {
            if (sprites[i]._character.eventId !== undefined) {
                let eId = sprites[i]._character.eventId();
                if (eId === eventId) {
                    return sprites[i];
                }
            }
        }
        return null;
    }

    function getPlayerSprite() {
        let sprites = SceneManager._scene._spriteset._characterSprites;
        for (let i = 0; i < sprites.length; i++) {
            if (sprites[i]._character instanceof Game_Player) {
                return sprites[i];
            }
        }
        return null;
    }
})();