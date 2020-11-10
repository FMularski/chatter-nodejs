$(document).ready( function() {

    const friendsList = $('#friends-to-invite');
    const createChatBtn = $('#create-chat-btn');
    friendsList.html('');
    
    $.ajax({
        url: '/get_friends',
        method: 'GET',
        contentType: 'application/json',
        success: response => {
            if (response.friends.length) {
                response.friends.forEach( friend => {
                    friendsList.append('<li>\
                    <input type="checkbox" name="friend_selection" value="' + friend._id + '"> <span>' + friend.login + '</span>\
                    </li>');
                });
            } else {
                friendsList.html('<li>You have no friends yet. Make a friend in order to create a chat.</li>');
                createChatBtn.addClass('inactive');
            }
        }
    })

    createChatBtn.on('click', function(event) {
        event.preventDefault();
        const checkedFriends = $('input:checked');
        let ids = [];
        for ( let i = 0; i < checkedFriends.length; i++) {
            ids.push(checkedFriends[i].value);
        }

        const chatName = $('#chat_name').val();
        
        $.ajax({
            url: '/api/chats/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({chatName: chatName, friendsIds: ids}),
            success: response => {

            }
        });
    });

});