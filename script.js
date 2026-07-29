// --- Mock Data & State Management ---
let currentLang = 'TR';

const mockNews = [
    {
        id: 1,
        category: 'altin',
        titleTR: 'Altın Fiyatlarında Rekor Sonrası Kar Satışları Başladı',
        titleEN: 'Profit Taking Begins in Gold After Record Highs',
        descTR: 'Ons altın küresel faiz beklentileriyle geri çekilme yaşıyor.',
        descEN: 'Spot gold pulls back amid global interest rate expectations.',
        img: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=500&q=80',
        date: '15 Dk Önce'
    },
    {
        id: 2,
        category: 'forex',
        titleTR: 'EUR/USD Paritesi Kritik Direnç Seviyesinde',
        titleEN: 'EUR/USD Pair Test Critical Resistance Level',
        descTR: 'Avrupa Merkez Bankası açıklamaları Euro üzerinde etkili oluyor.',
        descEN: 'ECB statements continue to impact the Euro dynamic.',
        img: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=80',
        date: '45 Dk Önce'
    },
    {
        id: 3,
        category: 'kripto',
        titleTR: 'Bitcoin 64,000$ Seviyesinde Güç Topluyor',
        titleEN: 'Bitcoin Consolidates Around $64,000 Mark',
        descTR: 'Kripto para piyasalarında hacim yeniden artışa geçti.',
        descEN: 'Trading volume in crypto markets is rising again.',
        img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
        date: '1 Saat Önce'
    },
    {
        id: 4,
        category: 'forex',
        titleTR: 'Petrol Fiyatları Arz Endişeleriyle Yükselişte',
        titleEN: 'Oil Prices Surge on Supply Concerns',
        descTR: 'Brent petrol varil fiyatı 82 Doların üzerine çıktı.',
        descEN: 'Brent crude surpasses $82 amid geopolitical tensions.',
        img: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=500&q=80',
        date: '2 Saat Önce'
    }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initTradingViewWidget();
    renderNews('all');
    setupEvents();
    fetchLivePrices();
    
    // Live price update simulation every 5 seconds
    setInterval(fetchLivePrices, 5000);
});

// --- Embedded TradingView Chart ---
function initTradingViewWidget() {
    if (typeof TradingView !== 'undefined') {
        new TradingView.widget({
            "width": "100%",
            "height": 320,
            "symbol": "OANDA:XAUUSD",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "tr",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_chart"
        });
    }
}

// --- Render News Cards ---
function renderNews(category) {
    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = '';

    const filtered = category === 'all' 
        ? mockNews 
        : mockNews.filter(n => n.category === category);

    filtered.forEach(item => {
        const title = currentLang === 'TR' ? item.titleTR : item.titleEN;
        const desc = currentLang === 'TR' ? item.descTR : item.descEN;

        const card = document.createElement('article');
        card.className = 'news-card fade-in';
        card.innerHTML = `
            <img src="${item.img}" alt="${title}">
            <div class="news-card-body">
                <span class="badge gold">${item.category.toUpperCase()}</span>
                <h4>${title}</h4>
                <p>${desc}</p>
                <span class="news-date"><i class="far fa-clock"></i> ${item.date}</span>
            </div>
        `;
        newsGrid.appendChild(card);
    });
}

// --- UI Events & Language Toggle ---
function setupEvents() {
    // Language Toggle
    const langBtn = document.getElementById('lang-toggle');
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'TR' ? 'EN' : 'TR';
        langBtn.textContent = currentLang === 'TR' ? 'EN' : 'TR';
        
        // Translate Static Data Attributes
        document.querySelectorAll('[data-tr]').forEach(el => {
            el.textContent = currentLang === 'TR' ? el.getAttribute('data-tr') : el.getAttribute('data-en');
        });

        // Translate Placeholders
        document.querySelectorAll('[data-tr-placeholder]').forEach(el => {
            el.placeholder = currentLang === 'TR' ? el.getAttribute('data-tr-placeholder') : el.getAttribute('data-en-placeholder');
        });

        renderNews('all');
    });

    // Category Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderNews(e.target.getAttribute('data-cat'));
        });
    });

    // Simple Search Filter
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.news-card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
}

// --- Dynamic Prices Simulation (CoinGecko & Mock Data) ---
async function fetchLivePrices() {
    try {
        // Fetch Crypto Prices via CoinGecko API
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();

        if (data.bitcoin) {
            updatePriceElement('btc-price', 'btc-change', data.bitcoin.usd, data.bitcoin.usd_24h_change, '$');
            document.getElementById('side-btc').innerText = `$${data.bitcoin.usd.toLocaleString()}`;
        }
        if (data.ethereum) {
            updatePriceElement('eth-price', 'eth-change', data.ethereum.usd, data.ethereum.usd_24h_change, '$');
        }

        // Mock updates for FX/Gold (Simulating real-time market fluctuations)
        const mockGold = 2385.50 + (Math.random() * 2 - 1);
        updatePriceElement('gold-price', 'gold-change', mockGold.toFixed(2), 0.45, '$');
        document.getElementById('side-xau').innerText = `$${mockGold.toFixed(2)}`;

        const mockEur = 1.0890 + (Math.random() * 0.001 - 0.0005);
        updatePriceElement('eurusd-price', 'eurusd-change', mockEur.toFixed(4), -0.12, '');
        document.getElementById('side-eur').innerText = mockEur.toFixed(4);

    } catch (error) {
        console.log('Fiyat güncelleme hatası:', error);
    }
}

function updatePriceElement(priceId, changeId, price, change, symbol = '') {
    const priceEl = document.getElementById(priceId);
    const changeEl = document.getElementById(changeId);

    if (priceEl) priceEl.innerText = `${symbol}${price}`;
    if (changeEl) {
        const isPositive = change >= 0;
        changeEl.innerText = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
        changeEl.className = `change ${isPositive ? 'up' : 'down'}`;
    }
}