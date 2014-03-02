'use strict';

function selectSource(source) {
    $('.content').html('LOADING...');
    $.ajax({
        url: 'sources/' + source + '.source',
        success: function(rawCode) {
            brushCode(rawCode);
            setCodeBlock(1, 10, 'Object jQuery');
        }
    });
}

function brushCode(rawCode) {
    $('.content').html('<pre class="brush:js">' + rawCode + '</pre>');
    SyntaxHighlighter.defaults['quick-code'] = false;
    SyntaxHighlighter.highlight();
}

function setCodeBlock(startline, endline, title) {
    $('.code .line.number' + startline).before('<h1><a data-toggle="collapse" data-target="#test" href="#">' + title + '</a></h1>');
    $('.code .line.number' + startline).nextUntil('.code .line.number' + endline).andSelf().wrapAll('<div id="test" class="panel-collapse collapse"></div>');
    $('#test').collapse();
}

$('a[data-source="jQuery-1.11.0"]').click(function() {
    selectSource('jquery-1.11.0');
});

$('a[data-source="jQuery-1.10.2"]').click(function() {
    selectSource('jQuery-1.10.2');
});