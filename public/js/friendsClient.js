$(document).ready(function(){

    $.ajax({
        url: '/api/invitations',
        method: 'GET',
        contentType: 'application/json',
        success: response => {
            const friendsInvitationsDiv = $('#friends-invitations');
            const chatsInvitationsDiv = $('#chats-invitations');

            friendsInvitationsDiv.html('');
            chatsInvitationsDiv.html('');

            if(!response.friendsInvitations.length) {
                friendsInvitationsDiv.html('<p>No invitations.</p>');
            }
            
            if(!response.chatsInvitations.length) {
                chatsInvitationsDiv.html('<p>No invitations.</p>');
            }

            response.friendsInvitations.forEach( function(invitation) {
                friendsInvitationsDiv.append('<p>\
                <button> <img src="/img/accept.png" alt="accept button"/> </button>\
                <button> <img src="/img/decline.png" alt="decline button"/> </button>\
                <span>' + invitation.senderLogin + '</span>\
            </p>');
            })

            response.chatsInvitations.forEach( function() {
                chatsInvitationsDiv.append('<p>\
                                                <button>\
                                                    <img src="/img/accept.png" alt="accept button"/>\
                                                </button>\
                                                <button>\
                                                    <img src="/img/decline.png" alt="decline button"/>\
                                                </button>\
                                                <span>chat1(user1, user2, user3)</span>\
                                            </p>');
            })
        }
    })
    
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