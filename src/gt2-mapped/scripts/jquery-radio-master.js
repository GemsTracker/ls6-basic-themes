
/**
<script type="text/javascript" charset="utf-8">
//<![CDATA[
$(document).ready(function () {
    $('div#question{QID} table.subquestions-list').radioMaster({
        masters: 'thead th',
        mastersTextColor: '#FFFFFF'
    });
});
//]]>
</script>
 */
// Creating the widget
jQuery.widget("ui.radioMaster", {
    // default options
    options: {
        masters: 'thead th',
        mastersCreate: '<input type="radio" />',
        mastersName: null,
        mastersPrepend: false,
        mastersTextColor: null,
        servants: 'tbody'
    },

    _create: function () {
        "use strict";

        var allServants, count, i, thisMaster;

        var current = this.element;
        while (current && !this.options.mastersName) {
            if (current.attr('name')) {
                this.options.mastersName = current.attr('name') + '_masters';
            } else if (current.attr('id')) {
                this.options.mastersName = current.attr('id') + '_masters';
            }
            // console.log(current);
            current = current.parent();
        }

        thisMaster   = this;
        this.masters = jQuery(this.options.masters, this.element);

        if (this.masters.not(':radio').length && this.options.mastersCreate) {
            this.masters.map(function () {
                thisMaster.addMaster(this);
            });
        }
        // Clean up so only input masters remain
        this.masters = this.masters.parent().find(':radio');

        // Servants may be parent elements of radio buttons
        allServants = jQuery(this.options.servants, this.element);
        this.servants = allServants.find(':radio');

        // Synchronize radio button values
        //
        // It is assumed that the first masters.length servants
        // contain the values of the masters
        count = Math.min(this.masters.length, this.servants.length);
        for (i = 0; i < count; i = i + 1) {
            this.masters.eq(i).attr('value', this.servants.eq(i).attr('value'));
        }

        this.masters.click(function () {
            thisMaster.masterOn(this);
        });

        // Bind to the original parent elements
        //
        // as these may trigger change code that is otherwise
        // not propagated to this element.
        allServants.click(function () {
            thisMaster.servantCheck();
        });

        this.mastersCheck();
    },

    addMaster: function (to) {
        "use strict";

        var $master;

        $master = jQuery(this.options.mastersCreate);
        $master.attr('name', this.options.mastersName);
        if (null !== this.options.mastersTextColor) {
            jQuery(to).css('color', this.options.mastersTextColor);
        }

        // console.log(to, this.options.mastersCreate, $master);
        if (this.options.mastersPrepend) {
            $master.prependTo(to);
        } else {
            $master.appendTo(to);
        }

        return this;
    },

    mastersCheck: function () {
        "use strict";

        var $checked, val;

        if (this.skipCheck) {
            return;
        }

        // console.log('check master');
        
        $checked = this.servants.filter(':checked');
        if (0 === $checked.length) {
            // console.log('nothing selected');
            this.masters.prop('checked', false);
            return;
        }
        val = $checked.attr('value');
        if ($checked.filter('[value!="' + val + '"]').length) {
            // console.log('other value', this.masters);
            this.masters.prop('checked', false);
            return;
        }
        if ($checked.length !== this.servants.filter('[value="' + val + '"]').length) {
            // console.log('value unselected');
            this.masters.prop('checked', false);
            return;
        }

        // console.log('master selected');
        this.masters.filter('[value="' + val + '"]').prop('checked', true);
    },

    masterOn: function (master) {
        "use strict";

        var val;

        val = master.getAttribute('value');

        this.skipCheck = true;
        this.servants.filter('[value="' + val + '"]').click();
        this.skipCheck = false;
    },

    masters: null,

    servantCheck: function () {
        "use strict";

        if (this.skipCheck) {
            return;
        }

        this.mastersCheck();
    },

    servants: null,

    skipCheck: false
});
