(function () {
    'use strict';

    Darkroom.plugins['edit'] = Darkroom.Plugin.extend({
        defaults: {
            callback: function () {
                this.darkroom.canvas.isGrabMode = false;
                var $container = $(this.darkroom.containerElement),
                    $wrapper = $container.closest('.wrapper'),
                    id = $wrapper.attr('id');
                $container.children('.darkroom-toolbar').removeClass('active');
                $container.find('.darkroom-button').show();
                $wrapper.draggable('enable');
                $('#exif-' + id).hide();
                //this.darkroom.selfDestroy();
            }
        },
        initialize: function () {
            var buttonGroup = this.darkroom.toolbar.createButtonGroup();
            this.destroyButton = buttonGroup.createButton({
                image: 'save'
            });
            this.destroyButton.addEventListener('click', this.options.callback.bind(this));
        }
    });

})();