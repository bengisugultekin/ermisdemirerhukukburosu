window.marker = null;

function initMap() {


  const marker = document.querySelector('gmp-advanced-marker');
  marker.addEventListener('gmp-click', () => {
    infoWindow.open({anchor: marker});
  });
}


window.initMap = initMap;