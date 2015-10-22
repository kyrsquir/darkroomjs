(function () {
    'use strict';

    Darkroom.plugins['save'] = Darkroom.Plugin.extend({

        defaults: {
            callback: function () {
                var $container = $(this.darkroom.containerElement),
                    $wrapper = $container.closest('.wrapper'),
                    id = $wrapper.attr('id');
                $container.children('.darkroom-toolbar').removeClass('active');
                $container.children('.darkroom-button').show();
                $wrapper.css('margin-top', '').draggable('enable');
                $('#exif-' + id).hide();
                //this.darkroom.selfDestroy();
            }
        },

        initialize: function InitializeDarkroomSavePlugin() {
            var buttonGroup = this.darkroom.toolbar.createButtonGroup();

            this.destroyButton = buttonGroup.createButton({
                image: 'save'
            });

            this.destroyButton.addEventListener('click', this.options.callback.bind(this));
        }
    });

})();