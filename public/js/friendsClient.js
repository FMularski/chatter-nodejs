$(document).ready(function(){

    function refreshInvitationsList() {
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
                    <button class="accept-friend-btn"> <img src="/img/accept.png" alt="accept button"/> </button>\
                    <button class="decline-friend-btn"> <img src="/img/decline.png" alt="decline button"/> </button>\
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
        });
    }

    function refreshFriendsList() {
        const friendsList = $('#friends-list');
        friendsList.html('');

        $.ajax({
            url: '/get_friends',
            method: 'GET',
            contentType: "application/json",
            success: response => {

                if (response.friends.length == 0) {
                    friendsList.append('<li>No friends yet.</li>');
                }

                response.friends.forEach( function (friend) {
                    friendsList.append('<li>' + friend.login + '</li>');
                })
            }
        })
    }

    function updateFriendsNotification(){
        const friendsNotification = $('#friends-notification');
        let parsed = parseInt(friendsNotification.html(), 10);
        parsed--;

        if (parsed) {
            friendsNotification.html(parsed);
        } else {
            friendsNotification.html('');
            friendsNotification.removeClass('friends-notification-active');
        }
    }

    refreshFriendsList();
    refreshInvitationsList();
    

    $('#friends-invitations').on('click', '.accept-friend-btn', function(){
        const senderLogin = $(this).parent().children()[2].innerHTML;
        
        $.ajax({
            url: '/add_friend',
            method: 'POST',
            contentType: "application/json",
            data: JSON.stringify({senderLogin: senderLogin}),
            success: response => {
                toastr.success(`You and ${senderLogin} are now friends.`);
                refreshFriendsList();
                refreshInvitationsList();
                updateFriendsNotification();
            },
            error: jqXHR => {
                toastr.error(jqXHR.responseJSON.error);
            }
        })
    });

    $('#friends-invitations').on('click', '.decline-friend-btn', function(){
        const senderLogin = $(this).parent().children()[2].innerHTML;
        
        $.ajax({
            url: '/decline_friend',
            method: 'POST',
            contentType: "application/json",
            data: JSON.stringify({senderLogin: senderLogin}),
            success: response => {
                toastr.info(`You declined ${senderLogin}\'s invitation.`);
                refreshFriendsList();
                refreshInvitationsList();
                updateFriendsNotification();
            },
            error: jqXHR => {
                toastr.error(jqXHR.responseJSON.error);
            }
        })
    });


    
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