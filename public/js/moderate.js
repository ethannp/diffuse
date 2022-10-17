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
    if (content.val()) {
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
        saveContent();
        document.getElementById("pages").appendChild(getEditBoxElement(numPages, false));
        numPages++;
    }
})

document.getElementById("reset").addEventListener("click", function () {
    if (confirm("Warning: this action is irreversible! Are you sure you would like to reset everything?") == true) {
        db.ref("session/content/").set({});
        db.ref("session/pagesVisible").set(0);
        location.reload();
    }
})

document.getElementById("preview").addEventListener("click", function () {
    saveContent();
    window.location.assign("preview.html");
})

db.ref("session/pagesVisible").on("value", (activePages) => {
    page = activePages.val();
    document.getElementById("page").textContent = activePages.val();
});

document.getElementById("save").addEventListener("click", function () {
    saveContent();
    alert("Changes were saved!");
})

function getEditBoxElement(i, fetchData) {
    let box = document.createElement("div");
    box.classList.add("box");
    box.id = `box-${i}`;

    let number = document.createElement("span");
    number.classList.add("number");
    number.classList.add("circlebtn");
    number.textContent = i + 1;
    box.appendChild(number);

    let del = document.createElement("span");
    del.classList.add("delete");
    del.classList.add("circlebtn");
    del.textContent = "x";
    del.id = `x-${i}`
    del.addEventListener("click", function () {
        if (confirm("Deleting a card is irreversible!") == true) {
            let pagesNode = document.getElementById("pages");
            let setObj = {};
            for (let j = 0; j < pagesNode.children.length; j++) {
                let id = -1;
                if (i > j) {
                    id = j;
                } else if (i == j) {
                    continue;
                } else {
                    id = j - 1;
                }
                setObj[id + 1] = {
                    title: document.getElementById(`input-${j}`).value,
                    text: document.getElementById(`text-${j}`).value
                }
            }
            db.ref("session/content/").set(setObj);
            db.ref("session/pagesVisible").set(0);
            location.reload();
        }
    })
    box.appendChild(del);

    if (i > 0) {
        let swap = document.createElement("span");
        swap.classList.add("circlebtn");
        swap.classList.add("swap");
        swap.textContent = "↕";
        swap.addEventListener("click", function() {
            let pagesNode = document.getElementById("pages");
            let setObj = {};
            for (let j = 0; j < pagesNode.children.length; j++) {
                let id = -1;
                if (i==j) {
                    id = j-1;
                } else if (j == i-1) {
                    id = i;
                } else {
                    id = j;
                } 
                console.log(id);
                setObj[id + 1] = {
                    title: document.getElementById(`input-${j}`).value,
                    text: document.getElementById(`text-${j}`).value
                }
            }
            console.log(setObj);
            db.ref("session/content/").set(setObj);
            location.reload();
        })
        box.appendChild(swap);
    }

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

function saveContent() {
    let pagesNode = document.getElementById("pages");
    let setObj = {};
    for (let i = 0; i < pagesNode.children.length; i++) {
        setObj[i + 1] = {
            title: document.getElementById(`input-${i}`).value,
            text: document.getElementById(`text-${i}`).value
        }
    }
    db.ref("session/content/").set(setObj);
}