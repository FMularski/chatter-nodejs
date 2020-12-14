$(document).ready(function() {
    const element = document.querySelector("#chat");
    element.scrollTop = element.scrollHeight;

    const splitUrl = window.location.href.split('/');
    const id = splitUrl[splitUrl.length - 1];

    // load messages
    $.ajax({
        url: '/api/chats/' + id,
        method: 'GET',
        contentType: 'application/json',
        success: response => {
            const chat = $('#chat');
            const userLogin = $('#user-login')[0].innerText;

            response.messages.forEach(msg => {
                if(msg.authorLogin == "sys") {
                    chat.append('\
                    <div class="message message-system">\
                        <span>' + msg.text + '</span>\
                    </div>\
                    ');
                } else if(msg.authorLogin == userLogin) {
                    chat.append('\
                    <div class="message message-user">\
                        <span><b>' + msg.authorLogin + '</b> ' + msg.date + '</span>\
                        <hr/>\
                        ' + msg.text + '\
                    </div>\
                    ')
                } else {
                    chat.append('\
                    <div class="message message-friend">\
                        <span><b>' + msg.authorLogin + '</b> ' + msg.date + '</span>\
                        <hr/>\
                        ' + msg.text + '\
                    </div>\
                    ')
                } 
            });
        }
    });

    
})