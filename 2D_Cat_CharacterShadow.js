/*:
 * @target     MZ
 * @plugindesc v1.3 为游戏角色添加自定义的阴影。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用说明：
 * 1、仅主角、跟随者，以及图片名无感叹号“!”前缀的事件可以生成阴影。
 * 2、所需阴影图片文件必须放置在img/system目录下。
 * 3、在插件参数中设置好阴影文件，以及x、y轴偏移量后，进入游戏即可生效。
 * 4、在事件备注中写入[CharacterShadow hideShadow]可以永久隐藏本事件的阴影。
 * 5、在事件备注中写入[CharacterShadow shadowName:Shadow2 offsetX:0 offsetY:10]
 * 可以自定义本事件的阴影文件，以及x、y轴的偏移量。
 * 6、可在任意事件调用“禁用阴影”来暂时禁用主角、跟随者或指定事件的阴影。
 * 7、可在任意事件调用“激活阴影”来重新激活主角、跟随者或指定事件的阴影（注意本
 * 指令无法激活拥有[CharacterShadow hideShadow]标签事件的阴影）。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20211012 v1.3
 *     修复了插件导致无法存档的Bug。
 * -- 20211005 v1.2
 *     增加了“禁用阴影”和“激活阴影”插件指令。
 * -- 20210930 v1.1
 *     现在事件备注中的插件标签可以忽略大小写差异。
 * -- 20210928 v1.0
 *     实现插件基本功能。
 *
 * * 致谢说明：
 * 1、感谢B站用户 C某人这次亿定 关于禁用主角阴影的建议。
 * 2、感谢Q友 云上的瘦子 反馈无法存档的Bug。
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
 *
 * @command disableShadow
 * @text    禁用阴影
 *
 * @arg     disableEventId
 * @text    事件编号
 * @type    number
 * @default 0
 * @min     0
 * @desc    待禁用阴影的事件编号，0表示主角和所有跟随者。
 *
 * @command enableShadow
 * @text    激活阴影
 *
 * @arg     enableEventId
 * @text    事件编号
 * @type    number
 * @default 0
 * @min     0
 * @desc    待激活阴影的事件编号，0表示主角和所有跟随者。
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

    PluginManager.registerCommand('2D_Cat_CharacterShadow', 'disableShadow', args => {
        let eId = Number(args.disableEventId);
        if (eId === 0) {
            $gamePlayer._shadowTextureBackup  = $gamePlayer._shadowSprite.texture;
            $gamePlayer._shadowSprite.texture = null;
            let followers = $gamePlayer.followers()._data;
            followers.forEach(e => {
                e._shadowTextureBackup  = e._shadowSprite.texture;
                e._shadowSprite.texture = null;
            });
        } else {
            let event = $gameMap.event(eId);
            if (!event._shadowSprite) return;
            event._shadowTextureBackup  = event._shadowSprite.texture;
            event._shadowSprite.texture = null;
        }
    });

    PluginManager.registerCommand('2D_Cat_CharacterShadow', 'enableShadow', args => {
        let eId = Number(args.enableEventId);
        if (eId === 0) {
            if (!$gamePlayer._shadowTextureBackup) return;
            $gamePlayer._shadowSprite.texture = $gamePlayer._shadowTextureBackup;
            $gamePlayer._shadowTextureBackup  = null;
            let followers = $gamePlayer.followers()._data;
            followers.forEach(e => {
                if (!e._shadowTextureBackup) return;
                e._shadowSprite.texture = e._shadowTextureBackup;
                e._shadowTextureBackup  = null;
            });
        } else {
            let event = $gameMap.event(eId);
            if (!event._shadowTextureBackup) return;
            event._shadowSprite.texture = event._shadowTextureBackup;
            event._shadowTextureBackup  = null;
        }
    });

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
        if (this._shadowTextureBackup) {
            this._shadowSprite.texture = null;
        }
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
    };

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

    JsonEx._encode = function(value, depth) {
        if (depth >= this.maxDepth) {
            throw new Error("Object too deep");
        }
        const type = Object.prototype.toString.call(value);
        if (type === "[object Object]" || type === "[object Array]") {
            if (value instanceof Sprite) return; // 存档时，数据中不能含有Sprite等图像信息
            const constructorName = value.constructor.name;
            if (constructorName !== "Object" && constructorName !== "Array") {
                value["@"] = constructorName;
            }
            for (const key of Object.keys(value)) {
                value[key] = this._encode(value[key], depth + 1);
            }
        }
        return value;
    };
})();