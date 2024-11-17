/**
 * When the document is fully loaded, initialise the page with the football quiz.
 * Add event listeners to all buttons to allow quiz category selection, answer
 * submission, and next question processing.
 */
document.addEventListener("DOMContentLoaded", function() {
    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function() {
            if (this.getAttribute("data-type") === "nextQuestion") {
                displayNextQuestion();
            } else if (this.getAttribute("data-type") === "submitAnswer") {
                checkAnswer();
            } else {
                let quizType = this.getAttribute("data-type");
                runQuiz(quizType);
            }
        });
    }

    runQuiz("football");
});


/**
 * Run the selected quiz, as indicated by the quizType parameter.
 */
function runQuiz(quizType) {
    document.getElementById("quizHeading").innerText = "The " + quizType + " Quiz";
    document.getElementById("questionNumber").innerText = "Question 0";
    document.getElementById("thisCorrectScore").innerText = "0";
    document.getElementById("thisIncorrectScore").innerText = "0";

    displayNextQuestion(quizType, 0);
}


/**
 * Interrogate the DOM to retrieve the username entered by the user, if any.
 */
function getUserName() {
    let userName = document.getElementById("userName").value;
    userName = (userName === "")? "Anonymous" : userName;

    return userName;
}


/**
 * Check the answer selected by the user against the correct answer in the quizzes
 * dictionary. Format an appropriate message for the user, depending on whether her
 * answer is correct or not.
 */
function checkAnswer() {
    let response;

    /* Disable the radio button group. */
    let radioButtons = document.getElementsByName("possibleAnswer");
    for (let radioButton of radioButtons) {
        radioButton.disabled = true;
    }

    /* Disable the Submit Answer button. */
    document.getElementById("submitAnswer").disabled = true;
    document.getElementById("submitAnswer").classList.add("disabled");

    /* Enable the Next Question button. */
    document.getElementById("nextQuestion").disabled = false;
    document.getElementById("nextQuestion").classList.remove("disabled");

    let userAnswer = "XXX";
    let quizType = determineCurrentQuiz();
    let lastQuestionNumber = determineCurrentQuestion();
    let lastQuestionNumberIndex = parseInt(lastQuestionNumber) - 1;

    let possibleAnswers = document.getElementsByName("possibleAnswer");
    for (let i = 0; i < possibleAnswers.length; i++ ) {
        if (possibleAnswers[i].checked) {
            userAnswer = possibleAnswers[i].value;
            break;
        }
    }
    if (userAnswer === quizzes[quizType][lastQuestionNumberIndex].rightAnswer) {
        updateScoreboard(true);
        response = "That's correct, " + getUserName() + "!";
    }
    else {
        updateScoreboard(false);
        response = "I'm afraid not, " + getUserName() + " - the correct answer is \"" + quizzes[quizType][lastQuestionNumberIndex].rightAnswer + "\".";
    }
    /* Display the response on screen. */
    document.getElementById("answerAndFeedback").innerHTML = "<p>" + response + "</p>";
}


/**
 * Display the next question - if there is one!
 * If there are no more questions for the current quiz category, format an
 * appropriate message for the user.
 */
function displayNextQuestion() {

    /* Prepare the page elements for the next question. */
    document.getElementById("answerAndFeedback").innerHTML = "<p></p>";
    document.getElementById("nextQuestion").disabled = true;
    document.getElementById("nextQuestion").classList.add("disabled");
    document.getElementById("submitAnswer").disabled = true;
    document.getElementById("submitAnswer").classList.add("disabled");

    /* Determine the quiz category and the number of the last question displayed within
       that category. */
    let quizType = determineCurrentQuiz();
    let lastQuestionNumber = determineCurrentQuestion();

    /* If the last question displayed is the last question in the category, format a suitable
       message. */
    if (parseInt(lastQuestionNumber) < quizzes[quizType].length) {
        let nextQuestionNumber = parseInt(lastQuestionNumber) + 1;
        document.getElementById("questionNumber").innerText = "Question " + nextQuestionNumber.toString();
        let questionNumber = nextQuestionNumber - 1;

        let questionHTML =
            `<p>${quizzes[quizType][questionNumber].question}<p>
             <input type="radio" id="option0" name="possibleAnswer" value="${quizzes[quizType][questionNumber].suggestedAnswers[0]}" required>
             <label for="option0">${quizzes[quizType][questionNumber].suggestedAnswers[0]}</label><br>
             <input type="radio" id="option1" name="possibleAnswer" value="${quizzes[quizType][questionNumber].suggestedAnswers[1]}" required>
             <label for="option1">${quizzes[quizType][questionNumber].suggestedAnswers[1]}</label><br>
             <input type="radio" id="option2" name="possibleAnswer" value="${quizzes[quizType][questionNumber].suggestedAnswers[2]}" required>
             <label for="option2">${quizzes[quizType][questionNumber].suggestedAnswers[2]}</label><br>`;
        document.getElementById("displayQuestion").innerHTML = questionHTML;
        /* Add a click event listener to each radio button so that the Submit Answer button may be enabled. */ 
        let radioButtons = document.getElementsByName("possibleAnswer");
        for (let i = 0; i < radioButtons.length; i++) {
            radioButtons[i].onclick = function() {
                document.getElementById("submitAnswer").disabled = false;
                document.getElementById("submitAnswer").classList.remove("disabled"); };
        }
    }
    else {
        let response = "Sorry, " + getUserName() + "! There are no more questions in this quiz. Why not try another category?";
        /* Display the response on screen. */
        document.getElementById("answerAndFeedback").innerHTML = "<p>" + response + "</p>";
    }
}


/**
 * Update the scoreboard figures i.e. the score for the current quiz category and the overall
 * score.
 */
function updateScoreboard(correctAnswer) {
    if (correctAnswer) {
        let oldThisCorrectScore = parseInt(document.getElementById("thisCorrectScore").innerText);
        document.getElementById("thisCorrectScore").innerText = ++oldThisCorrectScore;
        let oldAllCorrectScore = parseInt(document.getElementById("allCorrectScore").innerText);
        document.getElementById("allCorrectScore").innerText = ++oldAllCorrectScore;
    }
    else {
        let oldThisIncorrectScore = parseInt(document.getElementById("thisIncorrectScore").innerText);
        document.getElementById("thisIncorrectScore").innerText = ++oldThisIncorrectScore;
        let oldAllIncorrectScore = parseInt(document.getElementById("allIncorrectScore").innerText);
        document.getElementById("allIncorrectScore").innerText = ++oldAllIncorrectScore;
    }
}


/**
 * Interrogate the DOM to find the current quiz type and determine the last question number
 * displayed to the user.
 */
function determineCurrentQuiz() {
    let quizTypeWords = document.getElementById("quizHeading").innerHTML.toLowerCase();
    let quizType = quizTypeWords.split(" ")[1];

    return quizType;
}


/**
 * Interrogate the DOM to find the last question number displayed to the user in the current
 * quiz category..
 */
function determineCurrentQuestion() {
    let questionNumberWords = document.getElementById("questionNumber").innerHTML;
    let lastQuestionNumber = questionNumberWords.split(" ")[1];

    return lastQuestionNumber;
}


/**
 * Each quiz category contains five questions by default. More questions may be added to any
 * category without necessitating code changes.
 */
const quizzes = {
	football   : [{question: "Paul McGrath played for which club in 1990?", suggestedAnswers: ["Manchester United", "St. Patrick's Athletic", "Aston Villa"], rightAnswer: "Aston Villa"},
                      {question: "Which team won the first FA Cup Final played in the old Wembley Stadium?", suggestedAnswers: ["Bolton Wanderers", "West Ham", "Arsenal"], rightAnswer: "Bolton Wanderers"},
                      {question: "In which season were substitutes first allowed in English League football?", suggestedAnswers: ["1959-60", "1965-66", "1971-72"], rightAnswer: "1965-66"},
                      {question: "Who was the leading scorer at the 1970 World Cup finals?", suggestedAnswers: ["Pele", "Gerd Muller", "Bobby Charlton"], rightAnswer: "Gerd Muller"},
                      {question: "Which country hosted the World Cup finals in 1962?", suggestedAnswers: ["Uruguay", "Sweden", "Chile"], rightAnswer: "Chile"}],
        history    : [{question: "Lev Davidovich Bronstein was the real name of which historical person?", suggestedAnswers: ["Stalin", "Rasputin", "Trotsky"], rightAnswer: "Trotsky"},
                      {question: "On what date in 1941 did the Japanese attack on Pearl Harbour occur?", suggestedAnswers: ["5th January", "6th June", "7th December"], rightAnswer: "7th December"},
                      {question: "Who was the Prime Minister of Britain during the Abdication Crisis in 1936?", suggestedAnswers: ["Stanley Baldwin", "Neville Chamberlain", "Winston Churchill"], rightAnswer: "Stanley Baldwin"},
                      {question: "Which French monarch was known as The Sun King?", suggestedAnswers: ["Charles IV", "Louis XIV", "Louis XVI"], rightAnswer: "Louis XIV"},
                      {question: "John F. Kennedy succeeded whom as President of the USA?", suggestedAnswers: ["Harry S. Truman", "Dwight D. Eisenhower", "Lyndon B. Johnson"], rightAnswer: "Dwight D. Eisenhower"}],
        literature : [{question: "Eric Blair was the real name of which author?", suggestedAnswers: ["Nevil Shute", "George Orwell", "Somerset Maugham"], rightAnswer: "George Orwell"},
                      {question: "Who won the Nobel Prize for Literature in 1953?", suggestedAnswers: ["Ernest Hemingway", "Jean Paul Sartre", "Winston Churchill"], rightAnswer: "Winston Churchill"},
                      {question: "Who is the author of the novel Brighton Rock?", suggestedAnswers: ["Aldous Huxley", "Gore Vidal", "Graham Greene"], rightAnswer: "Graham Greene"},
                      {question: "Which English poet died in Venice on 12th December, 1889?", suggestedAnswers: ["Alfred Lord Tennyson", "John Keats", "Robert Browning"], rightAnswer: "Robert Browning"},
                      {question: "In which Charles Dickens book does Little Nell appear?", suggestedAnswers: ["The Old Curiosity Shop", "Bleak House", "Oliver Twist"], rightAnswer: "The Old Curiosity Shop"}],
        science    : [{question: "What would a scientist keep in a Leyden Jar?", suggestedAnswers: ["Acids", "Electrical Charge", "Anti-matter"], rightAnswer: "Electrical Charge"},
                      {question: "Which of these elements is the heaviest?", suggestedAnswers: ["Carbon", "Nitrogen", "Oxygen"], rightAnswer: "Oxygen"},
                      {question: "Ichthyology is the study of what?", suggestedAnswers: ["Fish", "Insects", "Bats"], rightAnswer: "Fish"},
                      {question: "Basalt is an example of which type of rock?", suggestedAnswers: ["Metamorphic", "Igneous", "Sedimentary"], rightAnswer: "Igneous"},
                      {question: "Crick and Watson specialised in which branch of science?", suggestedAnswers: ["Nuclear Physics", "Electromagnetism", "Genetics"], rightAnswer: "Genetics"}],
};
