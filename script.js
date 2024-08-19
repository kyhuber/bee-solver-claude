let dictionary = [];

async function loadDictionary() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/kyhuber/bee-solver-claude/main/clean_dictionary.txt');
        const text = await response.text();
        dictionary = new Set(text.split('\n')
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length >= 4));
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
        document.getElementById('letter6').value
    ].map(letter => letter.toLowerCase());

    const centerLetter = document.getElementById('centerLetter').value.toLowerCase();

    const allLetters = [...letters, centerLetter];
    const solutionWords = [];

    for (const word in dictionary) {
        if (
            word.length >= 4 &&
            word.includes(centerLetter) &&
            word.split('').every(letter => allLetters.includes(letter))
        ) {
            solutionWords.push(word);
        }
    }

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