export default class MyAMap{
    constructor(){
        
    }
    show(id){
        console.log(id)
        let map = new AMap.Map(id,{
            resizeEnable: true,
            center: [116.397428, 39.90923],
            zoom: 13
        })
        return map
    }
}