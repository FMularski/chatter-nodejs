const messages = document.querySelectorAll('.flying-msg');
messages.forEach(function(msg){
    msg.addEventListener('click', function() {
        this.src = 'img/opened.png';
    });

    setInterval(function() {
        const x = msg.getBoundingClientRect().x;
        if (x < -150 || x > screen.width) {
            msg.src = "img/message.png";
            change(msg);
        }
    }, 1);
});

function change(msg) {
    msg.style.top = (Math.random() * 100) % 80 + 'vh';
    msg.style.height  = (Math.random() * 100) % 15 + 4 + 'vh';
}
