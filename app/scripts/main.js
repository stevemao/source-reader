'use strict';

function selectSource(source) {
    $('.content').html('LOADING...');
    $.ajax({
        url: 'sources/' + source + '.source',
        success: function(rawCode) {
            brushCode(rawCode);
            //setCodeBlock(1, 10, 'Object jQuery');
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

// SyntaxHighlighter generates some extra tags at the end.
// todo: find out what causes this
function clearWrongTags(lastLine) {
    console.log(lastLine);
    $('.code .line.number9800').html('');
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
    selectSource('jquery-1.10.2');
});