devtools::load_all()
library(leaflet)

leaflet() |>
  addTiles() |>
  setView(-122.4, 33.8, 4) |>
  addVectorTiles(
    server  = "https://tile.calcofi.io",
    layer   = "public.stations",
    layerId = "stationid")
