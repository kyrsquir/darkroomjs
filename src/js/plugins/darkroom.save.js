(function () {
    'use strict';

    Darkroom.plugins['save'] = Darkroom.Plugin.extend({

        defaults: {
            callback: function () {
                var $container = $(this.darkroom.containerElement);
                $container.children('.darkroom-toolbar').hide();
                $container.children('.darkroom-button').show();
                $container.closest('.wrapper').css('margin-top', '');
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