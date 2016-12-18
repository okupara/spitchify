(function () {

  var getInfo = function() {
    var loc = window.location.href;
    var array = loc.split('/');
    array = array.filter(function(el) { return el !== '' });
    var no = array[array.length - 1].match(/[0-9]+/);
    no = Number(no);

    if (isNaN(no))
      return;
    
    var query = '#review-article-' + no;
    var artist = document.querySelector(query + ' h2.artists a');
    var title = document.querySelector(query + ' h1.review-title');
    if (!artist || !title) {
      return false;
    }
    window.postMessage({artist: artist.innerText, title: title.innerText}, "*");
    return true;
  }
  var timer = function() {
    var count = 0;
    var ID = -1;
    ID = setInterval(function() {
      var ret = getInfo();
      if (ret || count > 10) {
        clearInterval(ID);
      }
      count++;
    }, 300);
  }

  window.addEventListener('message', function (param) {
    var loc = window.location;
    var origin = loc.protocol + '//' + loc.host;
    if (param.origin !== origin)
      return;

    if (!param.data || param.data !== 'UPDATED')
      return;
    
    timer();
  });

  timer();
})(this);
