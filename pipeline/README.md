## Pipeline processor

Splits the given geoJSON into its constituent features, creating one file per feature. Only the feature's `properties` object will be written to the file.
Each feature **must** have an `id` property which will be used to name the resulting json file.
If an images path is provided the script will search for images in a subfolder with the same `id` as the feature and store the images names in the feature file.

### Usage

```
Usage: index [options] <file>

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
node pipeline/ rooftops.geojson -o data/ -i images/
```

Result
```
data/
  0.json
    { "material": "brick", "id": 0, "images": ["roof1.jpg", "roof2.jpg"] }
  1.json
    { "material": "wood", "id": 1, "images": [] }
```