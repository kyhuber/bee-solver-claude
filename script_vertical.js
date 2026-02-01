let dictionaryGeneral = new Set();
let dictionaryPopular = new Set();

async function loadDictionaries() {
    const statusEl = document.getElementById('statusMessage');
    const solveBtn = document.getElementById('solveButton');
    try {
        const responseGeneral = await fetch('cleaned_dictionary.txt');
        const textGeneral = await responseGeneral.text();
        dictionaryGeneral = new Set(textGeneral.split('\n').map(word => word.trim().toLowerCase()));

        const responsePopular = await fetch('cleaned_popular.txt');
        const textPopular = await responsePopular.text();
        dictionaryPopular = new Set(textPopular.split('\n').map(word => word.trim().toLowerCase()));

        statusEl.textContent = '';
        statusEl.classList.add('loaded');
        solveBtn.disabled = false;
    } catch (error) {
        console.error('Error loading dictionaries:', error);
        statusEl.textContent = 'Could not load word lists. Check that cleaned_dictionary.txt and cleaned_popular.txt are present.';
        statusEl.classList.add('error');
    }
}

function getLetters() {
    return [
        document.getElementById('centerLetter').value,
        document.getElementById('letter1').value,
        document.getElementById('letter2').value,
        document.getElementById('letter3').value,
        document.getElementById('letter4').value,
        document.getElementById('letter5').value,
        document.getElementById('letter6').value
    ].map(letter => letter.trim().toLowerCase());
}

function findSolutionWords() {
    const letters = getLetters();
    const validLetters = letters.filter(c => c.length === 1 && /^[a-z]$/.test(c));
    if (validLetters.length !== 7) {
        alert('Please enter exactly 7 letters (A–Z): one center letter and six outer letters.');
        return;
    }
    if (new Set(validLetters).size !== 7) {
        alert('All 7 letters must be different.');
        return;
    }

    const solutionWordsGeneral = findWords(dictionaryGeneral, letters);
    const solutionWordsPopular = findWords(dictionaryPopular, letters);
    const pangrams = findPangrams(solutionWordsGeneral, letters);

    // Right column: all words that are NOT in popular (no duplication)
    const popularSet = new Set(solutionWordsPopular);
    const solutionWordsOther = solutionWordsGeneral.filter(word => !popularSet.has(word));

    const sortWords = (arr) => [...arr].sort((a, b) => a.localeCompare(b));
    displaySolutionWords(sortWords(solutionWordsPopular), 'solutionListPopular');
    displaySolutionWords(sortWords(solutionWordsOther), 'solutionListGeneral');
    displaySolutionWords(sortWords(pangrams), 'solutionListPangrams');
    updateCounts(pangrams.length, solutionWordsPopular.length, solutionWordsOther.length);
    togglePangramVisibility();
}

function updateCounts(pangramCount, popularCount, generalCount) {
    document.getElementById('pangramCount').textContent = `(${pangramCount})`;
    document.getElementById('popularCount').textContent = `(${popularCount})`;
    document.getElementById('generalCount').textContent = `(${generalCount})`;
}

function togglePangramVisibility() {
    const pangramList = document.getElementById('solutionListPangrams');
    const pangramToggle = document.getElementById('pangramToggle');

    if (pangramToggle.checked) {
        pangramList.classList.remove('hidden');
    } else {
        pangramList.classList.add('hidden');
    }
}

function handleLetterInput(event) {
    const currentInput = event.target;
    const key = event.key;
    const value = currentInput.value;

    // Restrict to single A–Z letter
    if (value.length > 0) {
        const lastChar = value.slice(-1).toUpperCase();
        if (!/^[A-Z]$/.test(lastChar)) {
            currentInput.value = value.slice(0, -1).replace(/[^a-zA-Z]/g, '');
            return;
        }
        currentInput.value = lastChar;
    }

    const currentIndex = parseInt(currentInput.getAttribute('tabindex'));
    if (key === 'Enter' || currentInput.value.length === 1) {
        const nextInput = document.querySelector(`input[tabindex="${currentIndex + 1}"]`);
        if (nextInput) {
            nextInput.focus();
        } else {
            document.getElementById('solveButton').focus();
        }
    }
}

function handleLetterKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleLetterInput(event);
    }
}

function findWords(dictionary, letters) {
    return Array.from(dictionary).filter(word =>
        word.includes(letters[0]) && // Make sure word includes the center letter
        word.split('').every(letter => letters.includes(letter))
    );
}

function clearInputs() {
    const letterInputs = document.querySelectorAll('.letter-input');
    letterInputs.forEach(input => {
        input.value = '';
    });
    document.getElementById('centerLetter').focus();

    const solutionLists = document.querySelectorAll('.solutionList');
    solutionLists.forEach(list => {
        list.innerHTML = '';
    });
    updateCounts(0, 0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    loadDictionaries();
    document.getElementById('solveButton').addEventListener('click', findSolutionWords);
    document.getElementById('clearButton').addEventListener('click', clearInputs);
    document.getElementById('pangramToggle').addEventListener('change', togglePangramVisibility);
    const letterInputs = document.querySelectorAll('.letter-input');
    letterInputs.forEach(input => {
        input.addEventListener('input', handleLetterInput);
        input.addEventListener('keydown', handleLetterKeydown);
    });
});

function findPangrams(words, letters) {
    return words.filter(word => {
        const uniqueLetters = new Set(word.split(''));
        return uniqueLetters.size === letters.length;
    });
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
