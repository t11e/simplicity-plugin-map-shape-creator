(function(j){var g=j.simplicity.degreesToRadians,k=j.simplicity.radiansToDegrees,l={debug:!1};j.simplicityGeoFn=l;j.simplicityGeoFn.computeHeading=function(e,c){var a=g(c[1]-e[1]),b=g(e[0]),d=g(c[0]),a=Math.atan2(Math.sin(a)*Math.cos(d),Math.cos(b)*Math.sin(d)-Math.sin(b)*Math.cos(d)*Math.cos(a)),a=k(a);0>a&&(a+=360);return a};j.simplicityGeoFn.travel=function(e,c,a){c=c/1E3/6367;a=g(a);var b=g(e[0]),d=g(e[1]);e=Math.asin(Math.sin(b)*Math.cos(c)+Math.cos(b)*Math.sin(c)*Math.cos(a));c=d+Math.atan2(Math.sin(a)*
Math.sin(c)*Math.cos(b),Math.cos(c)-Math.sin(b)*Math.sin(e));c=(c+3*Math.PI)%(2*Math.PI)-Math.PI;return[k(e),k(c)]};j.simplicityGeoFn.intersection=function(e,c,a,b){var d=g(e[0]);e=g(e[1]);var f=g(a[0]),i=g(a[1]);c=g(c);b=g(b);a=f-d;var h=i-e;a=2*Math.asin(Math.sqrt(Math.sin(a/2)*Math.sin(a/2)+Math.cos(d)*Math.cos(f)*Math.sin(h/2)*Math.sin(h/2)));if(0===a)return l.debug&&console.log("dist12",0),null;h=Math.acos((Math.sin(f)-Math.sin(d)*Math.cos(a))/(Math.sin(a)*Math.cos(d)));isNaN(h)&&(h=0);f=Math.acos((Math.sin(d)-
Math.sin(f)*Math.cos(a))/(Math.sin(a)*Math.cos(f)));0<Math.sin(i-e)?(i=h,h=2*Math.PI-f):(i=2*Math.PI-h,h=f);f=(c-i+Math.PI)%(2*Math.PI)-Math.PI;b=(h-b+Math.PI)%(2*Math.PI)-Math.PI;if(0===Math.sin(f)&&0===Math.sin(b))return l.debug&&console.log("Infinite intersections"),null;if(0>Math.sin(f)*Math.sin(b))return l.debug&&console.log("Ambiguous intersection"),null;i=Math.acos(-Math.cos(f)*Math.cos(b)+Math.sin(f)*Math.sin(b)*Math.cos(a));a=Math.atan2(Math.sin(a)*Math.sin(f)*Math.sin(b),Math.cos(b)+Math.cos(f)*
Math.cos(i));b=Math.asin(Math.sin(d)*Math.cos(a)+Math.cos(d)*Math.sin(a)*Math.cos(c));d=Math.atan2(Math.sin(c)*Math.sin(a)*Math.cos(d),Math.cos(a)-Math.sin(d)*Math.sin(b));d=(e+d+3*Math.PI)%(2*Math.PI)-Math.PI;return[k(b),k(d)]}})(jQuery);(function(g){var i=["Point","MultiPoint","LineString","Polygon"];g.widget("ui.simplicityMapShapeCreator",g.ui.simplicityWidget,{options:{input:"",editMode:!1,connected:!0,draggableMarkers:!0,radius:0,capSegments:8,jointSegments:8,distanceUnit:"MI",markerOptions:"",lineStringOptions:"",polygonOptions:"",circleOptions:"",dragOptimization:!1,debug:!1,firstVertexMarkerOptions:"",vertexMarkerOptions:""},_create:function(){this._points=[];this._geoJson=this._newGeoJson();this._jointDegrees=180/this.options.jointSegments;
this._capDegrees=180/this.options.capSegments;this._precision=1E4;this._map="";this._markers=[];this._firstMarkerListener=null;""===this.options.markerOptions&&(this.options.markerOptions={});""===this.options.circleOptions&&(this.options.circleOptions={});this._input=""===this.options.input?g('\x3cinput name\x3d"placemark"/\x3e').simplicityInputs():g(this.options.input);this._bind(this._input,"change",this._inputChangeHandler);this._addClass("ui-simplicity-map-shape-creator");""===this.options.firstVertexMarkerOptions&&
(this.options.firstVertexMarkerOptions=this._getVertexMarkerOptions("first-vertex-marker"));""===this.options.vertexMarkerOptions&&(this.options.vertexMarkerOptions=this._getVertexMarkerOptions("vertex-marker"))},_getVertexMarkerOptions:function(a){var c=g("\x3cdiv/\x3e").addClass("ui-helper-hidden-accessible "+a).appendTo(this.element),b=c.width(),d=c.height(),b={icon:c.css("background-image").replace(/url\("?([^"]*)"?\)/,"$1"),size:[b,d],anchor:[(b+b%2)/2,(d+d%2)/2]};c.remove();this.options.debug&&
console.log('simplicityMapShapeCreator: vertex "'+a+'" options',JSON.stringify(b,null,"  "));return b},_setOption:function(a,c){g.Widget.prototype._setOption.apply(this,arguments);switch(a){case "editMode":(this._geoJson.properties.editMode=c)?("undefined"!==this._geoJson.properties&&this._geoJson.properties.geocoder&&this.reset(),this._addMapClickListener(),this._setupFirstPoint()):(this._clearFirstPointUi(),this._removeMapClickListener(),this._removeMarkerClickListener(0));(!this.options.editMode||
"Polygon"!==this._geoJson.placemarks.type)&&this._draw();this._changeHandler();break;case "radius":this._applyShapeBuffer();this._geoJson.properties.radius=c;this._changeHandler();break;case "connected":this.options.editMode&&(c?(this._createLineString(),this._setupFirstPoint()):-1===this._geoJson.placemarks.type.indexOf("Point")&&(this._removeShapeFromMap(),this._clearFirstPointUi(),"Polygon"===this._geoJson.placemarks.type&&(this._geoJson.placemarks.coordinates=this._geoJson.placemarks.coordinates[0].slice(0,
-1)),this._geoJson.placemarks.type=1===this._points.length?"Point":"MultiPoint"),this._geoJson.properties.radius=this.options.radius,this._draw(),this._applyShapeBuffer(),this._changeHandler(!0));break;case "jointSegments":this._jointDegrees=180/c;break;case "capSegments":this._capDegrees=180/c}},_setupFirstPoint:function(){"LineString"===this._geoJson.placemarks.type&&this._addMarkerClickListener(0,this._firstMarkerClickHandler);3<=this._points.length&&this._setFirstPointUi()},reset:function(a){this._clear();
this._geoJson=this._newGeoJson();("undefined"===typeof a||!0===a)&&this._changeHandler()},newGeocodedPoint:function(a){var c=this._makeLatLng(a.item.latitude,a.item.longitude),b=this._newPoint(c);null!==b&&(1===this._points.length&&this._addMarkerClickListener(0,this._firstMarkerClickHandler),"undefined"!==typeof a.item.value&&(this._geoJson.properties.geocoder=this._getGeocodePrecisionData(this._asGeoJsonLatLng(c),a)),this._changeHandler(!0));return b},convertPolygonToLineString:function(a){"Polygon"===
this._geoJson.placemarks.type&&(this._geoJson.placemarks.coordinates=this._geoJson.placemarks.coordinates[0].slice(0,-1),this._removeShapeFromMap(),this._geoJson.properties.radius=a,this._createLineString(),this._applyShapeBuffer(),this._addMarkerClickListener(0,this._firstMarkerClickHandler),3<=this._points.length&&this._setFirstPointUi(),this._changeHandler(!0))},_changeHandler:function(){this._triggerShapeChange(this._geoJson);this._input.val(0===this._geoJson.placemarks.coordinates.length?"":
JSON.stringify(this._geoJson));try{this._ignoreChangeEvent=!0,this._input.change()}finally{this._ignoreChangeEvent=!1}},geoJson:function(){return this._geoJson},geometry:function(){return this._geoJson.placemarks.type},getMappingProviderId:function(){throw Error("getMappingProviderId method should be implemented");},getMappingProviderWidgetNames:function(){var a=this.getMappingProviderId();return{map:"simplicity"+a+"Map",shapeCreator:"simplicity"+a+"MapShapeCreator",geocoder:"simplicity"+a+"Geocoder",
results:"simplicity"+a+"MapResults",boundsCoordinator:"simplicity"+a+"MapBoundsCoordinator",boundsTracker:"simplicity"+a+"MapBoundsTracker"}},updateBounds:function(){throw Error("updateBounds method should be implemented");},boundsHandler:function(){throw Error("boundsHandler method should be implemented");},setMapCenterFromMarker:function(){throw Error("setMapCenterFromMarker method should be implemented");},_getLatLngFromEvent:function(){throw Error("_getLatLngFromEvent method should be implemented");
},_makeLatLng:function(){throw Error("_makeLatLng method should be implemented");},_latLngAsArray:function(){throw Error("_latLngAsArray method should be implemented");},_getGeocodePrecisionData:function(){throw Error("_getGeocodePrecisionData method should be implemented");},_addMarkerClickListener:function(){throw Error("_addMarkerClickListener method should be implemented");},_removeMarkerClickListener:function(){throw Error("_removeMarkerClickListener method should be implemented");},_bufferShape:function(){throw Error("_bufferShape method should be implemented");
},_unbufferShape:function(){throw Error("_unbufferShape method should be implemented");},_setPolylinePath:function(){throw Error("_setPolylinePath method should be implemented");},_clear:function(){this._removeShapeFromMap();this._removeMarkers();this._points=[]},_inputChangeHandler:function(){if(!this._ignoreChangeEvent)if(0===this._input.val().length)0<this._markers.length&&this.reset();else try{this._geoJson=this._validateGeoJson(JSON.parse(this._input.val())),this._geoJsonToMap(this._geoJson),
this._triggerShapeChange(this._geoJson)}catch(a){this.options.debug?console.log(a.message,a):this.reset()}},_validateGeoJson:function(a){if("undefined"!==typeof a.placemarks)if("undefined"!==typeof a.placemarks.type)if(-1<g.inArray(a.placemarks.type,i))if("undefined"!==typeof a.placemarks.coordinates){if(!g.isArray(a.placemarks.coordinates))throw Error("geoJson coordinates are not an Array.");}else throw Error("Missing geoJson coordinates.");else throw Error("geoJson placemark type is not valid list: "+
a.placemarks.type+" not in "+i.join(", "));else throw Error("Missing geoJson placemarks type.");else throw Error("Missing geoJson placemarks");return a},_newGeoJson:function(){return{placemarks:{type:"Point",coordinates:[]},properties:{radius:this.options.radius}}},_applyShapeBuffer:function(){this._radiusMeters=this.options.radius*("MI"===this.options.distanceUnit?1609.344:1E3);this._unbufferShape();"0"===this.options.radius||(0===this.options.radius||"Polygon"===this._geoJson.placemarks.type||0===
this._coordsLength())||this._bufferShape()},_triggerShapeChange:function(a){this._trigger("shapeChange",{},a?{geoJson:a}:{})},_setFirstPointUi:function(){this._setMarkerStyle(0,"LineString"===this._geoJson.placemarks.type?"firstVertex":"vertex")},_clearFirstPointUi:function(){1<this._points.length&&this._setMarkerStyle(0,"vertex")},_mapClickHandler:function(a){this.options.editMode&&(a=this._getLatLngFromEvent(a),null!==this._newPoint(a)&&this._changeHandler())},_firstMarkerClickHandler:function(){"LineString"===
this._geoJson.placemarks.type&&(this._createPolygon(),this._setFirstPointUi(),this._changeHandler())},_markerMoveHandler:function(a,c){return function(b){b=this._getDragPosition(c,b);this._coordsSetAt(a,b);!this.options.dragOptimization&&"LineString"===this._geoJson.placemarks.type&&this._setPolylinePath(this._updateBufferedShape(a))}},_markerDragEndHandler:function(a,c){return function(){var b,d=this._getMarkerPosition(c);b=this._geoJson.placemarks.type;d=this._asGeoJsonLatLng(d);if("Point"===b)this._geoJson.placemarks.coordinates=
d;else if("Polygon"===b)b=this._geoJson.placemarks.coordinates[0],a<b.length&&(b[a]=d,0===a&&(b[b.length-1]=d));else if("LineString"===b||"MultiPoint"===b)this.options.dragOptimization&&"LineString"===this._geoJson.placemarks.type&&this._setPolylinePath(this._getLineStringBufferPoints()),b=this._geoJson.placemarks.coordinates,a<b.length&&(b[a]=d);delete this._geoJson.properties.geocoder;this._changeHandler()}},_asGeoJsonLatLng:function(a){a=this._latLngAsArray(a);return[Math.round(a[1]*this._precision)/
this._precision,Math.round(a[0]*this._precision)/this._precision]},_newPoint:function(a){var c=null;"Polygon"!==this._geoJson.placemarks.type&&(c=this._newMarkerHandler(a,this._points.length),this._points.push(c),1===this._points.length?this._addMarkerClickListener(0,this._firstMarkerClickHandler):2===this._points.length?this.options.connected&&this._createLineString():3===this._points.length&&this._setFirstPointUi(),this._applyShapeBuffer());return c},_newMarkerHandler:function(a,c){this._coordsPush(a);
var b=this._addMarker(c,a);this.options.draggableMarkers&&(this._addMarkerMoveListener(c,b,this._markerMoveHandler(c,b)),this._addMarkerDragEndListener(c,b,this._markerDragEndHandler(c,b)));var d=this._asGeoJsonLatLng(a);"Point"===this._geoJson.placemarks.type?this._geoJson.placemarks.coordinates=0===this._geoJson.placemarks.coordinates.length?d:[this._geoJson.placemarks.coordinates,d]:this._geoJson.placemarks.coordinates.push(d);return b},_createLineString:function(){var a=this._addLineString();
this._geoJson.placemarks.type="LineString";delete this._geoJson.properties.geocoder;return a},_createPolygon:function(){this._removeShapeFromMap();var a=this._addPolygon();this._geoJson.placemarks.type="Polygon";var c=this._geoJson.placemarks.coordinates;c.push(c[0]);this._geoJson.placemarks.coordinates=[c];this._geoJson.properties.radius=0;delete this._geoJson.properties.geocoder;return a},_geoJsonToMap:function(a){try{this.options.radius=a.properties.radius}catch(c){this.options.radius=0}var b=
a.placemarks,d=b.type,e=b.coordinates,b=[];if("Point"===d)b.push(this._makeLatLng(e[1],e[0]));else{var h;"Polygon"===d?(e=e[0],h=e.length-1):h=e.length;var f;for(f=0;f<h;f+=1)b.push(this._makeLatLng(e[f][1],e[f][0]))}this._clear();f=b.length;for(h=0;h<f;h+=1)this._coordsPush(b[h]),e=this._addMarker(h,b[h]),this.options.draggableMarkers&&(this._addMarkerMoveListener(h,e,this._markerMoveHandler(h,e)),this._addMarkerDragEndListener(h,e,this._markerDragEndHandler(h,e))),this._points.push(e);"Polygon"===
d?this._addPolygon():"LineString"===d?this._addLineString():"MultiPoint"===d&&(this.options.connected=!1);this._applyShapeBuffer();this.options.editMode!==a.properties.editMode&&this._setOption("editMode",a.properties.editMode)},_getBluntVertexData:function(a){var c=this._coordsGetAsDArray(a);return{vertex:c,fromPrev:0<a?this._makeVertexPart(a-1,c):null,toNext:a<this._coordsLength()-1?this._makeVertexPart(a+1,c):null}},_makeVertexPart:function(a,c){var b=this._coordsGetAsDArray(a),b=g.simplicityGeoFn.computeHeading(c,
b);return{out:g.simplicityGeoFn.travel(c,this._radiusMeters,b+90),back:g.simplicityGeoFn.travel(c,this._radiusMeters,b-90),heading:b}},_getArc:function(a,c,b,d,e){b=g.simplicityGeoFn.computeHeading(c,b);var h=[],f=Math.abs(a/e);a=0>a?-1:1;for(var j=1;j<f;j+=1){var i=g.simplicityGeoFn.travel(c,d,b-e*a*j);h.push(i)}return h},_getLineStringBufferPoints:function(){var a=[],c=[];this._vertexData=[];this._firstVertexEndCap(a,c);var b,d=this._coordsLength()-1;for(b=1;b<d;b+=1)this._midVertexCurves(b,a,c);
this._lastVertexEndCap(d,a,c);return this._getBufferedShapeArray(a,c)},_updateBufferedShape:function(a){var c=this._vertexData.length-1,b=[],d=[];a=0===a?[0,1]:a===c?[a-1,a]:[a-1,a+1];var e,h=this._vertexData.length,f;for(e=0;e<h;e+=1)for(;;){if(e>a[0]&&e<a[1]||0<e&&e===a[0]||e<c&&e===a[1]){this._midVertexCurves(e,b,d);break}else if(e===a[0]){this._firstVertexEndCap(b,d);break}else if(e===a[1]){this._lastVertexEndCap(e,b,d);break}f=this._vertexData[e];if(0===e)b.push(f.toNext.out),d.push.apply(d,
f.arc),d.push(f.toNext.back);else if(e===c)b.push(f.fromPrev.back),b.push.apply(b,f.arc),d.push(f.fromPrev.out);else if(-3>f.angle||3<f.angle){var g=0>f.angle?[b,d]:[d,b];0<f.arc.length?g[0].push.apply(g[0],f.arc):(g[0].push(f.fromPrev.back),g[0].push(f.toNext.out));null!==f.intersect?g[1].push(f.intersect):(g[1].push(f.fromPrev.out),g[1].push(f.toNext.back))}break}return this._getBufferedShapeArray(b,d)},_firstVertexEndCap:function(a,c){var b=this._vertexData[0]=this._getBluntVertexData(0);a.push(b.toNext.out);
b.arc=this._getArc(-180,b.vertex,b.toNext.out,this._radiusMeters,this._capDegrees);c.push.apply(c,b.arc);c.push(b.toNext.back)},_lastVertexEndCap:function(a,c,b){a=this._vertexData[a]=this._getBluntVertexData(a);c.push(a.fromPrev.back);a.arc=this._getArc(180,a.vertex,a.fromPrev.back,this._radiusMeters,this._capDegrees);c.push.apply(c,a.arc);b.push(a.fromPrev.out)},_midVertexCurves:function(a,c,b){var d=this._vertexData[a]=this._getBluntVertexData(a);d.arc=null;a=this._vertexData[a-1];angle=d.toNext.heading-
a.toNext.heading;angle-=180<angle?360:0;angle+=-180>angle?360:0;d.angle=angle;if(-3>angle||3<angle)0>angle?(d.arc=this._getArc(-angle,d.vertex,d.fromPrev.back,this._radiusMeters,this._jointDegrees),0<d.arc.length?c.push.apply(c,d.arc):(c.push(d.fromPrev.back),c.push(d.toNext.out)),a=d.intersect=g.simplicityGeoFn.intersection(a.toNext.back,a.toNext.heading,d.toNext.back,d.toNext.heading),null!==a?b.push(a):(b.push(d.fromPrev.out),b.push(d.toNext.back))):(a=d.intersect=g.simplicityGeoFn.intersection(a.toNext.out,
a.toNext.heading,d.toNext.out,d.toNext.heading),null!==a?c.push(a):(c.push(d.fromPrev.back),c.push(d.toNext.out)),d.arc=this._getArc(-angle,d.vertex,d.fromPrev.out,this._radiusMeters,this._jointDegrees),0<d.arc.length?b.push.apply(b,d.arc):(b.push(d.fromPrev.out),b.push(d.toNext.back)))},_getBufferedShapeArray:function(a,c){a.push.apply(a,c.reverse());a.push(a[0]);return this._newCoordsArray(a)},destroy:function(){this._removeMapClickListener();this._removeMarkerMoveListeners();this._removeMarkerDragEndListeners();
this.options.editMode=!1;this.reset(!1);this._draw();g.ui.simplicityWidget.prototype.destroy.apply(this,arguments)}})})(jQuery);(function(a){a.widget("ui.simplicityMapShapeCreatorUi",a.ui.simplicityWidget,{options:{shapeCreator:"",mapElement:"",allowMultiPoint:!1,helpPosition:"",geocoderInput:'\x3cinput class\x3d"geocoder" type\x3d"text" placeholder\x3d"Enter city, state, zip or location" /\x3e',geocoderElement:"",radiusElement:'\x3cselect class\x3d"radius"\x3e\x3coption value\x3d"0.5"\x3e½ mile\x3c/option\x3e\x3coption value\x3d"1"\x3e1 mile\x3c/option\x3e\x3coption value\x3d"5"\x3e5 miles\x3c/option\x3e\x3coption value\x3d"10"\x3e10 miles\x3c/option\x3e\x3coption value\x3d"20"\x3e20 miles\x3c/option\x3e\x3coption value\x3d"50"\x3e50 miles\x3c/option\x3e\x3coption value\x3d"0"\x3eNone\x3c/option\x3e\x3c/select\x3e',
template:'\x3cdiv class\x3d"ui"\x3e \x3cspan class\x3d"geocoder"/\x3e \x3cspan class\x3d"radius"\x3eRadius \x3cspan class\x3d"control"/\x3e\x3c/span\x3e \x3cspan class\x3d"tbBox"\x3e  \x3cbutton class\x3d"drawBtn btn" title\x3d"Start drawing a shape to search on the map."\x3e\x3ci class\x3d"icon-edit"\x3e\x3c/i\x3e \x3cspan\x3eDraw\x3c/span\x3e\x3c/button\x3e  \x3cbutton class\x3d"linkerBtn btn" title\x3d"Click to draw points only"\x3e\x3cspan\x3e●–●–●\x3c/span\x3e\x3c/button\x3e  \x3cbutton class\x3d"clear btn" title\x3d"Clear any drawn shape"\x3e\x3ci class\x3d"icon-remove"\x3e\x3c/i\x3e Clear\x3c/button\x3e  \x3cbutton class\x3d"showhelp btn" title\x3d"Show help"\x3e\x3ci class\x3d"icon-info-sign"\x3e\x3c/i\x3e Help\x3c/button\x3e \x3c/span\x3e\x3c/div\x3e',
helpTemplate:'\x3cdiv class\x3d"help ui-corner-all ui-helper-clearfix"\x3e\x3cdiv class\x3d"text"\x3e\x3cdiv class\x3d"background ui-corner-all"\x3e\x3c/div\x3e\x3cp\x3eTo draw or edit a shape, click to draw the first point. Click in another spot to draw a new point or drag a vertex.\x3c/p\x3e\x3cp\x3eTo draw a closed shape, add 3 points then click the first point. To end drawing, click Stop.\x3c/p\x3e\x3c/div\x3e\x3cdiv class\x3d"closer ui-corner-all" title\x3d"Close this help message"\x3e\x3ca class\x3d"close" title\x3d"Close this help message"\x3e\x26times;\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e',
updateBounds:!1,searchElement:"body",debug:!1},_create:function(){""!==this.options.shapeCreator&&(this._shapeCreator=this._locateShapeCreator(a(this.options.shapeCreator),/^(uiS|s)implicity(.+)MapShapeCreator$/));""!==this.options.mapElement&&"undefined"===typeof this._shapeCreator&&(this._shapeCreator=this._locateShapeCreator(a(this.options.mapElement),/^(uiS|s)implicity(.+)Map$/));if("undefined"===typeof this._shapeCreator){if(this.options.debug)throw Error("ShapeCreator could not be determined from either options.shapeCreator or options.mapElement.");
}else{!this._shapeCreator("option","debug")&&this.options.debug&&this._shapeCreator("option","debug",!0);""===this.options.helpPosition&&(this.options.helpPosition={left:300,top:-148});this._settings_COOKIE="__t11e_pd_st";this._settings={};this._settings.helpHidden=!1;this._getSettings();this._geoJson={};var b=this._shapeCreator("getMappingProviderWidgetNames");this._addClass("ui-simplicity-map-shape-creator-ui")._bind(this._shapeCreator,b.shapeCreator.toLowerCase()+"shapechange",this._shapeChangedHandler);
this.options.updateBounds&&this._bind(this._shapeCreator,b.boundsCoordinator.toLowerCase()+"calculatebounds",this._shapeCreator("boundsHandler"));this._createUi();this._shapeCreator("option","radius",this._radius)}},_setOption:function(b,d){a.ui.simplicityWidget.prototype._setOption.apply(this,arguments);"geocoderInput"===b?(this._geocoderInput=a(d),this._configureGeocoder()):"radiusElement"===b&&(this._radiusInput.remove(),this._radiusInput=a(d).appendTo(this.element.find(".radius .control")),this._geoJson.properties.radius=
this._radius,this._configureRadiusInput())},_locateShapeCreator:function(b,d){var c=a.map(b.data(),function(b,a){return d.test(a)?a:void 0});if(1!==c.length)this.options.debug&&(0===c.length?console.log("Missing mapping widget "+d.source):console.log("Ambigious mapping widget: "+c));else{var c="simplicity"+c[0].match(d)[2]+"MapShapeCreator",e=b[c];"undefined"===typeof b.data(c)&&e.call(b);return function(){return e.apply(b,arguments)}}},_radiusChangedHandler:function(b){this._radius=b.currentTarget.value?
+b.currentTarget.value:0;this._shapeCreator("option","radius",this._radius)},_shapeChangedHandler:function(b,a){var c=a.geoJson;0<c.placemarks.coordinates.length?("Polygon"===c.placemarks.type&&this._mapclicklabel.prop("checked")&&(this._disable(),this._shapeCreator("option","editMode")&&this._shapeCreator("option","editMode",!1)),this.element.find(".clear").fadeIn(),this._radiusInput.prop("disabled","Polygon"===c.placemarks.type),!this._radiusInput.prop("disabled")&&this._radius!==c.properties.radius&&
(this._radiusInput.val(this._radius),this._radius=this._radiusInput.val(),this._geoJson.properties.radius=this._radius),this._geocoderInput.val("undefined"!==typeof c.properties.geocoder?c.properties.geocoder.addr||"":""),c.properties.editMode&&this._enable()):(this.element.find(".clear").fadeOut(),this._geocoderInput.val(""),this._radiusInput.prop("disabled",!1));this._geoJson=c},_createUi:function(){this._helpMsg=a(this.options.helpTemplate).draggable().hide().css(this.options.helpPosition);this._helpMsg.find(".background").css({opacity:0.5});
this._bind(this._helpMsg.find(".closer"),"click",function(b){b.preventDefault();this._helpButton.fadeIn();this._helpMsg.fadeOut("slow",a.proxy(function(){this._helpMsg.detach();this._settings.helpHidden=!0;this._saveSettings()},this))});this.element.data("previousHTML",this.element.html()).html(this.options.template);this._mapclicklabel=this.element.find(".drawBtn").prop("checked",!1);this._bind(this._mapclicklabel,"click",function(){this._mapclicklabel.prop("checked")?(this._mapclicklabel.prop("checked",
!1),this._disable(),this._shapeCreator("option","editMode",!1),this._trigger("edit",{},{edit:!1})):(this._mapclicklabel.prop("checked",!0),"Polygon"===this._shapeCreator("geometry")&&this._shapeCreator("convertPolygonToLineString",this._radius),this._shapeCreator("option","editMode",!0),this._enable(),this._radius=this._radiusInput.val()?+this._radiusInput.val():0,this._radius!==this._shapeCreator("option","radius")&&this._shapeCreator("option","radius",this._radius),this._shapeCreator("updateBounds"),
this._trigger("edit",{},{edit:!0}))});this._helpButton=this.element.find(".showhelp").hide();this._bind(this._helpButton,"click",function(){this._settings.helpHidden&&(this._helpMsg.appendTo(this.element),this._helpMsg.fadeIn("slow"),this._helpButton.fadeOut(),this._settings.helpHidden=!1,this._saveSettings())});this._bind(this.element.find(".clear").hide(),"click",function(){this.element.find(".clear").fadeOut();this._shapeCreator("reset");this._geocoderInput.val("")});this.options.allowMultiPoint?
(this._bind(this.element.find(".linkerBtn"),"click",function(){var b=!this._shapeCreator("option","connected");this.element.find(".linkerBtn").prop("checked",b);this._setConnected(b);this._shapeCreator("option","radius",this._radius);this._shapeCreator("option","connected",b)}),this.element.find(".linkerBtn").hide()):this.element.find(".linkerBtn").remove();this._radiusInput=a(this.options.radiusElement).appendTo(this.element.find(".radius .control"));this._configureRadiusInput();this._geocoderInput=
"string"===typeof this.options.geocoderInput?a(this.options.geocoderInput).autocomplete({autoFocus:!0}):a(this.options.geocoderInput);this._configureGeocoder();this._shapeCreator("option","editMode")&&this._enable();this._setConnected("MultiPoint"!==this._shapeCreator("geometry"))},_configureRadiusInput:function(){0<this._radiusInput.length?(this._radius=this._radiusInput.val()?+this._radiusInput.val():0,this._bind(this._radiusInput,"change",this._radiusChangedHandler)):this._radiusInput.appendTo(this.element.find(".radius").children().remove())},
_configureGeocoder:function(){if(0<this._geocoderInput.length){this.element.find(".geocoder").append(this._geocoderInput);var b=a.proxy(function(b,a){if(a.item){var c=!0;try{"undefined"!==typeof this._geoJson.properties.geocoder&&(c=a.item.value!==this._geoJson.properties.geocoder.addr)}finally{c&&(this._shapeCreator("reset",!1),this._shapeCreator("option","radius",this._radius),c=this._shapeCreator("newGeocodedPoint",a),this._shapeCreator("setMapCenterFromMarker",c),c={geoJson:this._shapeCreator("geoJson"),
geocoderCallbackData:a},this._trigger("geocodedpoint",{},c))}}},this),d=a("\x3cspan/\x3e").addClass("ui-simplicity-map-shape-creator-ui-geocoder-menu").appendTo(a("body")),c=this._shapeCreator("getMappingProviderWidgetNames").geocoder,e=(""===this.options.geocoderElement?this._geocoderInput:a(this.options.geocoderElement))[c]();this._geocoderInput.autocomplete({source:e[c]("autocompleteSource"),select:b,change:b,appendTo:d});this._geocoderInput.watermark&&this._geocoderInput.watermark(this._geocoderInput.attr("placeholder"))}},
_enable:function(){a(this.options.searchElement).data("simplicityDiscoverySearch")&&a(this.options.searchElement).simplicityDiscoverySearch("option","searchOnStateChange",!1);this._mapclicklabel.prop("checked",!0).attr("title","Stop drawing.").find("span").text("Stop");this._settings.helpHidden||(this._helpMsg.appendTo(this.element),this._helpMsg.fadeIn("slow"));this._radiusInput.prop("disabled",!1);this.element.find(".linkerBtn").fadeIn();this._geocoderInput.attr("disabled","true").addClass("disabled");
this._helpButton[this._settings.helpHidden?"fadeIn":"fadeOut"]()},_disable:function(){a(this.options.searchElement).data("simplicityDiscoverySearch")&&a(this.options.searchElement).simplicityDiscoverySearch("option","searchOnStateChange",!0).simplicityDiscoverySearch("search");this._mapclicklabel.prop("checked",!1).attr("title","Start drawing a shape to search on the map.").find("span").text("Draw");this._helpMsg.fadeOut("slow",a.proxy(function(){this._helpMsg.detach()},this));this.element.find(".linkerBtn").fadeOut();
this._geocoderInput.removeAttr("disabled").removeClass("disabled");this._helpButton.fadeOut()},_setConnected:function(b){this.element.find(".linkerBtn").attr("title",b?"Click to draw points only":"Click to draw lines and closed shapes").find("span").text(b?"●–●–●":"● ● ●").prop("checked",b)},_saveSettings:function(){var b=this._settings_COOKIE,a=new Date;a.setDate(a.getDate()+6);document.cookie=b+"\x3d"+escape(JSON.stringify({h:this._settings.helpHidden?1:0}))+"; expires\x3d"+a.toUTCString()},_getSettings:function(){var b,
d,c,e,f=document.cookie.split(";"),g=this._settings_COOKIE;a.each(f,a.proxy(function(a){c=f[a].indexOf("\x3d");b=f[a].substr(0,c);d=f[a].substr(c+1);b=b.replace(/^\s+|\s+$/g,"");b===g&&(e=JSON.parse(unescape(d)),"undefined"!==typeof e.h&&(this._settings.helpHidden=1===e.h))},this))},destroy:function(){this._helpMsg.remove();this.element.html(this.element.data("previousHTML"));this.element.removeData("previousHTML");a.ui.simplicityWidget.prototype.destroy.apply(this,arguments)}})})(jQuery);(function(d){d.widget("ui.simplicityNokiaMapShapeCreator",d.ui.simplicityMapShapeCreator,{options:{lineStringOptions:"",polygonOptions:""},_create:function(){d.ui.simplicityMapShapeCreator.prototype._create.apply(this,arguments);""===this.options.lineStringOptions&&(this.options.lineStringOptions={width:1});""===this.options.polygonOptions&&(this.options.polygonOptions={brush:{color:"#0066cc43"},width:0});this._shapeType="Point";this._mapClickListener=this._currentMapShape=null;this._map=d(this.element).simplicityNokiaMap("map");
this._mvcCoords=new nokia.maps.geo.Strip([]);this.creatingMapCursor="crosshair";this.clickMethod=nokia.maps.dom.Page.browser.touch?"tap":"click";this.zoomMapComponent=this._map.getComponentById("zoom.DoubleClick");this._vertexMarkerImage=this._getMarkerImage(this.options.vertexMarkerOptions);this._firstVertexMarkerImage=this._getMarkerImage(this.options.firstVertexMarkerOptions);this._mapClick=null;this._addClass("ui-simplicity-nokia-shape-creator")},_getMarkerImage:function(b){a=b.anchor;return{icon:b.icon,
anchor:new nokia.maps.util.Point(a[0],a[1])}},_setOption:function(b,c){d.ui.simplicityMapShapeCreator.prototype._setOption.apply(this,arguments);switch(b){case "markerOptions":d.each(this._markers,d.proxy(function(b,c){c.marker.set(this.options.markerOptions)},this));break;case "firstVertexMarkerOptions":this.options.editMode&&2<this._markers.length&&(this._firstVertexMarkerImage=this._getMarkerImage(this.options.firstVertexMarkerOptions),this._markers[0].marker.set(this._firstVertexMarkerImage));
break;case "vertexMarkerOptions":this._vertexMarkerImage=this._getMarkerImage(this.options.vertexMarkerOptions);var e=this.options.editMode&&2<this._markers.length?0:-1;d.each(this._markers,d.proxy(function(b,c){b>e&&c.marker.set(this._vertexMarkerImage)},this))}},_draw:function(){null!==this.zoomMapComponent&&(this.options.editMode?this._map.removeComponent(this.zoomMapComponent):null===this._map.getComponentById("zoom.DoubleClick")&&this._map.addComponent(this.zoomMapComponent));d(this.element).css({cursor:this._mapCursor()})},
_mapCursor:function(){return this.options.editMode?this.creatingMapCursor:"inherit"},_addLineString:function(){var b=d.extend({},this.options.lineStringOptions);this._currentMapShape=new nokia.maps.map.Polyline(this._mvcCoords,b);this._map.objects.add(this._currentMapShape);this._shapeType="LineString";return this._currentMapShape},_addPolygon:function(){this._currentMapShape=new nokia.maps.map.Polygon(this._mvcCoords,d.extend({},this.options.polygonOptions));this._map.objects.add(this._currentMapShape);
this._shapeType="Polygon";return this._currentMapShape},_setPolylinePath:function(b){this._polylineRadius&&this._polylineRadius.set("path",b)},_bufferShape:function(){if("LineString"===this._geoJson.placemarks.type){var b=d.extend({},this.options.polygonOptions);this._polylineRadius=new nokia.maps.map.Polygon(this._getLineStringBufferPoints(),b);this._map.objects.add(this._polylineRadius)}else d.each(this._markers,d.proxy(function(b,e){e.radiusCircle?e.radiusCircle.set(d.extend({},{radius:this._radiusMeters})):
this._radiusMeters&&(e.radiusCircle=new nokia.maps.map.Circle(e.marker.coordinate,this._radiusMeters,d.extend({},this.options.polygonOptions,this.options.circleOptions)),this._map.objects.add(e.radiusCircle));-1===this._map.objects.indexOf(e.radiusCircle)&&this._map.objects.add(e.radiusCircle)},this))},_unbufferShape:function(){d.each(this._markers,d.proxy(function(b,c){c.radiusCircle&&(this._map.objects.remove(c.radiusCircle),c.radiusCircle=null)},this));this._polylineRadius&&(this._removeFromMap(this._polylineRadius),
this._polylineRadius=null)},_removeFromMap:function(b){null!==b&&this._map.objects.remove(b)},_removeShapeFromMap:function(){null!==this._currentMapShape&&(this._removeFromMap(this._currentMapShape),this._currentMapShape=null);this._shapeType="Point";this._polylineRadius&&(this._removeFromMap(this._polylineRadius),this._polylineRadius=null)},_getLatLngFromEvent:function(b){b=this._map.pixelToGeo(b.displayX,b.displayY);return new nokia.maps.geo.Coordinate(b.latitude,b.longitude,0,!0)},_makeLatLng:function(b,
c){return new nokia.maps.geo.Coordinate(b,c)},_latLngAsArray:function(b){return[b.latitude,b.longitude]},updateBounds:function(){var b={coordinates:[]};this.boundsHandler()({},b);d.isArray(b.coordinates)&&0<b.coordinates.length&&(b=nokia.maps.geo.BoundingBox.coverAll(b.coordinates),"undefined"!==typeof b&&this._map.zoomTo(b,!1))},_getGeocodePrecisionData:function(b,c){var e="houseNumber street postalCode district city county state country".split(" "),f={point:b,addr:c.item.value};try{var g=c.item.vendor.address;
d.each(e,function(b,c){"undefined"!==typeof g[c]&&(f[c]=g[c])})}catch(h){}return f},setMapCenterFromMarker:function(b){b&&this._map.setCenter(b.coordinate,"default")},getMappingProviderId:function(){return"Nokia"},_addMapClickListener:function(){null===this._mapClick&&(this._mapClick=d.proxy(this._mapClickHandler,this),this._map.addListener(this.clickMethod,this._mapClick))},_removeMapClickListener:function(){this._mapClick&&this._map.removeListener(this.clickMethod,this._mapClick);this._mapClick=
null},_addMarker:function(b,c){var e=new nokia.maps.map.Marker(c,d.extend({},this._vertexMarkerImage,this.options.markerOptions));e.addListener("mouseenter",d.proxy(function(){d(this.element).css({cursor:"move"})},this));e.addListener("mouseout",d.proxy(function(){d(this.element).css({cursor:this._mapCursor()})},this));this._markers.push({marker:e});this.options.draggableMarkers&&e.set({draggable:!0,zIndex:150});this._map.objects.add(e);return e},_setMarkerStyle:function(b,c){if(b<this._markers.length){var e=
this._markers[b].marker;"vertex"===c?e.set(d.extend({zIndex:150},this._vertexMarkerImage)):"firstVertex"===c&&e.set(d.extend({zIndex:200},this._firstVertexMarkerImage))}},_addMarkerClickListener:function(b,c){b<this._markers.length&&this._markers[b].marker.addListener(this.clickMethod,d.proxy(c,this))},_removeMarkerClickListener:function(){},_addMarkerMoveListener:function(b,c,e){b<this._markers.length&&c.addListener("drag",d.proxy(e,this))},_removeMarkerMoveListeners:function(){},_addMarkerDragEndListener:function(b,
c,e){b<this._markers.length&&c.addListener("dragend",d.proxy(e,this))},_removeMarkerDragEndListeners:function(){},_getDragPosition:function(b,c){return this._getLatLngFromEvent(c)},_getMarkerPosition:function(b){return b.coordinate},_removeMarkers:function(){this._removeMarkerClickListener(0);d.each(this._markers,d.proxy(function(b,c){var d=c.marker;c.radiusCircle&&this._map.objects.remove(c.radiusCircle);this._map.objects.remove(d)},this));this._markers=[];this._coordsClear()},_coordsObserver:function(b,
c,d){0!==d&&(null!==this._currentMapShape&&this._currentMapShape.path.set(c,b.get(c)),c<this._markers.length&&this._markers[c].radiusCircle&&this._markers[c].radiusCircle.set("center",b.get(c)))},_createCoordsArray:function(){this._mvcCoords=new nokia.maps.geo.Strip([]);this._mvcCoords.addObserver(this._coordsObserver,this);return this._mvcCoords},_newCoordsArray:function(b){return new nokia.maps.geo.Strip(b)},_coordsLength:function(){return this._mvcCoords.getLength()},_coordsPush:function(b){var c=
this._mvcCoords.getLength();this._mvcCoords.add(b);return c},_coordsGetAsDArray:function(b){b=this._mvcCoords.get(b);return[b.latitude,b.longitude]},_coordsSetAt:function(b,c){this._mvcCoords.set(b,c)},_coordsClear:function(){this._mvcCoords.removeObserver(this._coordsObserver,this);this._mvcCoords.destroy();this._createCoordsArray()},boundsHandler:function(){return d.proxy(function(b,c){var e=c.coordinates;if("undefined"!==typeof e){var f=null;"undefined"!==typeof this._polylineRadius&&null!==this._polylineRadius?
(f=this._polylineRadius.getBoundingBox(this._map),e.push(f.bottomRight),e.push(f.topLeft)):d.each(this._markers,d.proxy(function(b,c){f=c[c.radiusCircle?"radiusCircle":"marker"].getBoundingBox(this._map);e.push(f.bottomRight);e.push(f.topLeft)},this))}},this)}})})(jQuery);