function signin(){
    var mailValue= $('#emailValue').val()
    var passValue = $('#passValue').val()
    if(mailValue.length==0){
        alert('por favor digite o email')
        return
    }
    if(passValue.length==0){
        alert('por favor digite a senha')
        return
    }
    $.post( 
        "/api/signin", 
        { email: mailValue, pass: passValue }
    ).done(function( data ) {
        //alert( "Data Loaded: " + data );
        if(data.status=='ok'){
            var encodeDoc = btoa(JSON.stringify(data))
            Cookies.set('token', encodeDoc);
            window.location.replace("/dashboard");
        }else{
            alert(data.message)
        }
    });
}

function signup(){
    var nameValue= $('#nameValue').val()
    var lastNameValue= $('#lastNameValue').val()
    var mailValue= $('#emailValue').val()
    var passValue = $('#passValue').val()
    var repeatPassValue = $('#repeatPassValue').val()
    if(mailValue.length==0){
        alert('por favor digite o email')
        return
    }
    if(passValue.length==0){
        alert('por favor digite a senha')
        return
    }
    if(repeatPassValue != passValue){
        alert('as senhas diferem')
        return
    }

    if(nameValue.length==0 || lastNameValue.length==0){
        alert('digite o nome e o sobrenome')
        return
    }

    $.post( 
        "/api/signup", 
        { email: mailValue, pass: passValue,name:nameValue, last:lastNameValue }
    ).done(function( data ) {
        //alert( "Data Loaded: " + data );
        if(data.status=='ok'){
            var encodeDoc = btoa(JSON.stringify(data))
            Cookies.set('token', encodeDoc);
            window.location.replace("/dashboard");
        }else{
            alert(data.message)
        }
    });
}