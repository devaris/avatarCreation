var storeApi = {
    AVATAR_OPTIONS_URL:'store/avatar/default_options.json',
    getDefaultAvatarCreationOptions: function(cb){
        $.getJSON(this.AVATAR_OPTIONS_URL)
            .done(function (json) {
                console.log( 'Avatar default option JSON Data: ' + json);
                if(cb){
                    cb(null,json);
                }
                return json;
            })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ', ' + error;
                if(cb){
                    cb(err,jqxhr);
                }
                console.log( 'Request Failed: ' + err );
                return [];
            });
    }
};
