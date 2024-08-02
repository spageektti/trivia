// index
async function fetchAndSetToken() {
    try {
        const response = await fetch('https://opentdb.com/api_token.php?command=request');
        const data = await response.json();
        if (data.token) {
            document.getElementById('token').value = data.token;
        } else {
            console.error('Token not found in the response:', data);
        }
    } catch (error) {
        console.error('Error fetching the token:', error);
    }
}

async function fetchAndPopulateCategories() {
    try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        if (data.trivia_categories) {
            const categorySelect = document.getElementById('category');
            data.trivia_categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } else {
            console.error('Categories not found in the response:', data);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// app
async function fetchAndDisplayQuestions() {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get('amount');
    const category = urlParams.get('category');
    const difficulty = urlParams.get('difficulty');
    const type = urlParams.get('type');
    const token = urlParams.get('token');

    let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;
    if (category) apiUrl += `&category=${category}`;
    if (difficulty) apiUrl += `&difficulty=${difficulty}`;
    if (type) apiUrl += `&type=${type}`;
    if (token) apiUrl += `&token=${token}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.results) {
            displayQuestions(data.results);
        } else {
            console.error('No questions found in the response:', data);
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

let currentQuestionIndex = 0;
let correctAnswers = 0;
let questions = [];

function displayQuestions(fetchedQuestions) {
    questions = fetchedQuestions;
    showQuestion();
    document.getElementById('next').addEventListener('click', showQuestion);
}

function showQuestion() {
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const nextButton = document.getElementById('next');
    const backToHomeButton = document.getElementById('home');

    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        questionElement.innerHTML = question.question;

        answersElement.innerHTML = '';

        let answers = [...question.incorrect_answers, question.correct_answer];
        answers = shuffleArray(answers);

        answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerHTML = answer;
            button.addEventListener('click', () => selectAnswer(answer, question.correct_answer));
            answersElement.appendChild(button);
        });

        nextButton.style.display = 'none';
    } else {
        questionContainer.style.display = 'none';
        nextButton.style.display = 'none';
        backToHomeButton.style.display = 'block';
        document.getElementById('result').innerHTML = `You have completed the quiz!<br>You correctly answered ${correctAnswers} questions(${correctAnswers / currentQuestionIndex * 100}%).`;
    }
}

function selectAnswer(selectedAnswer, correctAnswer) {
    const nextButton = document.getElementById('next');
    const buttons = document.getElementById('answers').getElementsByTagName('button');

    if (selectAnswer === correctAnswer) {
        correctAnswers++;
    }

    for (let button of buttons) {
        button.disabled = true;
        if (button.innerHTML === correctAnswer) {
            button.style.backgroundColor = 'green';
        } else if (button.innerHTML === selectedAnswer) {
            button.style.backgroundColor = 'red';
        }
    }

    currentQuestionIndex++;
    nextButton.style.display = 'block';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
