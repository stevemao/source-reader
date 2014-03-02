'use strict';

$.ajax({
    url: 'sources/' + 'jQuery-1.11.0' + '.js',
    success: function(response) {
        $('pre').html(response);

    }
});
// $('a[data-source="jQuery-1.11.0"]').click(function() {
//     selectSource('jQuery-1.11.0');
// });

SyntaxHighlighter.all();