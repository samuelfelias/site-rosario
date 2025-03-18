const rosaryContainer = document.getElementById('rosary');
const prayerPopup = document.getElementById('prayerPopup');
const mysteryChoice = document.getElementById('mysteryChoice');
const languageChoice = document.getElementById('languageChoice');
const themeChoice = document.getElementById('themeChoice');
const mysteryText = document.getElementById('mysteryText');

// Theme handling
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update active state on theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
    
    // Keep dropdown in sync (for compatibility)
    themeChoice.value = theme;
}

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);
themeChoice.value = savedTheme;

// Theme change event listeners
themeChoice.addEventListener('change', (e) => {
    setTheme(e.target.value);
});

// Theme toggle buttons event listeners
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        setTheme(theme);
    });
    
    // Set initial active state
    if (btn.getAttribute('data-theme') === savedTheme) {
        btn.classList.add('active');
    }
});
let prayersPortugues = {}; // Orações em português
let prayersLatin = {}; // Orações em latim
let mysteries = {}; // Mistérios detalhados em português

// Carregar as orações e mistérios dos arquivos JSON
async function loadData() {
    try {
        const [portuguesResponse, latinResponse, mysteriesResponse] = await Promise.all([
            fetch('prayers.json'),
            fetch('prayers_latin.json'),
            fetch('mysteries.json')
        ]);
        prayersPortugues = await portuguesResponse.json().then(data => data.portugues.prayers);
        prayersLatin = await latinResponse.json().then(data => data.latim.prayers);
        mysteries = await mysteriesResponse.json();
        updateRosary(); // Inicializar o terço após carregar os dados
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        prayerPopup.textContent = 'Erro ao carregar os dados. Verifique os arquivos JSON.';
        prayerPopup.classList.add('active');
    }
}

// Função para criar um mistério (dezena)
function createMystery(mysteryIndex, selectedMysteries, language) {
    const decade = document.createElement('div');
    decade.classList.add('decade');

    const blueBead = document.createElement('div');
    blueBead.classList.add('rosary-item');
    blueBead.innerHTML = `
        <div class="bead" data-prayer="Pai Nosso">
            <img src="imagens/bola-azul-simples-feita-de-borracha-plastica-ou-borracha_689083-87-Photoroom.png" alt="Bola Azul">
            <span class="tooltip">${language === 'portugues' ? "Reze o 'Pai Nosso'" : "Ora 'Pater Noster'"} - ${selectedMysteries[mysteryIndex].split('\n')[0]}</span>
        </div>
        <input type="checkbox" class="checkbox" data-tooltip="${language === 'portugues' ? "Reze o 'Pai Nosso'" : "Ora 'Pater Noster'"} - ${selectedMysteries[mysteryIndex].split('\n')[0]}">
    `;
    decade.appendChild(blueBead);

    for (let i = 1; i <= 10; i++) {
        const whiteBead = document.createElement('div');
        whiteBead.classList.add('rosary-item');
        whiteBead.innerHTML = `
            <div class="bead" data-prayer="Ave Maria">
                <img src="imagens/images__1_-removebg-preview.png" alt="Bola Branca">
                <span class="tooltip">${language === 'portugues' ? "Reze a 'Ave Maria'" : "Ora 'Ave Maria'"} (${i} de 10) - ${selectedMysteries[mysteryIndex].split('\n')[0]}</span>
            </div>
            <input type="checkbox" class="checkbox" data-tooltip="${language === 'portugues' ? "Reze a 'Ave Maria'" : "Ora 'Ave Maria'"} (${i} de 10) - ${selectedMysteries[mysteryIndex].split('\n')[0]}">
        `;
        decade.appendChild(whiteBead);
    }

    const gloriaBead = document.createElement('div');
    gloriaBead.classList.add('rosary-item');
    gloriaBead.innerHTML = `
        <div class="bead" data-prayer="Glória">
            <img src="imagens/bola-azul-simples-feita-de-borracha-plastica-ou-borracha_689083-87-Photoroom.png" alt="Bola Azul">
            <span class="tooltip">${language === 'portugues' ? "Reze o 'Glória ao Pai'" : "Ora 'Gloria Patri'"} - ${selectedMysteries[mysteryIndex].split('\n')[0]}</span>
        </div>
        <input type="checkbox" class="checkbox" data-tooltip="${language === 'portugues' ? "Reze o 'Glória ao Pai'" : "Ora 'Gloria Patri'"} - ${selectedMysteries[mysteryIndex].split('\n')[0]}">
    `;
    decade.appendChild(gloriaBead);

    return decade;
}

// Atualizar o terço com base nas seleções
function updateRosary() {
    const selectedMystery = mysteryChoice.value;
    const selectedMysteries = mysteries[selectedMystery];
    const language = languageChoice.value;
    const prayers = language === 'portugues' ? prayersPortugues : prayersLatin;

    rosaryContainer.innerHTML = `
        <div class="rosary-item">
            <div class="cross" data-prayer="Sinal da Cruz">
                <img src="imagens/Free-Cross-With-Jesus-Background-Black-and-White-SVG-Vector-File-for-Laser-Cutting-3-Photoroom.png" alt="Cruz">
                <span class="tooltip">${language === 'portugues' ? "Faça o 'Sinal da Cruz' e reze o 'Creio'" : "Fac 'Signum Crucis' et ora 'Credo'"}</span>
            </div>
            <input type="checkbox" class="checkbox" data-tooltip="${language === 'portugues' ? "Reze o 'Sinal da Cruz' e o 'Creio'" : "Ora 'Signum Crucis' et 'Credo'"}">
        </div>
        <div class="rosary-item">
            <div class="bead" data-prayer="Pai Nosso">
                <img src="imagens/bola-azul-simples-feita-de-borracha-plastica-ou-borracha_689083-87-Photoroom.png" alt="Bola Azul">
                <span class="tooltip">${language === 'portugues' ? "Reze o 'Pai Nosso'" : "Ora 'Pater Noster'"}</span>
            </div>
            <input type="checkbox" class="checkbox" data-tooltip="${language === 'portugues' ? "Reze o 'Pai Nosso'" : "Ora 'Pater Noster'"}">
        </div>
        <div class="rosary-item">
            <div class="bead" data-prayer="Ave Maria">
                <img src="imagens/images__1_-removebg-preview.png" alt="Bola Branca">
                <span class="tooltip">${language === 'portugues' ? "Reze a 'Ave Maria' (1ª de 3)" : "Ora 'Ave Maria' (1ª ex 3)"}</span>
            </div>
            <input type="checkbox" class="checkbox" data-tooltip="${language === 'portugues' ? "Reze a 'Ave Maria'" : "Ora 'Ave Maria'"}">
        </div>
        <div class="rosary-item">
            <div class="bead" data-prayer="Ave Maria">
                <img src="imagens/images__1_-removebg-preview.png" alt="Bola Branca">
                <span class="tooltip">${language === 'portugues' ? "Reze a 'Ave Maria' (2ª de 3)" : "Ora 'Ave Maria' (2ª ex 3)"}</span>
            </div>
            <input type="checkbox" class="checkbox" data-tooltip="${language === 'portugues' ? "Reze a 'Ave Maria'" : "Ora 'Ave Maria'"}">
        </div>
        <div class="rosary-item">
            <div class="bead" data-prayer="Ave Maria">
                <img src="imagens/images__1_-removebg-preview.png" alt="Bola Branca">
                <span class="tooltip">${language === 'portugues' ? "Reze a 'Ave Maria' (3ª de 3)" : "Ora 'Ave Maria' (3ª ex 3)"}</span>
            </div>
            <input type="checkbox" class="checkbox" data-tooltip="${language === 'portugues' ? "Reze a 'Ave Maria'" : "Ora 'Ave Maria'"}">
        </div>
        <div class="rosary-item">
            <div class="bead" data-prayer="Glória">
                <img src="imagens/bola-azul-simples-feita-de-borracha-plastica-ou-borracha_689083-87-Photoroom.png" alt="Bola Azul">
                <span class="tooltip">${language === 'portugues' ? "Reze o 'Glória ao Pai'" : "Ora 'Gloria Patri'"}</span>
            </div>
            <input type="checkbox" class="checkbox" data-tooltip="${language === 'portugues' ? "Reze o 'Glória ao Pai'" : "Ora 'Gloria Patri'"}">
        </div>
    `;

    for (let i = 0; i < 5; i++) {
        rosaryContainer.appendChild(createMystery(i, selectedMysteries, language));
        if (i < 4) {
            const separator = document.createElement('div');
            separator.classList.add('decade-separator');
            rosaryContainer.appendChild(separator);
        }
    }

    const pendant = document.createElement('div');
    pendant.classList.add('rosary-item');
    pendant.innerHTML = `
        <div class="pendant" data-prayer="Salve Rainha">
            <img src="imagens/popsocket_nossa_senhora_1-Photoroom.png" alt="Pingente">
            <span class="tooltip">${language === 'portugues' ? "Reze a 'Salve Rainha'" : "Ora 'Salve Regina'"}</span>
        </div>
        <input type="checkbox" class="checkbox" data-tooltip="${language === 'portugues' ? "Reze a 'Salve Rainha'" : "Ora 'Salve Regina'"}">
    `;
    rosaryContainer.appendChild(pendant);

    // Atualizar texto dos mistérios com links para a Bíblia
    let formattedText = `<h2>Mistérios ${selectedMystery.charAt(0).toUpperCase() + selectedMystery.slice(1)}</h2>`;
    selectedMysteries.forEach(mystery => {
        const [title, ...rest] = mystery.split('\n');
        const verseMatch = rest.join('\n').match(/\(.*?\)/);
        if (verseMatch) {
            const verse = verseMatch[0];
            const bookChapter = verse.slice(1, -1).split(',')[0].trim();
            const [book, chapter] = bookChapter.split(' ');
            const verseRange = verse.slice(1, -1).split(',')[1]?.trim() || '1';
            const url = `https://www.bibliaonline.com.br/acf/${book.toLowerCase()}/${chapter}/${verseRange}`;
            const linkedVerse = rest.join('\n').replace(verse, `<a href="${url}" target="_blank">${verse}</a>`);
            formattedText += `${title}<br>${linkedVerse}<br><br>`;
        } else {
            formattedText += `${title}<br>${rest.join('\n')}<br><br>`;
        }
    });
    mysteryText.innerHTML = formattedText;

    addEvents();
}

// Adicionar eventos aos elementos do terço
function addEvents() {
    const language = languageChoice.value;
    const prayers = language === 'portugues' ? prayersPortugues : prayersLatin;

    document.querySelectorAll('.rosary-item').forEach(item => {
        const checkbox = item.querySelector('.checkbox');
        const element = item.querySelector('.bead, .cross, .pendant');
        const prayerType = element.getAttribute('data-prayer');

        checkbox.addEventListener('change', () => {
            item.classList.toggle('completed', checkbox.checked);
        });

        element.addEventListener('click', () => {
            let fullPrayer = '';
            if (prayerType === "Sinal da Cruz") {
                fullPrayer = `${prayers["Sinal da Cruz"]}\n\n${prayers["Creio"]}`;
            } else {
                fullPrayer = prayers[prayerType];
            }
            prayerPopup.textContent = fullPrayer;
            prayerPopup.classList.toggle('active');
        });
    });
}

// Carregar dados e inicializar
loadData();

// Atualizar o terço ao mudar mistério ou idioma
mysteryChoice.addEventListener('change', updateRosary);
languageChoice.addEventListener('change', updateRosary);

// Fechar o pop-up ao clicar fora
document.addEventListener('click', (e) => {
    if (!prayerPopup.contains(e.target) && !e.target.closest('.bead, .cross, .pendant')) {
        prayerPopup.classList.remove('active');
    }
});