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
    var encodedCode = '';
    encodedCode = htmlEncode(rawCode);

    $('.content').html('<pre class="brush:js">' + encodedCode + '</pre>');
    SyntaxHighlighter.defaults['quick-code'] = false;
    SyntaxHighlighter.highlight();

}


function htmlEncode(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

function setCodeBlock(startline, endline, title) {
    $('.code .line.number' + startline).before('<h1><a data-toggle="collapse" data-target=".test" href="#">' + title + '</a></h1>');
    $('.gutter .line.number' + startline).before('<h1><a data-toggle="collapse" data-target=".test" href="#">-</a></h1>');
    $('.gutter .line.number' + startline).nextUntil('.gutter .line.number' + endline).andSelf().wrapAll('<div class="panel-collapse collapse test"></div>');
    $('.code .line.number' + startline).nextUntil('.code .line.number' + endline).andSelf().wrapAll('<div class="panel-collapse collapse test"></div>');

    $('.test').collapse();
}

$('a[data-source="jQuery-1.11.0"]').click(function() {
    selectSource('jquery-1.11.0');
});

$('a[data-source="jQuery-1.10.2"]').click(function() {
    selectSource('jquery-1.10.2');
});