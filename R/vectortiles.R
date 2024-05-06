#' addVectorTiles
#'
#' - [Leaflet.VectorGrid API reference](https://leaflet.github.io/Leaflet.VectorGrid/vectorgrid-api-docs.html)
#'
#' @param map map object from `leaflet::leaflet()`
#' @param server URL to tile server
#' @param layer layer name
#' @param layerId column name to uniquely identify each feature in layer
#' @param style style as a list object
#' @param group group
#' @param pane pane in leaflet map
#' @param attribution attribution for layer
#'
#' @return map object from `leaflet::leaflet()` with vector tile layer added
#' @concept vectortiles
#' @import leaflet
#' @importFrom glue glue
#' @importFrom jsonlite toJSON
#' @export
#'
#' @examples
#' library(leaflet)
#'
#' leaflet() |>
#'   addTiles() |>
#'   setView(-122.4, 33.8, 4) |>
#'   addVectorTiles(
#'     server  = "https://tile.calcofi.io",
#'     layer   = "public.stations",
#'     layerId = "stationid")
addVectorTiles = function(
    map,
    server,
    layer,
    layerId,
    style = list(
      fill        = TRUE,
      fillColor   = "purple",
      fillOpacity = 0.2,
      color       = "purple",
      opacity     = 0.7,
      weight      = 0.1,
      radius      = 0.8),
    styleHighlight = list(
      fill        = TRUE,
      fillColor   = "yellow",
      fillOpacity = 0.2,
      color       = "red",
      opacity     = 0.7,
      weight      = 0.1,
      radius      = 0.8),
    group   = "",
    pane    = "overlayPane",
    attribution = NULL) {

  # debug ----
  # devtools::load_all(); server = "https://tile.calcofi.io"; layer  = "public.stations"; layerId = "stationid"; map <- leaflet() |> addTiles()

  # checks ----
  stopifnot(all(c("leaflet", "htmlwidget") %in% class(map)))

  if (length(style) == 0)
    stop("need at least one paint rule set to know which layer to visualise")

  lyr_js <- system.file("vectortiles/vtiles.js", package="leaftiles")
  stopifnot(file.exists(lyr_js))

  dep <- leafletVectorTilesDependencies()[[1]]
  stopifnot(all(file.exists(file.path(dep$src$file, dep$script$src))))

  # dependencies ----
  map$dependencies <- c(
    map$dependencies, leafletVectorTilesDependencies())

  # render ----
  js_style          <- jsonlite::toJSON(style         , auto_unbox = T, pretty = T)
  js_styleHighlight <- jsonlite::toJSON(styleHighlight, auto_unbox = T, pretty = T)

  js_lyr <- glue::glue(
    readLines(lyr_js) |> paste(collapse = "\n"),
    .open = "{{", .close = "}}")

  # writeLines(js_lyr, "inst/test.js")
  # js_lyr <- readLines("inst/test.js") |> paste(collapse = "\n")
  # paste('"', js_lyr, '"') |>  cat()
  # js_lyr |>  cat()

  map |>
    htmlwidgets::onRender(js_lyr)
}

leafletVectorTilesDependencies = function() {
  list(
    htmltools::htmlDependency(
      name    = "Leaflet.VectorGrid",
      version = "1.3.0",
      src     = system.file("vectortiles", package = "leaftiles"),
      script  = list(
        src = c(
          "Leaflet.VectorGrid.bundled.min.js"), crossorigin = "anonymous" ) ) )
}
