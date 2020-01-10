<template>
    <div :id="id" class="map" :style="style">
        
    </div>
</template>
<script>
import uuidv1 from 'uuid/v1'
import MyAMap from './Amap.js'
import MyGoogleMap from './googleMap.js'
const MyMap = {
    'MyAMap':new MyAMap(),
    'MyGoogleMap':new MyGoogleMap()
}
export default {
    data(){
        return{
            ratioHeigt:null,
            ratioWidth:null,
            id:'',
        }
    },
    props:{
        mapType:{ //地图类型
            default:'MyAMap'
        }
    },
    computed:{
        style(){
            return {
              width:`${1/this.ratioWidth*100}%`,
              height:`${1/this.ratioHeigt*100}%`,
              transform: "scale("+ this.ratioWidth + ',' + this.ratioHeigt + ") ",
              transformOrigin: "left top ",
            }
        }
    },
    created(){
      this.id = uuidv1()
      window.addEventListener('resize',this.getHeight)
      this.getHeight()
      this.$nextTick(() => {
          this.initMap()
      })
    },
    methods:{
      getHeight(){
        this.ratioWidth = 1920/window.innerWidth
        this.ratioHeigt=1080/window.innerHeight
      },
      initMap(){
          console.log(this.mapType,MyMap[this.mapType])
         MyMap[this.mapType].show(this.id)
      }
    }
}
</script>