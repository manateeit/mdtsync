var Fiiebase = require('firebase');
var elasticsearch = require('elasticsearch');
var fs = require('fs');
 
var config = {
    firebaseUrl:'https://mdtbackoffice.firebaseio.com/PRODUCTION/',
    elasticSearchUrl: 'http://mdt-es-01.mediathread.io:9200',
    index: 'material',
    type: 'In'
}
var rootRef = new Firebase(config.firebaseUrl);
 
var client = new elasticsearch.Client({
    host: config.elasticSearchUrl
});
 
var fqRef = rootRef.child('materialIn');
 
fqRef.on('child_added', upsert);
fqRef.on('child_changed', upsert);
fqRef.on('child_removed', remove);
 
function upsert(snapshot){
var snap = snapshot.val();
	if (snap.material.mr1 == undefined){
	  if (snap.material.MeltRange == undefined){
	   snap.material.MeltRange = "0-0"
	   snap.material.mr1 = 0;
           snap.material.mr2 = 0;
	  } else { 
	   var mr = snap.material.MeltRange;
	    var mr1  = mr.substr(0, mr.indexOf('-'));
        var mr2  = mr.substr(mr.indexOf('-') + 1, mr.length);
        var intmr1 = parseInt(mr1);
        var intmr2 = parseInt(mr2);
        snap.material.mr1 = intmr1;
        snap.material.mr2 = intmr2;
	  }
	
	}
 
    client.index({
        index: config.index,
        type: config.type,
        id: snapshot.key(),
        body: snap
    }, function(err, response){
        if(err){
            var dataError = snapshot.key() + ": " + snapshot.val().contact.id + " "+ err + "\n";
            fs.appendFile(config.type + ".error.txt", dataError, function(error) {
                if (error) {
                    return console.log(error);
                } else {
                    console.log("Error Indexing: " + snapshot.key());
                    
                }
            });
        }
        if (response) {	
            if (!err){
                //console.log("Indexing - ", snapshot.key() );
                var dataSuccess = snapshot.key() + ": " + snapshot.val().contact.id + "\n";
                fs.appendFile(config.type + ".success.txt", dataSuccess, function(err2) {
                if (err2) {
                    return console.log(err2);
                    } 
            });
                
            }
            
        }
    })
 
}
 
function remove(snapshot){
    client.delete({
        index: config.index,
        type: config.type,
        id: snapshot.key()
    }, function(error, response){
        if(error){
            console.log("Error deleting fq " + err);
        }
	if (response) {	
	    console.log("Respose:", response);
        }
    });
}
