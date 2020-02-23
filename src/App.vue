<template>
  <div id="app" :style="style">
    <transition name="fade" mode="out-in" appear>
      <login></login>
    </transition>
  </div>
</template>
<script>
import Login from '@/views/Login/'
export default {
  name: 'App',
  data(){
    return{
      ratioHeigt:null,
      ratioWidth:null
    }
  },
  components:{
    Login
  },
  computed:{
    style(){
      return {
        transform: "scale("+ this.ratioWidth + ',' + this.ratioHeigt + ") translate3d(0,0,0)",
        transformOrigin: "left top ",
        backgroundSize: "100%" + ' 100%',
      }
    }
  },
  created(){
    window.addEventListener('resize',this.getHeight)
    this.getHeight()
  },
  methods:{
    getHeight(){
      this.ratioWidth = window.innerWidth/1920
      this.ratioHeigt=window.innerHeight/1080
    }
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  font-size: 14px;
  -webkit-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
}
</style>
