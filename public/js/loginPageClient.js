$(document).ready(() => {
    
    $('#sign-up-form').on('submit', function(event){
        event.preventDefault();
        const login = $('#login');
        const email = $('#email');
        const password = $('#password');
        const confirm = $('#confirm');

        $.ajax({
            url: '/api/users',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                login: login.val(), 
                email: email.val(), 
                password: password.val(),
                confirm: confirm.val()
            }),
            success: response => {
                login.val('');
                email.val('');
                password.val('');
                confirm.val('');

                toastr.success('User has been successfully created.', 'Success');
            },
            error: jqXHR => {
                toastr.error(jqXHR.responseJSON.error);
                login.val('');
                email.val('');
                password.val('');
                confirm.val('');
            }
        })
    });

    // $('#sign-in-form').on('submit', function(event) {
    //     event.preventDefault();
    //     const login = $('#sign-in-login');
    //     const password = $('#sign-in-password');

    //     console.log(login.val(), password.val());
    // })
});