/*:
 * @target     MZ
 * @plugindesc 为地图中的水（等）图块添加波光粼粼效果。v1.0
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 条件限制：
 * 由于引擎底层功能限制，本插件的使用也存在若干条件限制。
 * 1、仅对图块集A中的自动Tile生效。
 * 2、必须提前查看水图像在图块集图片中的坐标位置（px），以用于插件参数设置。
 * 3、同一时间，仅支持1种水的波光效果。
 * 4、本插件专门用于表现水的波光效果，将该效果用于其他对象可能出现违和感。
 * 5、本插件可单独使用，但不能在2D_Cat_SwayingTreeTile插件之前加载，否则本插件
 * 将会失效。
 *
 * * 使用方法：
 * 1、确保已满足上方条件限制。
 * 2、在插件设置参数中设置好相应参数即可。
 * 3、还可以在任意事件中调用“更改波光数据”指令，随时更改当前波光效果。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * * 更新日志：
 * -- 20210907 v1.0
 *     实现插件基本功能。
 *
 * @param   waterImgPosX
 * @text    水在图块集图片中的x坐标位置（px）
 * @type    number
 * @min     0
 * @default 0
 * @desc    即目标图像左上角坐标的x值。
 *
 * @param   waterImgPosY
 * @text    水在图块集图片中的y坐标位置（px）
 * @type    number
 * @min     0
 * @default 0
 * @desc    即目标图像左上角坐标的y值。
 *
 * @param   referenceColor
 * @text    水的参考RGB颜色
 * @type    string
 * @default #2da2cd
 * @desc    用于识别水近似RGB颜色的参考值，值为带井号“#”的16进制字符串。
 *
 * @param   redOffset
 * @text    参考色R值偏移量
 * @type    number
 * @default 100
 * @desc    识别水近似RGB颜色时，决定R值的识别范围
 *
 * @param   greenOffset
 * @text    参考色G值偏移量
 * @type    number
 * @default 100
 * @desc    识别水近似RGB颜色时，决定R值的识别范围
 *
 * @param   blueOffset
 * @text    参考色B值偏移量
 * @type    number
 * @default 100
 * @desc    识别水近似RGB颜色时，决定B值的识别范围
 *
 * @param   glistenSpeed
 * @text    波光移动速度
 * @type    string
 * @default 1
 * @desc    介于-20~20之间的实数，正值与负值的移动方向相反，为0时停止移动。
 *
 * @param   glistenPower
 * @text    波光亮度
 * @type    string
 * @default 0.3
 * @desc    介于0~2之间的实数，值越大越亮，为0时波光消失。
 *
 * @param   glistenOffset
 * @text    波光亮度调节
 * @type    string
 * @default 0
 * @desc    介于-1~1之间的实数，正数增加亮度，负数降低亮度，为0不调节亮度。
 *
 * @param   glistenSize
 * @text    波光尺寸
 * @type    string
 * @default 0.008
 * @desc    介于0.001~1之间的实数，越小尺寸越大，反之越小。
 * 
 * @command changeGlistening
 * @text    更改波光数据
 * 
 * @arg     newWaterImgPosX
 * @text    水在图块集图片中的x坐标位置（px）
 * @type    number
 * @default 0
 * @min     0
 * @desc    即目标图像左上角坐标的x值。
 * 
 * @arg     newWaterImgPosY
 * @text    水在图块集图片中的y坐标位置（px）
 * @type    number
 * @default 0
 * @min     0
 * @desc    即目标图像左上角坐标的y值。
 * 
 * @arg     newReferenceColor
 * @text    水的参考RGB颜色
 * @type    string
 * @default #2da2cd
 * @desc    用于识别水近似RGB颜色的参考值，值为带井号“#”的16进制字符串。
 *
 * @arg     newRedOffset
 * @text    参考色R值偏移量
 * @type    number
 * @default 100
 * @desc    识别水近似RGB颜色时，决定R值的识别范围
 *
 * @arg     newGreenOffset
 * @text    参考色G值偏移量
 * @type    number
 * @default 100
 * @desc    识别水近似RGB颜色时，决定R值的识别范围
 *
 * @arg     newBlueOffset
 * @text    参考色B值偏移量
 * @type    number
 * @default 100
 * @desc    识别水近似RGB颜色时，决定B值的识别范围
 *
 * @arg     newGlistenSpeed
 * @text    波光移动速度
 * @type    string
 * @default 1
 * @desc    介于-20~20之间的实数，正值与负值的移动方向相反，为0时停止移动。
 *
 * @arg     newGlistenPower
 * @text    波光亮度
 * @type    string
 * @default 0.3
 * @desc    介于0~2之间的实数，值越大越亮，为0时波光消失。
 *
 * @arg     newGlistenOffset
 * @text    波光亮度调节
 * @type    string
 * @default 0
 * @desc    介于-1~1之间的实数，正数增加亮度，负数降低亮度，为0不调节亮度。
 *
 * @arg     newGlistenSize
 * @text    波光尺寸
 * @type    string
 * @default 0.008
 * @desc    介于0.001~1之间的实数，越小尺寸越大，反之越小。
 */

var P_2D_C = P_2D_C || {};

(() => {
    var params = PluginManager.parameters('2D_Cat_GlisteningWaterTile');

    P_2D_C.waterImgPosX   = Number(params.waterImgPosX);
    P_2D_C.waterImgPosY   = Number(params.waterImgPosY);
    P_2D_C.referenceColor = String(params.referenceColor);
    P_2D_C.redOffset      = Number(params.redOffset);
    P_2D_C.greenOffset    = Number(params.greenOffset);
    P_2D_C.blueOffset     = Number(params.blueOffset);
    P_2D_C.glisSpeed      = Number(params.glistenSpeed);
    P_2D_C.glisPower      = Number(params.glistenPower);
    P_2D_C.glisOffset     = Number(params.glistenOffset);
    P_2D_C.glisSize       = Number(params.glistenSize);

    P_2D_C.refR = Number('0x' + P_2D_C.referenceColor.slice(1, 3));
    P_2D_C.refG = Number('0x' + P_2D_C.referenceColor.slice(3, 5));
    P_2D_C.refB = Number('0x' + P_2D_C.referenceColor.slice(5));

    fixGlistenData();

    PluginManager.registerCommand('2D_Cat_GlisteningWaterTile', 'changeGlistening', args => {
        P_2D_C.waterImgPosX   = Number(args.newWaterImgPosX);
        P_2D_C.waterImgPosY   = Number(args.newWaterImgPosY);
        P_2D_C.referenceColor = String(args.newReferenceColor);
        P_2D_C.redOffset      = Number(args.newRedOffset);
        P_2D_C.greenOffset    = Number(args.newGreenOffset);
        P_2D_C.blueOffset     = Number(args.newBlueOffset);
        P_2D_C.glisSpeed      = Number(args.newGlistenSpeed);
        P_2D_C.glisPower      = Number(args.newGlistenPower);
        P_2D_C.glisOffset     = Number(args.newGlistenOffset);
        P_2D_C.glisSize       = Number(args.newGlistenSize);

        P_2D_C.refR = Number('0x' + P_2D_C.referenceColor.slice(1, 3));
        P_2D_C.refG = Number('0x' + P_2D_C.referenceColor.slice(3, 5));
        P_2D_C.refB = Number('0x' + P_2D_C.referenceColor.slice(5));

        fixGlistenData();

        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uWaterImgPosX   = P_2D_C.waterImgPosX;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uWaterImgPosY   = P_2D_C.waterImgPosY;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uReferenceColor = P_2D_C.referenceColor;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uRedOffset      = P_2D_C.redOffset;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uGreenOffset    = P_2D_C.greenOffset;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uBlueOffset     = P_2D_C.blueOffset;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uGlisPower      = P_2D_C.glisPower;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uGlisOffset     = P_2D_C.glisOffset;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uGlisSize       = P_2D_C.glisSize;

        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uRefRed   = P_2D_C.refR;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uRefGreen = P_2D_C.refG;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uRefBlue  = P_2D_C.refB;

    });

    Graphics._onTick = function(deltaTime) {
        this._fpsCounter.startTick();
        if (this._tickHandler) {
            this._tickHandler(deltaTime);
        }
        if (this._canRender()) {
            this._app.renderer.plugins.rpgtilemap.getShader().uniforms.uTreeTime  += deltaTime / P_2D_C.swayingSpeed;
            this._app.renderer.plugins.rpgtilemap.getShader().uniforms.uWaterTime += deltaTime * P_2D_C.glisSpeed;
            this._app.render();
        }
        this._fpsCounter.endTick();
    };

    function fixGlistenData() {
        if (P_2D_C.glisSpeed  === NaN || P_2D_C.glisSpeed  > 20 || P_2D_C.glisSpeed  < -20)      P_2D_C.glisSpeed  = 0.8;
        if (P_2D_C.glisPower  === NaN || P_2D_C.glisPower  > 2  || P_2D_C.glisPower  <  0)       P_2D_C.glisPower  = 0.5;
        if (P_2D_C.glisOffset === NaN || P_2D_C.glisOffset > 1  || P_2D_C.glisOffset < -1)       P_2D_C.glisOffset = 0;
        if (P_2D_C.glisSize   === NaN || P_2D_C.glisSize   > 1  || P_2D_C.glisSize   < -0.001)   P_2D_C.glisPower  = 0.01;
    }

    Tilemap.Renderer.prototype._createShader = function() {
        const vertexSrc =
            "attribute float aTextureId;" +
            "attribute vec4 aFrame;" +
            "attribute vec2 aSource;" +
            "attribute vec2 aDest;" +
            "uniform mat3   uProjectionMatrix;" +
            "uniform float  uTreeTime;" +
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
            "uniform float  uWaterTime;" +
            "uniform float  uWaterImgPosX;" +
            "uniform float  uWaterImgPosY;" +
            "uniform float  uReferenceColor;" +
            "uniform float  uRefRed;" +
            "uniform float  uRedOffset;" +
            "uniform float  uRefGreen;" +
            "uniform float  uGreenOffset;" +
            "uniform float  uRefBlue;" +
            "uniform float  uBlueOffset;" +
            "uniform float  uGlisPower;" +
            "uniform float  uGlisOffset;" +
            "uniform float  uGlisSize;" +
            "varying float  vIsWater;" +
            "varying float  vWaterTime;" +
            "varying float  vRefRed;" +
            "varying float  vRedOffset;" +
            "varying float  vRefGreen;" +
            "varying float  vGreenOffset;" +
            "varying float  vRefBlue;" +
            "varying float  vBlueOffset;" +
            "varying float  vGlisPower;" +
            "varying float  vGlisOffset;" +
            "varying float  vGlisSize;" +
            "varying vec4   vFrame;" +
            "varying vec2   vTextureCoord;" +
            "varying float  vTextureId;" +
            "void main(void) {" +
            "  vec3 position = uProjectionMatrix * vec3(aDest, 1.0);" +
            "  if (aSource.x >= uTree1ImgPosX + 1024.0 && aSource.x <= uTree1ImgPosX + 48.0 * uTree1ImgPosXCellNum + 1024.0 &&" +
            "      aSource.y >= uTree1ImgPosY          && aSource.y <= uTree1ImgPosY + 48.0 * (uTree1ImgPosYCellNum - 1.0)  &&" +
            "      aTextureId == 1.0 && uIsEnableTree1Swaying == 1.0) {" +
            "    position.x += (abs(sin(aSource.y + uTreeTime)) - 1.0) * uSwayingPower;" +
            "  } else if (aSource.x >= uTree2ImgPosX + 1024.0 && aSource.x <= uTree2ImgPosX + 48.0 * uTree2ImgPosXCellNum + 1024.0 &&" +
            "             aSource.y >= uTree2ImgPosY          && aSource.y <= uTree2ImgPosY + 48.0 * (uTree2ImgPosYCellNum - 1.0)  &&" +
            "             aTextureId == 1.0 && uIsEnableTree2Swaying == 1.0) {" +
            "    position.x += (abs(sin(aSource.y + uTreeTime)) - 1.0) * uSwayingPower;" +
            "  } else if (aSource.x >= uTree3ImgPosX + 1024.0 && aSource.x <= uTree3ImgPosX + 48.0 * uTree3ImgPosXCellNum + 1024.0 &&" +
            "             aSource.y >= uTree3ImgPosY          && aSource.y <= uTree3ImgPosY + 48.0 * (uTree3ImgPosYCellNum - 1.0)  &&" +
            "             aTextureId == 1.0 && uIsEnableTree3Swaying == 1.0) {" +
            "    position.x += (abs(sin(aSource.y + uTreeTime)) - 1.0) * uSwayingPower;" +
            "  }" +
            "  float isWater = 0.0;" +
            "  if (aSource.x >= uWaterImgPosX && aSource.x <= uWaterImgPosX + 48.0 * 6.0 &&" +
            "      aSource.y >= uWaterImgPosY && aSource.y <= uWaterImgPosY + 48.0 * 3.0 &&" +
            "      aTextureId == 0.0) {" +
            "    isWater = 1.0;" +
            "  }" +
            "  gl_Position = vec4(position, 1.0);" +
            "  vFrame        = aFrame;" +
            "  vTextureCoord = aSource;" +
            "  vTextureId    = aTextureId;" +
            "  vWaterTime    = uWaterTime;" +
            "  vIsWater      = isWater;" +
            "  vRefRed       = uRefRed;" +
            "  vRedOffset    = uRedOffset;" +
            "  vRefGreen     = uRefGreen;" +
            "  vGreenOffset  = uGreenOffset;" +
            "  vRefBlue      = uRefBlue;" +
            "  vBlueOffset   = uBlueOffset;" +
            "  vGlisPower    = uGlisPower;" +
            "  vGlisOffset   = uGlisOffset;" +
            "  vGlisSize     = uGlisSize;" +
            "}";
        const fragmentSrc =
            "varying vec4  vFrame;" +
            "varying vec2  vTextureCoord;" +
            "varying float vTextureId;" +
            "varying float vIsWater;" +
            "varying float vWaterTime;" +
            "varying float vRefRed;" +
            "varying float vRedOffset;" +
            "varying float vRefGreen;" +
            "varying float vGreenOffset;" +
            "varying float vRefBlue;" +
            "varying float vBlueOffset;" +
            "varying float vGlisPower;" +
            "varying float vGlisOffset;" +
            "varying float vGlisSize;" +
            "uniform sampler2D uSampler0;" +
            "uniform sampler2D uSampler1;" +
            "uniform sampler2D uSampler2;" +
            "vec2 hash22(vec2 p);" +
            "vec2 randomGradient(vec2 point);" +
            "float perlin_noise(vec2 position);" +
            "void main(void) {" +
            "  vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);" +
            "  int  textureId    = int(vTextureId);" +
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
            "  bool isRightColor = false;" +
            "  float colorR = color.r * 255.0;" +
            "  float colorG = color.g * 255.0;" +
            "  float colorB = color.b * 255.0;" +
            "  if (colorR >= vRefRed - vRedOffset && colorR <= vRefRed + vRedOffset) {" +
            "    if (colorG >= vRefGreen - vGreenOffset && colorG <= vRefGreen + vGreenOffset) {" +
            "      if (colorB >= vRefBlue - vBlueOffset && colorB <= vRefBlue + vBlueOffset) {" +
            "        isRightColor = true;" +
            "      }" +
            "    }" +
            "  }" +
            "  if (vIsWater == 1.0 && isRightColor) {" +
            "    float val = perlin_noise(vec2(gl_FragCoord.x + vWaterTime, gl_FragCoord.y + vWaterTime) * vGlisSize);" +
            "    color += vec4(vec3(vGlisPower * sin(val) + vGlisOffset), 0.0);" +
            "  }" +
            "  gl_FragColor = color;" +
            "}" +
            "vec2 hash22(vec2 p) {" +
	        "  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));" +
            "  p3 += dot(p3, p3.yzx + 33.33);" +
            "  return fract((p3.xx + p3.yz) * p3.zy);" +
            "}" +
            "vec2 randomGradient(vec2 point) {" +
            "  return -1.0 + 2.0 * hash22(point);" +
            "}" +
            "float perlin_noise(vec2 position) {" +
            "  vec2 gridCell = floor(position);" +
            "  vec2 local = position - gridCell;" +
            "  vec2 weight = local * local * (3.0 - 2.0 * local);" +
            "  return mix(" +
            "    mix(" +
            "      dot(local - vec2(0,0), randomGradient(gridCell + vec2(0,0)))," +
            "      dot(local - vec2(1,0), randomGradient(gridCell + vec2(1,0)))," +
            "      weight.x)," +
            "    mix(" +
            "      dot(local - vec2(0,1), randomGradient(gridCell + vec2(0,1)))," +
            "      dot(local - vec2(1,1), randomGradient(gridCell + vec2(1,1)))," +
            "      weight.x)," +
            "    weight.y);" +
            "}";

        return new PIXI.Shader(PIXI.Program.from(vertexSrc, fragmentSrc), {
            uSampler0: 0,
            uSampler1: 0,
            uSampler2: 0,
            uProjectionMatrix: new PIXI.Matrix(),
            uTreeTime: 0,
            uTree1ImgPosX:         P_2D_C.tree1ImgPosX,
            uTree1ImgPosY:         P_2D_C.tree1ImgPosY,
            uTree1ImgPosXCellNum:  P_2D_C.tree1ImgPosXCellNum,
            uTree1ImgPosYCellNum:  P_2D_C.tree1ImgPosYCellNum,
            uIsEnableTree1Swaying: P_2D_C.isEnableTree1Swaying ? 1 : 0,
            uTree2ImgPosX:         P_2D_C.tree2ImgPosX,
            uTree2ImgPosY:         P_2D_C.tree2ImgPosY,
            uTree2ImgPosXCellNum:  P_2D_C.tree2ImgPosXCellNum,
            uTree2ImgPosYCellNum:  P_2D_C.tree2ImgPosYCellNum,
            uIsEnableTree2Swaying: P_2D_C.isEnableTree2Swaying ? 1 : 0,
            uTree3ImgPosX:         P_2D_C.tree3ImgPosX,
            uTree3ImgPosY:         P_2D_C.tree3ImgPosY,
            uTree3ImgPosXCellNum:  P_2D_C.tree3ImgPosXCellNum,
            uTree3ImgPosYCellNum:  P_2D_C.tree3ImgPosYCellNum,
            uIsEnableTree3Swaying: P_2D_C.isEnableTree3Swaying ? 1 : 0,
            uSwayingPower:         P_2D_C.swayingPower,
            uWaterTime: 0,
            uWaterImgPosX:         P_2D_C.waterImgPosX,
            uWaterImgPosY:         P_2D_C.waterImgPosY,
            uReferenceColor:       P_2D_C.referenceColor,
            uRefRed:               P_2D_C.refR,
            uRedOffset:            P_2D_C.redOffset,
            uRefGreen:             P_2D_C.refG,
            uGreenOffset:          P_2D_C.greenOffset,
            uRefBlue:              P_2D_C.refB,
            uBlueOffset:           P_2D_C.blueOffset,
            uGlisPower:            P_2D_C.glisPower,
            uGlisOffset:           P_2D_C.glisOffset,
            uGlisSize:             P_2D_C.glisSize,
        });
    };
})();