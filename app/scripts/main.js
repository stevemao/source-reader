'use strict';

$('a[data-source="jQuery-1.11.0"]').click(function() {
    selectAndBrushCode('jquery-1.11.0');
});

function selectAndBrushCode(source) {
    $('.content').html('LOADING...');
    var blocks;
    $.when(
        $.ajax({
            url: 'sources/' + source + '.source',
            success: function(rawCode) {
                brushCode(rawCode);
            }
        }), $.ajax({
            url: 'json/' + source + '-helpers.json',
            success: function(sourceHelpers) {
                blocks = sourceHelpers.blocks;
            }
        })
    ).
    then(function() {
        blocks.forEach(function(block) {
            setCodeBlock(block.startline, block.endline, block.collapseFrom, block.collapseTo, block.title, block.collapseId);
        });
    });
}

function brushCode(rawCode) {
    var encodedCode = htmlEncode(rawCode);
    $('.content').html('<pre class="brush:js">' + encodedCode + '</pre>');
    SyntaxHighlighter.defaults['quick-code'] = false;
    SyntaxHighlighter.highlight();
}

function htmlEncode(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

function setCodeBlock(startline, endline, collapseFrom, collapseTo, title, collapseId) {
    //handle collapse
    $('.code .line.number' + collapseFrom).before('<h1><a data-toggle="collapse" data-target=".' + collapseId + '" href="#">' + title + '</a></h1>')
        .nextUntil('.code .line.number' + collapseTo).andSelf().wrapAll('<div class="panel - collapse collapse ' + collapseId + '"></div>');
    $('.gutter .line.number' + collapseFrom).before('<h1><a data-toggle="collapse" data-target=".' + collapseId + '" href="#">-</a></h1>')
        .nextUntil('.gutter .line.number' + collapseTo).andSelf().wrapAll('<div class="panel-collapse collapse ' + collapseId + '"></div>');
    $('.' + collapseId).collapse();

    //handle color
    //$('.gutter .line.number' + startline).nextUntil('.gutter .line.number' + endline).andSelf().css('background', 'red');
}