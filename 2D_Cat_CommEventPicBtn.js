/*:
 * @target     MZ
 * @plugindesc v1.4 调出一个或多个自定义图片按钮，点击触发共通事件。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用说明：
 * 1、需要使用的图片请放置在img/pictures目录下，仅支持png图片。
 * 2、在任意事件中调用本插件的“调出图片按钮”指令，并依次设置好相关参数即可。
 * 3、在执行内容未等待情况下，多次调用上方指令，可同时调出多个图片按钮。
 * 4、可以在任意事件中调用“销毁图片按钮”指令来销毁指定编号的图片按钮，所有拥有
 * 该编号的图片按钮将被销毁。
 * 5、可以在任意事件中调用“销毁所有图片按钮”指令一次性销毁现存所有图片按钮。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210919 v1.4
 *     图片按钮不会再遮挡图片以及对话框等窗口。
 *     对话框弹出时，图片按钮不可点击。
 *     图片按钮存在时可以调出菜单界面，返回后恢复图片按钮。
 *     增加了“销毁图片按钮”和“销毁所有图片按钮”指令，现在点击图片按钮不会消失，
 * 需要调用指令手动销毁。
 * -- 20210917 v1.3
 *     增加了设置图片锚点位置的指令；图片按钮坐标值现在可以设为负值。
 * -- 20210915 v1.2
 *     修复了在并行事件中调出图片按钮可能报错的Bug。
 * -- 20210911 v1.1
 *     将图片选择更改为可视化方式。
 * -- 20210910 v1.0
 *     实现插件基本功能。
 *
 * * 致谢说明：
 * 1、本插件的忽略按钮图片透明像素功能，使用了Github用户 ivanpopelyshev 的代码，
 * 非常感谢！
 * 2、感谢Gitee用户 vip徐浩 提供关于图片选择可视化的修改建议！
 * 3、感谢B站用户 靓点迷人 提供关于并行事件中调出图片按钮可能报错的Bug反馈，以
 * 及配合进行该Bug修复的测试！
 * 4、感谢B站用户 靓点迷人 提供关于图片按钮坐标值不能设为负值的问题反馈！
 * 5、感谢B站用户 靓点迷人 提供关于图片按钮与对话框、图片以及菜单之间存在冲突
 * 的反馈意见！
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
 * @command showPictureButton
 * @text    调出图片按钮
 * @desc    非等待情况下，多次调用本指令可同时调出多个按钮。
 *
 * @arg     buttonId
 * @text    图片按钮编号
 * @type    number
 * @default 1
 * @min     1
 *
 * @arg     _cutLine1
 * @text    ------------------------
 * @default
 *
 * @arg     buttonNormalPictureName
 * @text    正常按钮图片
 * @desc    至少要设置一个正常按钮图片。
 * @type    file
 * @dir     img/pictures
 *
 * @arg     _cutLine2
 * @text    ------------------------
 * @default
 *
 * @arg     buttonOverPictureName
 * @text    悬停按钮图片
 * @desc    可选，若留空，则悬停时不改变图片。
 * @type    file
 * @dir     img/pictures
 *
 * @arg     buttonOverPictureTint
 * @text    悬停按钮图片色调
 * @type    string
 * @default #96e3ff
 * @desc    可选，带井号“#”的16进制颜色值，若留空，则悬停时不改变图片色调。
 *
 * @arg     buttonOverPictureBrightness
 * @text    悬停按钮图片亮度
 * @type    string
 * @default 1.5
 * @desc    可选，0~10之间的实数，0为纯黑，1为正常，10为最亮，若留空，则悬停时不改变图片亮度。
 *
 * @arg     _cutLine3
 * @text    ------------------------
 * @default
 *
 * @arg     buttonDownPictureName
 * @text    按下按钮图片
 * @desc    可选，若留空，则按下时不改变图片。
 * @type    file
 * @dir     img/pictures
 *
 * @arg     buttonDownPictureTint
 * @text    按下按钮图片色调
 * @type    string
 * @default #ff8a8a
 * @desc    可选，带井号“#”的16进制颜色值，若留空，则按下时不改变图片色调。
 *
 * @arg     buttonDownPictureBrightness
 * @text    按下按钮图片亮度
 * @type    string
 * @default 0.5
 * @desc    可选，0~10之间的实数，0为纯黑，1为正常，10为最亮，若留空，则按下时不改变图片亮度。
 *
 * @arg     _cutLine4
 * @text    ------------------------
 * @default
 *
 * @arg     anchorX
 * @text    锚点位置x值
 * @type    string
 * @default 0.5
 * @desc    0~1之间的实数，越大锚点越靠图片右边，反之越靠左边，0.5为图片x轴中心点。
 *
 * @arg     anchorY
 * @text    锚点位置y值
 * @type    string
 * @default 0.5
 * @desc    0~1之间的实数，越大锚点越靠图片下边，反之越靠上边，0.5为图片y轴中心点。
 *
 * @arg     _cutLine5
 * @text    ------------------------
 * @default
 *
 * @arg     positionX
 * @text    位置x坐标值（px）
 * @type    number
 * @default 320
 * @min     -50000
 * @max     50000
 * @desc    即图片按钮显示在游戏画面中的x坐标值。
 *
 * @arg     positionY
 * @text    位置y坐标值（px）
 * @type    number
 * @default 360
 * @min     -50000
 * @max     50000
 * @desc    即图片按钮显示在游戏画面中的y坐标值。
 *
 * @arg     _cutLine6
 * @text    ------------------------
 * @default
 *
 * @arg     commonEventId
 * @text    共通事件编号
 * @type    number
 * @default 0
 * @min     0
 * @desc    按下按钮后调用哪个共通事件，0表示不调用任何共通事件。
 *
 * @arg     _cutLine7
 * @text    ------------------------
 * @default
 *
 * @arg     canPlayerMove
 * @text    玩家是否可移动
 * @type    boolean
 * @default false
 * @desc    图片按钮显示时玩家是否可移动，注意本参数最后一次设定将会影响之前本参数的设定。
 *
 * @arg     ignoreTransparence
 * @text    是否忽略透明像素
 * @type    boolean
 * @default true
 * @desc    点击图片按钮时是否忽略透明部分，注意本参数最后一次设定将会影响之前本参数的设定。
 *
 * @command destroyButtonById
 * @text    销毁图片按钮
 *
 * @arg     destroyButtonId
 * @text    图片按钮编号
 * @type    number
 * @default 1
 * @min     1
 * @desc    销毁所有此编号的图片按钮。
 *
 * @command destroyAllButtons
 * @text    销毁所有图片按钮
 */

var P_2D_C = P_2D_C || {};

(() => {
    class CommEventPicBtn {
        constructor() {
            this.spr      = null;
            this.id       = 1;
            this.norTex   = null;
            this.overTex  = null;
            this.overTint = null;
            this.overBrit = null;
            this.downTex  = null;
            this.downTint = null;
            this.overBrit = null;
            this.isDown   = false;
            this.isOver   = false;
            this.commEvId = 0;
        }

        registerBtnEvents() {
            this.spr.on('pointerdown'     , () => this.onBtnDown());
            this.spr.on('pointerup'       , () => this.onBtnUp  ());
            this.spr.on('pointerupoutside', () => this.onBtnUp  ());
            this.spr.on('pointerover'     , () => this.onBtnOver());
            this.spr.on('pointerout'      , () => this.onBtnOut ());
        }

        onBtnDown() {
            // console.log('down')
            if ($gameMessage.isBusy()) return;
            if (this.downTex  !== null) this.spr.texture = this.downTex;
            if (this.downTint !== null) this.spr.tint    = this.downTint;
            if (this.downBrit !== null) this.spr.filters = [this.downBrit];
            this.isDown = true;
        }

        onBtnUp() {
            // console.log('up')
            if ($gameMessage.isBusy()) return;
            if (this.isOver) {
                if (this.overTex  !== null) this.spr.texture = this.overTex;
                if (this.overTint !== null) this.spr.tint    = this.overTint;
                if (this.overBrit !== null) this.spr.filters = [this.overBrit];
            } else {
                this.spr.texture = this.norTex;
                this.spr.tint    = 0xffffff;
                this.spr.filters = [];
            }
            if (this.isDown) {
                // destoryAllBtnSpr();
                if (this.commEvId !== 0) $gameTemp.reserveCommonEvent(this.commEvId);
            }
            this.isDown  = false;
        }

        onBtnOver() {
            // console.log('over')
            if ($gameMessage.isBusy()) return;
            if (this.isDown)           return;
            if (this.overTex  !== null) this.spr.texture = this.overTex;
            if (this.overTint !== null) this.spr.tint    = this.overTint;
            if (this.overBrit !== null) this.spr.filters = [this.overBrit];
            this.isOver = true;
        }

        onBtnOut() {
            // console.log('out')
            if ($gameMessage.isBusy()) return;
            if (this.isDown)           return;
            this.spr.texture = this.norTex;
            this.spr.tint    = 0xffffff;
            this.spr.filters = [];
            this.isOver = false;
        }

    }

    var button = null;
    var _Game_Player_prototype_canMove       = Game_Player.prototype.canMove;
    var _PIXI_Sprite_prototype_containsPoint = PIXI.Sprite.prototype.containsPoint;

    P_2D_C.picBtnContainer = null;
    P_2D_C.picBtnsArr      = [];
    P_2D_C.pixiTempApp     = P_2D_C.pixiTempApp || new PIXI.Application();

    PluginManager.registerCommand('2D_Cat_CommEventPicBtn', 'showPictureButton', args => {
        P_2D_C.btnId          = Number(args.buttonId);
        P_2D_C.btnNorPicName  = String(args.buttonNormalPictureName);
        P_2D_C.btnOverPicName = String(args.buttonOverPictureName);
        P_2D_C.btnOverPicTint = Number('0x' + args.buttonOverPictureTint.slice(1));
        P_2D_C.btnOverPicBrit = Number(args.buttonOverPictureBrightness);
        P_2D_C.btnDownPicName = String(args.buttonDownPictureName);
        P_2D_C.btnDownPicTint = Number('0x' + args.buttonDownPictureTint.slice(1));
        P_2D_C.btnDownPicBrit = Number(args.buttonDownPictureBrightness);
        P_2D_C.anchorX        = Number(args.anchorX);
        P_2D_C.anchorY        = Number(args.anchorY);
        P_2D_C.posX           = Number(args.positionX);
        P_2D_C.posY           = Number(args.positionY);
        P_2D_C.commEventId    = Number(args.commonEventId);
        P_2D_C.canPlayerMove  = String(args.canPlayerMove)      === 'true';
        P_2D_C.ignoreTransp   = String(args.ignoreTransparence) === 'true';

        if (P_2D_C.ignoreTransp) {
            PIXI.Sprite.prototype.containsPoint = PIXI_Sprite_prototype_containsPoint;
        } else {
            PIXI.Sprite.prototype.containsPoint = _PIXI_Sprite_prototype_containsPoint;
        }

        setupButton();
    });

    PluginManager.registerCommand('2D_Cat_CommEventPicBtn', 'destroyButtonById', args => {
        destroyBtnById(Number(args.destroyButtonId));
    });

    PluginManager.registerCommand('2D_Cat_CommEventPicBtn', 'destroyAllButtons', () => {
        destoryAllBtns();
    });

    function fixData() {
        if (String(P_2D_C.anchorX) === 'NaN') P_2D_C.anchorX = 0.5;
        else if   (P_2D_C.anchorX < 0)        P_2D_C.anchorX = 0;
        else if   (P_2D_C.anchorX > 1)        P_2D_C.anchorX = 1;

        if (String(P_2D_C.anchorY) === 'NaN') P_2D_C.anchorY = 0.5;
        else if   (P_2D_C.anchorY < 0)        P_2D_C.anchorY = 0;
        else if   (P_2D_C.anchorY > 1)        P_2D_C.anchorY = 1;

        if (String(P_2D_C.btnOverPicTint) === 'NaN') P_2D_C.btnOverPicTint = 0x96e3ff;
        else if   (P_2D_C.btnOverPicTint < 0x000000) P_2D_C.btnOverPicTint = 0x000000;
        else if   (P_2D_C.btnOverPicTint > 0xffffff) P_2D_C.btnOverPicTint = 0xffffff;

        if (String(P_2D_C.btnDownPicTint) === 'NaN') P_2D_C.btnDownPicTint = 0xff8a8a;
        else if   (P_2D_C.btnDownPicTint < 0x000000) P_2D_C.btnDownPicTint = 0x000000;
        else if   (P_2D_C.btnDownPicTint > 0xffffff) P_2D_C.btnDownPicTint = 0xffffff;

        if (String(P_2D_C.btnOverPicBrit) === 'NaN') P_2D_C.btnOverPicBrit = 1.5;
        else if   (P_2D_C.btnOverPicBrit < 0)        P_2D_C.btnOverPicBrit = 0;
        else if   (P_2D_C.btnOverPicBrit > 10)       P_2D_C.btnOverPicBrit = 10;

        if (String(P_2D_C.btnDownPicBrit) === 'NaN') P_2D_C.btnDownPicBrit = 0.5;
        else if   (P_2D_C.btnDownPicBrit < 0)        P_2D_C.btnDownPicBrit = 0;
        else if   (P_2D_C.btnDownPicBrit > 10)       P_2D_C.btnDownPicBrit = 10;
    }

    function setupButton() {
        fixData();

        button = new CommEventPicBtn();

        button.id       = P_2D_C.btnId;
        button.commEvId = P_2D_C.commEventId;

        button.norTex = PIXI.Texture.from('img/pictures/' + P_2D_C.btnNorPicName + '.png');
        if (P_2D_C.btnOverPicName !== 'undefined' && P_2D_C.btnOverPicName !== '')
            button.overTex = PIXI.Texture.from('img/pictures/' + P_2D_C.btnOverPicName + '.png');
        if (P_2D_C.btnDownPicName !== 'undefined' && P_2D_C.btnDownPicName !== '')
            button.downTex = PIXI.Texture.from('img/pictures/' + P_2D_C.btnDownPicName + '.png');

        button.spr = new PIXI.Sprite(button.norTex);
        button.spr.texture     = button.norTex;
        button.spr.anchor.set(P_2D_C.anchorX, P_2D_C.anchorY);
        button.spr.x           = P_2D_C.posX;
        button.spr.y           = P_2D_C.posY;
        button.spr.interactive = true;

        button.overTint = P_2D_C.btnOverPicTint;
        button.downTint = P_2D_C.btnDownPicTint;

        button.overBrit = new PIXI.filters.ColorMatrixFilter();
        button.overBrit.brightness(P_2D_C.btnOverPicBrit, true);
        button.downBrit = new PIXI.filters.ColorMatrixFilter();
        button.downBrit.brightness(P_2D_C.btnDownPicBrit, true);

        button.registerBtnEvents();
        letHtmlTagsNotToBlockBtn();
        fixPlayerMove();

        P_2D_C.picBtnsArr.push(button);
        P_2D_C.picBtnContainer.addChild(button.spr);
    }

    function letHtmlTagsNotToBlockBtn() {
        document.getElementById('gameVideo')   .style.pointerEvents = 'none';
        document.getElementById('errorPrinter').style.pointerEvents = 'none';
    }

    function restoreHtmlTags() {
        document.getElementById('gameVideo')   .style.pointerEvents = '';
        document.getElementById('errorPrinter').style.pointerEvents = '';
    }

    function fixPlayerMove() {
        if (P_2D_C.canPlayerMove) {
            restorePlayerMove();
            return;
        }
        $gamePlayer.canMove = () => { return false; };
        $gamePlayer.setDirectionFix(true);
    }

    function restorePlayerMove() {
        $gamePlayer.canMove = _Game_Player_prototype_canMove;
        $gamePlayer.setDirectionFix(false);
    }

    function destroyBtnById(id) {
        P_2D_C.picBtnsArr.forEach(e => {
            if (e.id === id) {
                P_2D_C.picBtnContainer.removeChild(e.spr);
                let eIdx = P_2D_C.picBtnsArr.indexOf(e);
                if (eIdx > 0) P_2D_C.picBtnsArr.splice(eIdx, 1);
            }
        });

        if (P_2D_C.picBtnsArr.length <= 0) {
            restoreHtmlTags();
            restorePlayerMove();
        }
    }

    function destoryAllBtns() {
        P_2D_C.picBtnsArr.forEach(e => {
            P_2D_C.picBtnContainer.removeChild(e.spr);
        });
        P_2D_C.picBtnsArr = [];
        restoreHtmlTags();
        restorePlayerMove();
    }

    var _Scene_Map_prototype_callMenu = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function() {
        _Scene_Map_prototype_callMenu.call(this);

        if (P_2D_C.picBtnContainer)
            P_2D_C.picBtnContainer.setParent(P_2D_C.pixiTempApp.stage);
    };

    var _Scene_Map_prototype_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_prototype_onMapLoaded.call(this);

        if (P_2D_C.picBtnContainer) {
            P_2D_C.picBtnContainer.setParent(SceneManager._scene._spriteset);
            SceneManager._scene._spriteset.setChildIndex(P_2D_C.picBtnContainer, 2);
        } else {
            P_2D_C.picBtnContainer = new PIXI.Container();
            SceneManager._scene._spriteset.addChildAt(P_2D_C.picBtnContainer, 2);
        }
    };

    /***************************************************************************************
     * 下方代码摘自https://github.com/pixijs/pixijs/wiki/v5-Hacks#pixel-perfect-interaction，
     * 它实现了将Sprite作为按钮时，忽略透明像素的功能。
     */

    var PIXI_Sprite_prototype_containsPoint = function(point) {
        const tempPoint = {x: 0, y: 0 }
        //get mouse poisition relative to the bunny anchor point
        this.worldTransform.applyInverse(point, tempPoint);
        // console.error('temppoint:' + tempPoint);

        const width = this._texture.orig.width;
        const height = this._texture.orig.height;
        const x1 = -width * this.anchor.x;
        let y1 = 0;

        let flag = false;
        //collision detection for sprite (as a square, not pixel perfect)
        if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
            y1 = -height * this.anchor.y;

            if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
                flag = true;
            }
        }
        //if collision not detected return false
        if (!flag) {
            return false
        }

        //if not continues from here

        // bitmap check
        const tex = this.texture;
        const baseTex = this.texture.baseTexture;
        const res = baseTex.resolution;

        if (!baseTex.hitmap) {
            //generate hitmap
            if (!genHitmap(baseTex, 255)) {
                return true;
            }
        }

        const hitmap = baseTex.hitmap;

        // console.log(hitmap)
        // this does not account for rotation yet!!!

        //check mouse position if its over the sprite and visible
        let dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res);
        let dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res);
        let ind = (dx + dy * baseTex.realWidth);
        let ind1 = ind % 32;
        let ind2 = ind / 32 | 0;
        return (hitmap[ind2] & (1 << ind1)) !== 0;
    }

    function genHitmap(baseTex, threshold) {
        //check sprite props
        if (!baseTex.resource) {
            //renderTexture
            return false;
        }
        const imgSource = baseTex.resource.source;
        let canvas = null;
        if (!imgSource) {
            return false;
        }
        let context = null;
        if (imgSource.getContext) {
            canvas = imgSource;
            context = canvas.getContext('2d');
        } else if (imgSource instanceof Image) {
            canvas = document.createElement('canvas');
            canvas.width = imgSource.width;
            canvas.height = imgSource.height;
            context = canvas.getContext('2d');
            context.drawImage(imgSource, 0, 0);
        } else {
            //unknown source;
            return false;
        }

        const w = canvas.width, h = canvas.height;
        let imageData = context.getImageData(0, 0, w, h);
        //create array
        let hitmap = baseTex.hitmap = new Uint32Array(Math.ceil(w * h / 32));
        //fill array
        for (let i = 0; i < w * h; i++) {
            //lower resolution to make it faster
            let ind1 = i % 32;
            let ind2 = i / 32 | 0;
            //check every 4th value of image data (alpha number; opacity of the pixel)
            //if it's visible add to the array
            if (imageData.data[i * 4 + 3] >= threshold) {
                hitmap[ind2] = hitmap[ind2] | (1 << ind1);
            }
        }
        return true;
    }
})();