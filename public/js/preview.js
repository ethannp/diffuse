const firebaseConfig = {
    apiKey: "AIzaSyDto-91tH9YhX8cWqiQCJ-82nAvsdcMs74",
    authDomain: "diff-use.firebaseapp.com",
    projectId: "diff-use",
    storageBucket: "diff-use.appspot.com",
    messagingSenderId: "193721807431",
    appId: "1:193721807431:web:0240278c06787681e0f762",
    measurementId: "G-RJKBC04PEK"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

let page = 0;
let pages = [];

db.ref("session/content").once("value").then((snap) => {
    if (!snap.val()) {
        return;
    }
    pages = snap.val().slice(1);
    document.getElementById("page").innerHTML = 0;
    let pagesNode = document.getElementById("pages");
    while (pages.length > page) {
        let box = document.createElement("div");
        box.classList.add("box");
        box.id = `box-${page}`
        if (pages[page].title) {
            let h2 = document.createElement("h2");
            h2.textContent = pages[page].title;
            h2.classList.add("boxtitle");
            box.appendChild(h2);
        }
        let p = document.createElement("p");
        p.innerHTML = DOMPurify.sanitize(marked.parse(pages[page].text));
        p.classList.add("boxcontent");
        let nodes = p.querySelectorAll('a');
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].hostname != window.location.hostname) {
                    nodes[i].target = '_blank';
                }
            }
        }
        box.appendChild(p);
        box.hidden = true;
        pagesNode.prepend(box);
        page++;
    }
    page = 0;
});


document.getElementById("left").addEventListener("click", function () {
    if (page > 0) {
        page--;
        document.getElementById(`box-${page}`).hidden = true;
        document.getElementById("page").innerHTML = page;
    }
})

document.getElementById("right").addEventListener("click", function () {
    if (page < pages.length) {
        page++;
        document.getElementById(`box-${page-1}`).hidden = false;
        document.getElementById("page").innerHTML = page;
    }
})