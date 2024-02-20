const firebaseConfig = {
    apiKey: "AIzaSyCGcW5m1EUP-HQsY4NxFdJ4eSq1dSVYeM4",
    authDomain: "proto3-7d6ac.firebaseapp.com",
    databaseURL: "https://proto3-7d6ac-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "proto3-7d6ac",
    storageBucket: "proto3-7d6ac.appspot.com",
    messagingSenderId: "359369562597",
    appId: "1:359369562597:web:3021b387416c406825370c",
    measurementId: "G-X9J4E51VHK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log("go");
// Initialize Firestore
const db = firebase.firestore();  // Use firestore() instead of database()


// Function to save a poll to Firestore
function savePoll(pollTitle, pollPassword) {
    db.collection("questionPool").add({
        pollTitle: pollTitle,
        password: pollPassword
    })
        .then((docRef) => {
            console.log("Poll added with ID: ", docRef.id);
            localStorage.setItem("poolId", docRef.id);
            window.location.href = "adminManagement.html";
        })
        .catch((error) => {
            console.error("Error adding poll: ", error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    // Add event listener after the DOM is loaded
    document.getElementById("poll-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const pollTitle = document.getElementById("poll-title").value;
        const pollPassword = document.getElementById("poll-password").value;

        savePoll(pollTitle, pollPassword);

        document.getElementById("poll-title").value = "";
        document.getElementById("poll-password").value = "";
    });
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("findPool").addEventListener("submit", function(event) {
        event.preventDefault();
        const enterKey = document.getElementById("enterKey").value;
        const poolRef = db.collection("questionPool");

        poolRef.where("enterKey", "==", enterKey)  // Use enterKey variable instead of string "enterKey"
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        localStorage.setItem("poolId", doc.id);
                        window.location.href = "pool.html";
                    });
                } else {
                    console.log("No pool found with the provided enter key.");
                }
            })
            .catch((error) => {
                console.error("Error getting pools:", error);
            });
    });
});




