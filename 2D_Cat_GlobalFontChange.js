/*:
 * @target     MZ
 * @plugindesc v1.0 在游戏中实时更换全局字体。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：将所有字体放入fonts文件夹中，在任意事件中调用本插件的“更换字体”
 * 插件指令，并将唯一参数设为包含扩展名的对应字体文件名。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210830 v1.0
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
 * @command changeFont
 * @text    更换字体
 *
 * @arg  fontFileName
 * @text 字体文件名称
 * @type string
 * @desc 放在fonts目录下的字体文件名称，包括扩展名。
 */

(() => {
    var docFonts = {}; // key: fontUrl, val: fontFace

    var fnFileName;

    PluginManager.registerCommand('2D_Cat_GlobalFontChange', 'changeFont', args => {
        fnFileName = String(args.fontFileName);
        startChangeMainFont(fnFileName);
        // startChangeNumberFont(fnFileName);
    });

    function startChangeMainFont(mFnFileName) {
        FontManager._states['rmmz-mainfont'] = 'loading';
        FontManager.load('rmmz-mainfont', mFnFileName);
    }

    // function startChangeNumberFont(nFnFileName) {
    //     FontManager._states['rmmz-numberfont'] = 'loading';
    //     FontManager.load('rmmz-numberfont', nFnFileName);
    // }

    // var _FontManager_startLoading = FontManager.startLoading;
    FontManager.startLoading = function(family, url) {
        const source = "url(" + url + ")";
        const font   = new FontFace(family, source);
        this._urls[family]   = url;
        this._states[family] = "loading";
        font.load()
            .then(() => {
                if (docFonts.hasOwnProperty(decodeURI(url))) {
                    document.fonts.delete(docFonts[decodeURI(url)]);
                }
                else {
                    docFonts[decodeURI(url)] = font;
                }
                document.fonts.add(font);
                this._states[family] = "loaded";
                return 0;
            })
            .catch(() => {
                this._states[family] = "error";
            });
    };
})();