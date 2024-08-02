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
let questions = [];

function displayQuestions(fetchedQuestions) {

}

function showQuestion() {
}

function selectAnswer(selectedAnswer, correctAnswer) {

}
