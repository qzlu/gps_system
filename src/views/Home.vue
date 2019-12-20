<template>
  <div class="home">
      <canvas id="myCanvas"></canvas>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data(){
    return{

    }
  },
  mounted(){
    this.$nextTick(() => {
      this.draw()
    })
  },
  methods:{
    draw(){
      let canvas = document.getElementById('myCanvas'),
      ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(40, 200); //起始点
      var cp1x = 20, cp1y = 100;  //控制点1
      var cp2x = 100, cp2y = 120;  //控制点2
      var x = 200, y = 200; // 结束点
      //绘制二次贝塞尔曲线
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.rect(40, 200, 10, 10);
      ctx.rect(cp1x, cp1y, 10, 10);
      ctx.rect(cp2x, cp2y, 10, 10);
      ctx.rect(x, y, 10, 10);
      ctx.fill();
    }
  }
}
</script>
