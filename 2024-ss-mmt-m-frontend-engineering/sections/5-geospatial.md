---
layout: section
hideInToc: false
---

# Geospatial computing in JavaScript

- RFC

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [8, 50]
  },
  "properties": {
    "name": "FH Salzburg"
  }
}
```

---
layout: center
---

# Turf.js

```ts
var from = turf.point([-75.343, 39.984]);
var to = turf.point([-75.534, 39.123]);
var options = { units: 'miles' };

var distance = turf.distance(from, to, options);
```

---
layout: center
---

# Vector Tiles

- How do they work?
- Styling vector maps
