let dictionaryGeneral = new Set();
let dictionaryPopular = new Set();

async function loadDictionaries() {
    try {
        const responseGeneral = await fetch('cleaned_dictionary.txt');
        const textGeneral = await responseGeneral.text();
        dictionaryGeneral = new Set(textGeneral.split('\n').map(word => word.trim().toLowerCase()));

        const responsePopular = await fetch('cleaned_popular.txt');
        const textPopular = await responsePopular.text();
        dictionaryPopular = new Set(textPopular.split('\n').map(word => word.trim().toLowerCase()));
    } catch (error) {
        console.error('Error loading dictionaries:', error);
    }
}

function findSolutionWords() {
    const letters = [
        document.getElementById('centerLetter').value,
        document.getElementById('letter1').value,
        document.getElementById('letter2').value,
        document.getElementById('letter3').value,
        document.getElementById('letter4').value,
        document.getElementById('letter5').value,
        document.getElementById('letter6').value
    ].map(letter => letter.toLowerCase());

    const solutionWordsGeneral = findWords(dictionaryGeneral, letters);
    const solutionWordsPopular = findWords(dictionaryPopular, letters);

    displaySolutionWords(solutionWordsGeneral, 'solutionListGeneral');
    displaySolutionWords(solutionWordsPopular, 'solutionListPopular');
}

function findWords(dictionary, letters) {
    return Array.from(dictionary).filter(word =>
        word.includes(letters[0]) && // Make sure word includes the center letter
        word.split('').every(letter => letters.includes(letter))
    );
}

function displaySolutionWords(words, elementId) {
    const solutionList = document.getElementById(elementId);
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
    loadDictionaries();
    document.getElementById('solveButton').addEventListener('click', findSolutionWords);
});
