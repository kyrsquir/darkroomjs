(function () {
    'use strict';
    $('#file-input').after('<div id="content"></div>').on('change', function (event) {
        var $content = $('#content');
        $content.empty();
        Array.prototype.forEach.call(event.target.files, (function (file, index) {
            $content.append('<div class="wrapper">\
                                 <div id="image-container-' + index + '"></div>\
                                 <div id="exif-' + index + '" class="exif">\
                                     <table></table>\
                                 </div>\
                             </div>');
            $('#image-container-' + index).data('fileName', file.name);
            loadImage.parseMetaData(file, function (data) {
                var $exif = $('#exif-' + index);
                $exif.data('header', data.imageHead);
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
                        maxWidth: 600,
                        maxHeight: 500,
                        ratio: 4 / 3,
                        backgroundColor: '#000',

                        // Plugins options
                        plugins: {
                            //save: false,
                            crop: {
                                quickCropKey: 67//, key "c"
                                //minHeight: 50,
                                //minWidth: 50,
                                //ratio: 4/3

                            }
                        },

                        // Post initialize script
                        initialize: function () {
                            var $container = $(this.containerElement);
                            $container.children('.darkroom-toolbar').hide();
                            var buttonElement = document.createElement('button');
                            buttonElement.type = 'button';
                            buttonElement.className = 'darkroom-button darkroom-button-default';
                            buttonElement.innerHTML = '<svg class="darkroom-icon"><use xlink:href="#edit" /></svg>';
                            $container.append(buttonElement);
                            //var that = this;
                            $(buttonElement).click(function() {
                                var $button = $(this);
                                $button.siblings('.darkroom-toolbar').show();
                                $button.hide();
                                $button.closest('.wrapper').css('margin-top', '50px');
                                /*var cropPlugin = that.plugins['crop'];
                                 cropPlugin.selectZone(170, 25, 300, 300);
                                 cropPlugin.requireFocus();*/
                            });
                        }
                    });
                };
                loadImage.readFile(file, function (e) {
                    img.src = e.target.result;
                });

            });
        }));
    });
})();