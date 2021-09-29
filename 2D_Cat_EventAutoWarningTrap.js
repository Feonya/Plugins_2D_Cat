/*:
 * @target     MZ
 * @plugindesc v1.0 更方便的将事件变成带预警功能的自动陷阱。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 插件名称：2D_Cat_EventAutoWarningTrap
 *
 * * 使用说明：
 * 使用本插件只需要一个事件和一个事件页，就能实现带有预警功能的自动陷阱，免去了
 * 更加繁琐的事件指令设置。
 * 1、创建一个事件，确保勾选“选项”中的“穿透”，“踏步动画”可选。
 * 2、确保这个事件的“优先级”为“在人物下方”。
 * 3、确保这个事件的“触发条件”不设置为“自动执行”，可按需选择其他“触发条件”。
 * 4、将这个事件的“图像”设为某个角色3x4块大小范围内“面朝上方”或“面朝下方”的图像，
 * 这个方向将作为陷阱未启动时的图像；相应的，与这个方向相反的方向，将作为陷阱启
 * 动时的图像。
 * 5、在这个事件备注或注释内写下设置标签。如果写在备注内，则对所有事件页生效；
 * 如果卸载注释内，则仅当本事件页激活时生效。
 * 6、设置标签示例如下。
 *     带完整属性的设置标签（无论换行与否，各属性间至少留一个空格）：
 *     [EventAutoWarningTrap
 *      deactivatedDuration:180 warningDuration:180 activatedDuration:180
 *      warningBlinkColor:#ff0000 warningBlinkBrightness:510 warningBlinkSpeed:15
 *      commonEventId:0 processCommonEventSpeed:15 soundName:Flash1
 *      randomStartState:true inverseDirection:false]
 *     省略属性，使用默认值的设置标签：
 *     [EventAutoWarningTrap]
 * 7、设置标签属性解释如下。
 *     deactivatedDuration用于设置陷阱未启动未预警的持续帧数。
 *     warningDuration用于设置陷阱未启动开始预警的持续帧数。
 *     activatedDuration用于设置陷阱启动后的持续帧数。
 *     warningBlinkColor用于设置陷阱预警的闪烁色调（带井号“#”的16进制色彩值）。
 *     warningBlinkBrightness用于设置陷阱预警的闪烁亮度（0~510，255为默认）。
 *     warningBlinkSpeed用于设置陷阱预警的闪烁频率(大于0，单位为帧，越小越快)。
 *     commonEventId用于设置玩家进入启动后的陷阱时，触发哪个编号的共通事件。
 *     processCommonEventSpeed用于设置触发共通事件时的频率(同闪射频率设置)。
 *     soundName用于设置陷阱启动时的音效（audio/se目录下不带扩展名的文件名）。
 *     randomStartState用于设置一开始是否随机陷阱的状态（未启动、预警、启动）。
 *     inverseDirection用于设置是否反转陷阱图片未启动与启动的方向（若为真，则向
 * 下的图像表示未启动，向上的图像表示启动；若为假，则反之）。
 * 8、标签暂时不能忽略大小写差异！
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210923 v1.0
 *     实现插件基本功能。
 *
 * * 致谢说明：
 * 感谢B站用户 蛟龙DRONGEN 提供本插件的创意想法。
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
 */

(() => {
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

    Game_Event.prototype.getEventAutoWarningTrapCommentSettings = function() {
        let comment = this.event().note.trim();
        if (!comment) return [];

        if (comment.indexOf('[EventAutoWarningTrap]') > -1) return ['useDefaultSettings'];

        comment = comment.split('[EventAutoWarningTrap')[1];
        if (!comment) return [];

        comment = comment.split(']')[0];
        if (!comment) return [];

        return comment.trim().split(' ');
    };

    Game_Event.prototype.getEventAutoWarningTrapAnnotationSettings = function(pIdx) {
        let annotation = null;
        let page       = this.event().pages[pIdx];
        let annoTemp   = '';
        for (let i = 0; i < page.list.length; i++) {
            if (page.list[i].code === 108 || page.list[i].code === 408) {
                annoTemp += page.list[i].parameters[0];
            }
        }
        if (annoTemp.indexOf('[EventAutoWarningTrap]') > -1) {
            return ['useDefaultSettings'];
        } else if (annoTemp.indexOf('[EventAutoWarningTrap') > -1) {
            annotation = annoTemp;
        }
        if (!annotation) return [];

        annotation = annotation.split('[EventAutoWarningTrap')[1];
        if (!annotation) return [];

        annotation = annotation.split(']')[0];
        if (!annotation) return [];

        return annotation.trim().split(' ');
    };

    Game_Event.prototype.setupEventAutoWarningTrapSettings = function() {
        if (!this.eventAutoWarningTrapCommentSettings)
            this.eventAutoWarningTrapCommentSettings = this.getEventAutoWarningTrapCommentSettings();
        if (this.eventAutoWarningTrapCommentSettings.length === 0 || this.eventAutoWarningTrapCommentSettings[0] === '')
            this.eventAutoWarningTrapAnnotationSettings = this.getEventAutoWarningTrapAnnotationSettings(this._pageIndex);
    };

    Game_Event.prototype.setupEventAutoWarningTrapSettingsValue = function() {
        let settings = null;
        if (this.eventAutoWarningTrapCommentSettings            &&
            this.eventAutoWarningTrapCommentSettings.length > 0 &&
            this.eventAutoWarningTrapCommentSettings[0] !== '') {
            settings = this.eventAutoWarningTrapCommentSettings;
        } else if (this.eventAutoWarningTrapAnnotationSettings            &&
                   this.eventAutoWarningTrapAnnotationSettings.length > 0 &&
                   this.eventAutoWarningTrapAnnotationSettings[0] !== '') {
            settings = this.eventAutoWarningTrapAnnotationSettings;
        }
        if (!settings) {
            return;
        } else {
            this.thisIsAEventAutoWarningTrap            = true;
            this.eventAutoWarningTrapOnWarningColor     = true;
            this.eventAutoWarningTrapPlayerCollideCount = -1; // -1表示陷阱激活后，玩家尚未进入
            this.useDefaultEventAutoWarningTrapSettingsValue();
            settings.forEach(e => {
                let kv = e.split(':');
                switch(kv[0].trim()) {
                    case 'deactivatedDuration':
                        this.eventAutoWarningTrapDeactivatedDuration     = kv[1].trim();
                        break;
                    case 'warningDuration':
                        this.eventAutoWarningTrapWarningDuration         = kv[1].trim();
                        break;
                    case 'activatedDuration':
                        this.eventAutoWarningTrapActivatedDuration       = kv[1].trim();
                        break;
                    case 'warningBlinkColor':
                        this.eventAutoWarningTrapWarningBlinkColor       = kv[1].trim();
                        break;
                    case 'warningBlinkBrightness':
                        this.eventAutoWarningTrapWarningBlinkBrightness  = kv[1].trim();
                        break;
                    case 'warningBlinkSpeed':
                        this.eventAutoWarningTrapWarningBlinkSpeed       = kv[1].trim();
                        break;
                    case 'commonEventId':
                        this.eventAutoWarningTrapCommonEventId           = kv[1].trim();
                        break;
                    case 'processCommonEventSpeed':
                        this.eventAutoWarningTrapProcessCommonEventSpeed = kv[1].trim();
                        break;
                    case 'soundName':
                        this.eventAutoWarningTrapSoundName               = kv[1].trim();
                        break;
                    case 'randomStartState':
                        this.eventAutoWarningTrapRandomStartState        = kv[1].trim();
                        break;
                    case 'inverseDirection':
                        this.eventAutoWarningTrapInverseDirection        = kv[1].trim();
                        break;
                }
            });
            this.fixEventAutoWarningTrapSettingsValueType();
            this.setEventAutoWarningTrapState();
            if (this.eventAutoWarningTrapInverseDirection) {
                this.eventAutoWarningTrapLeft  = 6;
                this.eventAutoWarningTrapRight = 4;
                this.eventAutoWarningTrapUp    = 2;
                this.eventAutoWarningTrapDown  = 8;
            } else {
                this.eventAutoWarningTrapLeft  = 4;
                this.eventAutoWarningTrapRight = 6;
                this.eventAutoWarningTrapUp    = 8;
                this.eventAutoWarningTrapDown  = 2;
            }
        }
    };

    Game_Event.prototype.useDefaultEventAutoWarningTrapSettingsValue = function() {
        this.eventAutoWarningTrapDeactivatedDuration     = '180';
        this.eventAutoWarningTrapWarningDuration         = '180';
        this.eventAutoWarningTrapActivatedDuration       = '180';
        this.eventAutoWarningTrapWarningBlinkColor       = '#ff0000';
        this.eventAutoWarningTrapWarningBlinkBrightness  = '510';
        this.eventAutoWarningTrapWarningBlinkSpeed       = '10';
        this.eventAutoWarningTrapCommonEventId           = '0';
        this.eventAutoWarningTrapProcessCommonEventSpeed = '15';
        this.eventAutoWarningTrapSoundName               = 'Flash1';
        this.eventAutoWarningTrapRandomStartState        = 'true';
        this.eventAutoWarningTrapInverseDirection        = 'false';
    };

    Game_Event.prototype.fixEventAutoWarningTrapSettingsValueType = function() {
        this.eventAutoWarningTrapDeactivatedDuration     = Number(this.eventAutoWarningTrapDeactivatedDuration);
        this.eventAutoWarningTrapWarningDuration         = Number(this.eventAutoWarningTrapWarningDuration);
        this.eventAutoWarningTrapActivatedDuration       = Number(this.eventAutoWarningTrapActivatedDuration);
        this.eventAutoWarningTrapWarningBlinkColor       = [Number('0x' + this.eventAutoWarningTrapWarningBlinkColor.slice(1, 3)),
                                                            Number('0x' + this.eventAutoWarningTrapWarningBlinkColor.slice(3, 5)),
                                                            Number('0x' + this.eventAutoWarningTrapWarningBlinkColor.slice(5))];
        this.eventAutoWarningTrapWarningBlinkBrightness  = Number(this.eventAutoWarningTrapWarningBlinkBrightness);
        this.eventAutoWarningTrapWarningBlinkSpeed       = Number(this.eventAutoWarningTrapWarningBlinkSpeed);
        this.eventAutoWarningTrapCommonEventId           = Number(this.eventAutoWarningTrapCommonEventId);
        this.eventAutoWarningTrapProcessCommonEventSpeed = Number(this.eventAutoWarningTrapProcessCommonEventSpeed);
        this.eventAutoWarningTrapSoundName               = String(this.eventAutoWarningTrapSoundName);
        this.eventAutoWarningTrapRandomStartState        = this.eventAutoWarningTrapRandomStartState === 'true';
        this.eventAutoWarningTrapInverseDirection        = this.eventAutoWarningTrapInverseDirection === 'true';
    };

    Game_Event.prototype.fixEventAutoWarningTrapPriority = function() {
        if      ($gamePlayer.y <  this.y && this._priorityType !== 2) this.setPriorityType(2)
        else if ($gamePlayer.y >= this.y && this._priorityType !== 0) this.setPriorityType(0);
    }

    Game_Event.prototype.setEventAutoWarningTrapState = function() {
        if (this.eventAutoWarningTrapRandomStartState) {
            let randNum = Math.floor(Math.random() * 3);
            console.log(randNum)
            if (randNum === 0) {
                this.eventAutoWarningTrapState = 'deactivated';
            } else if (randNum === 1) {
                this.eventAutoWarningTrapState = 'warning';
            } else {
                this.eventAutoWarningTrapState = 'activated';
            }
        } else {
            this.eventAutoWarningTrapState = 'deactivated';
        }
        this.eventAutoWarningTrapStateCount = 0;
    };

    Game_Event.prototype.setupEventAutoWarningTrap = function() {
        this.setupEventAutoWarningTrapSettings();
        this.setupEventAutoWarningTrapSettingsValue();
    };

    Game_Event.prototype.updateEventAutoWarningTrap = function() {
        if (this.eventAutoWarningTrapState === 'deactivated') {
            if (this.eventAutoWarningTrapStateCount < this.eventAutoWarningTrapDeactivatedDuration) {
                this.eventAutoWarningTrapStateCount++;
                if (this._direction !== this.eventAutoWarningTrapUp)    this._direction = this.eventAutoWarningTrapUp;
                if (this.eventAutoWarningTrapPlayerCollideCount !== -1) this.eventAutoWarningTrapPlayerCollideCount = -1;
            } else {
                this.eventAutoWarningTrapState      = 'warning';
                this.eventAutoWarningTrapStateCount = 0;
            }
        } else if (this.eventAutoWarningTrapState === 'warning') {
            if (this.eventAutoWarningTrapStateCount < this.eventAutoWarningTrapWarningDuration) {
                this.eventAutoWarningTrapStateCount++;
                if (this._direction !== this.eventAutoWarningTrapUp) this._direction = this.eventAutoWarningTrapUp;
                if (this.eventAutoWarningTrapStateCount % this.eventAutoWarningTrapWarningBlinkSpeed === 0) {
                    if (!this.eventAutoWarningTrapOnWarningColor) {
                        this.eventAutoWarningTrapOnWarningColor = true;
                        this.eventAutoWarningTrapSprite.setColorTone([this.eventAutoWarningTrapWarningBlinkColor[0],
                                                                      this.eventAutoWarningTrapWarningBlinkColor[1],
                                                                      this.eventAutoWarningTrapWarningBlinkColor[2],
                                                                      0]);
                        this.eventAutoWarningTrapSprite._colorFilter.setBrightness(this.eventAutoWarningTrapWarningBlinkBrightness);
                    } else {
                        this.eventAutoWarningTrapOnWarningColor = false;
                        this.eventAutoWarningTrapSprite.setColorTone([0, 0, 0, 0]);
                        this.eventAutoWarningTrapSprite._colorFilter.setBrightness(255);
                    }
                }
            } else {
                this.eventAutoWarningTrapState      = 'activated';
                this.eventAutoWarningTrapStateCount = 0;
                AudioManager.playSe({name:this.eventAutoWarningTrapSoundName, volume:90, pitch:100, pan:0});
            }
        } else {
            if (this.eventAutoWarningTrapStateCount < this.eventAutoWarningTrapActivatedDuration) {
                this.eventAutoWarningTrapStateCount++;
                if (this.eventAutoWarningTrapOnWarningColor) {
                    this.eventAutoWarningTrapOnWarningColor = false;
                    this.eventAutoWarningTrapSprite.setColorTone([0, 0, 0, 0]);
                    this.eventAutoWarningTrapSprite._colorFilter.setBrightness(255);
                }
                if (this._direction !== this.eventAutoWarningTrapDown) {
                    if (this._direction === this.eventAutoWarningTrapUp && this.eventAutoWarningTrapStateCount > 5)
                        this._direction = this.eventAutoWarningTrapRight;
                    else if (this._direction === this.eventAutoWarningTrapRight && this.eventAutoWarningTrapStateCount > 10)
                        this._direction = this.eventAutoWarningTrapLeft;
                    else if (this._direction === this.eventAutoWarningTrapLeft)
                        this._direction = this.eventAutoWarningTrapDown;
                }
                if ($gamePlayer.x === this.x && $gamePlayer.y === this.y) {
                    if (this.eventAutoWarningTrapPlayerCollideCount === -1) {
                        this.eventAutoWarningTrapPlayerCollideCount = this.eventAutoWarningTrapStateCount;
                        $gameTemp.reserveCommonEvent(this.eventAutoWarningTrapCommonEventId);
                    } else if ((this.eventAutoWarningTrapStateCount - this.eventAutoWarningTrapPlayerCollideCount) %
                               this.eventAutoWarningTrapProcessCommonEventSpeed === 0) {
                        $gameTemp.reserveCommonEvent(this.eventAutoWarningTrapCommonEventId);
                    }
                } else {
                    if (this.eventAutoWarningTrapPlayerCollideCount !== -1) this.eventAutoWarningTrapPlayerCollideCount = -1;
                }
            } else {
                this.eventAutoWarningTrapState      = 'deactivated';
                this.eventAutoWarningTrapStateCount = 0;
            }
        }
    };

    var _Game_Event_prototype_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Game_Event_prototype_setupPageSettings.call(this);
        this.setupEventAutoWarningTrap();
    };

    var _Game_Event_prototype_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_Event_prototype_update.call(this);

        if (this.thisIsAEventAutoWarningTrap) {
            if (!this.eventAutoWarningTrapSprite) {
                this.eventAutoWarningTrapSprite = getEventSprite(this.eventId());
                if (!this.eventAutoWarningTrapSprite._colorFilter)
                    this.eventAutoWarningTrapSprite._createColorFilter();
            }

            if (!this.eventAutoWarningTrapSprite.filters ||
                this.eventAutoWarningTrapSprite.filters.indexOf(this.eventAutoWarningTrapSprite._colorFilter) < 0) {
                this.eventAutoWarningTrapSprite = getEventSprite(this.eventId());
                this.eventAutoWarningTrapSprite._createColorFilter();
            }

            this.fixEventAutoWarningTrapPriority();
            this.updateEventAutoWarningTrap();
            // console.log(this.eventAutoWarningTrapState);
        }
    };
})();