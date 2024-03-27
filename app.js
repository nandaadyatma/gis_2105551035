// LEAFLET.JS
var map = L.map("map").setView([-8.621213, 115.086804], 11);

let listLocation = [];
let listMarker = [];

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19, //max zoom
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', //copyright
}).addTo(map);


//////////////////////////////////////////////////////////////////////

let placeName = document.getElementById("inputPlaceName");
let description = document.getElementById("inputDescription");
let latitude = document.getElementById("inputLatitude");
let longitude = document.getElementById("inputLongitude");
let imgUrl = document.getElementById("inputImgUrl");
let category = document.getElementById("inputCategory");

// FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCebGipg56isDCAxjEJ1-jJtUXK4wTHERI",
  authDomain: "gis-nanda035.firebaseapp.com",
  databaseURL: "https://gis-nanda035-default-rtdb.firebaseio.com",
  projectId: "gis-nanda035",
  storageBucket: "gis-nanda035.appspot.com",
  messagingSenderId: "633969420544",
  appId: "1:633969420544:web:261c024511c4b1287b2be5",
  measurementId: "G-MRTLET02ZH",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let database = firebase.database();

//   Create Data to Firebase
function testing(){
  console.log(category.value)
}

function createData() {
  let data = {
    placeName: placeName.value,
    description: description.value,
    category: category.value,
    latitude: latitude.value,
    longitude: longitude.value,
    imgUrl: imgUrl.value,
  };

  if (
    placeName.value != "" &&
    description.value != "" &&
    latitude.value != "" &&
    longitude.value != "" &&
    imgUrl.value != "" 
  ) {
    database.ref("placeData").push(data);

    placeName.value = "";
    description.value = "";
    latitude.value = "";
    longitude.value = "";
    imgUrl.value = "";
  }
}

//   Read Data from Firebase
database.ref("placeData").on("value", getData);

function getData(snapshoot) {
  let table = ``;
  let number = 1;
  let points = [];
  snapshoot.forEach((element) => {
    console.log(element.val().placeName);
    var data = element.val();
    listLocation.push(data);
    table += `
        <tr>
                <th scope="row">${number}</th>
                <td>${data.placeName}</td>
                <td>${data.description}</td>
                <td>${data.latitude}</td>
              </tr>
        `;
    number++;
    points.push([data.latitude, data.longitude]);
    console.log(element.key);

    let currentIcon = cameraMarker
    switch (data.category) {
  
      case "pura":
        currentIcon = templeMarker
        break;
    
      case "kuliner":
        currentIcon = culinaryMarker
        break;
    
      case "belanja":
        currentIcon = shoppingMarker
        break;
    
      default:
        currectIcon = cameraMarker
        break;
    }

    let marker = L.marker([data.latitude, data.longitude], {icon: currentIcon})
      .addTo(map)
      .bindPopup(
        `<b>${data.placeName}</b>`
      );

    marker.on("click", function () {
      console.log(data.placeName);
      document.getElementById("tempo").innerHTML = `<div class="card" style="width: 100%;">
      <img src="${data.imgUrl}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${data.placeName}</h5>
        <p class="card-text">${data.description}</p>
        <p class="card-text">Lat: ${data.latitude}, Lng: ${data.longitude}</p>
        
      </div>
    </div>
    <br>
    <br>`
    });
  });

  contentPlaceTable.innerHTML = table;

  map.fitBounds(points);
}

function onMapClick(e) {
  const location = e.latlng;
  latitude.value = location.lat;
  longitude.value = location.lng;
  document.getElementById("tempo").innerHTML = ``
}

map.on("click", onMapClick);

// Sidebar hide unhide
let isSideBarHidden = false;
document.getElementById("closeSidebar").addEventListener("click", function () {
    latitude.value = "";
    longitude.value = "";
  if (!isSideBarHidden) {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("map").style.width = "100%";
    document.getElementById("sidebar").style.padding = "0";
    isSideBarHidden = true;
  } else {
    document.getElementById("sidebar").style.width = "30%";
    document.getElementById("sidebar").style.padding = "10px 20px";
    document.getElementById("map").style.width = "70%";
    isSideBarHidden = false;
  }
});

console.log(listLocation);
console.log(listMarker);

var ref = firebase.database().ref("placeData");
ref.orderByChild("placeName").equalTo("Pura Tanah Lot").on("value", function(snapshot) {
  snapshot.forEach((element) => {
    console.log(`ini datanya: ${element.val().description}`);
  })
  
});


//Temple Marker
var templeMarker = L.icon({
  iconUrl: 'img/temple.png',
  iconSize:     [30, 40], 
  iconAnchor:   [25, 25], 
  popupAnchor:  [-10, 0]
});

//Culinary Marker
var culinaryMarker = L.icon({
  iconUrl: 'img/culinary.png',
  iconSize:     [30, 40], 
  iconAnchor:   [25, 25], 
  popupAnchor:  [-10, 0]
});

//Camera Marker
var cameraMarker = L.icon({
  iconUrl: 'img/photo.png',
  iconSize:     [30, 40], 
  iconAnchor:   [25, 25], 
  popupAnchor:  [-10, 0]
});

//Shopping Marker
var shoppingMarker = L.icon({
  iconUrl: 'img/shop.png',
  iconSize:     [30, 40], 
  iconAnchor:   [25, 25], 
  popupAnchor:  [-10, 0]
});

var currectLocationMarker = L.icon({
  iconUrl: 'img/current_location.png',
  iconSize:     [40, 40], 
  iconAnchor:   [25, 25], 
  popupAnchor:  [-5, 0]

});

L.marker([51.5, -0.09], {icon: currectLocationMarker}).addTo(map);

navigator.geolocation.getCurrentPosition(position => {
  const { coords: { latitude, longitude }} = position;
  
  var marker = new L.marker([latitude, longitude], {
  draggable: false,
  icon: currectLocationMarker,
  autoPan: true
  }).addTo(map);

  map.setView([latitude, longitude], 20);

  marker.bindPopup("<b>Hello, you're here!").openPopup();
  console.log(marker);
})