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

document.getElementById("logout").addEventListener("click", function () {
    firebase.auth().signOut();
})