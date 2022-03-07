mapboxgl.accessToken = 'pk.eyJ1IjoicnRnaG50IiwiYSI6ImNrdW12YTVvYjAyb2kzMGp0Y2R0NmNpeXUifQ.1sZzWTJep9VSEk_YmcPBSA';

const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v10',
    center: [2.3364, 48.86091],
    zoom: 15.5,
});