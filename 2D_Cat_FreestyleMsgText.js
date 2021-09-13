/*:
 * @target     MZ
 * @plugindesc v1.0 自由设定对话框文字式样，包括颜色、渐变色、加粗、倾斜、轮廓、阴影、辉光等效果。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：请在任意事件中调用本插件的“设置消息文字式样”指令，并依次设置好相
 * 关参数。若要恢复默认式样，请调用本插件的“还原消息文字式样”指令。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210831 v1.0
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
 * @command setMessageTextStyle
 * @text    设置消息文字式样
 *
 * @arg     fontBold
 * @text    粗字体
 * @type    boolean
 * @default false
 *
 * @arg     fontItalic
 * @text    斜字体
 * @type    boolean
 * @default false
 *
 * @arg     fontColor
 * @text    字体颜色
 * @type    string
 * @default #ffffff
 * @desc    带井号“#”的十六进制颜色字符串
 *
 * @arg     isEnableGradient
 * @text    是否开启渐变
 * @type    boolean
 * @default true
 *
 * @arg     gradientDirection
 * @text    渐变方向
 * @type    combo
 * @option  水平
 * @value   hori
 * @option  垂直
 * @value   vert
 * @default 水平
 *
 * @arg     gradientColors
 * @text    渐变颜色
 * @type    string[]
 * @default ["#4facfe", "#ff7c95", "#ffffc7", "#4ffeb6"]
 * @desc    带井号“#”的十六进制颜色字符串
 *
 * @arg     isEnableOutline
 * @text    是否开启轮廓
 * @type    boolean
 * @default true
 *
 * @arg     outlineColor
 * @text    轮廓颜色
 * @type    string
 * @default #000000
 *
 * @arg     outlineWidth
 * @text    轮廓宽度
 * @type    number
 * @default 3
 * @min     1
 *
 * @arg     isEnableShadow
 * @text    是否开启阴影
 * @type    boolean
 * @default false
 *
 * @arg     shadowOffsetX
 * @text    阴影X轴偏移
 * @type    number
 * @min     0
 * @default 10
 *
 * @arg     shadowOffsetY
 * @text    阴影Y轴偏移
 * @type    number
 * @min     0
 * @default 10
 *
 * @arg     shadowColor
 * @text    阴影颜色
 * @type    string
 * @default #000000
 * @desc    带井号“#”的十六进制颜色字符串
 *
 * @arg     shadowBlur
 * @text    阴影模糊程度
 * @type    number
 * @min     0
 * @default 5
 * @desc    将本参数调高到10左右可模拟辉光效果。
 *
 * @command resetMessageTextStyle
 * @text    还原消息文字式样
 */

(() => {
    var isOn = false;

    var fnBold, fnItalic, fnColor;
    var isEnableGradient, gradientDir, gradientColors;
    var isEnableOutline, outlineColor, outlineWidth;
    var isEnableShadow, shadowOffsetX, shadowOffsetY, shadowColor, shadowBlur;

    PluginManager.registerCommand('2D_Cat_FreestyleMsgText', 'setMessageTextStyle', args => {
        isOn = true;

        fnBold   = String(args.fontBold)   === 'true' ? 'bold '   : '';
        fnItalic = String(args.fontItalic) === 'true' ? 'italic ' : '';
        fnColor  = String(args.fontColor);

        isEnableGradient = String(args.isEnableGradient) === 'true';
        gradientDir      = String(args.gradientDirection);
        gradientColors   = JSON.parse(String(args.gradientColors));

        isEnableOutline = String(args.isEnableOutline) === 'true';
        outlineColor    = String(args.outlineColor);
        outlineWidth    = Number(args.outlineWidth);

        isEnableShadow = String(args.isEnableShadow) === 'true';
        shadowOffsetX  = Number(args.shadowOffsetX);
        shadowOffsetY  = Number(args.shadowOffsetY);
        shadowColor    = String(args.shadowColor);
        shadowBlur     = Number(args.shadowBlur);
    });

    PluginManager.registerCommand('2D_Cat_FreestyleMsgText', 'resetMessageTextStyle', () => {
        if (isOn) isOn = false;
    });

    // 绘制文字轮廓
    var _Bitmap_prototype_drawTextOutline = Bitmap.prototype._drawTextOutline;
    Bitmap.prototype._drawTextOutline = function(text, tx, ty, maxWidth) {
        if (isOn && $gameMessage.isBusy()) {
            if (!isEnableOutline) return;

            const context       = this.context;
            context.font        = fnItalic + fnBold + this.fontSize + 'px rmmz-mainfont';
            context.strokeStyle = outlineColor;
            context.lineWidth   = outlineWidth;
            context.lineJoin    = 'round';
            context.strokeText(text, tx, ty, maxWidth);
        } else {
            _Bitmap_prototype_drawTextOutline.call(this, text, tx, ty, maxWidth);
        }
    };

    // 绘制文字阴影
    Bitmap.prototype._drawTextShadow = function(ctx) {
        if (isEnableShadow) {
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
            ctx.shadowColor   = shadowColor;
            ctx.shadowBlur    = shadowBlur;
        }
    };

    // 绘制文字
    var _Bitmap_prototype_drawTextBody = Bitmap.prototype._drawTextBody;
    Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth) {
        if (isOn && $gameMessage.isBusy()) {
            const context = this.context;
            this._drawTextShadow(context);
            context.font  = fnItalic + fnBold + this.fontSize + 'px rmmz-mainfont';
            if (!isEnableGradient) {
                context.fillStyle = fnColor;
            } else {
                context.fillStyle = getGradient(context);
            }
            context.fillText(text, tx, ty, maxWidth);
        } else {
            _Bitmap_prototype_drawTextBody.call(this, text, tx, ty, maxWidth);
        }
    };

    // 生成渐变
    function getGradient(ctx) {
        const textPadding = 16;

        let gradient;
        if (gradientDir === '垂直') {
            gradient = ctx.createLinearGradient(0, textPadding, 0, textPadding + ImageManager.faceHeight);
        } else {
            let x1;
            let x2 = Scene_Message.prototype.messageWindowRect().width - textPadding;
            if ($gameMessage.faceName() === '') {
                x1 = textPadding;
            } else {
                x1 = textPadding * 2 + ImageManager.faceWidth;
            }
            gradient = ctx.createLinearGradient(x1, 0, x2, 0);
        }

        let colorNum           = gradientColors.length;
        let currColorStopPos   = 0;
        let colorStopPosAmount = 1 / (colorNum - 1);
        for (let i = 0; i < colorNum; i++) {
            gradient.addColorStop(currColorStopPos, gradientColors[i]);
            currColorStopPos += colorStopPosAmount;
            if (currColorStopPos > 1) currColorStopPos = 1;
        }

        return gradient;
    }
})();