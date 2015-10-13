(function () {
    'use strict';
    Darkroom.plugins['download'] = Darkroom.Plugin.extend({
        defaults: {
            callback: function () {
                this.darkroom.download();
            }
        },
        initialize: function InitializeDarkroomDownloadPlugin() {
            var buttonGroup = this.darkroom.toolbar.createButtonGroup();

            this.downloadButton = buttonGroup.createButton({
                image: 'download'
            });
            this.downloadButton.addEventListener('click', this.options.callback.bind(this));
        }
    });
})();