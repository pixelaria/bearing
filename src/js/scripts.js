function initMap() {
    var uluru = {lat: 55.709759, lng: 37.597026};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: uluru,
        disableDefaultUI: true
    });
    var icon = {
        url: '/img/marker.png',
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        icon: icon
    });
}

$(function () {
    console.log('init');
    initMap();
});
