// LEAFLET.JS
var map = L.map("map").setView([-8.621213, 115.086804], 11);

let listLocation = [];
let listMarker = [];

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19, //max zoom
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', //copyright
}).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map);

var circle = L.circle([51.508, -0.11], {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 500,
}).addTo(map);

//////////////////////////////////////////////////////////////////////

let placeName = document.getElementById("inputPlaceName");
let description = document.getElementById("inputDescription");
let latitude = document.getElementById("inputLatitude");
let longitude = document.getElementById("inputLongitude");
let imgUrl = document.getElementById("inputImgUrl");

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
function createData() {
  let data = {
    placeName: placeName.value,
    description: description.value,
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

    let marker = L.marker([data.latitude, data.longitude])
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
  if (!isSideBarHidden) {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("map").style.width = "100%";
    document.getElementById("sidebar").style.padding = "0";
    isSideBarHidden = true;
  } else {
    document.getElementById("sidebar").style.width = "30%";
    document.getElementById("map").style.width = "70%";
    isSideBarHidden = false;
  }
});

console.log(listLocation);
console.log(listMarker);
