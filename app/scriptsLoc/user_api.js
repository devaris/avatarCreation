var userApi = {
    GET_AUTHENTICATED_USER_URL: "/api/user/authenticated.json",
    GET_AUTHENTICATED_USER_AVATAR_URL: "/api/user/avatar.json",
    SAVE_AVATAR_URL: "/api/user/avatar/save",
    getAuthenticatedUser: function(cb){
        var error = null;
        if(cb){
            $.getJSON(this.GET_AUTHENTICATED_USER_URL)
                .done(function (json) {
                    console.log( 'Authenticated user JSON Data: ' + json);
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
                    console.log( 'Authenticated user Request Failed: ' + err );
                    return [];
                });
        }else{
            alert("Dev alert! The authenticated user api is missing the cb function.");
        }
    },
    getStoredAvatars: function(){

    },
    getAuthenticatedUserAvatar: function(cb){
        $.getJSON(this.GET_AUTHENTICATED_USER_AVATAR_URL)
            .done(function (json) {
                console.log( 'User Avatar JSON Data: ' + json);
                if(cb){
                    cb(null,json);
                }
            })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ', ' + error;
                if(cb){
                    cb(err,jqxhr);
                }
                console.log( 'Request Failed: ' + err );
            });
    },
    saveAvatar: function(avatar, hasExtraItems, cb){
        var valResult = this.validateAvatarData(avatar, hasExtraItems);
        if(valResult.isValid) {
            $.ajax({
                url: this.SAVE_AVATAR_URL,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(avatar),
                success: function (data, textStatus, jqXHR) {
                    console.log("Avatar save was successful");
                    if(cb){
                        cb(null, data);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if(cb){
                        cb(errorThrown, jqXHR);
                    }
                    console.log("Avatar save has error");
                }
            });
        }else{
            alert(valResult.message);
        }

    },
    validateAvatarData: function(avatar,hasExtraItems){
        var ret = "";

        //empty checker
        if (!avatar.name || avatar.name.isEmpty()) {
            ret += "- " + LangMessages.get("avatar.name") + "\n";
        }
        if (!avatar.gender || avatar.gender.isEmpty()) {
            ret += "- " + LangMessages.get("avatar.gender") + "\n";
        }

        if (!avatar.headId || avatar.headId <= 0 || isNaN(avatar.headId)) {
            ret += "- " + LangMessages.get("avatar.head") + "\n";
        }

        if (!avatar.hairId || avatar.hairId <= 0 || isNaN(avatar.hairId)) {
            ret += "- " + LangMessages.get("avatar.hair") + "\n";
        }

        if (!avatar.bodyId || avatar.bodyId <= 0 || isNaN(avatar.bodyId)) {
            ret += "- " + LangMessages.get("avatar.body") + "\n";
        }

        if (!avatar.dressId || avatar.dressId <= 0 || isNaN(avatar.dressId)) {
            ret += "- " + LangMessages.get("avatar.dress") + "\n";
        }

        if(hasExtraItems) {
            if (!avatar.weaponId || avatar.weaponId <= 0 || isNaN(avatar.weaponId)) {
                ret += "- " + LangMessages.get("avatar.weapon") + "\n";
            }

            if (!avatar.petId || avatar.petId <= 0 || isNaN(avatar.petId)) {
                ret += "- " + LangMessages.get("avatar.pet") + "\n";
            }
        }

        var response = {};
        response.isValid = ret.isEmpty();
        response.message = ret.isEmpty() ? "" : LangMessages.get("avatar.fields.required.validation") + ": \n" + ret;
        return response;

    }
};