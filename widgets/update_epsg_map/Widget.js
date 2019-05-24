define([
        'dojo/_base/declare',
        'jimu/BaseWidget',
        'dijit/_WidgetsInTemplateMixin',
        'esri/map',
        'esri/SpatialReference',
        'esri/geometry/Extent',
        "esri/layers/FeatureLayer",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        'dojox/widget/TitleGroup',
        'dijit/form/Select',
        'dijit/TitlePane',
        'dijit/form/TextBox'
    ],
    function(
        declare,
        BaseWidget,
        _WidgetsInTemplateMixin,
        Map,
        SpatialReference,
        Extent,
        FeatureLayer,
        ArcGISDynamicMapServiceLayer
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
                } catch (err) {
                    console.log(err);
                }

            },

            startup: function() {
                try {
                    this.inherited(arguments);
                    console.log('update_epsg_map::startup');
                    this.getPanel().titleLabelNode.innerHTML = this.nls.widgetTitle;
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