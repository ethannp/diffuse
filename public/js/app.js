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

db.ref("connected").on("value", (snap) => {
    if (snap.val() == true) {
        document.getElementById("status").textContent = "";
    } else {
        document.getElementById("status").textContent = "not connected :( please try to refresh!"
    }
})
db.ref("session/pagesVisible").on("value", (activePages) => {
    db.ref("session/content").once("value").then((snap) => {
        let pages = snap.val().slice(1, activePages.val() + 1);
        let pagesNode = document.getElementById("pages");
        while (pages.length > page) {
            let box = document.createElement("div");
            box.classList.add("box");
            if(pages[page].title) {
                let h2 = document.createElement("h2");
                h2.textContent = pages[page].title;
                h2.classList.add("boxtitle");
                box.appendChild(h2);
            }
            let p = document.createElement("p");
            p.innerHTML = pages[page].text;
            p.classList.add("boxcontent");
            box.appendChild(p);
            pagesNode.prepend(box);
            page++;
        }
        while (pages.length < page) {
            pagesNode.removeChild(pagesNode.firstChild);
            page--;
        }
        if (page == 0) {
            document.getElementById("wait").style.display = "block";
            document.getElementById("status").textContent = "connected! waiting for content..."
        } else {
            console.log("hey");
            document.getElementById("wait").style.display = "none";
            document.getElementById("status").textContent = ""
        }
    })
});