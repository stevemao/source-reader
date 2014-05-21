'use strict';

//test loading time
var time = 0,
    apiPrefix = '';

$.ajax({
    url: 'json/sources.json',
    success: function(sources) {
        var $selectSourceButton = $('#select-script');
        sources.forEach(function(source) {
            source.sourcesFiles.forEach(function(sourcefile) {
                var $source = $('<li></li>')
                    .append($('<a href="#"></a>')
                        .html(sourcefile.name + ' ' + sourcefile.version)
                        .attr('data-source', sourcefile.file));
                $('#select-script').next().append($source);
            });

            $selectSourceButton.next().append('<li class="divider"></li>');
        });

        $('ul li a[data-source]').click(function(event) {
            var $currentTarget = $(event.currentTarget);
            selectAndBrushCode($currentTarget.attr('data-source'));
            $selectSourceButton.html($currentTarget.html());
            time = Date.now();
        });

    }
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
                apiPrefix = sourceHelpers.apiPrefix;
                blocks = sourceHelpers.blocks;
            }
        })
    )
        .then(function() {
            $('#rightBar').css('display', 'block');
            blocks.forEach(function(block) {
                setCodeBlock(block);
                setBlockNote(block);
                setBlockApi(block);
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
    $('.content').html('<div id="source"><pre class="brush:js; toolbar: false;">' + encodedCode + '</pre></div>');
    $('.content').append('<div id="blockNotes"></div>');
    $('.content').append('<div id="apis"></div>')
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
    var id = toCamelCase(block.title);
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

function toCamelCase(string) {
    var newString = string.replace(/[^a-zA-Z0-9_]/g, '-');
    newString = $.camelCase(newString).replace(/-/g, '');
    return newString;
}

function setBlockNote(block) {
    if (block.dependencies) {

        var $blockNote = $('<div class="bg-info"></div>')
            .css('top', $('.code .line.number' + block.line).offset().top)
            .html('Dependencies:');
        block.dependencies.forEach(function(dependency) {
            var $link = $('<a></a>')
                .attr('href', '#' + toCamelCase(dependency))
                .append(dependency);
            var $dependency = $('<div></div>')
                .append($link);

            $blockNote.append($dependency);
        });

        $('#blockNotes').append($blockNote);
    }
}

function setBlockApi(block) {
    if (block.api) {
        var api = apiPrefix + block.api;
        var $api = $('<a>API</a>')
            .attr('href', api)
            .css('top', $('.code .line.number' + block.line).offset().top - 25)
            .attr('target', '_blank');
        $('#apis').append($api);
    }
}

// for filter
$('#filter').keyup(function() {
    var value = this.value;
    $('#menu li').css('display', 'block').filter(function() {
        if ($(this).children().html().toUpperCase().indexOf(value.toUpperCase()) !== -1) {
            return false;
        }
        return true;
    }).css('display', 'none');
});

$('.clear').click(function(event) {
    var clearTarget = $(event.currentTarget).attr('for');
    $('#' + clearTarget).val('');
    $('#' + clearTarget).trigger('keyup');
});