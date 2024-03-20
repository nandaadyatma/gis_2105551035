var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, //max zoom
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' //copyright
}).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map)

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.509, -0.09],
    [51.523, -0.08],
    [51.509, -0.18],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map); //line itu polygon dua titik



circle.bindPopup("Aku adalah balon merah raksasa")

polygon.bindPopup("Aku polygon, bukan sepeda")

marker.bindPopup("aku marker, bukan spidol")


arr1 = [
    [51.509, -0.08],
    [51.523, -0.08],
    [52.32, -0.02]
]

arr1.forEach(element => {
    L.marker(element).addTo(map)
});

async function fetchData() {
    const url = 'https://story-api.dicoding.dev/v1/stories?location=1';
    const options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLVBJcTR5UWFCMUpnVU5rRjAiLCJpYXQiOjE3MTA4MjU1MzZ9.CzWxaWo92LCcNGl4Mvh0J9YNj7vEBo0syyWaKUFTD9Y'
      }
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`); // Menampilkan status error jika ada
      }
      const data = await response.json(); // Mengonversi response menjadi JSON
      console.log(data); // Menampilkan data di console
      displayData(data)
     
    } catch (error) {
      console.error('Fetching error:', error);
    }
  }

// Contoh fungsi untuk menampilkan data ke dalam DOM
function displayData(data) {
    const container = document.getElementById('data-container'); // Pastikan Anda memiliki elemen dengan id 'data-container' di HTML Anda
    if (!container) return;
  
    // Membersihkan konten container
    container.innerHTML = '';
  
    // Iterasi listStory dan membuat elemen untuk setiap item
    data.listStory.forEach(story => {
      const storyElement = document.createElement('div');
      storyElement.innerHTML = `
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <img src="${story.photoUrl}" alt="${story.name}" style="width: 100px; height: auto;">
        <p>Created at: ${story.createdAt}</p>
      `;
      container.appendChild(storyElement);

      var marker = L.marker([story.lat, story.lon]).addTo(map)
    });
  }
  
  // Panggil fungsi fetchData ketika dokumen telah dimuat
  document.addEventListener('DOMContentLoaded', fetchData);

//   map.locate({setView: true, watch: true, maxZoom: 17});
//   map.on('locationfound', onLocationFound);

//   function onLocationFound(e) {
//     var radius = e.accuracy / 2;

//     L.marker(e.latlng).addTo(map)
//         .bindPopup("You are within " + radius + " meters from this point").openPopup();

//     L.circle(e.latlng, radius).addTo(map);
// }

navigator.geolocation.getCurrentPosition(position => {

  const { coords: { latitude, longitude }} = position;

  var marker = new L.marker([latitude, longitude], {
    draggable: false,
    autoPan: true
  }).addTo(map);

  marker.bindPopup("My Location")

  map.setView([latitude, longitude], 17)

  console.log(marker);
})

function onMapClick(e) {
  alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);