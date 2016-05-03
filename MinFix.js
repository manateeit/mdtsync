var Firebase = require('firebase');
var elasticsearch = require('elasticsearch');
var fs = require('fs');
 
var config = {
    firebaseUrl:'https://mdtbackoffice.firebaseio.com/',
    elasticSearchUrl: 'http://104.236.34.233:9200',
    index: 'mdt',
    type: 'materialIn',
    firebaseSecret: "vrafT0iQZqNflNPXvzGOCHz7zZOfmtqHdBECR8UY",
}
var rootRef = new Firebase(config.firebaseUrl);
 
var client = new elasticsearch.Client({
    host: config.elasticSearchUrl
});
 
var fbPROD = rootRef.child('PRODUCTION');
var fbDEV = rootRef.child('DEVELOPMENT');
var fbminPROD = fbPROD.child('materialIn');
var fbminDEV = fbDEV.child('materialIn');
rootRef.authWithCustomToken(config.firebaseSecret, function(err){
    if (err) {
        console.log(err);
    }
});



 fbminPROD.once('value', function upsert(snapshot){
    snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key();
        var materialIn = childSnapshot.val()
        if (typeof materialIn.contact.id == 'number') {
            delete materialIn.contact.id
            materialIn.contact.id = childSnapshot.val().contact.id.toString();
            console.log("MaterialIn : " + key + " is now a " + typeof materialIn.contact.id)
        }
        fbminDEV.child(childSnapshot.key()).set(materialIn, function (err){ 
           // console.log("Saving materialIn "+ childSnapshot.key());
            if (err){
                console.log(err)
            }
        })
        
    });
});

 
 

