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
    displayQuestionsByPollId(pollId);
    displayPollKey();
});

function displayPollKey() {
    const questionRef = db.collection("questionPool");

    return questionRef.doc(pollId) // Assuming pollId is the ID of the document you want to retrieve
        .get()
        .then((doc) => {
            if (doc.exists) {
                // Document found, return its data
                return doc.data();
            } else {
                // Document does not exist
                console.error("Document not found");
                return null;
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
            return null; // Return null in case of error
        });
}

// Example usage:
displayPollKey().then((pollData) => {
    if (pollData) {
        // Update HTML content with the data from the document
        document.getElementById("enterKeyDisplay").innerText = pollData.enterKey;
    } else {
        // Handle case where document is not found or error occurred
        console.error("Enter key not found or error occurred.");
    }
});


// Function to retrieve and display questions based on pollId
function displayQuestionsByPollId(pollId) {
    // Get a reference to the "questions" collection
    const questionsRef = db.collection("questions");

    // Query the "questions" collection for documents where the "pollId" field matches the specified pollId
    questionsRef.where("poolId", "==", pollId)
        .get()
        .then((querySnapshot) => {
            const container = document.getElementById("question-container");
            if (querySnapshot.empty) {
                const container = document.getElementById("question-container");
                const message = document.createElement("h2");
                message.textContent = "No Question Yet";
                container.appendChild(message);
            }
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
    <button class="delete-btn" data-question-id="${questionId}">Delete</button>
`;

                answerForm.addEventListener("submit", function (event) {
                    event.preventDefault();
                    const answerText = answerForm.querySelector(".answer-text").value;
                    saveAnswer(questionId, answerText);
                    answerForm.reset();
                });

                // Move the deleteBtn event listener inside this block
                const deleteBtn = answerForm.querySelector(".delete-btn");
                deleteBtn.addEventListener("click", (event) => {
                    const questionId = event.target.getAttribute("data-question-id");
                    deleteQuestion(questionId);
                    deleteAnswersByQuestionId(questionId);
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


function deleteQuestion(questionId) {
    // Get a reference to the question document to be deleted
    const questionRef = db.collection("questions").doc(questionId);

    // Delete the question document
    questionRef.delete()
        .then(() => {
            console.log("Question successfully deleted");
            // Refresh the questions list
            displayQuestionsByPollId(); // You may need to pass pollId here if it's not globally accessible
        })
        .catch((error) => {
            console.error("Error deleting question: ", error);
        });
}

function deleteAnswersByQuestionId(questionId) {
    // Get a reference to the answers collection
    const answersRef = db.collection("answers");

    // Query the answers collection for documents where the questionId field matches the specified questionId
    answersRef.where("questionId", "==", questionId)
        .get()
        .then((querySnapshot) => {
            // Iterate through the retrieved documents
            querySnapshot.forEach((doc) => {
                // Delete each answer document
                doc.ref.delete()
                    .then(() => {
                        console.log("Answer successfully deleted");
                    })
                    .catch((error) => {
                        console.error("Error deleting answer: ", error);
                    });
            });
        })
        .catch((error) => {
            console.error("Error getting answers: ", error);
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

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('copyButton').addEventListener('click', function () {
        const shareableUrl = generateShareableUrl(pollId);
        copyToClipboard(shareableUrl);
        alert('URL copied to clipboard!');
    });
});


function generateShareableUrl(poolId) {
    // Construct the URL with the poolId as a parameter
    const baseUrl = window.location.origin + '/pool.html'; // Construct the base URL with pool.html
    const shareableUrl = baseUrl + '?poolId=' + poolId;

    return shareableUrl;
}


function copyToClipboard(text) {
    // Create a temporary <textarea> element to temporarily hold the text
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;

    // Append the <textarea> element to the DOM
    document.body.appendChild(tempTextArea);

    // Select the text inside the <textarea>
    tempTextArea.select();

    try {
        // Copy the selected text to the clipboard
        document.execCommand('copy');
        console.log('Text copied to clipboard:', text);
    } catch (err) {
        console.error('Failed to copy text to clipboard:', err);
    }

    // Remove the <textarea> element from the DOM
    document.body.removeChild(tempTextArea);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logout").addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.clear();
        window.location.href = "index.html";
    });
});
