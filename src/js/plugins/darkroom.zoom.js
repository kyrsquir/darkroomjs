(function () {
    'use strict';

    var Zoom = Darkroom.Transformation.extend({
        applyTransformation: function (canvas, image, next) {
            /*image.filters.push(
             new fabric.Image.filters.Resize({
             scaleX: multiplier,
             scaleY: multiplier,
             resizeType: 'sliceHack'
             })
             );
             image.applyFilters(canvas.renderAll.bind(canvas));
             next();*/
            next();
        }
    });

    Darkroom.plugins['zoom'] = Darkroom.Plugin.extend({
        initialize: function () {
            var darkroom = this.darkroom,
                canvas = darkroom.canvas,
                $container = $(darkroom.containerElement);
            $container.on('mousewheel', function (event) {
                var scrollUp = event.originalEvent.wheelDelta > 0;
                if (event.ctrlKey) {
                    event.preventDefault();
                    var lowerCanvasEl = canvas.lowerCanvasEl,
                        upperCanvasEl = canvas.upperCanvasEl,
                        modifier = scrollUp ? 0.9 : 1.1,
                        width = lowerCanvasEl.width * modifier,
                        height = lowerCanvasEl.height * modifier,
                        img = new Image,
                        ctx = lowerCanvasEl.getContext('2d');
                    img.onload = function () {
                        $(lowerCanvasEl).add(upperCanvasEl).attr({
                            width: width,
                            height: height
                        }).add(lowerCanvasEl.parentNode).css({
                            width: width,
                            height: height
                        });
                        ctx.drawImage(img, 0, 0);
                        darkroom.canvas.setZoom(darkroom.canvas.viewport.zoom);
                    };
                    img.src = darkroom.originalImageElement.src;
                } else if (canvas.isGrabMode === true) {
                    event.preventDefault();
                    if (scrollUp) {
                        canvas.setZoom(canvas.viewport.zoom * 1.1);
                    } else {
                        canvas.setZoom(canvas.viewport.zoom * 0.9);
                    }
                }
            });
        }
    });

})();