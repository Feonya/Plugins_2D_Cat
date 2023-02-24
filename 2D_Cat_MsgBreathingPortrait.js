/*:
 * @target     MZ
 * @plugindesc v1.8 在对话时添加带呼吸效果的多人立绘。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：
 * 1、在任意事件中调用“设置立绘”指令，并设置好相应参数，即可在下次弹出对话框时显
 * 示立绘。若多次调用且立绘ID参数不重复，则可显示多个立绘，若有重复则覆盖之前拥
 * 有该ID的立绘。
 * 2、可在任意事件中调用“切换正在说话的立绘”指令，以将指定ID的立绘切换为正在说话
 * 状态。
 * 3、可在任意事件中调用“销毁立绘”，以销毁指定ID的立绘，下次对话框弹出时，该立绘
 * 将不再出现。
 * 4、可在任意事件中调用“销毁所有立绘”，以销毁所有立绘，下次对话框弹出时，将不再
 * 出现任何立绘。
 * 5、若部署时需要加密图片，请在插件设置参数中开启“显示图片是否被加密”。
 * 6、解码加密图片的过程是异步的，因此，如果你的事件存在紧挨着的多个“设置立绘”指
 * 令，请在它们之间等待1帧或多帧。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20230222 v1.8
 *     现在可以加载加密图片了。（需要在插件设置参数中手动选择图片是否被加密）
 * -- 20221224 v1.7
 *     修复了返回标题画面读取进度发生错误的Bug。
 * -- 20220730 v1.6
 *     修复了角色死亡后读取进度发生错误的Bug。
 * -- 20220206 v1.5
 *     修复了某些与其他插件的兼容性错误的Bug。
 * -- 20220119 v1.4
 *     修复了进行名字输入处理后发生错误的Bug。
 * -- 20211125 v1.3
 *     修复了从商店窗口返回地图时发生错误的Bug。
 * -- 20211008 v1.2
 *     修复了结束战斗或从Debug窗口返回地图时发生错误的Bug。
 * -- 20210926 v1.1
 *     修正了调用“切换正在说的立绘”指令后，可能导致立绘在下一次对话中无法调出的
 * Bug。
 *     去掉了“设置立绘”指令中可能导致错误的“是否正在说话”参数，当同时调出多个立
 * 绘时，默认最后一个设置的立绘为正在说话状态，可以在在对话框弹出前调用“切换正
 * 在说话的立绘”指令来修改正在说话的立绘。
 * -- 20210925 v1.0
 *     实现插件基本功能。
 *
 * * 致谢说明：
 * 1、感谢B站用户 mic0 提供关于“设置立绘”指令中“是否正在说话”参数会导致错误发生
 * 的Bug反馈！
 * 2、感谢B站用户 坏女人辉夜姐姐 提供关于战斗结束或从Debug窗口返回地图时发生错
 * 误的Bug反馈！
 * 3、感谢QQ用户 这是否 提供关于从商店返回地图时发生错误的Bug反馈！
 * 4、感谢B站用户 TheHQ98 提供关于进行名字输入处理后发生错误的Bug反馈！
 * 5、感谢B站用户 爱走位的KN_sword 提供关于角色死亡后读取进度发生错误的Bug反馈！
 * 6、感谢QQ用户 我妻何汐 提供关于返回标题画面读取进度发生错误的Bug反馈！
 * 7、感谢B站用户 吓你一跳的小伞酱 提供关于无法加载加密图片问题的反馈！
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
 *
 * @param   isEncryped
 * @text    显示图片是否被加密（部署加密图片时开启）
 * @type    boolean
 * @default false
 *
 * @command setPortrait
 * @text    设置立绘
 *
 * @arg     id
 * @text    立绘ID
 * @type    number
 * @default 1
 * @min     1
 * @desc    立绘ID是唯一的，若有重复则覆盖之前的设置，若不重复则添加多个立绘。
 *
 * @arg     _cutLine1
 * @text    ------------------------
 * @default
 *
 * @arg     pictureName
 * @text    立绘图片
 * @type    file
 * @dir     img/pictures
 *
 * @arg     _cutLine2
 * @text    ------------------------
 * @default
 *
 * @arg     anchorX
 * @text    锚点位置x值
 * @type    string
 * @default 0.5
 * @desc    0~1之间的实数，越大锚点越靠立绘右边，反之越靠左边，0.5为图片x轴中心点。
 *
 * @arg     anchorY
 * @text    锚点位置y值
 * @type    string
 * @default 0.5
 * @desc    0~1之间的实数，越大锚点越靠立绘下边，反之越靠上边，0.5为图片y轴中心点。
 *
 * @arg     _cutLine3
 * @text    ------------------------
 * @default
 *
 * @arg     posX
 * @text    位置x坐标值（px）
 * @type    number
 * @default 320
 * @min     -50000
 * @max     50000
 * @desc    即立绘显示在游戏画面中的x坐标值。
 *
 * @arg     posY
 * @text    位置y坐标值（px）
 * @type    number
 * @default 360
 * @min     -50000
 * @max     50000
 * @desc    即立绘显示在游戏画面中的y坐标值。
 *
 * @arg     _cutLine4
 * @text    ------------------------
 * @default
 *
 * @arg      breathSpeed
 * @text    呼吸速度
 * @type    string
 * @default 0.05
 * @desc    0.01~0.1之间的实数，越小呼吸速度越慢，反之越快。
 *
 * @arg     breathAmpX
 * @text    呼吸时x轴呼吸幅度
 * @type    string
 * @default 0.005
 * @desc    0.001~0.02之间的实数，越大呼吸幅度越大，反之越小。
 *
 * @arg     breathAmpY
 * @text    呼吸时y轴呼吸幅度
 * @type    string
 * @default 0.01
 * @desc    0.001~0.02之间的实数，越大呼吸幅度越大，反之越小。
 *
 * @arg     _cutLine5
 * @text    ------------------------
 * @default
 *
 * @arg     onTalkScaleX
 * @text    说话时的x轴缩放比例
 * @type    string
 * @default 1
 * @desc    -2~2之间的实数，1为原始比例，若要左右翻转，请设为负值。
 *
 * @arg     onTalkScaleY
 * @text    说话时的y轴缩放比例
 * @type    string
 * @default 1
 * @desc    -2~2之间的实数，1为原始比例，若要上下翻转，请设为负值。
 *
 * @arg     _cutLine6
 * @text    ------------------------
 * @default
 *
 * @arg     onTalkStoppedScaleX
 * @text    未说话时的x轴缩放比例
 * @type    string
 * @default 0.8
 * @desc    -2~2之间的实数，1为原始比例，若要左右翻转，请设为负值。
 *
 * @arg     onTalkStoppedScaleY
 * @text    未说话时的y轴缩放比例
 * @type    string
 * @default 0.8
 * @desc    -2~2之间的实数，1为原始比例，若要上下翻转，请设为负值。
 *
 * @arg     _cutLine7
 * @text    ------------------------
 * @default
 *
 * @arg     onTalkBrightness
 * @text    未说话时的亮度（0~510）
 * @type    number
 * @default 255
 * @min     0
 * @max     510
 *
 * @arg     onTalkStoppedBrightness
 * @text    未说话时的亮度（0~510）
 * @type    Number
 * @default 100
 * @min     0
 * @max     510
 *
 * @command setTalkPortrait
 * @text    切换正在说话的立绘
 *
 * @arg     talkingId
 * @text    立绘ID
 * @type    number
 * @default 1
 * @min     1
 *
 * @command removePortrait
 * @text    销毁立绘
 * @desc    根据销毁指定ID的立绘，下一次对话开启后，该立绘将不再出现。
 *
 * @arg     removeId
 * @text    立绘ID
 * @type    number
 * @default 1
 * @min     1
 *
 * @command removeAllPortraits
 * @text    销毁所有立绘
 * @desc    下一次对话开启后，将不再出现任何立绘。
 */

var P_2D_C = P_2D_C || {};

//P_2D_C.textToArrayBuffer = function(s) {
//	var i = s.length;
//	var n = 0;
//	var ba = new Array()
//	for (var j = 0; j < i;) {
//		var c = s.codePointAt(j);
//		if (c < 128) {
//			ba[n++] = c;
//			j++;
//		}
//		else if ((c > 127) && (c < 2048)) {
//			ba[n++] = (c >> 6) | 192;
//			ba[n++] = (c & 63) | 128;
//			j++;
//		}
//		else if ((c > 2047) && (c < 65536)) {
//			ba[n++] = (c >> 12) | 224;
//			ba[n++] = ((c >> 6) & 63) | 128;
//			ba[n++] = (c & 63) | 128;
//			j++;
//		}
//		else {
//			ba[n++] = (c >> 18) | 240;
//			ba[n++] = ((c >> 12) & 63) | 128;
//			ba[n++] = ((c >> 6) & 63) | 128;
//			ba[n++] = (c & 63) | 128;
//			j+=2;
//		}
//	}
//	return new Uint8Array(ba).buffer;
//}

P_2D_C._onXhrLoad = function(xhr, ps) {
    if (xhr.status < 400) {
		console.log("Text Response: " + xhr.response);
        const arrayBuffer = Utils.decryptArrayBuffer(xhr.response);
        console.log("Decrypted ArrayBuffer: " + arrayBuffer);
        const blob = new Blob([arrayBuffer]);
        console.log("Blob: " + blob);
        const src = URL.createObjectURL(blob);
        console.log("Decrypted src: " + src);
        ps.textureBackup = PIXI.Texture.from(src);
        P_2D_C.portraitContainer.addChild(ps);
        console.log("图片解密成功 src: " + src);

		showPortraits();
    } else {
        console.log("图片解密失败！");
    }
};

function showPortraits() {
	//let onTalkPortrait = null;
	P_2D_C.portraitContainer.children.forEach(e => {
		if (!e.filters) e.filters           = [];
		if (!e._colorFilter) e._colorFilter = new ColorFilter();
		if (e.filters.indexOf(e._colorFilter) < 0) e.filters.push(e._colorFilter);

		e.anchor  .set(e.anchorX, e.anchorY);
		e.position.set(e.posX   , e.posY);

		if (e.isTalking) {
			//onTalkPortrait = e;
			e._colorFilter.setBrightness(e.onTalkBrightness);
			e.scale.set(e.onTalkScaleX, e.onTalkScaleY);
			P_2D_C.portraitContainer.setChildIndex(e, P_2D_C.portraitContainer.children.length - 1);
		}
		else {
			e._colorFilter.setBrightness(e.onTalkStoppedBrightness);
			e.scale.set(e.onTalkStoppedScaleX, e.onTalkStoppedScaleY);
		}

		e.texture = e.textureBackup;
	});
	//if (!onTalkPortrait) {
	//	P_2D_C.portraitContainer.setChildIndex(onTalkPortrait, P_2D_C.portraitContainer.children.length - 1);
	//}
}

function hidePortraits() {
	P_2D_C.portraitContainer.children.forEach(e => {
		e.texture = null;
	});
}

function updatePortraits() {
	P_2D_C.portraitContainer.children.forEach(e => {
		if (e.breathAmpX !== 0 && e.breathAmpY !== 0 && e.breathSpeed !== 0) {
			if (!e.filters) e.filters           = [];
			if (!e._colorFilter) e._colorFilter = new ColorFilter();
			if (e.filters.indexOf(e._colorFilter) < 0) e.filters.push(e._colorFilter);
		
			e.time += Graphics.app.ticker.deltaTime * e.breathSpeed;
			let ampX = e.breathAmpX * Math.sin(e.time);
			let ampY = e.breathAmpY * Math.cos(e.time);
			if (e.isTalking) {
				e.scale.set(e.onTalkScaleX + ampX, e.onTalkScaleY + ampY);
				if (e._colorFilter.brightness !== e.onTalkBrightness)
					e._colorFilter.setBrightness(e.onTalkBrightness);
			} else {
				e.scale.set(e.onTalkStoppedScaleX + ampX, e.onTalkStoppedScaleY + ampY);
				if (e._colorFilter.brightness !== e.onTalkStoppedBrightness)
					e._colorFilter.setBrightness(e.onTalkStoppedBrightness);
			}
		}
	});
}

(() => {
    class Portrait_Container extends PIXI.Container {
        constructor() {
            super();
            this.onShown = false;
        }
    }

    class Portrait_Sprite extends PIXI.Sprite {
        constructor() {
            super();

            this.id                       = 1;
            this.pictureName              = '';
            this.anchorX                  = 0;
            this.anchorY                  = 0;
            this.posX                     = 0;
            this.posY                     = 0;
            this.isTalking                = true;
            this.breathSpeed              = 0;
            this.breathAmpX               = 1;
            this.breathAmpY               = 1;
            this.onTalkScaleX             = 1;
            this.onTalkScaleY             = 1;
            this.onTalkStoppedScaleX      = 1;
            this.onTalkStoppedScaleY      = 1;
            this.onTalkBrightness         = 255;
            this.onTalkStoppedBrightness  = 100;

            this.textureBackup = null;
            this.time          = Math.random() * 10;
        }
    }

    P_2D_C.pixiTempApp       = P_2D_C.pixiTempApp || new PIXI.Application();
    P_2D_C.portraitContainer = null;

    var params = PluginManager.parameters('2D_Cat_MsgBreathingPortrait');
    P_2D_C.isEncryped = String(params.isEncryped) === 'true';

    PluginManager.registerCommand('2D_Cat_MsgBreathingPortrait', 'setPortrait', args => {
        let id                       = Number(args.id);
        let pictureName              = String(args.pictureName);
        let anchorX                  = Number(args.anchorX);
        let anchorY                  = Number(args.anchorY);
        let posX                     = Number(args.posX);
        let posY                     = Number(args.posY);
        // let isTalking                = String(args.isTalking) === 'true';
        let isTalking                = true;
        let breathSpeed              = Number(args.breathSpeed);
        let breathAmpX               = Number(args.breathAmpX);
        let breathAmpY               = Number(args.breathAmpY);
        let onTalkScaleX             = Number(args.onTalkScaleX);
        let onTalkScaleY             = Number(args.onTalkScaleY);
        let onTalkStoppedScaleX      = Number(args.onTalkStoppedScaleX);
        let onTalkStoppedScaleY      = Number(args.onTalkStoppedScaleY);
        let onTalkBrightness         = Number(args.onTalkBrightness);
        let onTalkStoppedBrightness  = Number(args.onTalkStoppedBrightness);

        // Fix Data
        if (String(anchorX) === 'NaN') anchorX = 0.5;
        else if   (anchorX < 0)        anchorX = 0;
        else if   (anchorX > 1)        anchorX = 1;
        if (String(anchorY) === 'NaN') anchorY = 0.5;
        else if   (anchorY < 0)        anchorY = 0;
        else if   (anchorY > 1)        anchorY = 1;

        if (String(breathSpeed) === 'NaN') breathSpeed = 0.05;
        else if   (breathSpeed < 0.01)     breathSpeed = 0.01;
        else if   (breathSpeed > 0.1)      breathSpeed = 0.1;

        if (String(breathAmpX) === 'NaN') breathAmpX = 0.005;
        else if   (breathAmpX < 0.001)    breathAmpX = 0.001;
        else if   (breathAmpX > 0.02)     breathAmpX = 0.02;
        if (String(breathAmpY) === 'NaN') breathAmpY = 0.01;
        else if   (breathAmpY < 0.001)    breathAmpY = 0.001;
        else if   (breathAmpY > 0.02)     breathAmpY = 0.02;

        if (String(onTalkScaleX) === 'NaN') onTalkScaleX = 1;
        else if   (onTalkScaleX < -2)       onTalkScaleX = -2;
        else if   (onTalkScaleX > 2)        onTalkScaleX = 2;
        if (String(onTalkScaleY) === 'NaN') onTalkScaleY = 1;
        else if   (onTalkScaleY < -2)       onTalkScaleY = -2;
        else if   (onTalkScaleY > 2)        onTalkScaleY = 2;

        if (String(onTalkStoppedScaleX) === 'NaN') onTalkStoppedScaleX = 0.8;
        else if   (onTalkStoppedScaleX < -2)       onTalkStoppedScaleX = -2;
        else if   (onTalkStoppedScaleX > 2)        onTalkStoppedScaleX = 2;
        if (String(onTalkStoppedScaleY) === 'NaN') onTalkStoppedScaleY = 0.8;
        else if   (onTalkStoppedScaleY < -2)       onTalkStoppedScaleY = -2;
        else if   (onTalkStoppedScaleY > 2)        onTalkStoppedScaleY = 2;

        let newPortraitSprite = null;
        for (let i = 0; i < P_2D_C.portraitContainer.children.length; i++) {
            let ps = P_2D_C.portraitContainer.children[i];
            if (ps.id === id) {
                newPortraitSprite = ps;
                if (ps.pictureName !== pictureName) {
                    if (P_2D_C.isEncryped) {
                        P_2D_C.xhr = new XMLHttpRequest();
                        P_2D_C.xhr.open("GET", 'img/pictures/' + pictureName + '.png_');
                        P_2D_C.xhr.responseType = "arraybuffer";
                        P_2D_C.xhr.onload = () => P_2D_C._onXhrLoad(P_2D_C.xhr, ps);
                        //P_2D_C.xhr.onerror = P_2D_C._onError.bind(this);
                        P_2D_C.xhr.send();
                        //ps.textureBackup = PIXI.Texture.from('img/pictures/' + pictureName + '.png_');
                    }
                    else
                        ps.textureBackup = PIXI.Texture.from('img/pictures/' + pictureName + '.png');
                        P_2D_C.portraitContainer.addChild(newPortraitSprite);
                
						showPortraits();
                }
                // break;
            } else if (isTalking && ps.isTalking) {
                ps.isTalking = false;
            }
        }

        //console.log(newPortraitSprite)
        if (!newPortraitSprite) {
            newPortraitSprite = new Portrait_Sprite();
            newPortraitSprite.id                       = id;
			newPortraitSprite.pictureName              = pictureName;
			newPortraitSprite.anchorX                  = anchorX;
			newPortraitSprite.anchorY                  = anchorY;
			newPortraitSprite.posX                     = posX;
			newPortraitSprite.posY                     = posY;
			newPortraitSprite.isTalking                = isTalking;
			newPortraitSprite.breathSpeed              = breathSpeed;
			newPortraitSprite.breathAmpX               = breathAmpX;
			newPortraitSprite.breathAmpY               = breathAmpY;
			newPortraitSprite.onTalkScaleX             = onTalkScaleX;
			newPortraitSprite.onTalkScaleY             = onTalkScaleY;
			newPortraitSprite.onTalkStoppedScaleX      = onTalkStoppedScaleX;
			newPortraitSprite.onTalkStoppedScaleY      = onTalkStoppedScaleY;
			newPortraitSprite.onTalkBrightness         = onTalkBrightness;
			newPortraitSprite.onTalkStoppedBrightness  = onTalkStoppedBrightness;
			
            if (P_2D_C.isEncryped) {
                P_2D_C.xhr = new XMLHttpRequest();
                P_2D_C.xhr.open("GET", 'img/pictures/' + pictureName + '.png_');
                P_2D_C.xhr.responseType = "arraybuffer";
                P_2D_C.xhr.onload = () => P_2D_C._onXhrLoad(P_2D_C.xhr, newPortraitSprite);
                //P_2D_C.xhr.onerror = P_2D_C._onError.bind(this);
                P_2D_C.xhr.send();
                //newPortraitSprite.textureBackup = PIXI.Texture.from('img/pictures/' + pictureName + '.png_');
            }
            else {
                newPortraitSprite.textureBackup = PIXI.Texture.from('img/pictures/' + pictureName + '.png');
                P_2D_C.portraitContainer.addChild(newPortraitSprite);
                
				showPortraits();
            }
        }
    });

    PluginManager.registerCommand('2D_Cat_MsgBreathingPortrait', 'setTalkPortrait', args => {
        let talkingId = Number(args.talkingId);
        P_2D_C.portraitContainer.children.forEach(e => {
            if (e.id === talkingId) {
                e.isTalking = true;
                // P_2D_C.portraitContainer.setChildIndex(e, P_2D_C.portraitContainer.children.length - 1);
            }
            else {
                e.isTalking = false;
            }
        });

        showPortraits();
    });

    PluginManager.registerCommand('2D_Cat_MsgBreathingPortrait', 'removePortrait', args => {
        let thisIsOnTalkSprite = false;
        let removeId = Number(args.removeId);
        for (let i = 0; i < P_2D_C.portraitContainer.children.length; i++) {
            if (P_2D_C.portraitContainer.children[i].id === removeId) {
                let idx = P_2D_C.portraitContainer.children.indexOf(P_2D_C.portraitContainer.children[i]);
                if (idx >= 0) {
                    P_2D_C.portraitContainer.removeChildAt(idx);
                    thisIsOnTalkSprite = true;
                    break;
                }
            }
        }
        if (thisIsOnTalkSprite && P_2D_C.portraitContainer.children.length > 0) {
            P_2D_C.portraitContainer.children[0].isTalking = true;
            showPortraits();
        }
    });

    PluginManager.registerCommand('2D_Cat_MsgBreathingPortrait', 'removeAllPortraits', () => {
        P_2D_C.portraitContainer.removeChildren();
    });

    //var _Scene_Map_prototype_callMenu = Scene_Map.prototype.callMenu;
    //Scene_Map.prototype.callMenu = function() {
        //_Scene_Map_prototype_callMenu.call(this);

        //if (P_2D_C.portraitContainer)
            //P_2D_C.portraitContainer.setParent(P_2D_C.pixiTempApp.stage);
    //};
    var _SceneManager_push = SceneManager.push;
    SceneManager.push = function(sceneClass) {
		_SceneManager_push.call(this, sceneClass);

		if (P_2D_C.portraitContainer)
            P_2D_C.portraitContainer.setParent(P_2D_C.pixiTempApp.stage);
    }

    var _Scene_Battle_prototype_create = Scene_Battle.prototype.create;
    Scene_Battle.prototype.create = function() {
        _Scene_Battle_prototype_create.call(this);

        if (P_2D_C.portraitContainer)
            P_2D_C.portraitContainer.setParent(P_2D_C.pixiTempApp.stage);
    };

    var _Scene_Name_prototype_create = Scene_Name.prototype.create;
    Scene_Name.prototype.create = function() {
		_Scene_Name_prototype_create.call(this);

		if (P_2D_C.portraitContainer)
            P_2D_C.portraitContainer.setParent(P_2D_C.pixiTempApp.stage);
    }

    var _Scene_Shop_prototype_create = Scene_Shop.prototype.create;
    Scene_Shop.prototype.create = function() {
        _Scene_Shop_prototype_create.call(this);

        if (P_2D_C.portraitContainer)
            P_2D_C.portraitContainer.setParent(P_2D_C.pixiTempApp.stage);
    };

    var _Scene_Gameover_prototype_create = Scene_Gameover.prototype.create;
    Scene_Gameover.prototype.create = function() {
        _Scene_Gameover_prototype_create.call(this);

        if (P_2D_C.portraitContainer)
            P_2D_C.portraitContainer.setParent(P_2D_C.pixiTempApp.stage);
    };

    var _Scene_Title_prototype_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_prototype_create.call(this);

        if (P_2D_C.portraitContainer)
            P_2D_C.portraitContainer.setParent(P_2D_C.pixiTempApp.stage);
    };

    Scene_Map.prototype.updateCallDebug = function() {
        if (this.isDebugCalled()) {
            if (P_2D_C.portraitContainer)
                P_2D_C.portraitContainer.setParent(P_2D_C.pixiTempApp.stage);
            if (P_2D_C.picBtnContainer)
                P_2D_C.picBtnContainer.setParent(P_2D_C.pixiTempApp.stage);

            SceneManager.push(Scene_Debug);
        }
    };

    var _Scene_Map_prototype_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_prototype_onMapLoaded.call(this);

        if (P_2D_C.portraitContainer) {
            P_2D_C.portraitContainer.setParent(SceneManager._scene._spriteset);
            SceneManager._scene._spriteset.setChildIndex(P_2D_C.portraitContainer, 2);
        } else {
            P_2D_C.portraitContainer = new Portrait_Container();
            SceneManager._scene._spriteset.addChildAt(P_2D_C.portraitContainer, 2);
        }
    };

    var _Scene_Map_prototype_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_prototype_update.call(this);

        if ($gameMessage.isBusy()) {
            if (!P_2D_C.portraitContainer.onShown) {
                P_2D_C.portraitContainer.onShown = true;
                // showPortraits();
            } else {
                updatePortraits();
            }
        } else if (!$gameMessage.isBusy()) {
            if (P_2D_C.portraitContainer.onShown) {
                P_2D_C.portraitContainer.onShown = false;
                hidePortraits();
            }
        }
    }
})();