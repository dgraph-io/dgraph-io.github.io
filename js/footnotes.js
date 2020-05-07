(function() {

    var $references = document.querySelector('.post__references');
    var $footnotes = document.querySelector('.post__content .footnotes');
    var $ol = document.querySelector('.post__content .footnotes ol');

    if ( $references && $footnotes && $ol ) {
        $references.appendChild($ol);
        $footnotes.remove();
    }

}());
