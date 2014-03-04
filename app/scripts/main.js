'use strict';

$('a[data-source="jQuery-1.11.0"]').click(function() {
    selectAndBrushCode('jquery-1.11.0');
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
        'data-toggle': 'collapse',
        'data-target': '.' + block.blockId,
        'href': 'javascript:void(0)',
        'id': block.blockId,
        on: {
            click: function() {
                if ($('#toggle_' + block.blockId).children().html() === '+') {
                    $('#toggle_' + block.blockId).children().html('-');
                } else if ($('#toggle_' + block.blockId).children().html() === '-') {
                    $('#toggle_' + block.blockId).children().html('+');
                }
                $('body').scrollspy('refresh');
            }
        }
    }).append('<' + block.level + '>' + block.title + '</' + block.level + '>');

    var $toggle = $title.clone().attr('id', 'toggle_' + block.blockId);


    var $wrapper = $('<div></div>').addClass('panel-collapse collapse ' + block.blockId);

    if (block.endline) {
        $toggle.children().html('-');
        $('.code .line.number' + block.startline).before($title)
            .nextUntil('.code .line.number' + (block.endline + 1)).andSelf().wrapAll($wrapper);
        $('.gutter .line.number' + block.startline).before($toggle)
            .nextUntil('.gutter .line.number' + (block.endline + 1)).andSelf().wrapAll($wrapper);
        $('.' + block.blockId).collapse();
    } else {
        $toggle.children().html('*');
        $('.code .line.number' + block.startline).before($title);
        $('.gutter .line.number' + block.startline).before($toggle);
    }

    //setup menu
    $('#menu ul').append('<li><a href="#' + block.blockId + '"><' + block.level + '>' + block.title + '</' + block.level + '></a></li>');

    //handle color
    //$('.gutter .line.number' + startline).nextUntil('.gutter .line.number' + endline).andSelf().css('background', 'red');
}