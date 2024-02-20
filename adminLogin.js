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
const pollId = localStorage.getItem("poolId");

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("adminLogin").addEventListener("submit", function (event) {
        event.preventDefault();
        const title = document.getElementById("poll-titleL").value;
        const password = document.getElementById("poll-passwordL").value;
        const poolRef = db.collection("questionPool");

        poolRef.where("pollTitle", "==", title)
            .where("password", "==", password)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        localStorage.setItem("poolId", doc.id);
                        window.location.href = "adminManagement.html";
                    });
                } else {
                    console.log("No pool found.");
                }
            })
            .catch((error) => {
                console.error("Error getting pools:", error);
            });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout"); // Use "logout2" as the button ID
    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.clear();
            window.location.href = "index.html";
        });
    } else {
        console.error("Logout button not found in the DOM.");
    }
});
