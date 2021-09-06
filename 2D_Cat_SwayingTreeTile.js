/*:
 * @target     MZ
 * @plugindesc 为地图中的树（等）图块添加随风摆动效果。v1.0
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 条件限制：
 * 由于引擎底层功能限制，本插件的使用也存在若干条件限制。
 * 1、树木图像必须放置在图块集B中。
 * 2、树木图像周围1格（48px）范围内必须留空，不得有其他图像。
 * 3、树木图像高度最少为2格（96px），宽度最少为1格（48px）。
 * 4、必须提前查看树木图像在图块集图片中的坐标位置（px），以用于插件参数设置。
 * 5、同一时间，仅支持3种树的摇摆。
 * 6、本插件专门用于表现树的摇摆，将该效果用于其他物体可能出现违和感。
 *
 * * 使用方法：
 * 1、确保已满足上方条件限制。
 * 2、在插件设置参数中设置好相应参数，并确保开启对应树的摇摆。
 * 3、也可以在任意事件中调用“更改摇摆数据”指令，随时更改当前摇摆效果。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210906 v1.0
 *     实现插件基本功能。
 *
 * @param   tree1ImgPosX
 * @text    树1在图块集图片中的x坐标位置（px）
 * @type    number
 * @min     0
 * @default 384
 * @desc    即目标图像左上角坐标的x值。
 *
 * @param   tree1ImgPosY
 * @text    树1在图块集图片中的y坐标位置（px）
 * @type    number
 * @min     0
 * @default 288
 * @desc    即目标图像左上角坐标的y值。
 *
 * @param   tree1ImgPosXCellNum
 * @text    树1在图块集图片中横向占几个图块
 * @type    number
 * @min     1
 * @default 2
 * @desc    引擎默认以48x48为一个图块。
 *
 * @param   tree1ImgPosYCellNum
 * @text    树1在图块集图片中纵向占几个图块
 * @type    number
 * @min     2
 * @default 2
 * @desc    引擎默认以48x48为一个图块。
 *
 * @param   isEnableTree1Swaying
 * @text    是否开启树1摇摆
 * @type    boolean
 * @default true
 *
 * @param   _cutLine1
 * @text    ------------------------
 * @default
 *
 * @param   tree2ImgPosX
 * @text    树2在图块集图片中的x坐标位置（px）
 * @type    number
 * @min     0
 * @default 624
 * @desc    即目标图像左上角坐标的x值。
 *
 * @param   tree2ImgPosY
 * @text    树2在图块集图片中的y坐标位置（px）
 * @type    number
 * @min     0
 * @default 144
 * @desc    即目标图像左上角坐标的y值。
 *
 * @param   tree2ImgPosXCellNum
 * @text    树2在图块集图片中横向占几个图块
 * @type    number
 * @min     1
 * @default 1
 * @desc    引擎默认以48x48为一个图块。
 *
 * @param   tree2ImgPosYCellNum
 * @text    树2在图块集图片中纵向占几个图块
 * @type    number
 * @min     2
 * @default 2
 * @desc    引擎默认以48x48为一个图块。
 *
 * @param   isEnableTree2Swaying
 * @text    是否开启树2摇摆
 * @type    boolean
 * @default true
 *
 * @param   _cutLine2
 * @text    ------------------------
 * @default
 *
 * @param   tree3ImgPosX
 * @text    树3在图块集图片中的x坐标位置（px）
 * @type    number
 * @min     0
 * @default 384
 * @desc    即目标图像左上角坐标的x值。
 *
 * @param   tree3ImgPosY
 * @text    树3在图块集图片中的y坐标位置（px）
 * @type    number
 * @min     0
 * @default 624
 * @desc    即目标图像左上角坐标的y值。
 *
 * @param   tree3ImgPosXCellNum
 * @text    树3在图块集图片中横向占几个图块
 * @type    number
 * @min     1
 * @default 1
 * @desc    引擎默认以48x48为一个图块。
 *
 * @param   tree3ImgPosYCellNum
 * @text    树3在图块集图片中纵向占几个图块
 * @type    number
 * @min     2
 * @default 2
 * @desc    引擎默认以48x48为一个图块。
 *
 * @param   isEnableTree3Swaying
 * @text    是否开启树3摇摆
 * @type    boolean
 * @default true
 *
 * @param   _cutLine3
 * @text    ------------------------
 * @default
 *
 * @param   swayingPower
 * @text    所有树的摇摆强度
 * @type    number
 * @min     1
 * @max     20
 * @default 10
 * @desc    一个介于1~20之间的数，越大摇摆幅度越大，越小反之。
 *
 * @param   swayingSpeed
 * @text    所有树的摇摆速度
 * @type    number
 * @min     1
 * @max     200
 * @default 80
 * @desc    一个介于1~200之间的数，越大摇摆速度越慢，越小反之。
 *
 * @command changeSwaying
 * @text   更改摇摆数据
 *
 * @arg     enableTree1
 * @text    开启树1摇摆
 * @type    boolean
 * @default true
 *
 * @arg     enableTree2
 * @text    开启树2摇摆
 * @type    boolean
 * @default true
 *
 * @arg     enableTree3
 * @text    开启树3摇摆
 * @type    boolean
 * @default true
 *
 * @arg     newSwayingPower
 * @text    所有树的摇摆强度
 * @type    number
 * @min     1
 * @max     20
 * @default 10
 * @desc    一个介于1~20之间的数，越大摇摆幅度越大，越小反之。
 *
 * @arg     newSwayingSpeed
 * @text    所有树的摇摆速度
 * @type    number
 * @min     1
 * @max     200
 * @default 80
 * @desc    一个介于1~200之间的数，越大摇摆速度越慢，越小反之。
 */

(() => {
    var params = PluginManager.parameters('2D_Cat_SwayingTreeTile');

    let tree1ImgPosX         = Number(params.tree1ImgPosX);
    let tree1ImgPosY         = Number(params.tree1ImgPosY);
    let tree1ImgPosXCellNum  = Number(params.tree1ImgPosXCellNum);
    let tree1ImgPosYCellNum  = Number(params.tree1ImgPosYCellNum);
    let isEnableTree1Swaying = String(params.isEnableTree1Swaying) === 'true';
    let tree2ImgPosX         = Number(params.tree2ImgPosX);
    let tree2ImgPosY         = Number(params.tree2ImgPosY);
    let tree2ImgPosXCellNum  = Number(params.tree2ImgPosXCellNum);
    let tree2ImgPosYCellNum  = Number(params.tree2ImgPosYCellNum);
    let isEnableTree2Swaying = String(params.isEnableTree2Swaying) === 'true';
    let tree3ImgPosX         = Number(params.tree3ImgPosX);
    let tree3ImgPosY         = Number(params.tree3ImgPosY);
    let tree3ImgPosXCellNum  = Number(params.tree3ImgPosXCellNum);
    let tree3ImgPosYCellNum  = Number(params.tree3ImgPosYCellNum);
    let isEnableTree3Swaying = String(params.isEnableTree3Swaying) === 'true';

    let swayingPower = Number(params.swayingPower) / 1000;
    let swayingSpeed = Number(params.swayingSpeed);

    PluginManager.registerCommand('2D_Cat_SwayingTreeTile', 'changeSwaying', args => {
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uIsEnableTree1Swaying = String(args.enableTree1) === 'true';
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uIsEnableTree2Swaying = String(args.enableTree2) === 'true';
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uIsEnableTree3Swaying = String(args.enableTree3) === 'true';
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uSwayingPower         = Number(args.newSwayingPower) / 1000;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uSwayingSpeed         = Number(args.newSwayingSpeed);
    });

    Graphics._onTick = function(deltaTime) {
        this._fpsCounter.startTick();
        if (this._tickHandler) {
            this._tickHandler(deltaTime);
        }
        if (this._canRender()) {
            this._app.renderer.plugins.rpgtilemap.getShader().uniforms.uTime += deltaTime / swayingSpeed;
            this._app.render();
        }
        this._fpsCounter.endTick();
    };

    Tilemap.Renderer.prototype._createShader = function() {
        const vertexSrc =
            "attribute float aTextureId;" +
            "attribute vec4 aFrame;" +
            "attribute vec2 aSource;" +
            "attribute vec2 aDest;" +
            "uniform mat3   uProjectionMatrix;" +
            "uniform float  uTime;" +
            "uniform float  uTree1ImgPosX;" +
            "uniform float  uTree1ImgPosY;" +
            "uniform float  uTree1ImgPosXCellNum;" +
            "uniform float  uTree1ImgPosYCellNum;" +
            "uniform float  uIsEnableTree1Swaying;" +
            "uniform float  uTree2ImgPosX;" +
            "uniform float  uTree2ImgPosY;" +
            "uniform float  uTree2ImgPosXCellNum;" +
            "uniform float  uTree2ImgPosYCellNum;" +
            "uniform float  uIsEnableTree2Swaying;" +
            "uniform float  uTree3ImgPosX;" +
            "uniform float  uTree3ImgPosY;" +
            "uniform float  uTree3ImgPosXCellNum;" +
            "uniform float  uTree3ImgPosYCellNum;" +
            "uniform float  uIsEnableTree3Swaying;" +
            "uniform float  uSwayingPower;" +
            "varying vec4   vFrame;" +
            "varying vec2   vTextureCoord;" +
            "varying float  vTextureId;" +
            "void main(void) {" +
            "  vec3 position = uProjectionMatrix * vec3(aDest, 1.0);" +
            "  if (aSource.x >= uTree1ImgPosX + 1024.0 && aSource.x <= uTree1ImgPosX + 48.0 * uTree1ImgPosXCellNum + 1024.0 &&" +
            "      aSource.y >= uTree1ImgPosY          && aSource.y <= uTree1ImgPosY + 48.0 * (uTree1ImgPosYCellNum - 1.0)  &&" +
            "      aTextureId == 1.0 && uIsEnableTree1Swaying == 1.0) {" +
            "    position.x += (abs(sin(aSource.y + uTime)) - 1.0) * uSwayingPower;" +
            "  } else if (aSource.x >= uTree2ImgPosX + 1024.0 && aSource.x <= uTree2ImgPosX + 48.0 * uTree2ImgPosXCellNum + 1024.0 &&" +
            "             aSource.y >= uTree2ImgPosY          && aSource.y <= uTree2ImgPosY + 48.0 * (uTree2ImgPosYCellNum - 1.0)  &&" +
            "             aTextureId == 1.0 && uIsEnableTree2Swaying == 1.0) {" +
            "    position.x += (abs(sin(aSource.y + uTime)) - 1.0) * uSwayingPower;" +
            "  } else if (aSource.x >= uTree3ImgPosX + 1024.0 && aSource.x <= uTree3ImgPosX + 48.0 * uTree3ImgPosXCellNum + 1024.0 &&" +
            "             aSource.y >= uTree3ImgPosY          && aSource.y <= uTree3ImgPosY + 48.0 * (uTree3ImgPosYCellNum - 1.0)  &&" +
            "             aTextureId == 1.0 && uIsEnableTree3Swaying == 1.0) {" +
            "    position.x += (abs(sin(aSource.y + uTime)) - 1.0) * uSwayingPower;" +
            "  }" +
            "  gl_Position = vec4(position, 1.0);" +
            "  vFrame        = aFrame;" +
            "  vTextureCoord = aSource;" +
            "  vTextureId    = aTextureId;" +
            "}";
        const fragmentSrc =
            "varying vec4  vFrame;" +
            "varying vec2  vTextureCoord;" +
            "varying float vTextureId;" +
            "uniform sampler2D uSampler0;" +
            "uniform sampler2D uSampler1;" +
            "uniform sampler2D uSampler2;" +
            "void main(void) {" +
            "  vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);" +
            "  int textureId     = int(vTextureId);" +
            "  vec4 color;" +
            "  if (textureId < 0) {" +
            "    color = vec4(0.0, 0.0, 0.0, 0.5);" +
            "  } else if (textureId == 0) {" +
            "    color = texture2D(uSampler0, textureCoord / 2048.0);" +
            "  } else if (textureId == 1) {" +
            "    color = texture2D(uSampler1, textureCoord / 2048.0);" +
            "  } else if (textureId == 2) {" +
            "    color = texture2D(uSampler2, textureCoord / 2048.0);" +
            "  }" +
            "  gl_FragColor = color;" +
            "}";

        console.log(swayingPower)
        console.log(isEnableTree1Swaying)
        return new PIXI.Shader(PIXI.Program.from(vertexSrc, fragmentSrc), {
            uSampler0: 0,
            uSampler1: 0,
            uSampler2: 0,
            uProjectionMatrix: new PIXI.Matrix(),
            uTime: 0,
            uTree1ImgPosX:         tree1ImgPosX,
            uTree1ImgPosY:         tree1ImgPosY,
            uTree1ImgPosXCellNum:  tree1ImgPosXCellNum,
            uTree1ImgPosYCellNum:  tree1ImgPosYCellNum,
            uIsEnableTree1Swaying: isEnableTree1Swaying ? 1 : 0,
            uTree2ImgPosX:         tree2ImgPosX,
            uTree2ImgPosY:         tree2ImgPosY,
            uTree2ImgPosXCellNum:  tree2ImgPosXCellNum,
            uTree2ImgPosYCellNum:  tree2ImgPosYCellNum,
            uIsEnableTree2Swaying: isEnableTree2Swaying ? 1 : 0,
            uTree3ImgPosX:         tree3ImgPosX,
            uTree3ImgPosY:         tree3ImgPosY,
            uTree3ImgPosXCellNum:  tree3ImgPosXCellNum,
            uTree3ImgPosYCellNum:  tree3ImgPosYCellNum,
            uIsEnableTree3Swaying: isEnableTree3Swaying ? 1 : 0,
            uSwayingPower:         swayingPower,
        });
    };
})();