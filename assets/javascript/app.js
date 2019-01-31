 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyDcHbfsQ6yYxOl6GGvwcVqyjiefa-aStP8",
    authDomain: "my-train-scheduler-c17cb.firebaseapp.com",
    databaseURL: "https://my-train-scheduler-c17cb.firebaseio.com",
    projectId: "my-train-scheduler-c17cb",
    storageBucket: "",
    messagingSenderId: "1091439494563"
};
firebase.initializeApp(config);
// initializing variables

var trainName = "";
var trainDestination = "";
var trainStart = "";
var trainFrequency = "";
var database = firebase.database();

// on submit button click event
$('#submit-employee').on('click', function (event) {
    event.preventDefault();
    trainName = $('#train-name').val().trim();
    trainDestination = $('#train-destination').val().trim();
    trainStart = $('#train-start').val();
    trainFrequency = $('#train-frequency').val();

    database.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        trainStart: trainStart,
        trainFrequency: trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    // resets the input fields to empty
    $('#train-name').val('');
    $('#train-destination').val('');
    $('#train-start').val('');
    $('#train-frequency').val('');
});

database.ref().on('child_added', function (childSnapshot) {

    var startTimeConverted = moment(childSnapshot.val().trainStart, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    var timeRemain = timeDiff % childSnapshot.val().trainFrequency;
    var minToArrival = childSnapshot.val().trainFrequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
    var key = childSnapshot.key;

    $("tbody").append(
        `<tr class="newRow">
        <td> ${childSnapshot.val().trainName} </td>
        <td> ${childSnapshot.val().trainDestination} </td>
        <td> ${childSnapshot.val().trainFrequency} </td>
        <td> ${moment(nextTrain).format("LT")} </td>
        <td> ${minToArrival} </td>
        <td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key=${key}>X</button></td>));
        </tr>`
    );
});

$(document).on("click", ".arrival", function () {
    keyGrab = $(this).attr("data-key");
    database.ref().child(keyGrab).remove();
    window.location.reload();
});

