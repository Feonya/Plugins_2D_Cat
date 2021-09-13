/*:
 * @target     MZ
 * @plugindesc v1.1 为地图中的水（等）图块添加波光粼粼效果。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 条件限制：
 * 由于引擎底层功能限制，本插件的使用也存在若干条件限制。
 * 1、仅对图块集A中288x144大小的水面自动Tile生效。
 * 2、必须提前查看水图像在图块集图片中的坐标位置（px），以用于插件参数设置。
 * 3、同一时间，仅支持2种水Tile的波光效果。
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
 * * 致谢说明：
 * 本插件的柏林噪音生成功能使用了shadertoy.com用户Sprocket的代码，这里表示感谢！
 * 地址：https://www.shadertoy.com/view/7dcGRj
 *
 * * 更新日志：
 * -- 20210911 v1.1
 *     同一时间支持2种水Tile的波光效果。
 * -- 20210907 v1.0
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
 * @param   water1ImgPosX
 * @text    水1在图块集图片中的x坐标位置（px）
 * @type    number
 * @min     0
 * @default 0
 * @desc    即目标图像左上角坐标的x值。
 *
 * @param   water1ImgPosY
 * @text    水1在图块集图片中的y坐标位置（px）
 * @type    number
 * @min     0
 * @default 0
 * @desc    即目标图像左上角坐标的y值。
 *
 * @param   water1ReferenceColor
 * @text    水1的参考RGB颜色
 * @type    string
 * @default #2da2cd
 * @desc    用于识别水1近似RGB颜色的参考值，值为带井号“#”的16进制字符串。
 *
 * @param   water1RedOffset
 * @text    水1的参考色R值偏移量
 * @type    number
 * @default 100
 * @desc    识别水1近似RGB颜色时，决定R值的识别范围
 *
 * @param   water1GreenOffset
 * @text    水1的参考色G值偏移量
 * @type    number
 * @default 100
 * @desc    识别水1近似RGB颜色时，决定R值的识别范围
 *
 * @param   water1BlueOffset
 * @text    水1的参考色B值偏移量
 * @type    number
 * @default 100
 * @desc    识别水1近似RGB颜色时，决定B值的识别范围
 *
 * @param   _cutLine1
 * @text    ------------------------
 * @default
 *
 * @param   water2ImgPosX
 * @text    水2在图块集图片中的x坐标位置（px）
 * @type    number
 * @min     0
 * @default 0
 * @desc    即目标图像左上角坐标的x值。
 *
 * @param   water2ImgPosY
 * @text    水2在图块集图片中的y坐标位置（px）
 * @type    number
 * @min     0
 * @default 144
 * @desc    即目标图像左上角坐标的y值。
 *
 * @param   water2ReferenceColor
 * @text    水2的参考RGB颜色
 * @type    string
 * @default #2da2cd
 * @desc    用于识别水2近似RGB颜色的参考值，值为带井号“#”的16进制字符串。
 *
 * @param   water2RedOffset
 * @text    水2的参考色R值偏移量
 * @type    number
 * @default 100
 * @desc    识别水2近似RGB颜色时，决定R值的识别范围
 *
 * @param   water2GreenOffset
 * @text    水2的参考色G值偏移量
 * @type    number
 * @default 100
 * @desc    识别水2近似RGB颜色时，决定R值的识别范围
 *
 * @param   water2BlueOffset
 * @text    水2的参考色B值偏移量
 * @type    number
 * @default 100
 * @desc    识别水2近似RGB颜色时，决定B值的识别范围
 *
 * @param   _cutLine2
 * @text    ------------------------
 * @default
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

    P_2D_C.water1ImgPosX        = Number(params.water1ImgPosX);
    P_2D_C.water1ImgPosY        = Number(params.water1ImgPosY);
    P_2D_C.water1ReferenceColor = String(params.water1ReferenceColor);
    P_2D_C.water1RedOffset      = Number(params.water1RedOffset);
    P_2D_C.water1GreenOffset    = Number(params.water1GreenOffset);
    P_2D_C.water1BlueOffset     = Number(params.water1BlueOffset);
    P_2D_C.water2ImgPosX        = Number(params.water2ImgPosX);
    P_2D_C.water2ImgPosY        = Number(params.water2ImgPosY);
    P_2D_C.water2ReferenceColor = String(params.water2ReferenceColor);
    P_2D_C.water2RedOffset      = Number(params.water2RedOffset);
    P_2D_C.water2GreenOffset    = Number(params.water2GreenOffset);
    P_2D_C.water2BlueOffset     = Number(params.water2BlueOffset);
    P_2D_C.glisSpeed  = Number(params.glistenSpeed);
    P_2D_C.glisPower  = Number(params.glistenPower);
    P_2D_C.glisOffset = Number(params.glistenOffset);
    P_2D_C.glisSize   = Number(params.glistenSize);

    P_2D_C.water1RefR = Number('0x' + P_2D_C.water1ReferenceColor.slice(1, 3));
    P_2D_C.water1RefG = Number('0x' + P_2D_C.water1ReferenceColor.slice(3, 5));
    P_2D_C.water1RefB = Number('0x' + P_2D_C.water1ReferenceColor.slice(5));
    P_2D_C.water2RefR = Number('0x' + P_2D_C.water2ReferenceColor.slice(1, 3));
    P_2D_C.water2RefG = Number('0x' + P_2D_C.water2ReferenceColor.slice(3, 5));
    P_2D_C.water2RefB = Number('0x' + P_2D_C.water2ReferenceColor.slice(5));

    fixGlistenData();

    PluginManager.registerCommand('2D_Cat_GlisteningWaterTile', 'changeGlistening', args => {
        P_2D_C.glisSpeed  = Number(args.newGlistenSpeed);
        P_2D_C.glisPower  = Number(args.newGlistenPower);
        P_2D_C.glisOffset = Number(args.newGlistenOffset);
        P_2D_C.glisSize   = Number(args.newGlistenSize);
        fixGlistenData();
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uGlisPower  = P_2D_C.glisPower;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uGlisOffset = P_2D_C.glisOffset;
        Graphics.app.renderer.plugins.rpgtilemap.getShader().uniforms.uGlisSize   = P_2D_C.glisSize;
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
        if (String(P_2D_C.glisSpeed)  === 'NaN' || P_2D_C.glisSpeed  > 20 || P_2D_C.glisSpeed  < -20)      P_2D_C.glisSpeed  = 0.8;
        if (String(P_2D_C.glisPower)  === 'NaN' || P_2D_C.glisPower  > 2  || P_2D_C.glisPower  <  0)       P_2D_C.glisPower  = 0.5;
        if (String(P_2D_C.glisOffset) === 'NaN' || P_2D_C.glisOffset > 1  || P_2D_C.glisOffset < -1)       P_2D_C.glisOffset = 0;
        if (String(P_2D_C.glisSize)   === 'NaN' || P_2D_C.glisSize   > 1  || P_2D_C.glisSize   < -0.001)   P_2D_C.glisPower  = 0.01;
    }

    Tilemap.Renderer.prototype._createShader = function() {
        const vertexSrc =
            "attribute float aTextureId;" +
            "attribute vec4  aFrame;" +
            "attribute vec2  aSource;" +
            "attribute vec2  aDest;" +
            "uniform mat3  uProjectionMatrix;" +
            "uniform float uTreeTime;" +
            "uniform float uTree1ImgPosX;" +
            "uniform float uTree1ImgPosY;" +
            "uniform float uTree1ImgPosXCellNum;" +
            "uniform float uTree1ImgPosYCellNum;" +
            "uniform float uIsEnableTree1Swaying;" +
            "uniform float uTree2ImgPosX;" +
            "uniform float uTree2ImgPosY;" +
            "uniform float uTree2ImgPosXCellNum;" +
            "uniform float uTree2ImgPosYCellNum;" +
            "uniform float uIsEnableTree2Swaying;" +
            "uniform float uTree3ImgPosX;" +
            "uniform float uTree3ImgPosY;" +
            "uniform float uTree3ImgPosXCellNum;" +
            "uniform float uTree3ImgPosYCellNum;" +
            "uniform float uIsEnableTree3Swaying;" +
            "uniform float uSwayingPower;" +
            "uniform float uWaterTime;" +
            "uniform float uWater1ImgPosX;" +
            "uniform float uWater1ImgPosY;" +
            "uniform float uWater1ReferenceColor;" +
            "uniform float uWater1RefRed;" +
            "uniform float uWater1RedOffset;" +
            "uniform float uWater1RefGreen;" +
            "uniform float uWater1GreenOffset;" +
            "uniform float uWater1RefBlue;" +
            "uniform float uWater1BlueOffset;" +
            "uniform float uWater2ImgPosX;" +
            "uniform float uWater2ImgPosY;" +
            "uniform float uWater2ReferenceColor;" +
            "uniform float uWater2RefRed;" +
            "uniform float uWater2RedOffset;" +
            "uniform float uWater2RefGreen;" +
            "uniform float uWater2GreenOffset;" +
            "uniform float uWater2RefBlue;" +
            "uniform float uWater2BlueOffset;" +
            "uniform float uGlisPower;" +
            "uniform float uGlisOffset;" +
            "uniform float uGlisSize;" +
            "varying float vIsWater;" +
            "varying float vWaterTime;" +
            "varying float vWater1RefRed;" +
            "varying float vWater1RedOffset;" +
            "varying float vWater1RefGreen;" +
            "varying float vWater1GreenOffset;" +
            "varying float vWater1RefBlue;" +
            "varying float vWater1BlueOffset;" +
            "varying float vWater2RefRed;" +
            "varying float vWater2RedOffset;" +
            "varying float vWater2RefGreen;" +
            "varying float vWater2GreenOffset;" +
            "varying float vWater2RefBlue;" +
            "varying float vWater2BlueOffset;" +
            "varying float vGlisPower;" +
            "varying float vGlisOffset;" +
            "varying float vGlisSize;" +
            "varying vec4  vFrame;" +
            "varying vec2  vTextureCoord;" +
            "varying float vTextureId;" +
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
            "  if (aSource.x >= uWater1ImgPosX && aSource.x <= uWater1ImgPosX + 48.0 * 6.0 &&" +
            "      aSource.y >= uWater1ImgPosY && aSource.y <= uWater1ImgPosY + 48.0 * 3.0 &&" +
            "      aTextureId == 0.0) {" +
            "    isWater = 1.0;" +
            "  } else if (aSource.x >= uWater2ImgPosX && aSource.x <= uWater2ImgPosX + 48.0 * 6.0 &&" +
            "      aSource.y >= uWater2ImgPosY && aSource.y <= uWater2ImgPosY + 48.0 * 3.0 &&" +
            "      aTextureId == 0.0) {" +
            "    isWater = 2.0;" +
            "  }" +
            "  gl_Position = vec4(position, 1.0);" +
            "  vFrame        = aFrame;" +
            "  vTextureCoord = aSource;" +
            "  vTextureId    = aTextureId;" +
            "  vWaterTime    = uWaterTime;" +
            "  vIsWater      = isWater;" +
            "  vWater1RefRed      = uWater1RefRed;" +
            "  vWater1RedOffset   = uWater1RedOffset;" +
            "  vWater1RefGreen    = uWater1RefGreen;" +
            "  vWater1GreenOffset = uWater1GreenOffset;" +
            "  vWater1RefBlue     = uWater1RefBlue;" +
            "  vWater1BlueOffset  = uWater1BlueOffset;" +
            "  vWater2RefRed      = uWater2RefRed;" +
            "  vWater2RedOffset   = uWater2RedOffset;" +
            "  vWater2RefGreen    = uWater2RefGreen;" +
            "  vWater2GreenOffset = uWater2GreenOffset;" +
            "  vWater2RefBlue     = uWater2RefBlue;" +
            "  vWater2BlueOffset  = uWater2BlueOffset;" +
            "  vGlisPower  = uGlisPower;" +
            "  vGlisOffset = uGlisOffset;" +
            "  vGlisSize   = uGlisSize;" +
            "}";
        const fragmentSrc =
            "varying vec4  vFrame;" +
            "varying vec2  vTextureCoord;" +
            "varying float vTextureId;" +
            "varying float vIsWater;" +
            "varying float vWaterTime;" +
            "varying float vWater1RefRed;" +
            "varying float vWater1RedOffset;" +
            "varying float vWater1RefGreen;" +
            "varying float vWater1GreenOffset;" +
            "varying float vWater1RefBlue;" +
            "varying float vWater1BlueOffset;" +
            "varying float vWater2RefRed;" +
            "varying float vWater2RedOffset;" +
            "varying float vWater2RefGreen;" +
            "varying float vWater2GreenOffset;" +
            "varying float vWater2RefBlue;" +
            "varying float vWater2BlueOffset;" +
            "varying float vGlisPower;" +
            "varying float vGlisOffset;" +
            "varying float vGlisSize;" +
            "uniform sampler2D uSampler0;" +
            "uniform sampler2D uSampler1;" +
            "uniform sampler2D uSampler2;" +
            "vec2  hash22(vec2 p);" +
            "vec2  randomGradient(vec2 point);" +
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
            "  float colorR = color.r * 255.0;" +
            "  float colorG = color.g * 255.0;" +
            "  float colorB = color.b * 255.0;" +
            "  if (vIsWater == 1.0) {" +
            "    if (colorR >= vWater1RefRed - vWater1RedOffset && colorR <= vWater1RefRed + vWater1RedOffset) {" +
            "      if (colorG >= vWater1RefGreen - vWater1GreenOffset && colorG <= vWater1RefGreen + vWater1GreenOffset) {" +
            "        if (colorB >= vWater1RefBlue - vWater1BlueOffset && colorB <= vWater1RefBlue + vWater1BlueOffset) {" +
            "          float val = perlin_noise(vec2(gl_FragCoord.x + vWaterTime, gl_FragCoord.y + vWaterTime) * vGlisSize);" +
            "          color += vec4(vec3(vGlisPower * sin(val) + vGlisOffset), 0.0);" +
            "        }" +
            "      }" +
            "    }" +
            "  } else if (vIsWater == 2.0) {" +
            "    if (colorR >= vWater2RefRed - vWater2RedOffset && colorR <= vWater2RefRed + vWater2RedOffset) {" +
            "      if (colorG >= vWater2RefGreen - vWater2GreenOffset && colorG <= vWater2RefGreen + vWater2GreenOffset) {" +
            "        if (colorB >= vWater2RefBlue - vWater2BlueOffset && colorB <= vWater2RefBlue + vWater2BlueOffset) {" +
            "          float val = perlin_noise(vec2(gl_FragCoord.x + vWaterTime, gl_FragCoord.y + vWaterTime) * vGlisSize);" +
            "          color += vec4(vec3(vGlisPower * sin(val) + vGlisOffset), 0.0);" +
            "        }" +
            "      }" +
            "    }" +
            "  }" +
            "  gl_FragColor = color;" +
            "}" +
            "vec2 hash22(vec2 p) {" +
	        "  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, 0.1030, 0.0973));" +
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
            uWater1ImgPosX:        P_2D_C.water1ImgPosX,
            uWater1ImgPosY:        P_2D_C.water1ImgPosY,
            uWater1ReferenceColor: P_2D_C.water1ReferenceColor,
            uWater1RefRed:         P_2D_C.water1RefR,
            uWater1RedOffset:      P_2D_C.water1RedOffset,
            uWater1RefGreen:       P_2D_C.water1RefG,
            uWater1GreenOffset:    P_2D_C.water1GreenOffset,
            uWater1RefBlue:        P_2D_C.water1RefB,
            uWater1BlueOffset:     P_2D_C.water1BlueOffset,
            uWater2ImgPosX:        P_2D_C.water2ImgPosX,
            uWater2ImgPosY:        P_2D_C.water2ImgPosY,
            uWater2ReferenceColor: P_2D_C.water2ReferenceColor,
            uWater2RefRed:         P_2D_C.water2RefR,
            uWater2RedOffset:      P_2D_C.water2RedOffset,
            uWater2RefGreen:       P_2D_C.water2RefG,
            uWater2GreenOffset:    P_2D_C.water2GreenOffset,
            uWater2RefBlue:        P_2D_C.water2RefB,
            uWater2BlueOffset:     P_2D_C.water2BlueOffset,
            uGlisPower:            P_2D_C.glisPower,
            uGlisOffset:           P_2D_C.glisOffset,
            uGlisSize:             P_2D_C.glisSize,
        });
    };
})();