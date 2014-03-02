'use strict';

function selectSource(source) {
    $('.content').html('LOADING...');
    $.ajax({
        url: 'sources/' + source + '.js',
        success: function(rawCode) {
            var brushedCode = brushCode(rawCode);
            setCodeBlock(brushedCode);
        }
    });
}

function brushCode(rawCode) {
    $('.content').html('<pre class="brush:js">' + rawCode + '</pre>');
    SyntaxHighlighter.defaults['quick-code'] = false;
    SyntaxHighlighter.highlight();
    return $('.content').html();
}

function setCodeBlock(brushedCode) {
    $('.collapse').collapse();
}

$('a[data-source="jQuery-1.11.0"]').click(function() {
    selectSource('jQuery-1.11.0');
});

$('a[data-source="jQuery-1.10.2"]').click(function() {
    selectSource('jQuery-1.10.2');
});