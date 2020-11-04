$(document).ready( function () {
    const friendsNotification = $('#friends-notification');

    if (friendsNotification.html() == "0") {
        friendsNotification.html('');
        friendsNotification.removeClass('friends-notification-active');
    } else {
        friendsNotification.addClass('friends-notification-active');
    }
})