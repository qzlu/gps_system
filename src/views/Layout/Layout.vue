<template>
    <div class="layout">
        <header class="layout-header">
            <ul class="layout-header-icon-list">
                <li class="icon-circle">
                    <i class="iconfont icon-Itsmine"></i>
                </li>
                <li class="user-name-dropdown">
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        {{userName||'--'}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li class="icon-circle">
                    <i class="iconfont icon-Alert"></i>
                </li>
                <li class="icon-circle">
                    <i class="iconfont icon-Updatecalendar"></i>
                </li>
                <li class="icon-circle">
                    <i class="iconfont icon-News"></i>
                </li>
                <li class="icon-circle">
                    <i class="iconfont icon-Customerservice"></i>
                </li>
            </ul>
            <canvas id="canvas" style="position: absolute; z-index: -1; left: 0px;"></canvas>
            <div class="logo flex">
                <img src="" alt="">
                <span class="system-name">{{$t('layout.formName')}}</span>
            </div>
            <ul class="menu"> 
                <li class="menu-item" v-for="(item,i) in menus" :key="i"  @click="changeRoute(i)">
                    <router-link :to="item.path||'/manage'">{{item.FMenuName}}</router-link>
                    <ul class="menu-children" v-if="item.children&&item.children.length>0">
                        <li class="menu-children-item" v-for="(obj,j) in item.children" :key="j">
                            <router-link :to="obj.path||'/manage'">{{obj.FMenuName}}</router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </header>
        <div class="layout-main">
            <router-view>

            </router-view>
            <!-- <my-map></my-map> -->
        </div>  
    </div>
</template>
<script>
import {MyMap} from '@/components/index.js'
import {User} from '@/request/api.js'
export default {
    data(){
        return{
            menus:[],
            canvas:null,
            index:0,
            userName:localStorage.getItem('userName')
        }
    },
    components:{
        MyMap
    },
    created(){
        this.menus = this.$t('layout.menus')
        let path = this.$route.path
        let index = this.menus.findIndex(item => {
            let reg = new RegExp(item.path)
            return reg.test(path)
        })
        this.index = index>=0?index:0
    },
    mounted(){
        this.getMenus()
    },
    methods:{
        /**
         * 绘制头部背景
         */
        drawMenubg(){
            var c = Math.min, h = Math.sign, m = Math.max, n = Math.abs, j = .85, k = 10, l = 4;
            var opt = {};
            opt.currentIndex = this.index;
            opt.canvas = document.getElementById('canvas');


            var calcAVGSpeed = function (a) {
                var b = (l * j * a + k * (1 - j) * a) / (k * l * 20);
                return b = m(n(b), 2.5) * h(b), b
            }
            var getCurSpeed = function (a, b) {
                var c = n(a) > n(j * b) ? l * opt.avgSpeed : k * opt.avgSpeed;
                return c
            }


            var _calCurve = function (a, b, c, d, e, f) {
                //console.log(a + f,b,c-f,d,c,d);
                e.bezierCurveTo(a + f, b, c - f, d, c, d)
            }

            var _initCanvas = function (canvas, width, height) {
                var devicePixelRatio = window.devicePixelRatio, canvasObj = canvas.getContext("2d");
                canvas.width = width * devicePixelRatio, canvas.height = height * devicePixelRatio, canvas.style.width = width + "px", canvas.style.height = height + "px", canvasObj.scale(devicePixelRatio, devicePixelRatio)
            }

            var resize = function () {
                //resize发生
                opt.timer && cancelAnimationFrame(opt.timer);
                _calcTabs();
                _initCanvas(opt.canvas, opt.width, opt.height), draw(0)
            }


            var _calcTabs = function () {
                var a = document.querySelectorAll(".menu .menu-item"), b = [], c = 0;
                Array.prototype.forEach.call(a, function (a) {
                    b.push(c), c += a.offsetWidth
                }), b[0] = -20, b.push(c), opt.tabWidthList = b, opt.tabHeight = a[0].offsetHeight, opt.height = opt.tabHeight + 20, opt.width = window.innerWidth
            }


            var _toggle = function (navindex) {
                "undefined" !== typeof navindex && navindex !== opt.currentIndex && opt.tabWidthList && opt.tabWidthList.length && (!opt.animating || navindex !== opt.nextIndex) && (opt.animating = true, opt.distance = opt.tabWidthList[navindex] - opt.tabWidthList[opt.currentIndex], opt.avgSpeed = calcAVGSpeed(opt.distance), opt.curDisX = 0, opt.nextIndex = navindex)
                this.index = navindex
                return false;

            }


            var _createPattern = function (a) {
                var b = 140, c = 63, d = 1, e = document.createElement("canvas");
                e.width = b, e.height = c, e.style.width = b / d + "px", e.style.height = c / d + "px";
                var f = e.getContext("2d");
                //缩放 宽高 100%
                f.scale(d, d);
                f.lineWidth = .4;
                for (var g = 3, h = .8, j = 1; 30 > j; j++){
                    //设置或返回用于笔触的颜色、渐变或模式
                    f.strokeStyle = "RGBA(22, 120, 160, " + h + ")";
                    //开始一条路径
                    f.beginPath();
                    //把路径移动到画布中的指定点，不创建线条
                    f.moveTo(0, j * g);
                    //添加一个新点，然后在画布中创建从该点到最后指定点的线条
                    f.lineTo(b, j * g);
                    //绘制已定义的路径
                    f.stroke();
                    //创建从当前点回到起始点的路径
                    f.closePath();
                    10 < j && (h -= .1);
                }
                var i = a.getContext("2d").createPattern(e, "repeat-x");
                opt.pattern = i, e = null
            }

            var _drawHightlight = function (a) {
                //a = 0
                var b = opt.canvas.getContext("2d"), d = .3;
                //clearRect 在给定的矩形内清除指定的像素,这里清完了
                b.clearRect(0, 0, 2 * opt.width, 2 * opt.height);
                b.shadowColor = "#048C92";
                b.shadowBlur = 5;
                b.strokeStyle = "#048C92";
                b.lineWidth = 2.8;
                b.fillStyle = "none";
                _draw(b, false);
                //这里绘制了外围边框线条
                //return false;
                var e = b.createLinearGradient(0, 0, opt.width, opt.height), f = a - d;
                e.addColorStop(c(1, m(0, 0 + f)), "rgba(0,0,0,0)");
                e.addColorStop(c(1, m(0, 0 + f + .1)), "#8ED6FF");
                e.addColorStop(c(1, 0 + f + d), "#8ED6FF");
                e.addColorStop(c(1, 0 + f + d + .1), "rgba(0,0,0,0)");
                e.addColorStop(1, "rgba(0,0,0,0)");
                b.lineWidth = 1.5;
                b.strokeStyle = e;
                b.fillStyle = opt.pattern;
                _draw(b, true)

            }


            var draw = function (a) {
                //console.log(a);
                _drawHightlight(a);
                //return false;

                opt.timer = requestAnimationFrame(function () {
                    /* console.log(a); */
                    draw((a + .005) % 1.6)
                })


            }

            var _draw = function (canvasObj, trueorfalse) {
                var navindex = opt.currentIndex, tableHeight = opt.tabHeight, f = 470, g = 40, i = 20, j = .5, k = 2.5, l = 0;
                if (canvasObj.beginPath(), canvasObj.moveTo(-50, opt.height + 10), canvasObj.lineTo(-50, tableHeight + j), opt.animating) {
                    var m = getCurSpeed(opt.curDisX, opt.distance);
                    l = c(n(opt.distance), n(opt.curDisX + m)) * h(m)
                }
                if (canvasObj.lineTo(f + opt.tabWidthList[navindex] + l - g / 2, tableHeight + j), _calCurve(f + opt.tabWidthList[navindex] + l - g / 2, tableHeight + j, f + opt.tabWidthList[navindex] + l + g / 2, k + j, canvasObj, i), opt.animating) {
                    var o = opt.tabWidthList[opt.nextIndex + 1] - opt.tabWidthList[opt.nextIndex];
                    canvasObj.lineTo(f + opt.tabWidthList[navindex] + o + l - g / 2, k + j), _calCurve(f + opt.tabWidthList[navindex] + o + l - g / 2, k + j, f + opt.tabWidthList[navindex] + o + l + g / 2, tableHeight + j, canvasObj, i)
                } else {
                    //lineTO添加一个新点 宽度长度
                    canvasObj.lineTo(f + opt.tabWidthList[navindex + 1] + l - g / 2, k + j);
                    _calCurve(f + opt.tabWidthList[navindex + 1] + l - g / 2, k + j, f + opt.tabWidthList[navindex + 1] + l + g / 2, tableHeight + j, canvasObj, i);
                }

                canvasObj.lineTo(opt.width + 10, tableHeight + j);
                canvasObj.lineTo(opt.width + 10, opt.height + 10);
                canvasObj.closePath();
                canvasObj.stroke();
                trueorfalse && canvasObj.fill();
                opt.animating && trueorfalse && (opt.curDisX = l, n(l) >= n(opt.distance) && (opt.animating = false, opt.currentIndex = opt.nextIndex))
            }

           /*  _toggle(0); */
            _calcTabs();
            _initCanvas(opt.canvas, opt.width, opt.height);
            _createPattern(opt.canvas);
            draw(0);

            window.onresize = function () {
                resize();
            };
            return {
                "_toggle": _toggle
            }
        },
        changeRoute(i){
            this.canvas._toggle(i)
        },
        formatterMenu(arr,guid,result =[]){
            arr.forEach(item => {
                if(item.FParentGUID == guid){
                    result.push(item)
                    item.children = this.formatterMenu(arr,item.FGUID)
                }
            })
            return result
        },
        getMenus(){
            User({
                FAction:'QueryAdminMenuListByUserGUID'
            })
            .then(result => {
                let menus = result.FObject
               /*  this.menus = this.formatterMenu(menus,null,[]) */
                this.$nextTick(() => {
                    this.canvas = this.drawMenubg()
                })
            })
            .catch(err => {
                console.log(err)
            })
        },
        logOut(){
            window.location.href = 'http://39.108.194.238:56081'
        }
    }
}
</script>
<style lang="scss">
.layout{
    height: 100%;
    &-header{
        width:100%;
        height:100px;
        padding-top: 60px;
        box-sizing: border-box;
        background:#000B21;
        position: relative;
        z-index: 10;
        &-icon-list{
            display: flex;
            position: absolute;
            top: 13px;
            right: 68px;
            align-items: center;
            .icon-circle{
                width:30px;
                height:30px;
                line-height: 30px;
                margin-left: 13px;
                background:rgba(0,255,249,0.2);
                box-shadow:0px 3px 7px 0px rgba(0, 0, 0, 0.35);
                border-radius:50%;
                color: #00FFF9;
                font-size: 18px;
            }
            .user-name-dropdown{
                margin-left: 4px;
                cursor: pointer;
                font-size: 14px;
                .el-dropdown{
                    color: white;
                    .el-icon-arrow-down{
                        font-size: 18px;
                        color: #00FFF9
                    }
                    .el-icon-arrow-down:before{
                        content:"\E790"
                    }
                }
            }
        }
        .logo{
            position: absolute;
            align-items: center;
            top: 39px;
            left: 90px;
            img{
                    width: 52px;
                    height: 39px;
            }
            .system-name{
                font-size:32px;
                font-family:Microsoft YaHei;
                font-weight:bold;
                color:rgba(255,255,255,1);
            }
        }
        #canvas{
            top: 57px;
        }
        >ul{
            margin-left: 470px;
            display: flex;
            >li.menu-item{
                width: 120px;
                height: 40px;
                line-height: 40px;
                cursor: pointer;
                font-size:20px;
                font-family:Microsoft YaHei;
                font-weight:bold;
                color:rgba(255,255,255,1);
                .menu-children{
                    display: none;
                }
                &:hover{
                    .menu-children{
                        width: 100%;
                        margin-top: 0px;
                        display: block;
                        box-sizing: border-box;
                        background: #002032;
                        li{
                            height: 40px;
                            line-height: 40px;
                            font-size: 16px;
                            a{
                                display: block
                            }
                            &:hover{
                                background: #15868c;
                            }
                        }
                    }
                }
            }
        } 
    }
    &-main{
        height: calc(100% - 100px);
    }
}
</style>