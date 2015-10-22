(function () {
    'use strict';
    var $dropzone = $('#dropzone'),
        $images = $('#images'),
        $metadata = $('#metadata'),
        imageWidth = screen.width * 0.85 * 0.30,
        imageHeight = 500;
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
            var x = 0,
                y = -1;
            Array.prototype.forEach.call(event.originalEvent.dataTransfer.files, (function (file, index) {
                if (index % 3 === 0) {
                    x = 0;
                    y++;
                } else {
                    x++;
                }
                $images.append('<div class="wrapper" x="' + x + '" y="' + y + '" id="' + index + '">\
                                     <div id="image-container-' + index + '"></div>\
                                </div>');
                $metadata.append('<div id="exif-' + index + '" style="display: none;" class="exif">\
                                      <table></table>\
                                  </div>');
                $('#image-container-' + index).data('fileName', file.name);
                loadImage.parseMetaData(file, function (data) {
                    var $exif = $('#exif-' + index);
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
                        window.dkrm = new Darkroom('#' + img.id, {
                            // Size options
                            minWidth: 100,
                            minHeight: 100,
                            maxWidth: imageWidth,
                            maxHeight: imageHeight,
                            /*ratio: 4 / 3,
                             backgroundColor: '#000',*/

                            // Plugins options
                            plugins: {
                                //save: false,
                                crop: {
                                    //quickCropKey: 67//, key "c"
                                    //minHeight: 50,
                                    //minWidth: 50,
                                    //ratio: 4/3

                                }
                            },

                            // Post initialize script
                            initialize: function () {
                                var $container = $(this.containerElement),
                                    buttonElement = document.createElement('button');
                                $container.children('.darkroom-toolbar')
                                buttonElement.type = 'button';
                                buttonElement.className = 'darkroom-button darkroom-button-default';
                                buttonElement.innerHTML = '<svg class="darkroom-icon"><use xlink:href="#edit" /></svg>';
                                $container.append(buttonElement);
                                $(buttonElement).click(function () {
                                    var $button = $(this),
                                        $wrapper = $button.closest('.wrapper'),
                                        id = $wrapper.attr('id');
                                    $button.siblings('.darkroom-toolbar').addClass('active');
                                    $button.hide();
                                    $wrapper.css('margin-top', '50px').draggable('disable');
                                    $('#exif-' + id).show().siblings().hide();
                                });
                            }
                        });
                    };
                    loadImage.readFile(file, function (e) {
                        img.src = e.target.result;
                    });

                });
            }));
            $('.wrapper').draggable({}).each(function () {
                var $this = $(this),
                    x = $this.attr('x'),
                    y = $this.attr('y');
                $this.css({
                    left: x * imageWidth * 1.1,
                    top: y * imageHeight * 1.1
                });
            });
            $('#left').css('height', (y + 1) * imageHeight * 1.1);
        }
    });
})();