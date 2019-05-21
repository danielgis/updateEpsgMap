define(['dojo/_base/declare', 'jimu/BaseWidget', 'esri/map', 'esri/SpatialReference', 'dojo/on'], function (declare, BaseWidget, Map, SpatialReference, on) {
            //To create a widget, you need to derive from BaseWidget.
            return declare([BaseWidget], {

                        // Custom widget code goes here

                        baseClass: 'update-epsg-map',
                        epsg: null,
                        center: {
                                    '32717': {
                                                x: 1226968.0270,
                                                y: 8983605.4679
                                    },
                                    '32718': {
                                                x: 564501.0873,
                                                y: 8993441.4110
                                    },
                                    '32719': {
                                                x: 564501.0873,
                                                y: 8993441.4110
                                    }
                        },
                        // this property is set by the framework when widget is loaded.
                        // name: 'update_epsg_map',
                        // add additional properties here

                        //methods to communication with app container:
                        postCreate: function postCreate() {
                                    this.inherited(arguments);
                                    console.log('update_epsg_map::postCreate');
                        },

                        startup: function startup() {
                                    this.inherited(arguments);
                                    console.log('update_epsg_map::startup');
                        },

                        _updateSrcView: function _updateSrcView() {
                                    this.epsg = this.selectUEM.value;

                                    var src = new SpatialReference({
                                                wkid: this.epsg
                                    });

                                    var centerView = {
                                                x: this.center[this.epsg].x,
                                                y: this.center[this.epsg].y,
                                                spatialReference: src
                                    };

                                    this.map.removeAllLayers();
                                    this.map.container = null;
                                    this.map = null;

                                    // this.map = new Map()

                                    console.log(this.epsg);
                                    console.log(src);
                                    console.log(centerView);
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
