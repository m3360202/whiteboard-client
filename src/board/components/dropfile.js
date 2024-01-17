
import jQuery from 'jquery';

(function ($) {
    const methods = {
        init(options) {
            return this.each(function () {
                const self = this;
                const isInitialized = $(self).data('isFiledropInitialized');

                if (isInitialized == null) {
                    let opts = {};
                    const default_opts = {
                        pasteEl: document,
                        upload(files, webItems, url, position) { },

                        error(error) {
                            alert(error);
                        },
                    };

                    opts = $.extend({}, default_opts, options);
                    $(self)
                        .bind('drop', drop)
                        .bind('dragenter', dragEnter)
                        .bind('dragover', dragOver)
                        .bind('dragleave', dragLeave);
                    $(opts.pasteEl).unbind('drop').unbind('dragenter').unbind('dragover');
                    $(opts.pasteEl)
                        .bind('drop', docDrop)
                        .bind('dragenter', docEnter)
                        .bind('dragover', docOver);

                    $(self).data('options', opts);
                    $(opts.pasteEl).data('options', opts);
                    $(self).data('isFiledropInitialized', 'true');
                }
            });
        },
    };

    var drop = function (e) {
        const options = $(this).data('options');
        const { files } = e.originalEvent.dataTransfer;
        const webItems = $(e.originalEvent.dataTransfer.getData('text/html'));
        const url = e.originalEvent.dataTransfer.getData('text/uri-list');

        if (files === undefined || files === null) {
            options.error('Your browser does not support HTML5 file uploads!');
            return false;
        }

        const position = {
            left: e.originalEvent.offsetX,
            top: e.originalEvent.offsetY,
        };

        options.upload(files, webItems, url, position);
        e.preventDefault();

        return false;
    };

    var dragEnter = function (e) {
        e.preventDefault();
    };

    var dragOver = function (e) {
        e.preventDefault();
    };

    var dragLeave = function (e) {
        e.stopPropagation();
    };

    var docDrop = function (e) {
        e.preventDefault();
        return false;
    };

    var docEnter = function (e) {
        e.preventDefault();
        return false;
    };

    var docOver = function (e) {
        e.preventDefault();
        return false;
    };

    $.fn.filedrop = function (method) {
        if (methods[method]) {
            return methods[method].apply(
                this,
                Array.prototype.slice.call(arguments, 1),
            );
        }
        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        $.error(`Method ${method} does not exist on filedrop`);
    };
})(jQuery);
