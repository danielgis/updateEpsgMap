define(['dojo/_base/declare', 'jimu/BaseWidget', 'dijit/_WidgetsInTemplateMixin', 'esri/map', 'esri/toolbars/draw', 'esri/SpatialReference', 'esri/geometry/Extent', "esri/layers/FeatureLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/graphic", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", 'dojo/_base/Color', "esri/geometry/geometryEngine", 'jimu/PanelManager', 'dojo/_base/array', 'dojox/widget/TitleGroup', 'dijit/form/Select', 'dijit/TitlePane', 'dijit/form/TextBox', 'dijit/form/Button', 'dijit/form/HorizontalSlider', 'dijit/form/HorizontalRule', 'dijit/form/HorizontalRuleLabels'], function (declare, BaseWidget, _WidgetsInTemplateMixin, Map, Draw, SpatialReference, Extent, FeatureLayer, ArcGISDynamicMapServiceLayer, Graphic, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, geometryEngine, PanelManager, array) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget, _WidgetsInTemplateMixin], {

        // Custom widget code goes here

        baseClass: 'update-epsg-map',
        epsg: null,
        center: {
            '32717': {
                xmin: -10142884.841428969,
                ymin: -1980962.564791115,
                xmax: -6424987.785638983,
                ymax: 63880.81589337652,
                zona: 17,
                url_cmi: 'WGS84_17/WEBGIS_CATASTRO_MINERO_WGS84_17/MapServer/0',
                url_basemap: "WGS84_17/WEBGIS_PAISES_UTM_WGS84_17/MapServer"
            },
            '32718': {
                xmin: -10114105.37080958,
                ymin: -2016984.56600928,
                xmax: -6396208.3150195945,
                ymax: 27858.81467521147,
                zona: 18,
                url_cmi: 'WGS84_18/WEBGIS_CATASTRO_MINERO_WGS84_18/MapServer/0',
                url_basemap: "WGS84_17/WEBGIS_PAISES_UTM_WGS84_17/MapServer"
            },
            '32719': {
                xmin: -10056890.70524422,
                ymin: -1985573.973288541,
                xmax: -6338993.649454236,
                ymax: 59269.407395950635,
                zona: 19,
                url_cmi: 'WGS84_19/WEBGIS_CATASTRO_MINERO_WGS84_19/MapServer/0',
                url_basemap: "WGS84_17/WEBGIS_PAISES_UTM_WGS84_17/MapServer"
            }
        },
        urlAgsIngemmet: 'https://geocatminapp.ingemmet.gob.pe/arcgis/rest/services/',
        geoms: [],
        graphicBuffer: [],
        // this property is set by the framework when widget is loaded.
        // name: 'update_epsg_map',
        // add additional properties here

        //methods to communication with app container:
        postCreate: function postCreate() {
            try {
                this.inherited(arguments);
                console.log('update_epsg_map::postCreate');
                this.getPanel().titleLabelNode.innerHTML = this.nls.widgetTitle;
            } catch (err) {
                console.log(err);
            }
        },

        startup: function startup() {
            try {
                this.inherited(arguments);
                console.log('update_epsg_map::startup');
                self = this; // Conservar el contexto incial de this
                this._createToolbarUEM();
            } catch (err) {
                console.log(err);
            }
        },

        _updateSrcView: function _updateSrcView() {
            this.epsg = this.selectUEM.value;

            var src = new SpatialReference({
                wkid: parseInt(this.epsg)
            });

            var ext = this.center[this.epsg];

            this.map.removeAllLayers();

            // this.map.spatialReference = src;

            var basemap = new ArcGISDynamicMapServiceLayer(this.urlAgsIngemmet + ext.url_basemap);

            this.map.addLayer(basemap);

            // let customExtent = new Extent(ext.xmin, ext.ymin, ext.xmax, ext.ymax, src);
            // this.map.setExtent(customExtent);
            // this.map.setBasemap('satellite');
            var featureLayer = this._getFeatureServiceUrl(this.map);
            this.map.addLayer(featureLayer);
        },

        _getFeatureServiceUrl: function _getFeatureServiceUrl() {
            var urlFeature = this.urlAgsIngemmet + this.center[this.epsg].url_cmi;
            var featureLayer = new FeatureLayer(urlFeature);
            return featureLayer;
        },

        _activateToolUEM: function _activateToolUEM(evt) {
            // id del tag contenedor utilizado (convertir a mayusculas)
            var tool = evt.target.id.toUpperCase();
            if (tool != "ERASE") {
                // Se establece el tipo de geometria a graficar por el id del tag contenedor
                tb.activate(Draw[tool]);
            } else {
                // Elimina todos los graficos generados
                this.map.graphics.clear();
                self.geoms = [];
                self.graphicBuffer = [];
            }
        },

        _createToolbarUEM: function _createToolbarUEM() {
            tb = new Draw(this.map);
            tb.on('draw-end', this._addToMapUEM);
        },

        _customStyleMarker: function _customStyleMarker() {
            // Configurar estilo del Marker
            var style = SimpleMarkerSymbol.STYLE_CIRCLE;
            var colorMark = new Color.fromHex(self.config.simbologia.point.colorMarker);
            var colorLine = new Color.fromHex(self.config.simbologia.point.colorBorderMarker);
            var size = self.config.simbologia.point.sizeMarker;
            var width = self.config.simbologia.point.sizeBorderMarker;
            var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, colorLine, width);
            var symbol = new SimpleMarkerSymbol(style, size, sls, colorMark);
            return symbol;
        },

        _customStyleBuffer: function _customStyleBuffer() {
            // Configurar estilo del Marker
            var symbol = new SimpleFillSymbol();
            return symbol;
        },

        _addToMapUEM: function _addToMapUEM(evt) {
            this.map.graphics.clear();
            // Se desactiva el evento de dibujo
            tb.deactivate();

            // Obtener el estilo del marker
            var symbol = self._customStyleMarker();

            // Agregando estilo al grafico
            var graphic = new Graphic(evt.geometry, symbol);

            // Agregando el grafico al mapa
            this.map.graphics.add(graphic);
            self._createBuffer(evt.geometry);
            self.geoms.push(evt.geometry);
        },

        _createBuffer: function _createBuffer(geom) {
            var distance = dijit.byId("horizontalSlider").value;
            var buffer = geometryEngine.geodesicBuffer(geom, [distance], self.config.distancia.unt, false);
            var symbol = self._customStyleBuffer();
            var graphic = new Graphic(buffer, symbol);
            this.map.graphics.add(graphic);
            this.map.setExtent(buffer.getExtent(), true);
            self.graphicBuffer.push(graphic);

            // Abrir widget por nombre
            var widget = self.appConfig.getConfigElementsByName("serviceTotem");
            var idwidget = widget[0].id;

            self.openWidgetById(idwidget);
        },

        _changeSliderUEM: function _changeSliderUEM(evt) {
            if (self.geoms.length == 0) {
                return;
            }
            this.map.graphics.remove(self.graphicBuffer.slice(-1)[0]);
            self._createBuffer(self.geoms.slice(-1)[0]);
        }

        // onOpen: function(){
        //   console.log('update_epsg_map::onOpen');
        // },

        // onClose: function(){
        //   console.log('update_epsg_map::onClose');
        // },

        // onMinimize: function(){
        //   console.log('update_epsg_map::onMinimize');
        // },

        // onMaximize: function(){
        //   console.log('update_epsg_map::onMaximize');
        // },

        // onSignIn: function(credential){
        //   console.log('update_epsg_map::onSignIn', credential);
        // },

        // onSignOut: function(){
        //   console.log('update_epsg_map::onSignOut');
        // }

        // onPositionChange: function(){
        //   console.log('update_epsg_map::onPositionChange');
        // },

        // resize: function(){
        //   console.log('update_epsg_map::resize');
        // }

        //methods to communication between widgets:

    });
});
//# sourceMappingURL=Widget.js.map
