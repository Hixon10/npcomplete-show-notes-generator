(function (window, document, undefined) {
    /*
    Check and set a global guard variable.
    If this content script is injected into the same page again,
    it will do nothing next time.
    */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;
    init()

    var startTime = new Date();

    function init() {
        console.log("npcomplete-show-notes-generator addon is starting...");

        insertStartButton();
        handleInDiscussionEvent();
    }

    function insertStartButton() {
        console.log("inserting start button");
        let prevNode = document.getElementById('workspaces-preamble-invite-button');
        if (prevNode == null) {
            console.log("prevNode == null");
            setTimeout(
                function() {
                    init();
                }, 3000);
            return
        }

        let startButtonHtml = '<button id="start-button">START TIMER</button>';
        prevNode.insertAdjacentHTML('afterend', startButtonHtml);

        document.addEventListener('click', function (e) {
            if (e.target && e.target.id === "start-button") {
                console.log("click on start button");
                alert("Clock is starting");
                startTime = new Date();
            }
        });
    }

    function handleInDiscussionEvent() {
        let inDiscussionBoardDiv = document.querySelector("#board div.js-list:nth-child(3) > div:nth-child(1) > div:nth-child(2)");
        inDiscussionBoardDiv.addEventListener("DOMNodeInserted", function (ev) {
            let isNewsLink = ev.target.parentNode === inDiscussionBoardDiv &&
                ev.target instanceof HTMLAnchorElement &&
                ev.target.href.length > 0;

            if (isNewsLink) {
                let newsNext = ev.target.querySelector("span.list-card-title").childNodes[1].textContent
                console.log(newsNext)

                let contentDiv = document.querySelector("#content");

                var resultDiv = document.querySelector("#result-div");
                if (resultDiv == null) {
                    let resultDivHtml = '<div id="result-div" style="width: 900px;height: 150px;position: relative;margin-top: 1000px;margin-left:50px; margin-bottom: 50px;color: white;font-size: 24px;display: block;"></div>';
                    contentDiv.insertAdjacentHTML('beforeend', resultDivHtml);
                    resultDiv = document.querySelector("#result-div");
                }

                let currentTime = new Date();
                let diffTime = currentTime - startTime;
                let backlogNewsHtml = '<p>' + msToTime(diffTime) + " - " + newsNext + '</p>';
                resultDiv.insertAdjacentHTML('beforeend', backlogNewsHtml);
            }
        });
    }

    function msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

})(window, document, undefined);


