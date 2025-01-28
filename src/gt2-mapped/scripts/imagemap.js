class ImageMapper {
    constructor(elementId, options = {
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
        highlightArea: null,
        highlightQuestion: '#A7A9D1'
    }) {


        this.options = options;
        this.answerOptions = [];
        this.answerRowStyles = [];
        if ('answerDisplays' in options) {
            this.answerOptions = Object.keys(options.answerDisplays);
        }

        if (null === this.options.highlightArea || undefined === this.options.highlightArea) {
            var highlightColor = '#A7A9D1';
            if ('highlightQuestion' in this.options) {
                highlightColor = this.options.highlightQuestion;
            }

            this.options.highlightArea = {
                fill: true,
                fillColor: highlightColor.substring(1), // Remove '#'
                fillOpacity: 0.75
            };
        }

        this.init(elementId);
    }

    getAreaAnswerOptions(areaId) {
        var areaElements = this.getAreaAnswerElements(areaId);
        var options = [];

        areaElements.each(function () {
            var value = $(this).attr('value');
            if (Number.isInteger(Number(value))) {
                value = parseInt(value);
            }
            options.push(value);
        });

        return options;
    }

    getAreaAnswerElements(areaId) {        
        return $('#javatbd' + areaId.substring(1) + ' td input');
    }

    getAreaValue(areaId) {
        var hiddenInput = $('#java' + areaId.substring(1));

        if (hiddenInput.length) {
            if ('' !== hiddenInput.val()) {
                return hiddenInput.val();
            }
        }

        return null;
    }

    getCurrentData(areaId) {
        var data = $('#' + areaId).data('maphilight') || {};

        var currentClass = this;
        var currentValue = this.getAreaValue(areaId);
        var defaultDisplay = this.options.defaultDisplay;

        if (currentValue === null) {
            var groupSelector = this.getGroupSelector(areaId);
            $(groupSelector).each(function () {
                currentValue = currentClass.getAreaValue($(this).attr('id'));
                if (currentValue !== null) {
                    return false;
                }
            });
        }

        if (currentValue in this.options.answerDisplays) {
            var answerDisplay = this.options.answerDisplays[currentValue];
            data.alwaysOn = true;
            return { ...data, ...defaultDisplay, ...answerDisplay };
        }

        return { ...data, ...defaultDisplay };
    }

    getDefaultData(areaId) {
        var data = $('#' + areaId).data('maphilight') || {};
        var defaultDisplay = this.options.defaultDisplay;
        return { ...data, ...defaultDisplay };
    }

    getGroupSelector(areaId) {
        var areaTagSettings = $('#' + areaId).attr('data-maphilight');
        if (areaTagSettings) {
            var areaTagSettings = JSON.parse(areaTagSettings);
            if ('groupBy' in areaTagSettings) {
                return areaTagSettings.groupBy;
            }
        }
        return null;
    }

    getHoverData(areaId) {
        var data = $('#' + areaId).data('maphilight') || {};
        var hoverData = this.options.highlightArea;
        console.log({ ...data, ...hoverData });
        return { ...data, ...hoverData };
    }

    init(elementId) {

        // Start mapHighlight on the linked imageElement
        var imageElement = $('img[usemap="#' + elementId + '"]');
        imageElement.maphilight(this.options.defaultDisplay);

        var answerOptionsLoaded = false;

        var firstAreaId = null;

        var currentClass = this;
        $('#' + elementId + ' area').each(function () {
            var areaElement = $(this);
            var areaId = areaElement.attr('id');
            if (firstAreaId === null) {
                firstAreaId = areaId;
            }

            if (!answerOptionsLoaded) {
                this.answerOptions = currentClass.getAreaAnswerOptions(areaId);
                answerOptionsLoaded = true;
            }

            if ('initialAreaSettings' in currentClass.options && areaId in currentClass.options.initialAreaSettings) {
                var initData = currentClass.options.initialAreaSettings[areaId];
                areaElement.attr('data-maphilight', JSON.stringify(initData));
            }

            var areaData = currentClass.getDefaultData(areaId);
            currentClass.setDisplayData(areaId, areaData);

            areaElement.click(function (e) {
                e.preventDefault();

                currentClass.setNextValue(areaId);
            });

            areaElement.hover(function (e) {
                var areaData = currentClass.getHoverData(areaId);
                currentClass.setDisplayData(areaId, areaData);
                currentClass.setAnswerRowStyle(areaId, areaData);
            }, function (e) {
                var areaData = currentClass.getCurrentData(areaId);
                currentClass.setDisplayData(areaId, areaData);
                currentClass.setAnswerRowStyle(areaId, null);
            });

            areaElement.mouseover().mouseout();

            $('input[name=' + areaId.substring(1) + ']').change(function () {
                // Limesurvey does this! please disable!
                var hiddenInput = $('#java' + areaId.substring(1));
                hiddenInput.val($(this).val());
                // 
                currentClass.setDisplayData('_' + $(this).attr('name'));
            });

            var rowElement = $('#javatbd' + areaId.substring(1));
            currentClass.answerRowStyles[areaId] = {
                backgroundColor: rowElement[0].style.backgroundColor,
            };
            rowElement.hover(function(e) {
                var areaData = currentClass.getHoverData(areaId);
                currentClass.setDisplayData(areaId, areaData);
                currentClass.setAnswerRowStyle(areaId, areaData);
            }, function (e) {
                var areaData = currentClass.getCurrentData(areaId);
                currentClass.setDisplayData(areaId, areaData);
                currentClass.setAnswerRowStyle(areaId, null);
            });
            
        });

        if ('hideAnswers' in this.options && this.options.hideAnswers === true) {
            $('#' + elementId).closest('.question-container').find('table.ls-answers').hide();
        }
        this.setTableLegend(firstAreaId);
        this.setTableColumnRadioSelector(firstAreaId);
    }

    setAnswerRowStyle(areaId, areaData) {
        var rowElement = document.getElementById('javatbd' + areaId.substring(1));
        if (areaData && 'fillColor' in areaData) {
            rowElement.style.backgroundColor = '#' + areaData.fillColor;
            return;
        }

        if (areaData === null && areaId in this.answerRowStyles && 'backgroundColor' in this.answerRowStyles[areaId] && this.answerRowStyles[areaId].backgroundColor !== '') {
            rowElement.style.backgroundColor = this.answerRowStyles[areaId].backgroundColor;
            return null;
        }

        rowElement.style.backgroundColor = null;
        
    }

    setGroupedNextValues(areaId) {

        var groupSelector = this.getGroupSelector(areaId);

        if (groupSelector) {
            var currentClass = this;
            $(groupSelector).each(function () {
                if ($(this).attr('id') === areaId) {
                    return;
                }
                currentClass.setNextValue($(this).attr('id'));
            });
        }
    }

    setNextValue(areaId) {
        const answersElements = true;

        var currentValue = this.getAreaValue(areaId);

        var currentIndex = 0;

        if (this.answerOptions.includes(currentValue)) {
            currentIndex = this.answerOptions.indexOf(currentValue);
        }

        var nextIndex = currentIndex + 1;
        if (nextIndex >= this.answerOptions.length) {
            nextIndex = 0;
        }
        var nextValue = this.answerOptions[nextIndex];
        var hiddenInput = $('#java' + areaId.substring(1));
        hiddenInput.val(nextValue);

        var answerId = 'answer' + areaId.substring(1) + '-' + nextValue;

        $('label[for="' + answerId + '"]')[0].click();
    }

    setDisplayData(areaId, data = null) {
        if (data === null) {
            data = this.getCurrentData(areaId);
        }
        // console.log('set display', data, areaId);
        $('#' + areaId).data('maphilight', data).trigger('alwaysOn.maphilight');

        var groupSelector = this.getGroupSelector(areaId);
        if (groupSelector !== null) {
            $(groupSelector).each(function () {
                var groupAreaId = $(this).attr('id');
                $('#' + groupAreaId).data('maphilight', data).trigger('alwaysOn.maphilight');
            });
        }
    }

    setTableColumnRadioSelector(areaId) {
        // The the legend to the display colors
        var currentClass = this;
        var areaRow = $('#javatbd' + areaId.substring(1));
        if (this.options.columnRadioSelector) {

            var questionId = areaRow.closest('div.question-container').attr('id');
            areaRow.closest('table').find('thead th').map(function (index) {

                var headerElement = $(this);
                var headerText = headerElement.text().trim();

                var answerElements = currentClass.getAreaAnswerElements(areaId);
                var answerElement = answerElements[index];

                var value = answerElement.getAttribute('value');

                headerElement.html('<label>' + headerText + ' <input type="radio" name="' + questionId + '_masters" value="' + value + '"/></label>');
            });

            $('input[name="' + questionId + '_masters"').change(function () {
                var index = $(this).parent().parent().index();
                var value = $(this).val();

                areaRow.parent().find('.answers-list').each(function() {
                    $(this).find('input[value="' + value + '"').click();
                });
            });
        }
    }

    setTableLegend(areaId) {
        // The the legend to the display colors
        var currentClass = this;
        if (this.options.colorLegend) {
            $('#javatbd' + areaId.substring(1)).closest('table').find('thead th').map(function (index) {

                var headerElement = $(this);

                var answerElements = currentClass.getAreaAnswerElements(areaId);
                var answerElement = answerElements[index];

                var value = answerElement.getAttribute('value');

                if (currentClass.options.answerDisplays[value]) {
                    var newdata = currentClass.options.answerDisplays[value];
                } else {
                    var newdata = currentClass.options.defaultDisplay;
                }

                // Fill color
                if (true === newdata.fill) {
                    currentClass.setCssOpacity(headerElement, 'background-color', newdata.fillColor, newdata.fillOpacity);
                }

                // Border
                if (true === newdata.stroke) {
                    headerElement.css('border-style', 'solid');
                    if (newdata.strokeWidth) {
                        headerElement.css('border-width', newdata.strokeWidth);
                    }
                    currentClass.setCssOpacity(headerElement, 'border-color', newdata.strokeColor, newdata.strokeOpacity);
                }
            });
        }
    }

    setCssOpacity(jq, attr, color, opacity) {
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
    }
}