var productURL = document.URL;
var csrftoken = getCookie("csrftoken");
var fetched_data_type = 0; // 0: review; 1:Follower
var mode = 0; // 0: FOllow; 1: Unfollow
var itemid;
var shopid;
var max = 2;
var timeDelayed = 0;
var userN = 4;

switch (fetched_data_type) {
    case 0:
        itemid = productURL.slice(productURL.lastIndexOf(".") + 1, productURL.length);
        productURLSliced = productURL.slice(0, productURL.lastIndexOf(".") - 1);
        shopid = productURL.slice(productURLSliced.lastIndexOf(".") + 1, productURL.lastIndexOf("."));
        break;

    case 1:
        shopid = productURL.slice(getPosition(productURL, "/", 4) + 1, getPosition(productURL, "/", 5));
        break;

    default:
        break;
}


for (var i = 0; i < max; i++) {
    timeDelayed += getRndInteger(30, 90);
    setTimeout(function () {
        switch (fetched_data_type) {
            case 0:
                fetch("https://shopee.co.id/api/v2/item/get_ratings?filter=0&flag=1&itemid=" + itemid + "&limit=1&offset=" + userN + "&shopid=" + shopid + "&type=0")
                    .then(response => response.json())
                    .then(data => {
                        shopee_subscribe(
                            data.data.ratings[0].author_shopid,
                            data.data.ratings[0].author_username,
                            userN);
                    })
                break;

            case 1:
                fetch("https://shopee.co.id/shop/" + shopid + "/followers?offset=" + (userN + 1) + "&limit=1", {
                    "headers": { "x-requested-with": "XMLHttpRequest" }
                })
                    .then(response => response.text())
                    .then(html => {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(html, 'text/html');
                        shopee_subscribe(
                            doc.getElementsByTagName("li")[0].attributes[0].value,
                            doc.getElementsByTagName("a")[0].attributes[1].value,
                            userN);
                    })

            default:
                break;
        }


        userN += 1;
    }, timeDelayed * 100);
}


function shopee_subscribe(author_shopid, author_username, followed) {
    var subs = mode ? "follow" : "unfollow";
    var shopee_api_subs = "https://shopee.co.id/api/v0/buyer/" + subs + "/shop/" + author_shopid + "/";
    fetch(shopee_api_subs, {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
            "content-type": "application/json",
            "if-none-match-": "55b03-ff02d66557b09ab6e5cb5a4780992ba7",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-api-source": "pc",
            "x-csrftoken": csrftoken,
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://shopee.co.id/" + author_username,
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": "{}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
        .then(function (response) {
            if (response.status == 200) {
                console.log("Followed" +
                    " " + author_shopid +
                    " " + author_username +
                    " \t of total = " + followed);
            }
        });
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}