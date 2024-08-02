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