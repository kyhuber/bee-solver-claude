let dictionary = new Set();

async function loadDictionary() {
    try {
        // Assuming 'cleaned_dictionary.txt' is in the same directory as your HTML/JS files
        const response = await fetch('cleaned_popular.txt');
        const text = await response.text();
        dictionary = new Set(text.split('\n').map(word => word.trim().toLowerCase()));
        console.log("Dictionary loaded with size: ", dictionary.size);
    } catch (error) {
        console.error('Error loading dictionary:', error);
    }
}



function findSolutionWords() {
    const letters = [
        document.getElementById('letter1').value,
        document.getElementById('letter2').value,
        document.getElementById('letter3').value,
        document.getElementById('letter4').value,
        document.getElementById('letter5').value,
        document.getElementById('letter6').value,
        document.getElementById('centerLetter').value
    ].map(letter => letter.toLowerCase());
    console.log("Letters for search: ", letters);

    const solutionWords = [];

    for (const word of dictionary) {  // Use 'of' for iterating over Set
        if (word.includes(letters[6]) && word.split('').every(letter => letters.includes(letter))) {
            solutionWords.push(word);
        }
    }
    console.log("Found solution words: ", solutionWords);
    displaySolutionWords(solutionWords);
}

function displaySolutionWords(words) {
    const solutionList = document.getElementById('solutionList');
    solutionList.innerHTML = '';

    if (words.length === 0) {
        solutionList.innerHTML = '<p>No solution words found.</p>';
    } else {
        const wordList = document.createElement('ul');
        words.forEach(word => {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            wordList.appendChild(listItem);
        });
        solutionList.appendChild(wordList);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDictionary();
    document.getElementById('solveButton').addEventListener('click', findSolutionWords);
});
