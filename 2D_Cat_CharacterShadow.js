/*:
 * @target     MZ
 * @plugindesc v1.1 为游戏角色添加自定义的阴影。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用说明：
 * 1、在插件参数中设置好阴影文件，以及x、y轴偏移量后，进入游戏即可生效。
 * 2、在事件备注中写入[CharacterShadow hideShadow]可以隐藏本事件的阴影。
 * 3、在事件备注中写入[CharacterShadow shadowName:Shadow2 offsetX:0 offsetY:10]
 * 可以自定义本事件的阴影文件，以及x、y轴的偏移量。
 * 4、所需阴影图片文件必须放置在img/system目录下。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210930 v1.1
 *     现在事件备注中的插件标签可以忽略大小写差异。
 * -- 20210928 v1.0
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
 * @param   shadowFileName
 * @text    阴影文件
 * @type    file
 * @dir     img/system
 * @default Shadow1
 *
 * @param   offsetX
 * @text    x轴偏移
 * @type    string
 * @default 0
 *
 * @param   offsetY
 * @text    y轴偏移
 * @type    string
 * @default 0
 */

(() => {
    var params = PluginManager.parameters('2D_Cat_CharacterShadow');

    var shadowFileName = String(params.shadowFileName);
    if (!shadowFileName || shadowFileName === '') shadowFileName = 'Shadow1';
    var offsetX = Number(params.offsetX);
    if (String(offsetX) === 'NaN') offsetX = 0;
    else if   (offsetX < -50000)   offsetX = -50000;
    else if   (offsetX > 50000)    offsetX = 50000;
    var offsetY = Number(params.offsetY);
    if (String(offsetY) === 'NaN') offsetY = 0;
    else if   (offsetY < -50000)   offsetY = -50000;
    else if   (offsetY > 50000)    offsetY = 50000;

    Game_Character.prototype.getCommentSettings = function() {
        let comment  = $gameMap.event(this.eventId()).event().note.trim();
        if (!comment) return [];

        comment = comment.toLowerCase().split('[charactershadow')[1];
        if (!comment) return [];

        comment = comment.split(']')[0];
        if (!comment) return [];

        let rst = comment.trim().split(' ');
        if (rst.length === 0 || rst[0] === '') return [];

        rst.forEach(e => {
            e.trim().toLowerCase();
        });

        return rst;
    };

    Game_Character.prototype.createShadow = function(tilemap) {
        // if (this._shadowSprite) return;
        if (this instanceof Game_Event) {
            this.shadowOffsetX = offsetX;
            this.shadowOffsetY = offsetY;
            let sName = shadowFileName;
            if (this._characterName && this._characterName[0] !== '!') {
                let settings = this.getCommentSettings();
                if (settings.indexOf('hideshadow') > -1) {
                    // Do nothing
                } else {
                    for (let i = 0; i < settings.length; i++) {
                        let e = settings[i].split(':');
                        if (e[0].trim() === 'shadowname') {
                            sName = e[1].trim();
                        } else if (e[0].trim() === 'offsetx') {
                            this.shadowOffsetX = Number(e[1].trim());
                        } else if (e[0].trim() === 'offsety') {
                            this.shadowOffsetY = Number(e[1].trim());
                        }
                    }
                    this.createShadowSprite(sName, tilemap);
                }
            }
        } else if (this instanceof Game_Player) {
            this.shadowOffsetX = offsetX;
            this.shadowOffsetY = offsetY;
            this.createShadowSprite(shadowFileName, tilemap);
        } else if (this instanceof Game_Follower) {
            this.shadowOffsetX = offsetX;
            this.shadowOffsetY = offsetY;
            this.createShadowSprite(shadowFileName, tilemap);
        }
    };

    Game_Character.prototype.createShadowSprite = function(sFileName, tilemap) {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap   = ImageManager.loadSystem(sFileName);
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 1;
        this._shadowSprite.z        = 0;
        tilemap.addChild(this._shadowSprite);
    };

    Game_Character.prototype.updateShadow = function() {
        if (!this._shadowSprite) return;

        this._shadowSprite.x       = this.screenX() + this.shadowOffsetX;
        this._shadowSprite.y       = this.screenY() + this.shadowOffsetY + 6;
        this._shadowSprite.opacity = this.opacity();
        if (!this._characterName || this._characterName === '')
            this._shadowSprite.opacity = 0;
    };

    var _Spriteset_Map_prototype_updateShadow = Spriteset_Map.prototype.updateShadow;
    Spriteset_Map.prototype.updateShadow = function() {
        _Spriteset_Map_prototype_updateShadow.call(this);

        $gamePlayer.updateShadow();
        $gamePlayer._followers._data.forEach(e => {
            e.updateShadow();
        });
        $gameMap.events().forEach(e => {
            e.updateShadow();
        });
    }

    var _Spriteset_Map_prototype_createShadow = Spriteset_Map.prototype.createShadow;
    Spriteset_Map.prototype.createShadow = function() {
        _Spriteset_Map_prototype_createShadow.call(this);

        $gamePlayer.createShadow(this._tilemap);
        $gamePlayer._followers._data.forEach(e => {
            e.createShadow(this._tilemap);
        });
        $gameMap.events().forEach(e => {
            e.createShadow(this._tilemap);
        });
    };
})();