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
    })
});