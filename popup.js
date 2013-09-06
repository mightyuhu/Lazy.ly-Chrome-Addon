App = Ember.Application.create();

App.Store = DS.Store.extend({
    revision : 12,
    adapter : DS.RESTAdapter.extend({
        url : 'http://lazy.ly'
        //namespace: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
    })
});

App.ShortLink = DS.Model.extend({
    hash : DS.attr('string'),
    url : DS.attr('string'),
    encrypted : DS.attr('boolean'),
    didCreate : function() {
        //TODO
    },
    becameError : function() {
        //TODO
    }
});


function makeKey(num) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < num; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


App.CurrentURL = Em.Object.create({
    encrypted : true,
    containsGenerated : false,
    passphrase : '',
    value : '',
    isValid : function() {
        var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return pattern.test(this.get('value'));
    },
    isSelf : function() {
        var patternself = /http:\/\/lazy.ly\/\w+/;
        return patternself.test(this.get('value'));
    }
});


function copyToClipboard( text ){
                var copyDiv = document.createElement('div');
                copyDiv.contentEditable = true;
                document.body.appendChild(copyDiv);
                copyDiv.innerHTML = text;
                copyDiv.unselectable = "off";
                copyDiv.focus();
                document.execCommand('SelectAll');
                document.execCommand("Copy", false, null);
                document.body.removeChild(copyDiv);
            }


makeUrl = function() {
chrome.tabs.query({'active': true}, function (tabs) {
  var url = tabs[0].url;
  var encrypt = true;

            var value, passphrase;
            if (!encrypt) {
                passphrase = '';
                value = url;
            } else {
                passphrase = makeKey(3);
                value = CryptoJS.AES.encrypt(url, passphrase);
            }
            var newUrl = App.ShortLink.createRecord({
                url : value,
                encrypted : App.CurrentURL.get('encrypted')
            });
            self = this;


            newUrl.one('didCreate', this, function() {
                var self = this;
                setTimeout(function() {
                    copyToClipboard("http://lazy.ly/"+newUrl.get('hash')+"#"+passphrase);
                    $('#url').text("http://lazy.ly/"+newUrl.get('hash')+"#"+passphrase);
                    $('#success').show();
                });
            });
            newUrl.get('store').commit();



    /*var req = new XMLHttpRequest();
    req.open("GET", this.searchOnFlickr_, true);
    req.onload = this.showPhotos_.bind(this);
    req.send(null);*/
    //alert('call');
    });
    //document.execCommand('copy')

  }

  makeUrl();