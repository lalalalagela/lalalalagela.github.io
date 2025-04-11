const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");
const recentList = document.getElementById("recent-list");
const clearBtn = document.getElementById("clear-recent-btn");

function loadRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    
    if (recentList) {
        recentList.innerHTML = "";
        
        if (recentSearches.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No recent searches yet";
            li.classList.add("no-searches");
            li.addEventListener("click", () => {
                window.location.href = "html.html";
            });
            recentList.appendChild(li);
        } else {
            recentSearches.forEach(word => {
                const li = document.createElement("li");
                li.textContent = word;
                li.addEventListener("click", () => {
                    window.location.href = `html.html?word=${word}`;
                });
                recentList.appendChild(li);
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadRecentSearches();
    
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            localStorage.removeItem("recentSearches");
            loadRecentSearches(); 
        });
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const wordParam = urlParams.get("word");
    
    if (wordParam && document.getElementById("inp-word")) {
        document.getElementById("inp-word").value = wordParam;
        btn.click();
    }
});

function saveSearch(word) {
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    
    recentSearches = recentSearches.filter(item => item.toLowerCase() !== word.toLowerCase());
    
    recentSearches.unshift(word);
    
    if (recentSearches.length > 10) {
        recentSearches = recentSearches.slice(0, 10);
    }
    
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

if (btn) {
    btn.addEventListener("click", () => {
        if (result) result.style.display = "block"; 

        let inpWord = document.getElementById("inp-word").value;
        if (!inpWord.trim()) return; 
        
        saveSearch(inpWord);
        
        fetch(`${url}${inpWord}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (result) {
                    result.innerHTML = `
                    <div class="word">
                        <h3>${inpWord}</h3>
                    </div>
                    <div class="details">
                        <p>${data[0].meanings[0].partOfSpeech}</p>
                        <p>/${data[0].phonetic || ''}/</p>
                    </div>
                    <p class="word-meaning">
                       ${data[0].meanings[0].definitions[0].definition}
                    </p>
                    <p class="word-example">
                        ${data[0].meanings[0].definitions[0].example || ""}
                    </p>
                    <p class="word-synonyms">
                        Synonyms: ${data[0].meanings[0].synonyms && data[0].meanings[0].synonyms.length > 0 ? data[0].meanings[0].synonyms.join(', ') : "None"}
                    </p>
                    <p class="word-antonyms">
                        Antonyms: ${data[0].meanings[0].antonyms && data[0].meanings[0].antonyms.length > 0 ? data[0].meanings[0].antonyms.join(', ') : "None"}
                    </p>`;
                }
            })
            .catch(() => {
                if (result) {
                    result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
                }
            });
    });
}