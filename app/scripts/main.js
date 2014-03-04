'use strict';
var time = 0;
$('a[data-source="jQuery-1.11.0"]').click(function() {
    selectAndBrushCode('jquery-1.11.0');
    time = Date.now();
});

$('#filter').keyup(function(event) {
    var value = this.value;
    var $li = $('#menu li');
    $('#menu li').css('display', 'block').filter(function(index) {
        if ($(this).children().html().toUpperCase().indexOf(value.toUpperCase()) != -1) {
            return false;
        }
        return true;
    }).css('display', 'none');
});

function selectAndBrushCode(source) {
    $('.content').html('<pre>LOADING...</pre>');
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
            $('#rightBar').css('display', 'block');
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
    //remove special charactor
    var id = block.title.replace(/[^a-zA-Z0-9_]/g, '');
    var $title = $('<a></a>', {
        'href': '#' + id,
        'id': id,
    }).append('<' + block.style + '>' + block.title + '</' + block.style + '>');

    var $toggle = $title.clone().attr('id', 'toggle_' + block.title);

    $toggle.children().html('*');
    $('.code .line.number' + block.line).before($title);
    $('.gutter .line.number' + block.line).before($toggle);

    //setup menu
    $('#menu ul').append('<li><a href="#' + id + '"><' + block.style + '>' + block.title + '</' + block.style + '></a></li>');
}