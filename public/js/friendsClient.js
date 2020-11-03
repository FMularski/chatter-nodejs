$(document).ready(function(){
    
    $('#invite-friend-form').on('submit', function(event) {
        event.preventDefault();

        const userLogin = $('#user-login');

        $.ajax({
            url: "/api/invitations",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({userLogin: userLogin.val()}),
            success: response => {
                toastr.success('Invitation has been sent.', 'Success');
            },
            error: jqXHR => {
                toastr.error(jqXHR.responseJSON.error);
            }
        })

        userLogin.val('');
        $('#invite-btn').blur();
    })

})