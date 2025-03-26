// Elementos do DOM
const rosaryContainer = document.getElementById('rosary');
const prayerPopup = document.getElementById('prayerPopup');
const mysteryChoice = document.getElementById('mysteryChoice');
const languageChoice = document.getElementById('languageChoice');
const mysteryText = document.getElementById('mysteryText');
const playAudioButton = document.getElementById('playAudio');
const pauseAudioButton = document.getElementById('pauseAudio');
const youtubePlayer = document.getElementById('youtubePlayer');

// Dados das orações e mistérios
let prayersPortugues = {};
let prayersLatin = {};
let mysteries = {};

// Links dos vídeos do Frei Gilson no YouTube
const audioLinks = {
    gozosos: 'https://www.youtube.com/embed/EKTz4C44aEc?enablejsapi=1',
    dolorosos: 'https://www.youtube.com/embed/0_jGY4bB0lw?enablejsapi=1&start=185',
    gloriosos: 'https://www.youtube.com/embed/j84Cg9GYO3o?enablejsapi=1',
    luminosos: 'https://www.youtube.com/embed/lO0uMSJa8g0?enablejsapi=1'
};

// Carregar a API do YouTube
let player;
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Função chamada pela API do YouTube quando estiver pronta
window.onYouTubeIframeAPIReady = function() {
    updateAudioPlayer();
};

// Carregar dados das orações e mistérios
async function loadData() {
    try {
        const [translationsResponse, portuguesResponse, latinResponse, mysteriesResponse] = await Promise.all([
            fetch('translations.json'),
            fetch('prayers.json'),
            fetch('prayers_latin.json'),
            fetch('mysteries.json')
        ]);

        const translationsData = await translationsResponse.json();
        prayersPortugues = { ...translationsData.translations.portugues.prayers, ...(await portuguesResponse.json()).portugues.prayers };
        prayersLatin = { ...translationsData.translations.latim.prayers, ...(await latinResponse.json()).latim.prayers };
        mysteries = await mysteriesResponse.json();

        updateRosary();
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        prayerPopup.textContent = 'Erro ao carregar os dados. Verifique os arquivos JSON.';
        prayerPopup.classList.add('active');
    }
}

// Criar um item do terço
function createRosaryItem(prayerType, imgSrc, tooltipText, mysteryTitle = '') {
    const item = document.createElement('div');
    item.classList.add('rosary-item');
    const tooltip = mysteryTitle ? `${tooltipText} - ${mysteryTitle}` : tooltipText;
    const className = prayerType === 'Sinal da Cruz' ? 'cross' : prayerType === 'Salve Rainha' ? 'pendant' : 'bead';
    item.innerHTML = `
        <div class="${className}" data-prayer="${prayerType}">
            <img src="imagens/${imgSrc}" alt="${prayerType}">
            <span class="tooltip">${tooltip}</span>
        </div>
        <input type="checkbox" class="checkbox" data-tooltip="${tooltip}">
    `;
    return item;
}

// Criar uma dezena do terço
function createDecade(mysteryIndex, selectedMysteries, language) {
    const decade = document.createElement('div');
    decade.classList.add('decade');
    const mysteryTitle = selectedMysteries[mysteryIndex].split('\n')[0];

    // Pai Nosso
    decade.appendChild(createRosaryItem(
        'Pai Nosso',
        'bola-azul-simples-feita-de-borracha-plastica-ou-borracha_689083-87-Photoroom.png',
        language === 'portugues' ? "Reze o 'Pai Nosso'" : "Ora 'Pater Noster'",
        mysteryTitle
    ));

    // 10 Ave Marias
    for (let i = 1; i <= 10; i++) {
        decade.appendChild(createRosaryItem(
            'Ave Maria',
            'images__1_-removebg-preview.png',
            language === 'portugues' ? `Reze a 'Ave Maria' (${i} de 10)` : `Ora 'Ave Maria' (${i} ex 10)`,
            mysteryTitle
        ));
    }

    // Glória
    decade.appendChild(createRosaryItem(
        'Glória',
        'bola-azul-simples-feita-de-borracha-plastica-ou-borracha_689083-87-Photoroom.png',
        language === 'portugues' ? "Reze o 'Glória ao Pai'" : "Ora 'Gloria Patri'",
        mysteryTitle
    ));

    // Ó Meu Jesus
    decade.appendChild(createRosaryItem(
        'Ó Meu Jesus',
        'bola-azul-simples-feita-de-borracha-plastica-ou-borracha_689083-87-Photoroom.png',
        language === 'portugues' ? "Reze o 'Ó Meu Jesus'" : "Ora 'O Jesu mi'",
        mysteryTitle
    ));

    return decade;
}

// Atualizar o player de áudio com base no mistério selecionado
function updateAudioPlayer() {
    const selectedMystery = mysteryChoice.value;
    const videoUrl = audioLinks[selectedMystery];

    if (player) {
        player.destroy(); // Destroi o player anterior para evitar múltiplos players
    }

    player = new YT.Player('youtubePlayer', {
        height: '0', // Oculta o vídeo
        width: '0',
        videoId: videoUrl.split('/embed/')[1].split('?')[0],
        playerVars: {
            autoplay: 0, // Não inicia automaticamente
            controls: 0, // Remove controles padrão do YouTube
            modestbranding: 1,
            start: videoUrl.includes('start=') ? parseInt(videoUrl.split('start=')[1]) : 0
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

// Quando o player estiver pronto
function onPlayerReady(event) {
    playAudioButton.addEventListener('click', () => {
        event.target.playVideo();
    });
    pauseAudioButton.addEventListener('click', () => {
        event.target.pauseVideo();
    });
}

// Atualizar o terço
function updateRosary() {
    const selectedMystery = mysteryChoice.value;
    const selectedMysteries = mysteries[selectedMystery];
    const language = languageChoice.value;
    const currentPrayers = language === 'portugues' ? prayersPortugues : prayersLatin;

    rosaryContainer.innerHTML = '';

    // Introdução do terço
    rosaryContainer.appendChild(createRosaryItem(
        'Sinal da Cruz',
        'Free-Cross-With-Jesus-Background-Black-and-White-SVG-Vector-File-for-Laser-Cutting-3-Photoroom.png',
        language === 'portugues' ? "Faça o 'Sinal da Cruz' e reze o 'Creio'" : "Fac 'Signum Crucis' et ora 'Credo'"
    ));
    rosaryContainer.appendChild(createRosaryItem(
        'Pai Nosso',
        'bola-azul-simples-feita-de-borracha-plastica-ou-borracha_689083-87-Photoroom.png',
        language === 'portugues' ? "Reze o 'Pai Nosso'" : "Ora 'Pater Noster'"
    ));
    for (let i = 1; i <= 3; i++) {
        rosaryContainer.appendChild(createRosaryItem(
            'Ave Maria',
            'images__1_-removebg-preview.png',
            language === 'portugues' ? `Reze a 'Ave Maria' (${i}ª de 3)` : `Ora 'Ave Maria' (${i}ª ex 3)`
        ));
    }
    rosaryContainer.appendChild(createRosaryItem(
        'Glória',
        'bola-azul-simples-feita-de-borracha-plastica-ou-borracha_689083-87-Photoroom.png',
        language === 'portugues' ? "Reze o 'Glória ao Pai'" : "Ora 'Gloria Patri'"
    ));

    // Cinco dezenas
    for (let i = 0; i < 5; i++) {
        rosaryContainer.appendChild(createDecade(i, selectedMysteries, language));
        if (i < 4) {
            const separator = document.createElement('div');
            separator.classList.add('decade-separator');
            rosaryContainer.appendChild(separator);
        }
    }

    // Conclusão com Salve Rainha
    rosaryContainer.appendChild(createRosaryItem(
        'Salve Rainha',
        'popsocket_nossa_senhora_1-Photoroom.png',
        language === 'portugues' ? "Reze a 'Salve Rainha'" : "Ora 'Salve Regina'"
    ));

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

    addPrayerEvents(currentPrayers);
    updateAudioPlayer(); // Atualiza o áudio quando o mistério muda
}

// Adicionar eventos de clique e checkbox
function addPrayerEvents(currentPrayers) {
    document.querySelectorAll('.rosary-item').forEach(item => {
        const checkbox = item.querySelector('.checkbox');
        const element = item.querySelector('.bead, .cross, .pendant');
        const prayerType = element.getAttribute('data-prayer');

        checkbox.addEventListener('change', () => {
            item.classList.toggle('completed', checkbox.checked);
        });

        element.addEventListener('click', () => {
            const fullPrayer = prayerType === 'Sinal da Cruz' 
                ? `${currentPrayers['Sinal da Cruz']}\n\n${currentPrayers['Creio']}` 
                : currentPrayers[prayerType];
            prayerPopup.textContent = fullPrayer;
            prayerPopup.classList.toggle('active');
        });
    });
}

// Fechar popup ao clicar fora
document.addEventListener('click', (e) => {
    if (!prayerPopup.contains(e.target) && !e.target.closest('.bead, .cross, .pendant')) {
        prayerPopup.classList.remove('active');
    }
});

// Event listeners para atualização do terço
mysteryChoice.addEventListener('change', updateRosary);
languageChoice.addEventListener('change', updateRosary);

// Inicializar
loadYouTubeAPI();
loadData();