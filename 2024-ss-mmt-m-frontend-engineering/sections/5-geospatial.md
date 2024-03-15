---
layout: section
hideInToc: false
---

# Going geospatial on the Frontend

---

# Web Mercator

Common coordinate systems used on the web:
- WGS 84/EPSG:4326
  - A coordinate sytem on the surface of a sphere (the earth)
  - Used for data storage/transfer
- Projected as: EPSG:3857
  - Projected coordinate system from a sphere to a flat map
  - Used for maps displayed in browser
  - Areas grow with distance from the equator, polar regions are oversized

<img width="200" src="/assets/geospatial-web-mercator.png">


---
layout: iframe
url: https://macwright.com/lonlat/
---

---

# GeoJSON – [RFC 7946](https://datatracker.ietf.org/doc/html/rfc7946)

> GeoJSON is a geospatial data interchange format based on JavaScript
Object Notation (JSON).  It defines several types of JSON objects and
the manner in which they are combined to represent data about
geographic features, their properties, and their spatial extents.
GeoJSON uses a geographic coordinate reference system, World Geodetic
System 1984, and units of decimal degrees.


So we have `@types/geojson@7946.0.x`

---

# Geometries

<img class="bg-white p-10" width="480" src="/assets/geospatial-geojson-geometries.png">[^1]

Let's draw them on [geojson.io](https://geojson.io/#map=16.04/47.723509/13.086181)

<!-- Footer -->
[^1]: https://geobgu.xyz/web-mapping2/geojson-1.html
---

# Point

```json
{
  "type": "Point",
  "coordinates": [13.086521149298349, 47.72393242567343]
}
```

- Coordinates are a single `Position`
- `Position` equals `[longitude, latitude]`, third value optional for elevation
  - Typed as `number[]` and not `[number, number]`, [because of reasons](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60732)

---

# LineString

```json
{
  "type": "LineString",
  "coordinates": [
    [13.087619107600432, 47.72530693818723],
    [13.086233217951303, 47.72508263256532],
    [13.085420440562444, 47.72481626838504]
  ]
}
```

- Coordinates are `Position[]`

---

# Polygon
```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [13.084948596347658, 47.724691014652166],
      [13.087229555201702, 47.722083180077476],
      [13.088467205521482, 47.721945559851235],
      [13.087659152832828, 47.72535843418092],
      [13.084948596347658, 47.724691014652166]
    ]
  ]
}
```

- Coordinates are `Position[][]`

---

# Features

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [13.086521149298349, 47.72393242567343]
  },
  "properties": {
    "name": "FH Salzburg"
  }
}
```

- Combines a `Geometry` with any kind of JSON `properties`

---

# FeatureCollection

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          13.086521149298349,
          47.72393242567343
        ]
      },
      "properties": {
        "name": "FH Salzburg"
      }
    }
  ]
}
```

- Just a list of Features

---
layout: center
---

# Turf.js

---

# Calculating a Distance between two Coordinates

```ts
var from = turf.point([-75.343, 39.984]);
var to = turf.point([-75.534, 39.123]);

var distance = turf.distance(from, to, { units: 'kilometers' });
```

<v-clicks>

- Limiting your reverse Geocoding result
  &rarr; Only accept if less than X meters from chosen location
- Generating your users speed profile

</v-clicks>

---

# Get the nearest Point on a Line

```ts
const line = turf.lineString([
    [-77.031669, 38.878605],
    [-77.029609, 38.881946],
    [-77.020339, 38.884084],
    [-77.025661, 38.885821],
    [-77.021884, 38.889563],
    [-77.019824, 38.892368]
]);
const pt = turf.point([-77.037076, 38.884017]);

const snapped = turf.nearestPointOnLine(line, pt, { units: 'kilometers' });
```

<v-clicks>

- Snapping your users location to the route path
  &rarr; Finding the current navigation step

</v-clicks>

---
layout: center
---

# Map Tiles

---

# Tiles

- A map will be loaded in tiles
- Thereby allowing zooming into a map and only load the current area
- Tiles can be previously generated on the server, instead of always requesting an exact tile of the current viewport
- First introduced by Google Maps
- Description of tiles and zoom of [WMTS](https://www.ogc.org/standard/wmts/) spec:

> This well-known scale set has been defined to be compatible with Google Maps and
Microsoft Live Map projections and zoom levels. Level 0 allows representing the whole
world in a single 256x256 pixels. The next level represents the whole world in 2x2 tiles
of 256x256 pixels and so on in powers of 2. Scale denominator is only accurate near the
equator.

<img class="mt-10 mx-auto" width="480" src="/assets/geospatial-map-tiles.jpeg">


---

# Raster Tiles

- Bitmap image formats: PNG/JPEGs
- Generated/hosted on the server
- Requested from the client as `z/x/y.{png,jpg}`
  - `z`: Zoom
  - `x`/`y`: Coordinate
- Delivered via WMTS, Web Map Tile Service[^1]
- Optimal for satellite imagery

<!-- Footer -->
[^1]: https://www.ogc.org/standard/wmts/

---

# Vector Tiles

- Instead of rasterized images, vector information with properties will be downloaded
  - In the same tiles style as with raster imagery
- Must be rendered by the client browser
  - Data is thereby on the client and can be queried
- Currently driven by [Mapbox Vector Tile Specification](https://github.com/mapbox/vector-tile-spec)
  - Basically a special binary format to transfer GeoJSON very efficiently
- Vector precisions of the same feature will be different, depending on zoom level
- Allows custom styling on the client and thereby:
  - Toggling of layers
  - Animations
  - Rotating with fixed text
  - Inserting custom layers with the style or below the text layers

---

# Getting started with Maps and React

- [`react-map-gl`](https://github.com/visgl/react-map-gl)
- [`maplibre-gl`](https://github.com/maplibre/maplibre-gl-js)
- Free official government tiles:
  - https://basemap.de/
  - https://basemap.at/

```tsx
import Map, { LngLatBoundsLike } from 'react-map-gl/maplibre';

export function BaseMap() {
  return (
    <Map
      mapStyle="https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_col.json"
      initialViewState={{ bounds: [5.8, 47.2, 15.1, 55.1] }}
    />
  );
}
```

- Create your own styles with [Maputnik](https://maplibre.org/maputnik/?layer=2134303678~0#0.74/0/0)