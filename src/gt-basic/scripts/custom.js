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
    var hideChars = '-/-';

    // radio and checkboxes
    $('.hide-marked-options .ls-answers.radio-list, .hide-marked-options .ls-answers.checkbox-list')
        .find('label.radio-label, label.checkbox-label')
        .filter(function() {
            return $(this).text().replace(/\s/gm,"").startsWith(hideChars);
        })
        .each(function() {
            $(this).closest('.answer-item').hide();
        });

    // dropdown
    $('.hide-marked-options .list-dropdown')
        .find('.hide-marked-options .dropdown-item option')
        .filter(function() {
            return $(this).text().replace(/\s/gm,"").startsWith(hideChars);
        })
        .each(function() {
            $(this).remove();
        });


    // Array rows
    $('.hide-marked-options .answertext')
        .filter(function() {
            return $(this).text().replace(/\s/gm,"").startsWith(hideChars);
        })
        .each(function() {
            $(this).closest('.answers-list').hide();
        });

    // Array cols
    $('.hide-marked-options .subquestion-list .question-item')
        .filter(function() {
            return $('label', this).text().replace(/\s/gm,"").startsWith(hideChars);
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
