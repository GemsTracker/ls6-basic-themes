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
        masters: 'thead .ls-header th',
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
        var parents = 0;
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

        // Servants may be parent elements of radio buttons
        allServants = jQuery(this.options.servants, this.element);
        this.servants = allServants.find(':radio');

        if (this.masters.not(':radio').length && this.options.mastersCreate) {
            this.masters.map(function (i) {
                thisMaster.addMaster(this, i);
            });
        }
        // Clean up so only input masters remain
        this.masters = this.masters.parent().find(':radio');

        // Synchronize radio button values
        //
        // It is assumed that the first masters.length servants
        // contains the values of the masters
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

    addMaster: function (to, i) {
        "use strict";

        var index, $master;

        index = this.getIndex(this.servants.get(i));
        $master = jQuery(this.options.mastersCreate);
        if (index !== null) {
            console.log(index);
            $master.attr('name', this.options.mastersName + "_" + index);
        } else {
            $master.attr('name', this.options.mastersName);
        }
        if (null !== this.options.mastersTextColor) {
            jQuery(to).css('color', this.options.mastersTextColor);
        }

        if (this.options.mastersPrepend) {
            $master.prependTo(to);
        } else {
            $master.appendTo(to);
        }

        return this;
    },
    
    getIndex: function (elem) {
        // console.log(elem);
        var val = elem.value;
        var id = elem.id;
        
        if (! id) {
             id = elem.parentElement.id;
        }
        
        var match = id.match(".+_(\\d)-" + val + "$");
        
        // console.log(id, ".+_(\\d)-" + val + "$", match);
        if (match && match[1]) {
            return match[1];
        }
        
        return null;
    },

    mastersCheck: function () {
        "use strict";

        var $checked, $this, val;

        if (this.skipCheck) {
            return;
        }

        $this = this;
        this.masters.each(function (i) {
            var index, master, servants, val;
    
            master   = $this.masters.get(i);
            index    = $this.getIndex(master);
            val      = master.getAttribute('value');
            servants = $this.servants.filter('[value=' + val + ']');
            
            if (null !== index) {
                servants = servants.filter(function (i) {
                    return $this.getIndex(servants.get(i)) == index; 
                })    
                // console.log(index, val, servants.length, servants.filter(':checked').length);
            }
            
            // console.log('nothing selected');
            master.checked = (servants.length == servants.filter(':checked').length);
            // console.log(index, val, i);
        });
    },

    masterOn: function (master) {
        "use strict";

        var index, servants, val, $this;

        index = this.getIndex(master);
        val    = master.getAttribute('value');

        this.skipCheck = true;
        servants = this.servants.filter('[value="' + val + '"]');
        if (null !== index) {
            $this = this;
            servants = servants.filter(function (i) {
                return $this.getIndex(servants.get(i)) == index; 
            })    
            // console.log(servants);
        }
        
        servants.click()
        servants.change();
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
