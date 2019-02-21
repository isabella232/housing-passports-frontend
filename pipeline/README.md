# Pipeline processor

## Command: split

Splits the given geoJSON into its constituent features, creating one file per feature. Only the feature's `properties` object will be written to the file.
Each feature **must** have an `id` property which will be used to name the resulting json file.
If an images path is provided the script will search for images in a subfolder with the same `id` as the feature and store the images names in the feature file.

### Usage

```
Usage: index.js split [options] <file>

Options:
  -V, --version  output the version number
  -o <dir>       output folder
  -i <dir>       images folder
  -h, --help     output usage information
```

### Example

Source geojson
```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "material": "brick",
        "id": 0
      },
      "geometry": {...}
    },
    {
      "type": "Feature",
      "properties": {
        "material": "wood",
        "id": 1
      },
      "geometry": {...}
    }
  ]
}
```

Images dir:
```
images/
  0/
    roof1.jpg
    roof2.jpg
```

```
node pipeline/ split rooftops.geojson -o data/ -i images/
```

Result
```
data/
  0.json
    { "material": "brick", "id": 0, "images": ["roof1.jpg", "roof2.jpg"] }
  1.json
    { "material": "wood", "id": 1, "images": [] }
```

## Command: point2json

Extracts the point coordinates from a given geoJSON into a JSON array.
The feature order is important and will be maintained in the output file.
Coordinates will be rounded to 5 decimals.

### Usage

```
Usage: index.js point2json <file> <dest>

Options:
  -V, --version  output the version number
  -h, --help     output usage information
```

### Example

Source geojson
```
{
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "properties": { "ID": 0 }, "geometry": { "type": "Point", "coordinates": [ -74.158685988059432, 4.555174603682212 ] } },
    { "type": "Feature", "properties": { "ID": 1 }, "geometry": { "type": "Point", "coordinates": [ -74.158749595117683, 4.555194842518034 ] } },
    { "type": "Feature", "properties": { "ID": 2 }, "geometry": { "type": "Point", "coordinates": [ -74.158802021722636, 4.555230191786681 ] } }
  ]
}
```

```
node pipeline/ point2json centroids.geojson centroids.json
```

Result
```
[
  [ -74.15869, 4.55517 ],
  [ -74.15875, 4.55519 ],
  [ -74.15880, 4.55523 ]
]
```