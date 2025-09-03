// Elements
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const convertBtn = document.getElementById('convertBtn');
const resultContainer = document.getElementById('resultContainer');
const resultAmount = document.getElementById('resultAmount');
const resultDetails = document.getElementById('resultDetails');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const currencyImage = document.getElementById('currencyImage'); // gambar di sebelah kanan
const currencyCaption = document.getElementById('currencyCaption'); // teks di bawah gambar

// Exchange rates data
const exchangeRates = {
    USD: 1,
    EUR: 0.93,
    GBP: 0.79,
    JPY: 148.50,
    IDR: 15600.0,
    SGD: 1.34,
    AUD: 1.52,
    CAD: 1.35,
    CNY: 7.25,
    KRW: 1320.50,
    INR: 83.10,
    CHF: 0.90,
    NZD: 1.65,
    SAR: 3.75
};

// Data bendera + simbol
const currencyFlags = {
    USD: { img: "https://flagcdn.com/us.svg", symbol: "$" },
    IDR: { img: "https://flagcdn.com/id.svg", symbol: "Rp" },
    JPY: { img: "https://flagcdn.com/jp.svg", symbol: "¥" },
    EUR: { img: "https://flagcdn.com/eu.svg", symbol: "€" },
    GBP: { img: "https://flagcdn.com/gb.svg", symbol: "£" },
    AUD: { img: "https://flagcdn.com/au.svg", symbol: "A$" },
    SGD: { img: "https://flagcdn.com/sg.svg", symbol: "S$" },
    CAD: { img: "https://flagcdn.com/ca.svg", symbol: "C$" },
    CNY: { img: "https://flagcdn.com/cn.svg", symbol: "¥" },
    KRW: { img: "https://flagcdn.com/kr.svg", symbol: "₩" },
    INR: { img: "https://flagcdn.com/in.svg", symbol: "₹" },
    CHF: { img: "https://flagcdn.com/ch.svg", symbol: "CHF" },
    NZD: { img: "https://flagcdn.com/nz.svg", symbol: "NZ$" },
    SAR: { img: "https://flagcdn.com/sa.svg", symbol: "﷼" }

};

// Format currency function
function formatCurrency(amount, currencyCode) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Convert currency function
function convertCurrency(amount, fromCurrency, toCurrency) {
    const amountInUSD = amount / exchangeRates[fromCurrency];
    return amountInUSD * exchangeRates[toCurrency];
}

// Update result display
function updateResult(amount, fromCurrency, toCurrency, convertedAmount) {
    resultAmount.textContent = formatCurrency(convertedAmount, toCurrency);
    resultDetails.textContent = `${formatCurrency(amount, fromCurrency)} = ${formatCurrency(convertedAmount, toCurrency)}`;
    errorMessage.style.display = 'none';

    // Update gambar sesuai mata uang yang dipilih (toCurrency)
    updateCurrencyImage(toCurrency);            
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    resultAmount.textContent = '-';
    resultDetails.textContent = '-';
}

// Show loading
function showLoading() {
    loading.style.display = 'block';
    convertBtn.disabled = true;
}

// Hide loading
function hideLoading() {
    loading.style.display = 'none';
    convertBtn.disabled = false;
}

// Swap currencies
swapBtn.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    
    // Ganti gambar setelah swap
    updateCurrencyImage(toCurrencySelect.value);

    // Auto-convert after swap
    convertBtn.click();
});

// Convert button click event
convertBtn.addEventListener('click', () => {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    // Validation
    if (isNaN(amount) || amount <= 0) {
        showError('Masukkan jumlah yang valid (harus lebih dari 0)');
        return;
    }

    if (fromCurrency === toCurrency) {
        showError('Pilih mata uang yang berbeda untuk konversi');
        return;
    }

    showLoading();

    // Simulate API call delay
    setTimeout(() => {
        try {
            const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
            updateResult(amount, fromCurrency, toCurrency, convertedAmount);
        } catch (error) {
            showError('Terjadi kesalahan dalam konversi');
        } finally {
            hideLoading();
        }
    }, 800);
});

// Enter key support
amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        convertBtn.click();
    }
});

// Input validation
amountInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
    
    const decimalCount = (e.target.value.match(/\./g) || []).length;
    if (decimalCount > 1) {
        e.target.value = e.target.value.slice(0, -1);
    }
});

// Auto-convert on currency change
fromCurrencySelect.addEventListener('change', () => {
    if (amountInput.value && parseFloat(amountInput.value) > 0) {
        convertBtn.click();
    }
});

toCurrencySelect.addEventListener('change', () => {
    if (amountInput.value && parseFloat(amountInput.value) > 0) {
        convertBtn.click();
    }
});

// Update gambar sesuai mata uang
function updateCurrencyImage(currency) {
    if (currencyFlags[currency]) {
        currencyImage.src = currencyFlags[currency].img;
        currencyCaption.textContent = `${currency} - ${currencyFlags[currency].symbol}`;
    } else {
        currencyImage.src = "https://placehold.co/400x400?text=Currency";
        currencyCaption.textContent = "Ilustrasi mata uang dunia";
    }
}

// Initialize with sample conversion
document.addEventListener('DOMContentLoaded', () => {
    const sampleAmount = 100000;
    const fromCurrency = 'IDR';
    const toCurrency = 'USD';
    const convertedAmount = convertCurrency(sampleAmount, fromCurrency, toCurrency);
    updateResult(sampleAmount, fromCurrency, toCurrency, convertedAmount);

    // Tampilkan gambar awal
    updateCurrencyImage(toCurrency);
});
