$.widget("ui.lsImageMapper", {
    // default options
    options: {
        answerDisplays: {},
        colorLegend: true,
        defaultDisplay: {
            fill: false,
            stroke: true,
            strokeColor: '808080',
            strokeOpacity: 0.75,
            strokeWidth: 1
        },
        defaultValue: null,
        hideAnswers: false,
        highlightArea: null,
        highlightQuestion: '#A7A9D1',
    },

    _create: function () {
        "use strict";

        if (null === this.options.highlightArea) {
            this.options.highlightArea = {
                fill: true,
                fillColor: this.options.highlightQuestion.substring(1), // Remove '#'
                fillOpacity: 0.75
            };
        }

        this.loadAll();
    },

    addAreaData: function (areaId, newdata) {
        "use strict";

        var data, query, prop;

        query = '#_' + areaId;
        data = jQuery(query).data('maphilight') || {};
        data.alwaysOn = true;

        for (prop in newdata) {
            if (newdata.hasOwnProperty(prop)) {
                data[prop] = newdata[prop];
            }
        }
        // console.log(data);

        jQuery(query).data('maphilight', data).trigger('alwaysOn.maphilight');
    },

    getAreaAnswers: function (areaId) {
        "use strict";

        return jQuery('#javatbd' + areaId + ' td input');
    },

    getAreaValue: function (areaId) {
        "use strict";

        var result = jQuery('#java' + areaId);

        if (result.length && ('' !== result.val())) {
            return result.val();
        }

        return null;
    },

    /**
     * Function for setting alt and title attributes.
     *
     * this is not the lsImageMapper but the DOM object that should be set
     */
    getTitle: function () {
        "use strict";

        return jQuery('#javatbd' + jQuery(this).attr('id').substr(1) + ' th.answertext')
            .text().replace(/^\s+/, '').replace(/\s+$/, '');
    },

    getValueIndex: function (value) {
        "use strict";

        var i, len;

        len = this.valuesUsed.length;
        for (i = 0; i < len; i = i + 1) {
            if (this.valuesUsed[i] === value) {
                return i;
            }
        }

        return null;
    },

    getValueNext: function (value) {
        "use strict";

        var i = this.getValueIndex(value);
        if (null === i) {
            return this.valuesUsed[0];
        }

        i = i + 1;
        if (i === this.valuesUsed.length) {
            return this.valuesUsed[0];
        }

        if (this.valuesUsed[i]) {
            return this.valuesUsed[i];
        }

        return this.valuesUsed[0];
    },

    loadAll: function () {
        "use strict";

        // Read the defined area id's from their alt attributes
        var answerElements, areaCount, areaIds, cellClick, i, inputClick,
            rowHoverIn, rowHoverOut, thisMapper, valueCount;

        thisMapper = this;
        areaIds = jQuery('area', this.element).map(function () {
            return this.getAttribute('id').substr(1); // Remove leading _
        });
        areaCount = areaIds.length;

        // Stop if none were found
        if (0 === areaCount) {
            window.alert('No areas found for the image mapper.');
            return;
        }

        // Get the possible values from the first question
        answerElements = this.getAreaAnswers(areaIds[0]);
        this.valuesUsed = answerElements.map(function () {
            return this.getAttribute('value');
        });
        valueCount = this.valuesUsed.length;

        // Stop if no answers where found
        if (0 === valueCount) {
            window.alert('No answers found for the image mapper.');
            return;
        }

        // The legend to the display colors
        if (this.options.colorLegend) {
            jQuery('#javatbd' + areaIds[0]).parent().parent().find('thead th').map(function () {
                var $this, newdata, text, value;

                $this = jQuery(this);
                text  = $this.text();
                value = $this.attr('id').split('-')[1];

                if (thisMapper.options.answerDisplays[value]) {
                    newdata = thisMapper.options.answerDisplays[value];
                } else {
                    newdata = thisMapper.options.defaultDisplay;
                }

                // Fill color
                if (true === newdata.fill) {
                    thisMapper.setCssOpacity($this, 'background-color', newdata.fillColor, newdata.fillOpacity);
                }

                // Border
                if (true === newdata.stroke) {
                    $this.css('border-style', 'solid');
                    if (newdata.strokeWidth) {
                        $this.css('border-width', newdata.strokeWidth);
                    }
                    thisMapper.setCssOpacity($this, 'border-color', newdata.strokeColor, newdata.strokeOpacity);
                }
            });
        }


        // console.log(areaIds, this.valuesUsed);

        // Set defaults
        if ((null !== this.options.defaultValue) && this.valuesUsed.has(this.options.defaultValue)) {
            for (i = 0; i < areaCount; i = i + 1) {
                if (null === this.getAreaValue(areaIds[i])) {
                    this.setAreaValue(areaIds[i], this.options.defaultValue);
                }
            }
        }

        // Start maphilight
        jQuery('img[usemap=#' + this.element.attr("id") + ']').maphilight({});

        // Program the child activites
        jQuery('area', this.element)
            .attr('alt', this.getTitle)
            .attr('title', this.getTitle)
            .hover(function() {
                var areaId = jQuery(this).attr('id').substr(1);

                thisMapper.addAreaData(areaId, thisMapper.options.highlightArea);
                jQuery('#javatbd' + areaId).css('background-color', thisMapper.options.highlightQuestion);
            }, function() {
                var areaId = jQuery(this).attr('id').substr(1);

                thisMapper.setAreaDisplay(areaId);
                jQuery('#javatbd' + areaId).css('background-color', '');
            }).click(function() {
            var areaId, next, value;

            areaId = jQuery(this).attr('id').substr(1);
            value  = thisMapper.getAreaValue(areaId);
            next   = thisMapper.getValueNext(value);

            thisMapper.setAreaValue(areaId, next);
            thisMapper.setAreaDisplay(areaId);

            // Make sure the map does not scroll
            return false;
        });


        // Handle changes when the user clicks on the questions
        //
        // Make functions here, not in the loop
        rowHoverIn = function () {
            var areaId = jQuery(this).attr('id').substr(7);
            thisMapper.addAreaData(areaId, thisMapper.options.highlightArea);
        };
        rowHoverOut = function () {
            var areaId = jQuery(this).attr('id').substr(7);
            thisMapper.setAreaDisplay(areaId);
        };
        cellClick = function () {
            var areaId = jQuery('input', this).attr('name');
            thisMapper.setAreaDisplay(areaId);
        };
        inputClick = function () {
            var areaId = this.getAttribute('name');
            thisMapper.setAreaDisplay(areaId);
        };
        for (i = 0; i < areaCount; i = i + 1) {
            this.setAreaDisplay(areaIds[i]);

            jQuery('#javatbd' + areaIds[i]).hover(rowHoverIn, rowHoverOut);
            jQuery('#javatbd' + areaIds[i] + ' td').click(cellClick);
            jQuery('#javatbd' + areaIds[i] + ' td input').click(inputClick);
            jQuery('#javatbd' + areaIds[i] + ' td input').change(inputClick);
        }

        if (true === this.options.hideAnswers) {
            $(this.element).closest('.question-container').find('table.ls-answers').hide();
        }
    },

    setAreaDisplay: function (areaId) {
        "use strict";

        var newdata, value;

        value = this.getAreaValue(areaId);
        console.log(areaId, value);
        
        if (this.options.answerDisplays[value]) {
            newdata = this.options.answerDisplays[value];
        } else {
            newdata = this.options.defaultDisplay;
        }

        this.addAreaData(areaId, newdata);
    },

    setAreaValue: function (areaId, value) {
        "use strict";

        // console.log(value);

        // Set the hidden element
        jQuery('#java' + areaId).val(value);

        // Set the input element and communicate action
        jQuery('#answer' + areaId + '-' + value).attr('checked', true).click();
        
        jQuery('#answer' + areaId + '-' + value).change();
    },

    setCssOpacity: function (jq, attr, color, opacity) {
        "use strict";

        var b, g, r;

        if (color) {
            jq.css(attr, '#' + color);

            if (opacity && jQuery.support.opacity) {
                r = parseInt(color.substring(0, 2), 16);
                g = parseInt(color.substring(2, 4), 16);
                b = parseInt(color.substring(4, 6), 16);

                jq.css(attr, 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')');
            }
        }
    },

    valuesUsed: null
});
