(function () {
    'use strict';
    var $dropzone = $('#dropzone'),
        $images = $('#images'),
        $metadata = $('#metadata');
    window.dkrm = [];
    $dropzone.on({
        dragover: function (event) {
            event.preventDefault();
            event.stopPropagation();
            $dropzone.addClass('hover');
        },
        dragleave: function (event) {
            event.preventDefault();
            event.stopPropagation();
            $dropzone.removeClass('hover');
        },
        drop: function (event) {
            event.preventDefault();
            event.stopPropagation();
            $dropzone.removeClass('hover');
            $images.empty();
            $metadata.empty();
            Array.prototype.forEach.call(event.originalEvent.dataTransfer.files, (function (file, index) {
                $images.append('<div class="wrapper" id="' + index + '">\
                                     <div id="image-container-' + index + '"></div>\
                                </div>');
                $metadata.append('<div id="exif-' + index + '" style="display: none;" class="exif">\
                                      <table></table>\
                                  </div>');
                $('#image-container-' + index).data('fileName', file.name);
                loadImage.parseMetaData(file, function (data) {
                    var $exif = $('#exif-' + index);
                    $('#image-container-' + index).data('header', data.imageHead);
                    if (data.exif) {
                        var tags = data.exif.getAll(),
                            table = $exif.find('table'),
                            row = $('<tr></tr>'),
                            cell = $('<td></td>'),
                            prop;
                        for (prop in tags) {
                            if (tags.hasOwnProperty(prop)) {
                                table.append(
                                    row.clone()
                                        .append(cell.clone().text(prop))
                                        .append(cell.clone().text(tags[prop]))
                                );
                            }
                        }
                    } else {
                        $exif.html('<div class="no-metadata">No available metadata</div>');
                    }

                    var img = document.createElement('img');
                    img.onload = function () {
                        img.id = 'target-' + index;
                        $('#image-container-' + index).append(img);
                        var darkroom = new Darkroom('#' + img.id, {
                            // Size options
                            minWidth: 100,
                            minHeight: 100,

                            // Post initialize script
                            initialize: function () {
                                var $container = $(this.containerElement).find('.canvas-container');
                                //$container.parent().siblings('.darkroom-toolbar').appendTo($container);
                                $('<button type="button" class="darkroom-button darkroom-button-default">\
                                       <svg class="darkroom-icon"><use xlink:href="#edit" /></svg>\
                                   </button>').click(function () {
                                    var $button = $(this),
                                        $wrapper = $button.closest('.wrapper'),
                                        id = $wrapper.attr('id');
                                    $wrapper.draggable('disable');
                                    darkroom.canvas.isGrabMode = true;
                                    $button.hide().parent().parent().siblings('.darkroom-toolbar').addClass('active');
                                    $('#exif-' + id).show().siblings().hide();
                                }).appendTo($container);
                                $container.resizable({
                                    resize: function (event, ui) {
                                        var $canvases = $(this).find('.lower-canvas,.upper-canvas'),
                                            img = new Image,
                                            ctx = $canvases.filter('.lower-canvas').get(0).getContext('2d');
                                        img.onload = function () {
                                            $canvases.attr({
                                                width: ui.size.width,
                                                height: ui.size.height
                                            }).css({
                                                width: ui.size.width,
                                                height: ui.size.height
                                            });
                                            ctx.drawImage(img, 0, 0);
                                            darkroom.canvas.setZoom(darkroom.canvas.viewport.zoom);
                                        };
                                        img.src = darkroom.originalImageElement.src;
                                    }
                                });
                                $('.wrapper').draggable({});
                            }
                        });
                        window.dkrm.push(darkroom);
                    };
                    loadImage.readFile(file, function (e) {
                        img.src = e.target.result;
                    });

                });
            }));
        }
    });
})();