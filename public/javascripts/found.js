var timeLeft = document.getElementsByClassName("time-left")[0].innerText || 5;
countDown(timeLeft);

function countDown(left) {
    if (left > 0) {
        setTimeout(function () {
            var timeLeft = left - 1;
            document.getElementsByClassName("time-left")[0].innerText = timeLeft;
            countDown(timeLeft)
        }, 1000)
    } else {
        location.href = "/";
    }
}