'use strict';
var time = 0;
$('a[data-source="jQuery-1.11.0"]').click(function() {
    selectAndBrushCode('jquery-1.11.0');
    time = Date.now();
});

function selectAndBrushCode(source) {
    $('.content').html('LOADING...');
    $('#menu ul').html('');
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
    )
        .then(function() {
            blocks.forEach(function(block) {
                setCodeBlock(block);
            });
            $('body').scrollspy({
                target: '#menu'
            });
            var finishTime = Date.now();
            console.log(finishTime - time);
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

function setCodeBlock(block) {
    //handle collapse
    var $title = $('<a></a>', {
        'href': '#' + block.title,
        'id': block.title,
    }).append('<' + block.level + '>' + block.title + '</' + block.level + '>');

    var $toggle = $title.clone().attr('id', 'toggle_' + block.title);

    $toggle.children().html('*');
    $('.code .line.number' + block.startline).before($title);
    $('.gutter .line.number' + block.startline).before($toggle);

    //setup menu
    $('#menu ul').append('<li><a href="#' + block.title + '"><' + block.level + '>' + block.title + '</' + block.level + '></a></li>');

    //handle color
    //$('.gutter .line.number' + startline).nextUntil('.gutter .line.number' + endline).andSelf().css('background', 'red');
}