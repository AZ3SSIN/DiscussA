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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Get the poolId from URL parameters
const poolIdFromUrl = getUrlParameter('poolId');

// Get the poolId from localStorage
const poolIdFromLocalStorage = localStorage.getItem('poolId');

// Determine the poolId to use
const pollId = poolIdFromUrl || poolIdFromLocalStorage;

document.addEventListener("DOMContentLoaded", function() {
    displayQuestionsByPollId(pollId);
});

function saveAnswer(questionId, answerText) {
    // Get a reference to the "questions" collection
    const questionsRef = db.collection("answers");

    // Add a new document to the "questions" collection with the provided data
    questionsRef.add({
        questionId: questionId,
        answerText: answerText,
        // Automatically use server timestamp as the time field
        Atime: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then((docRef) => {
            console.log("Answer added with ID: ", docRef.id);
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error adding answer: ", error);
        });
}



// Function to retrieve and display questions based on pollId
function displayQuestionsByPollId(pollId) {
    // Get a reference to the "questions" collection
    const questionsRef = db.collection("questions");

    // Query the "questions" collection for documents where the "pollId" field matches the specified pollId
    questionsRef.where("poolId", "==", pollId)
        .get()
        .then((querySnapshot) => {
            const container = document.getElementById("question-container");

            // Iterate through the retrieved documents
            querySnapshot.forEach((doc) => {
                // Access the data in each document
                const questionData = doc.data();
                const questionText = questionData.question;
                const questionId = doc.id;
                const timestampData = questionData.time;

                // Convert Firestore timestamp to JavaScript Date object
                const timestamp = new Date(timestampData.seconds * 1000 + timestampData.nanoseconds / 1000000);

                // Format the date and time
                const dateString = timestamp.toLocaleDateString(); // Format: MM/DD/YYYY
                const timeString = timestamp.toLocaleTimeString(); // Format: HH:MM:SS AM/PM

                // Concatenate date and time strings
                const formattedDateTime = `${dateString} ${timeString}`;

                // Create HTML elements for the question
                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question");
                questionDiv.innerHTML = `
                           <p>${questionText}</p>
                       `;

                // Create "Time Posted" paragraph
                // Time posted section creation
                const timePostedPara = document.createElement("p");
                timePostedPara.textContent = `Time Posted: ${formattedDateTime}`;
                timePostedPara.classList.add("time-posted"); // Add the class for styling

                const timePostedContainer = document.createElement("div");
                timePostedContainer.classList.add("time-posted-container");
                timePostedContainer.appendChild(timePostedPara);

                questionDiv.appendChild(timePostedContainer);


                // Create answer form
                const answerForm = document.createElement("form");
                answerForm.classList.add("answer-form");
                answerForm.innerHTML = `
    <textarea class="answer-text" placeholder="Your answer..."></textarea>
    <button type="submit">Submit</button>
`;

                answerForm.addEventListener("submit", function (event) {
                    event.preventDefault();
                    const answerText = answerForm.querySelector(".answer-text").value;
                    saveAnswer(questionId, answerText);
                    answerForm.reset();
                });

                displayAnswersForQuestion(questionId, questionDiv);
                questionDiv.appendChild(answerForm);
                container.appendChild(questionDiv);
            });
        })
        .catch((error) => {
            console.error("Error getting questions: ", error);
        });
}

function displayAnswersForQuestion(questionId, questionDiv) {
    // Get a reference to the "answers" collection
    const answersRef = db.collection("answers");

    // Query the "answers" collection for documents where the "questionId" field matches the specified questionId
    answersRef.where("questionId", "==", questionId)
        .get()
        .then((querySnapshot) => {
            // Iterate through the retrieved documents
            querySnapshot.forEach((doc) => {
                // Access the data in each document
                const answerData = doc.data();
                const answerText = answerData.answerText;

                // Create HTML element for the answer
                const answerPara = document.createElement("p");
                answerPara.textContent = `${answerText}`;
                answerPara.classList.add("answer"); // Add the "answer" class

                // Append the answer to the question div
                const answerContainer = document.createElement("div");
                answerContainer.classList.add("answer-container");
                answerContainer.appendChild(answerPara);

                questionDiv.appendChild(answerContainer);
            });
        })
        .catch((error) => {
            console.error("Error getting answers for question ", questionId, ": ", error);
        });
}

function saveQuestion(questionText) {
    // Get a reference to the "questions" collection
    const questionsRef = db.collection("questions");

    // Add a new document to the "questions" collection with the provided data
    questionsRef.add({
        poolId: pollId,
        question: questionText,
        // Automatically use server timestamp as the time field
        time: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then((docRef) => {
            console.log("Question added with ID: ", docRef.id);
            alert("Question Successfully Posted.");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error adding question: ", error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("question-form").addEventListener("submit", function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        const question = document.getElementById("question-text").value;

        saveQuestion(question);
    });
});

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("logout").addEventListener("click", function(event){
        event.preventDefault();
        localStorage.clear();
        window.location.href = "index.html";
    });
});
