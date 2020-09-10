$(document).ready(() => {
  // Getting references to our form and inputs
  const loginForm = $("form.login");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(() => {
        window.location.replace("/habits");
        // If there's an error, log the error
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Getting references to our form and input
  const signUpForm = $("form.signup");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password) {
    $.post("/api/signup", {
      email: email,
      password: password
    })
      .then(() => {
        window.location.replace("/habits");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }

  // GET request to figure out which user is logged in and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);

    const userId = data.id;

    // Getting references to the name input and habit container, as well as the table body
    const nameInput = $("#habitName");
    const habitList = $("tbody");
    const habitContainer = $(".habit-container");

    //Event listener to create and delete habit objects
    $(document).on("submit", "#add-habit", handleHabitFormSubmit);
    $(document).on("click", ".delete-habit", handleDeleteButtonPress);

    //Getting the initial list of habits
    getHabits();

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

    // A function for creating a habit. Calls H upon completion
    function upsertHabit(habitData) {
      console.log({ habitData });
      $.post("/api/insert_habit", habitData).then(getHabits);
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
        //renderEmpty();
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
