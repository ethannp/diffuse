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
let numPages = 0;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        if (firebase.auth().currentUser.uid == "K5bJoTYHnsTeNcwzkj7LeKBBZJ22") {

        } else {
            location = "index.html"
        }
    } else {
        location = "index.html"
    }
})

db.ref("session/content").once("value", (content) => {
    if (content) {
        let pages = content.val().slice(1);
        numPages = pages.length;
        let pagesNode = document.getElementById("pages");
        for (let i = 0; i < numPages; i++) {
            pagesNode.appendChild(getEditBoxElement(i, true));
        }
    }
})

document.getElementById("logout").addEventListener("click", function () {
    firebase.auth().signOut();
})

document.getElementById("left").addEventListener("click", function () {
    if (page > 0) {
        db.ref("session/pagesVisible").set(page - 1);
    }
})

document.getElementById("right").addEventListener("click", function () {
    if (page < numPages) {
        db.ref("session/pagesVisible").set(page + 1);
    }
})

document.getElementById("addpg").addEventListener("click", function () {
    if (page < 20) {
        document.getElementById("pages").appendChild(getEditBoxElement(numPages, false));
        numPages++;
    }
})

db.ref("session/pagesVisible").on("value", (activePages) => {
    page = activePages.val();
    document.getElementById("page").textContent = activePages.val();
});

document.getElementById("save").addEventListener("click", function () {

    let pagesNode = document.getElementById("pages");
    let setObj = {};
    for (let i = 0; i < pagesNode.children.length; i++) {
        setObj[i+1] = {
            title: document.getElementById(`input-${i}`).value,
            text: document.getElementById(`text-${i}`).value
        }
    }
    db.ref("session/content/").set(setObj);
    alert("Saved!");
})

function getEditBoxElement(i, fetchData) {
    let box = document.createElement("div");
    box.classList.add("box");
    box.id = `box-${i}`;

    let number = document.createElement("span");
    number.classList.add("number");
    number.textContent = i + 1;
    box.appendChild(number);

    let del = document.createElement("span");
    del.classList.add("delete");
    del.textContent = "x";
    del.id = `x-${i}`
    del.addEventListener("click", function () {
        if (confirm("Make sure you have saved your data before deleting any cards!") == true) {

        }
    })
    box.appendChild(del);

    let input = document.createElement("input");
    input.placeholder = "Title goes here!";
    input.classList.add("edittitle");
    input.id = `input-${i}`;

    let textarea = document.createElement("textarea");
    textarea.classList.add("editcontent");
    textarea.id = `text-${i}`;
    textarea.placeholder = "Your content goes here! Markdown is supported.";

    if (fetchData) {
        db.ref(`session/content/${i+1}`).once("value", (snap) => {
            if (snap.val().title != undefined) {
                input.value = snap.val().title;
            }
            if (snap.val().text != undefined) {
                textarea.value = snap.val().text;
            }
        })
    }
    box.appendChild(input);
    box.appendChild(textarea);

    return box;
}