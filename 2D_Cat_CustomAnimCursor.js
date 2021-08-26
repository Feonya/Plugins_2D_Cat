/*:
 * @target MZ
 * @plugindesc 自定义动画光标指针。v1.0
 * @author 2D_猫
 * @url https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：请将所有光标动画图片放在img/system目录下，并按照播放顺序将图片
 * 文件名输入插件相应参数中，最后设置好播放帧间隔时间即可。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 * 
 * @param images
 * @text 光标动画图片（.png）
 * @type string[]
 * @default ['Cursor1', 'Cursor2', 'Cursor3', 'Cursor4']
 * @desc 放在img/system目录下的每一帧光标动画图片文件名，不包括扩展名。
 * 
 * @param interval
 * @text 播放帧间隔时间（毫秒）
 * @type number
 * @default 100
 */

(() => {
    var params = PluginManager.parameters('2D_Cat_CustomAnimCursor');

    let images = JSON.parse(params.images);
    let maxImageNum = images.length;
    let interval = Number(params.interval);

    if (maxImageNum == 1) {
        setCursor(images[0]);
    }
    else if (maxImageNum > 1) {
        let counter = 0;
        setInterval(() => {
            setCursor(images[counter]);
            counter = (counter + 1) % maxImageNum;
        }, interval);
    }

    var setCursor = function(image) {
        document.body.style.cursor = 'url("../img/system/' + image + '.png"), auto';
    };
})();