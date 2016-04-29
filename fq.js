var Firebase = require('firebase');
var elasticsearch = require('elasticsearch');
 
var config = {
    firebaseUrl:'https://mdtbackoffice.firebaseio.com/PRODUCTION/',
    elasticSearchUrl: 'http://104.236.34.233:9200',
    index: 'mdt',
    type: 'frieghtQuotes'
}
var rootRef = new Firebase(config.firebaseUrl);
 
var client = new elasticsearch.Client({
    host: config.elasticSearchUrl
});
 
var fqRef = rootRef.child('frieghtQuotes2');
 
fqRef.on('child_added', upsert);
fqRef.on('child_changed', upsert);
fqRef.on('child_removed', remove);
 
function upsert(snapshot){
    client.index({
        index: config.index,
        type: config.type,
        id: snapshot.key(),
        body: snapshot.val()
    }, function(err, response){
        if(err){
            console.log("Error Indexing fq" + err);
        }
	if (response) {	
	    console.log("Respose:", response);
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
