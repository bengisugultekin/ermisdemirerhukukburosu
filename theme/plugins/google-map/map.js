window.marker = null;

function initMap() {
  // Check if using new web component format (gmp-map)
  const gmpMarker = document.querySelector('gmp-advanced-marker');
  if (gmpMarker) {
    gmpMarker.addEventListener('gmp-click', () => {
      if (window.infoWindow) {
        window.infoWindow.open({anchor: gmpMarker});
      }
    });
    return;
  }

  // Standard Google Maps API format
  const mapElement = document.getElementById('map');
  if (mapElement) {
    const officeLocation = { lat: 38.452141831422225, lng: 27.181137772927652 };
    
    const map = new google.maps.Map(mapElement, {
      zoom: 14,
      center: officeLocation,
      mapId: 'DEMO_MAP_ID' // Required for AdvancedMarkerElement
    });

    // Use AdvancedMarkerElement (new API) if available, otherwise fallback to Marker
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: officeLocation,
        title: 'Ermiş Hukuk Bürosu'
      });

      const infoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 10px;"><strong>Ermiş Hukuk Bürosu</strong><br>Tuna Mah, İbrahim Yılmaz 1714 SK, No: 17 Büro: 301, Mertoğlu İş Merkezi, Karşıyaka/İzmir</div>'
      });

      // AdvancedMarkerElement uses addEventListener with 'gmp-click' event
      marker.addEventListener('gmp-click', () => {
        infoWindow.open({
          anchor: marker,
          map: map
        });
      });

      window.marker = marker;
    } else {
      // Fallback to deprecated Marker API
      const marker = new google.maps.Marker({
        position: officeLocation,
        map: map,
        title: 'Ermiş Hukuk Bürosu'
      });

      const infoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 10px;"><strong>Ermiş Hukuk Bürosu</strong><br>Tuna Mah, İbrahim Yılmaz 1714 SK, No: 17 Büro: 301, Mertoğlu İş Merkezi, Karşıyaka/İzmir</div>'
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      window.marker = marker;
    }
  }
}

window.initMap = initMap;