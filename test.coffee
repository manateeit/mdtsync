fs.writeFile config.backupLocation + "/" + filename, JSON.stringify(snapshot.exportVal()), (err) ->
        if err
          console.log err
        else
          console.log "The backup was saved! " + filename