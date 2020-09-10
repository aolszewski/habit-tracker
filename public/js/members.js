$(document).ready(() => {
  // GET request to figure out which user is logged in and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);

    const userId = data.id;

    // Getting references to the name input and habit container, as well as the table body
    const nameInput = $("#habit-name");
    const habitList = $("tbody");
    const habitContainer = $(".habit-container");

    //Event listener to create and delete habit objects
    $(document).on("submit", "#add-habit", handleHabitFormSubmit);
    $(document).on("click", ".delete-habit", handleDeleteButtonPress);

    //Getting the initial list of habits
    gethabits();

    // A function to handle what happens when the form is submitted to create a new Habit
    function handleHabitFormSubmit(event) {
      event.preventDefault();
      // Don't do anything if the name fields hasn't been filled out
      if (
        !nameInput
          .val()
          .trim()
          .trim()
      ) {
        return;
      }
      // Calling the upsertHabit function and passing in the value of the name input
      upsertHabit({
        name: nameInput.val().trim()
      });
    }

    // A function for creating a habit. Calls getHabits upon completion
    function upsertHabit(habitData) {
      $.post("/api/habit_data", habitData).then(getHabits);
    }

    // Function for retrieving habits for a user and getting them ready to be rendered to the page
    function getHabits() {
      $.get("/api/habit_data/" + userId, data => {
        console.log(data);

        const rowsToAdd = [];
        for (let i = 0; i < data.length; i++) {
          rowsToAdd.push(createHabitRow(data[i++]));
        }
        renderHabitsList(rowsToAdd);
        nameInput.val("");
      });
    }

    // A function for rendering the list of habits to the page
    function renderHabitsList(rows) {
      habitList
        .children()
        .not(":last")
        .remove();
      habitContainer.children(".alert").remove();
      if (rows.length) {
        console.log(rows);
        habitList.prepend(rows);
      } else {
        renderEmpty();
      }
    }

    // Function for handling what happens when the delete button is pressed
    function handleDeleteButtonPress() {
      const habitData = $(this)
        .parent("td")
        .parent("tr")
        .data("habit");
      const id = habitData.id;
      $.ajax({
        method: "DELETE",
        url: "/api/habit_data/" + id
      }).then(getHabits);
    }
  });
});

//Need to figure out code to change a habit from being incomplete to completed
//This will change the completed field boolean on the habit row from false to true
//Figure out how to reset this every day at midnight?
//Check last updated date. If current date is newer than last updated day, completed boolean is set to false.
//This has to be checked before habits are rendered to the html page so that they will show false for completed.
//How do you pull and work with the dates in a habit row?
//0. const current datetime?
//1. Get habit by user/id
//2. req.body.updatedAt
//3. if currentDate is > req.body.updatedAt then req.body.completed = false?
//4. Then render habits to html with new completed boolean values?
