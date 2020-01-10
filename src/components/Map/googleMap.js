export default class myGoogleMap {
    show(id){
        let map = new google.maps.Map(document.getElementById(id), {
            resizeEnable: true,
            center: [116.397428, 39.90923],
            zoom: 8
        });
        return map
    }
}