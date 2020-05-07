var productURL = document.URL;
var csrftoken = getCookie("csrftoken");
var itemid;
var shopid;
var max = 4;
var timeDelayed = 0;
var userN = 0;

itemid = productURL.slice(productURL.lastIndexOf(".") + 1, productURL.length);
productURLSliced = productURL.slice(0, productURL.lastIndexOf(".") - 1);
shopid = productURL.slice(productURLSliced.lastIndexOf(".") + 1, productURL.lastIndexOf("."));

for (var i = 0; i < max; i++) {
    timeDelayed += getRndInteger(30, 90);
    setTimeout(function () {
        fetch("https://shopee.co.id/api/v2/item/get_ratings?filter=0&flag=1&itemid=" + itemid + "&limit=1&offset=" + userN + "&shopid=" + shopid + "&type=0")
            .then(response => response.json())
            .then(data => {
                author_shopid = data.data.ratings[0].author_shopid;
                author_username = data.data.ratings[0].author_username;
                shopee_subscribe(
                    data.data.ratings[0].author_shopid,
                    data.data.ratings[0].author_username,
                    userN);
            })
        userN += 1;
    }, timeDelayed * 100);
}


function shopee_subscribe(author_shopid, author_username, followed) {
    var shopee_api_subs = "https://shopee.co.id/api/v0/buyer/follow/shop/" + author_shopid + "/";
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