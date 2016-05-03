var Firebase = require('firebase');
var elasticsearch = require('elasticsearch');
var fs = require('fs');

var config = {
    firebaseUrl: 'https://mdtbackoffice.firebaseio.com/PRODUCTION/',
    elasticSearchUrl: 'http://104.236.34.233:9200',
    index: 'mdt',
    type: 'minIn'
}
var rootRef = new Firebase(config.firebaseUrl);

var client = new elasticsearch.Client({
    host: config.elasticSearchUrl
});

client.search({
    index: config.index,
    type : config.type,
    body:{
    "query": 
        {
            "match_all": {}
        }
    }, function(err, resp){
        if (err) {
            console.log(err);
        } else {
            console.log(resp);
        }
        
    }
    
})