/*
 * Make the help-content clickable
 */
function GT_clickableSurveyQuestionHelp(find)
{
    $(find).click(function () {
        $('.help-content', this).toggle();
    });
    $(find + ' .help-content').hide();
}


/*
 * The function focusFirst puts the Focus on the first non-hidden element in the Survey.
 *
 * Normally this is the first input field (the first answer).
 */
function GT_focusFirst()
{
	var i=0;
	// count up as long as the elements are hidden
	while(document.forms[0].elements[i].type == "hidden" &&
		document.forms[0].elements[i].style.visibility == 'visible')
	{
		i++;
	}
	// put focus on the element we just counted.
	if (document.forms[0].elements[i].type == "hidden" &&
		document.forms[0].elements[i].style.visibility == 'visible')
	{
		document.forms[0].elements[i].focus();
	}
	return;
}

function GT_hideMarkedOptions()
{
    /**
     * HIDE ANSWER OPTIONS WITH LABEL STARTING WITH hideChars
     */
    var hideChars  = '-/-';
    var hideLength = hideChars.length;

    // radio and checkboxes
    $('.hide-marked-options .ls-answers.radio-list, .hide-marked-options .ls-answers.checkbox-list')
        .find('label.radio-label, label.checkbox-label')
        .filter(function() {
            return hideChars == $(this).text().replace(/\s/gm,"").substr(0, hideLength);
        })
        .each(function() {
            $(this).closest('.answer-item').hide();
        });

    // dropdown
    $('.hide-marked-options .list-dropdown')
        .find('.hide-marked-options .dropdown-item option')
        .filter(function() {
            return hideChars == $(this).text().replace(/\s/gm,"").substr(0, hideLength);
        })
        .each(function() {
            $(this).remove();
        });

    // Subquestion rows
    $('.hide-marked-options .answertext')
        .filter(function() {
            return hideChars == $(this).text().replace(/\s/gm,"").substr(0, hideLength);
        })
        .each(function() {
            $(this).parent().hide();
        });

    // Array columns headers
    $('.hide-marked-options .answer-text')
        .filter(function() {
            return hideChars == $(this).text().replace(/\s/gm,"").substr(0, hideLength);
        })
        .each(function() {
            $(this).hide();
        });
    // Array columns items
    $('.hide-marked-options .answer-item')
        .filter(function() {
            return hideChars == $(this).text().replace(/\s/gm,"").substr(0, hideLength);
        })
        .each(function() {
            $(this).hide();
        });

    // Array columns other type?
    $('.hide-marked-options .subquestion-list .question-item')
        .filter(function() {
            console.log($(this).text().replace(/\s/gm,"").substr(0, hideLength), hideChars == $(this).text().replace(/\s/gm,"").substr(0, hideLength));
            return hideChars == $(this).text().replace(/\s/gm,"").substr(0, hideLength);
        })
        .each(function() {
            var currentElement = $(this);
            var index          = $('.subquestion-list .question-item').index(currentElement);
            var answerRows = currentElement.closest('table').find('tbody .answers-list');
            answerRows.each(function(e) {
                $(this).find('td.answer-item:eq('+ index +')').hide();
            });
            var cols = currentElement.closest('table').find('colgroup');
            cols.each(function() {
                $(this).find('col:eq('+ index +')').hide();
            });
            currentElement.hide();
        });
}

function GT_saveAjax(e, afterSaveUrl)
{
    if (e) {
        e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
    }
    // console.log(e);
    
    $(e).css('cursor','wait');
    $('html,body').css('cursor','wait');

    var saveUrl = $("#limesurvey").attr('action');
    var data    = $('#limesurvey').serialize() + "&saveall=saveall";

    $.ajax({
        url: saveUrl,
        cache: false,
        type: "POST",
        data: data,
        success: function (response) {
            var data = $(response);
            var csrf = data.find("#limesurvey input[name=LEMpostKey]");
            // console.log(csrf);
            if (csrf) {
//                console.log($("#limesurvey input[name=LEMpostKey]").attr('value'));
//                console.log(csrf.attr('value'));
                /// expression manager post key needed to keep data OK
                var orig = $("#limesurvey input[name=LEMpostKey]");
                if (orig) {
                    orig.attr('value', csrf.attr('value'));
                }
            }
            // console.log('saved');
        },
        error: function () {
            console.log('error');
        }
    }).done(function () {
        // Clean up optional wiat cursor
        $('html,body').css('cursor','default');
        //trigger any doc ready scripts we may have just loaded
        $.ready();
        
        if (afterSaveUrl)  {
            window.location.href = afterSaveUrl;
        }
        // console.log('done');
    }); // */

    setTimeout(function() {
        $(e).css('cursor','default');
        $('html,body').css('cursor','default');
    }, 600);

    return false;
}

$(document).on('ready pjax:scriptcomplete', function() {
    // Implement tabs per group
    // if ($('#tabs').length > 0) {
    //     $("#tabs").tabs();
    // }
    
    if ($('.hide-tip-click').length > 0) {
        GT_clickableSurveyQuestionHelp('.hide-tip-click.text-info');
    }
    if ($('.hide-help').length > 0) {
        GT_clickableSurveyQuestionHelp('.hide-help .ls-questionhelp');
    }
    
    // HIDE ANSWER OPTIONS WITH LABEL STARTING WITH hideChars
    if ($('.hide-marked-options').length > 0) {
        GT_hideMarkedOptions();
    }
    
    if ($('.select-all-buttons .subquestion-list').length > 0) {
        $('.select-all-buttons .subquestion-list').radioMaster({
            masters: 'thead th'
        });
    }
    
    GT_focusFirst();
});


!function(t,i){"function"==typeof define&&define.amd?define(["jquery"],i):i(t.jQuery)}(this,function(d){var l,c,f,p,u,g,m,e,v,w,y;if(c=!!document.createElement("canvas").getContext,l=function(){var t=document.createElement("div");t.innerHTML='<v:shape id="vml_flag1" adj="1" />';var i=t.firstChild;return i.style.behavior="url(#default#VML)",!i||"object"==typeof i.adj}(),c||l){if(c){e=function(t){return Math.max(0,Math.min(parseInt(t,16),255))},v=function(t,i){return"rgba("+e(t.substr(0,2))+","+e(t.substr(2,2))+","+e(t.substr(4,2))+","+i+")"},f=function(t){var i=d('<canvas style="width:'+d(t).width()+"px;height:"+d(t).height()+'px;"></canvas>').get(0);return i.getContext("2d").clearRect(0,0,d(t).width(),d(t).height()),i};function b(t,e,a,o,r){if(o=o||0,r=r||0,t.beginPath(),"rect"==e)t.rect(a[0]+o,a[1]+r,a[2]-a[0],a[3]-a[1]);else if("poly"==e)for(t.moveTo(a[0]+o,a[1]+r),i=2;i<a.length;i+=2)t.lineTo(a[i]+o,a[i+1]+r);else"circ"==e&&t.arc(a[0]+o,a[1]+r,a[2],0,2*Math.PI,!1);t.closePath()}p=function(t,i,e,a,o){var r=t.getContext("2d");if(a.shadow){r.save(),"inside"==a.shadowPosition&&(b(r,i,e),r.clip());var s=100*t.width,n=100*t.height;b(r,i,e,s,n),r.shadowOffsetX=a.shadowX-s,r.shadowOffsetY=a.shadowY-n,r.shadowBlur=a.shadowRadius,r.shadowColor=v(a.shadowColor,a.shadowOpacity);var h=a.shadowFrom;h||(h="outside"==a.shadowPosition?"fill":"stroke"),"stroke"==h?(r.strokeStyle="rgba(0,0,0,1)",r.stroke()):"fill"==h&&(r.fillStyle="rgba(0,0,0,1)",r.fill()),r.restore(),"outside"==a.shadowPosition&&(r.save(),b(r,i,e),r.globalCompositeOperation="destination-out",r.fillStyle="rgba(0,0,0,1);",r.fill(),r.restore())}r.save(),b(r,i,e),a.fill&&(r.fillStyle=v(a.fillColor,a.fillOpacity),r.fill()),a.stroke&&(r.strokeStyle=v(a.strokeColor,a.strokeOpacity),r.lineWidth=a.strokeWidth,r.stroke()),r.restore(),a.fade&&d(t).css("opacity",0).animate({opacity:1},100)},u=function(t){t.getContext("2d").clearRect(0,0,t.width,t.height)}}else f=function(t){return d('<var style="zoom:1;overflow:hidden;display:block;width:'+t.width+"px;height:"+t.height+'px;"></var>').get(0)},p=function(t,i,e,a,o){var r,s,n,h;for(var l in e)e[l]=parseInt(e[l],10);r='<v:fill color="#'+a.fillColor+'" opacity="'+(a.fill?a.fillOpacity:0)+'" />',s=a.stroke?'strokeweight="'+a.strokeWidth+'" stroked="t" strokecolor="#'+a.strokeColor+'"':'stroked="f"',n='<v:stroke opacity="'+a.strokeOpacity+'"/>',"rect"==i?h=d('<v:rect name="'+o+'" filled="t" '+s+' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:'+e[0]+"px;top:"+e[1]+"px;width:"+(e[2]-e[0])+"px;height:"+(e[3]-e[1])+'px;"></v:rect>'):"poly"==i?h=d('<v:shape name="'+o+'" filled="t" '+s+' coordorigin="0,0" coordsize="'+t.width+","+t.height+'" path="m '+e[0]+","+e[1]+" l "+e.join(",")+' x e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:'+t.width+"px;height:"+t.height+'px;"></v:shape>'):"circ"==i&&(h=d('<v:oval name="'+o+'" filled="t" '+s+' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:'+(e[0]-e[2])+"px;top:"+(e[1]-e[2])+"px;width:"+2*e[2]+"px;height:"+2*e[2]+'px;"></v:oval>')),h.get(0).innerHTML=r+n,d(t).append(h)},u=function(t){var i=d("<div>"+t.innerHTML+"</div>");i.children("[name=highlighted]").remove(),d(t).html(i.html())};g=function(t){var i,e,a=(t.getAttribute("shape")||"rect").toLowerCase().substr(0,4);if("defa"!==a){for(e=(t.getAttribute("coords")||"").split(","),i=0;i<e.length;i++)e[i]=parseFloat(e[i]);return[a,e]}},y=function(t,i){var e=d(t);return d.extend({},i,!!d.metadata&&e.metadata(),e.data("maphilight"))},w=function(t){return!!t.complete&&(void 0===t.naturalWidth||0!==t.naturalWidth)};var t=!(m={position:"absolute",left:0,top:0,padding:0,border:0});d.fn.maphilight=function(h){return h=d.extend({},d.fn.maphilight.defaults,h),c||t||(d(window).ready(function(){document.namespaces.add("v","urn:schemas-microsoft-com:vml");var t=document.createStyleSheet();d.each(["shape","rect","oval","circ","fill","stroke","imagedata","group","textbox"],function(){t.addRule("v\\:"+this,"behavior: url(#default#VML); antialias:true")})}),t=!0),this.each(function(){var e,t,r,s,n,a,i;if(e=d(this),!w(this))return window.setTimeout(function(){e.maphilight(h)},200);if(r=d.extend({},h,!!d.metadata&&e.metadata(),e.data("maphilight")),(i=e.get(0).getAttribute("usemap"))&&(s=d('map[name="'+i.substr(1)+'"]'),e.is('img,input[type="image"]')&&i&&0<s.length)){if(e.hasClass("maphilighted")){var o=e.parent();e.insertBefore(o),o.remove(),d(s).unbind(".maphilight")}this.src.replace(/[\n\r]/g,""),t=d("<div></div>").css({display:"block",background:'url("'+this.src+'")',"background-size":"contain","background-repeat":"no-repeat",position:"relative",padding:0,width:this.width,height:this.height}),r.wrapClass&&(!0===r.wrapClass?t.addClass(d(this).attr("class")):t.addClass(r.wrapClass)),e.before(t).css("opacity",1e-10).css(m).remove(),l&&e.css("filter","Alpha(opacity=0)"),t.append(e),n=f(this),d(n).css(m),n.height=this.height,n.width=this.width,d(s).bind("alwaysOn.maphilight",function(){a&&u(a),c||d(n).empty(),d(s).find("area[coords]").each(function(){var t,i;if((i=y(this,r)).alwaysOn){if(!a&&c&&(a=f(e[0]),d(a).css(m),a.width=e[0].width,a.height=e[0].height,e.before(a)),i.fade=i.alwaysOnFade,!(t=g(this)))return;p(c?a:n,t[0],t[1],i,"")}})}).trigger("alwaysOn.maphilight").bind("mouseover.maphilight focusin.maphilight",function(t){var i,e,a=t.target;if(!(e=y(a,r)).neverOn&&!e.alwaysOn){if(!(i=g(a)))return;if(p(n,i[0],i[1],e,"highlighted"),e.groupBy){"string"==typeof e.groupBy&&(e.groupBy=[e.groupBy]);var o=d(this);d.each(e.groupBy,function(t,i){var e;e=/^[a-zA-Z][\-a-zA-Z]+$/.test(i)?s.find("area["+i+'="'+o.attr(i)+'"]'):s.find(i);var a=this;e.each(function(){if(this!=a){var t=y(this,r);if(!t.neverOn&&!t.alwaysOn){var i=g(this);p(n,i[0],i[1],t,"highlighted")}}})})}c||d(n).append("<v:rect></v:rect>")}}).bind("mouseout.maphilight focusout.maphilight",function(t){u(n)}),e.before(n),e.addClass("maphilighted")}})},d.fn.maphilight.defaults={fill:!0,fillColor:"000000",fillOpacity:.2,stroke:!0,strokeColor:"ff0000",strokeOpacity:1,strokeWidth:1,fade:!0,alwaysOn:!1,neverOn:!1,groupBy:!1,wrapClass:!0,shadow:!1,shadowX:0,shadowY:0,shadowRadius:6,shadowColor:"000000",shadowOpacity:.8,shadowPosition:"outside",shadowFrom:!1}}else d.fn.maphilight=function(){return this}});

jQuery.widget("ui.lsImageMapper", {
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
        highlightArea: null,
        highlightQuestion: '#A7A9D1'
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

        // The the legend to the display colors
        if (this.options.colorLegend) {
            jQuery('#javatbd' + areaIds[0]).parent().parent().find('thead th').map(function () {
                var $this, newdata, text, value;

                $this = jQuery(this);
                text  = $this.text();
                value = answerElements.filter('[title="' + text + '"]').val();

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
        }
    },

    setAreaDisplay: function (areaId) {
        "use strict";

        var newdata, value;

        value = this.getAreaValue(areaId);
        //console.log(areaId, value);

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
