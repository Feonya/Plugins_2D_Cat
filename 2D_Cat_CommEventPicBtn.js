/*:
 * @target     MZ
 * @plugindesc 调出一个或多个自定义图片按钮，点击触发共通事件。v1.0
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用说明：
 * 1、需要使用的图片请放置在img/pictures目录下，仅支持png图片。
 * 2、在任意事件中调用本插件的“调出图片按钮”指令，并依次设置好相关参数即可。
 * 3、在执行内容未等待情况下，多次调用上方指令，可同时调出多个图片按钮。
 * 4、点击任意图片按钮后，将会移除当前正在显示的所有图片按钮。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210910 v1.0
 *     实现插件基本功能。
 *
 * * 致谢说明：
 * 本插件的忽略按钮图片透明像素功能，使用了Github用户ivanpopelyshev的代码，非常
 * 感谢！
 *
 * @command showPictureButton
 * @text    调出图片按钮
 *
 * @arg     buttonNormalPictureName
 * @text    正常按钮图片名称
 * @type    string
 * @default SF_Actor1_1
 * @desc    至少要设置一个正常按钮图片名称。
 *
 * @arg     buttonOverPictureName
 * @text    悬停按钮图片名称
 * @type    string
 * @desc    可选，若留空，则悬停时不改变图片。
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
 * @arg     buttonDownPictureName
 * @text    按下按钮图片名称
 * @type    string
 * @desc    可选，若留空，则按下时不改变图片。
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
 * @arg     positionX
 * @text    位置x坐标值（px）
 * @type    number
 * @default 320
 * @desc    即图片按钮显示在游戏画面中的x坐标值，锚点为图片中心。
 *
 * @arg     positionY
 * @text    位置y坐标值（px）
 * @type    number
 * @default 360
 * @desc    即图片按钮显示在游戏画面中的y坐标值，锚点为图片中心。
 *
 * @arg     commonEventId
 * @text    共通事件编号
 * @type    number
 * @default 0
 * @min     0
 * @desc    按下按钮后调用哪个共通事件，0表示不调用任何共通事件。
 *
 * @arg     canPlayerMove
 * @text    玩家是否可移动
 * @type    boolean
 * @default false
 * @desc    图片按钮显示时玩家是否可移动。
 *
 * @arg     ignoreTransparence
 * @text    是否忽略透明
 * @type    boolean
 * @default true
 * @desc    点击图片按钮时是否忽略透明部分，注意本参数最后一次设定将会影响之前本参数的设定。
 */

var P_2D_C = P_2D_C || {};

(() => {
    class CommEventPicBtn {
        constructor() {
            this.spr          = null;
            this.norTex       = null;
            this.overTex      = null;
            this.overTint     = null;
            this.overBrit     = null;
            this.downTex      = null;
            this.downTint     = null;
            this.overBrit     = null;
            this.isDown       = false;
            this.isOver       = false;
            this.commEvId     = 0;
            this.boundBox     = null;
            this.pixels       = null;
            // this.ignoreTransp = true;
        }

        registerBtnEvents() {
            this.spr.on('pointerdown'     , () => this.onBtnDown());
            this.spr.on('pointerup'       , () => this.onBtnUp  ());
            this.spr.on('pointerupoutside', () => this.onBtnUp  ());
            this.spr.on('pointerover'     , () => this.onBtnOver());
            this.spr.on('pointerout'      , () => this.onBtnOut ());
        }

        onBtnDown() {
            console.log('down')
            if (this.downTex  !== null) this.spr.texture = this.downTex;
            if (this.downTint !== null) this.spr.tint    = this.downTint;
            if (this.downBrit !== null) this.spr.filters = [this.downBrit];
            this.isDown = true;
        }

        onBtnUp() {
            console.log('up')
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
                destoryAllBtnSpr();
                if (this.commEvId !== 0) $gameTemp.reserveCommonEvent(this.commEvId);
            }
            this.isDown  = false;
        }

        onBtnOver() {
            console.log('over')
            if (this.isDown) return;
            if (this.overTex  !== null) this.spr.texture = this.overTex;
            if (this.overTint !== null) this.spr.tint    = this.overTint;
            if (this.overBrit !== null) this.spr.filters = [this.overBrit];
            this.isOver = true;
        }

        onBtnOut() {
            console.log('out')
            if (this.isDown) return;
            this.spr.texture = this.norTex;
            this.spr.tint    = 0xffffff;
            this.spr.filters = [];
            this.isOver = false;
        }

    }

    var button    = null;
    var btnSprArr = [];
    var _Game_Player_prototype_canMove = Game_Player.prototype.canMove;
    var _Scene_Map_prototype_callMenu  = Scene_Map  .prototype.callMenu;
    var _PIXI_Sprite_prototype_containsPoint = PIXI.Sprite.prototype.containsPoint;

    PluginManager.registerCommand('2D_Cat_CommEventPicBtn', 'showPictureButton', args => {
        P_2D_C.btnNorPicName  = String(args.buttonNormalPictureName);
        P_2D_C.btnOverPicName = String(args.buttonOverPictureName);
        P_2D_C.btnOverPicTint = String(args.buttonOverPictureTint);
        P_2D_C.btnOverPicBrit = Number(args.buttonOverPictureBrightness);
        P_2D_C.btnDownPicName = String(args.buttonDownPictureName);
        P_2D_C.btnDownPicTint = String(args.buttonDownPictureTint);
        P_2D_C.btnDownPicBrit = Number(args.buttonDownPictureBrightness);
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

    function setupButton() {
        button = new CommEventPicBtn();

        button.commEvId = P_2D_C.commEventId;

        button.norTex = PIXI.Texture.from('img/pictures/' + P_2D_C.btnNorPicName + '.png');
        if (P_2D_C.btnOverPicName !== 'undefined' && P_2D_C.btnOverPicName !== '')
            button.overTex = PIXI.Texture.from('img/pictures/' + P_2D_C.btnOverPicName + '.png');
        if (P_2D_C.btnDownPicName !== 'undefined' && P_2D_C.btnDownPicName !== '')
            button.downTex = PIXI.Texture.from('img/pictures/' + P_2D_C.btnDownPicName + '.png');

        button.spr = new PIXI.Sprite(button.norTex);
        button.spr.texture     = button.norTex;
        button.spr.anchor.set(0.5);
        button.spr.x           = P_2D_C.posX;
        button.spr.y           = P_2D_C.posY;
        button.spr.interactive = true;
        //button.spr.buttonMode  = true;

        if (P_2D_C.btnOverPicTint !== 'undefined' && P_2D_C.btnOverPicTint !== '')
            button.overTint = Number('0x' + P_2D_C.btnOverPicTint.slice(1));
        if (P_2D_C.btnDownPicTint !== 'undefined' && P_2D_C.btnDownPicTint !== '')
            button.downTint = Number('0x' + P_2D_C.btnDownPicTint.slice(1));

        if (P_2D_C.btnOverPicBrit !== 'NaN' && P_2D_C.btnOverPicBrit >= 0 && P_2D_C.btnOverPicBrit <= 10) {
            button.overBrit = new PIXI.filters.ColorMatrixFilter();
            button.overBrit.brightness(P_2D_C.btnOverPicBrit, true);
        }
        if (P_2D_C.btnDownPicBrit !== 'NaN' && P_2D_C.btnDownPicBrit >= 0 && P_2D_C.btnDownPicBrit <= 10) {
            button.downBrit = new PIXI.filters.ColorMatrixFilter();
            button.downBrit.brightness(P_2D_C.btnDownPicBrit, true);
        }

        // button.pixels       = Graphics.app.renderer.plugins.extract.pixels(button.spr);
        button.boundBox     = button.spr.getBounds();
        // button.ignoreTransp = P_2D_C.ignoreTransp;

        button.registerBtnEvents();
        btnSprArr.push(button.spr);
        letHtmlTagsNotToBlockBtn();
        fixPlayerMove();
        disableCallMenu();

        Graphics.app.stage.addChild(button.spr);
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

    function destoryAllBtnSpr() {
        btnSprArr.forEach(e => {
            Graphics.app.stage.removeChild(e);
        });
        restoreHtmlTags();
        restorePlayerMove();
        restoreCallMenu();
    }

    function disableCallMenu() {
        Scene_Map.prototype.callMenu = () => {};
    }

    function restoreCallMenu() {
        Scene_Map.prototype.callMenu = _Scene_Map_prototype_callMenu;
    }

    /**
     * 下方代码修改自https://github.com/pixijs/pixijs/wiki/v5-Hacks#pixel-perfect-interaction，
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