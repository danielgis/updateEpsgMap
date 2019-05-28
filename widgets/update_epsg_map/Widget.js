define([
        'dojo/_base/declare',
        'jimu/BaseWidget',
        'dijit/_WidgetsInTemplateMixin',
        'esri/map',
        'esri/toolbars/draw',
        'esri/SpatialReference',
        'esri/geometry/Extent',
        "esri/layers/FeatureLayer",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        'dojo/_base/Color',
        "dojo/_base/lang",
        'dojox/widget/TitleGroup',
        'dijit/form/Select',
        'dijit/TitlePane',
        'dijit/form/TextBox',
        'dijit/form/Button',
        'dijit/form/HorizontalSlider',
        'dijit/form/HorizontalRule',
        'dijit/form/HorizontalRuleLabels'
    ],
    function(
        declare,
        BaseWidget,
        _WidgetsInTemplateMixin,
        Map,
        Draw,
        SpatialReference,
        Extent,
        FeatureLayer,
        ArcGISDynamicMapServiceLayer,
        Graphic,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        Color,
        lang
    ) {
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
            // this property is set by the framework when widget is loaded.
            // name: 'update_epsg_map',
            // add additional properties here

            //methods to communication with app container:
            postCreate: function() {
                try {
                    this.inherited(arguments);
                    console.log('update_epsg_map::postCreate');
                    this.getPanel().titleLabelNode.innerHTML = this.nls.widgetTitle;
                } catch (err) {
                    console.log(err);
                }

            },

            startup: function() {
                try {
                    this.inherited(arguments);
                    console.log('update_epsg_map::startup');
                    this._createToolbarUEM();
                } catch (err) {
                    console.log(err);
                }

            },

            _updateSrcView: function() {
                this.epsg = this.selectUEM.value

                const src = new SpatialReference({
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

            _getFeatureServiceUrl: function() {
                var urlFeature = this.urlAgsIngemmet + this.center[this.epsg].url_cmi;
                var featureLayer = new FeatureLayer(urlFeature);
                return featureLayer;
            },


            _activateToolUEM: function(evt) {
                // id del tag contenedor utlizado
                var tool = evt.target.id.toUpperCase();
                if (tool != "ERASE") {
                    // Se establece el tipo de geometria a graficar por el id del tag contenedor
                    tb.activate(Draw[tool]);
                } else {
                    // Elimina todos los graficos generados
                    this.map.graphics.clear();
                }
            },

            _createToolbarUEM: function() {
                tb = new Draw(this.map);
                tb.on('draw-end', this._addToMapUEM);
            },

            // _customStyleMarker: function(){
            //     // Configurar estilo del Marker
            //     let style = SimpleMarkerSymbol.STYLE_CIRCLE;
            //     let colorMark = new Color.fromHex(this.config.colorMarker);
            //     let colorLine = new Color.fromHex(this.config.colorBorderMarker);
            //     let size = this.config.sizeMarker;
            //     let width = this.config.sizeBorderMarker;
            //     let sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, colorLine, width);
            //     var symbol = new SimpleMarkerSymbol(style, size, sls, colorMark);
            //     return symbol;
            // },

            _addToMapUEM: function(evt) {
                // Se desactiva el evento de dibujo
                tb.deactivate();

                // var symbol = this._customStyleMarker();

                let style = SimpleMarkerSymbol.STYLE_CIRCLE;
                let colorMark = new Color.fromHex("#fab95b");
                let colorLine = new Color.fromHex("#212121");
                let size = 12;
                let width = 1;
                let sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, colorLine, width);
                var symbol = new SimpleMarkerSymbol(style, size, sls, colorMark);

                // Agregando estilo al grafico
                var graphic = new Graphic(evt.geometry, symbol);

                // Agregando el grafico al mapa
                this.map.graphics.add(graphic);
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