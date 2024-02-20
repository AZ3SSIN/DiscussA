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

function savePoll(pollTitle, pollPassword) {
    // Get a reference to the "questionPool" collection
    const questionPoolRef = db.collection("questionPool");

    // Query the "questionPool" collection for documents with the same pollTitle and password
    questionPoolRef.where("pollTitle", "==", pollTitle)
                   .where("password", "==", pollPassword)
                   .get()
                   .then((querySnapshot) => {
                        // Check if any documents exist with the same pollTitle and password
                        if (!querySnapshot.empty) {
                            // If a document exists, alert the user that the question pool already exists
                            alert("A question pool with the same title and password already exists.");
                        } else {
                            // If no document exists, proceed to add the new question pool
                            addNewQuestionPool(pollTitle, pollPassword);
                        }
                   })
                   .catch((error) => {
                        console.error("Error checking for existing question pool: ", error);
                   });
}

// Function to save a poll to Firestore
function addNewQuestionPool(pollTitle, pollPassword) {
    // Get a reference to the "questionPool" collection
    const questionPoolRef = db.collection("questionPool");

    // Get a snapshot of existing keys in the "questionPool" collection
    questionPoolRef.get()
        .then((querySnapshot) => {
            // Create an array to store existing keys
            const existingKeys = [];
            querySnapshot.forEach((doc) => {
                existingKeys.push(doc.data().enterKey);
            });

            // Generate a unique key for the pool
            let poolKey = generateUniqueKey();

            // Check if the generated key already exists
            while (existingKeys.includes(poolKey)) {
                poolKey = generateUniqueKey();
            }

            // Once a unique key is generated, save the pool data to Firestore
            return questionPoolRef.add({
                pollTitle: pollTitle,
                password: pollPassword,
                enterKey: poolKey
            });
        })
        .then((docRef) => {
            console.log("Poll added with ID: ", docRef.id);
            localStorage.setItem("poolId", docRef.id);
            window.location.href = "adminManagement.html";
            alert("Title: " + pollTitle + "\nPassword: " + pollPassword + "\n\nPlease remember both the title and password.");
        })
        .catch((error) => {
            console.error("Error adding poll: ", error);
        });
}


function generateUniqueKey() {
    // Implement your logic to generate a unique alphanumeric key here
    // You can use a combination of letters and numbers, and check if it's not already used in Firestore
    // For simplicity, let's say we're generating a random 6-character key
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 6; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
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
        console.log("here!q");
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




