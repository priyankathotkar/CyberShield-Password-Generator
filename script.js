const passwordField = document.getElementById("password");
const lengthInput = document.getElementById("length");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");
const strengthText = document.getElementById("strengthText");
const strengthBar = document.getElementById("strengthBar");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+{}[]=<>/";

let passwordHistory = [];

function generatePassword() {
    let length = parseInt(lengthInput.value);
    let charset = "";
    let password = "";

    if (uppercaseCheckbox.checked) charset += uppercaseChars;
    if (lowercaseCheckbox.checked) charset += lowercaseChars;
    if (numbersCheckbox.checked) charset += numberChars;
    if (symbolsCheckbox.checked) charset += symbolChars;

    if (charset === "") {
        showAlert("Please select at least one option!", "danger");
        return;
    }

    // Ensure at least one of each selected type is included
    let mandatoryChars = [];
    if (uppercaseCheckbox.checked) mandatoryChars.push(getRandomChar(uppercaseChars));
    if (lowercaseCheckbox.checked) mandatoryChars.push(getRandomChar(lowercaseChars));
    if (numbersCheckbox.checked) mandatoryChars.push(getRandomChar(numberChars));
    if (symbolsCheckbox.checked) mandatoryChars.push(getRandomChar(symbolChars));

    // Fill the rest of the password
    for (let i = mandatoryChars.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Mix in the mandatory characters
    password = (password + mandatoryChars.join(""))
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

    passwordField.value = password;
    updateStrength(password);
    saveToHistory(password);
}

function getRandomChar(charset) {
    return charset[Math.floor(Math.random() * charset.length)];
}

function updateStrength(password) {
    let score = 0;
    if (password.length >= 8) score += 30;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;

    strengthBar.value = score;

    if (score < 40) {
        strengthText.textContent = "Weak";
        strengthText.className = "fw-bold text-danger";
        strengthBar.className = "progress-bar bg-danger";
    } else if (score < 70) {
        strengthText.textContent = "Medium";
        strengthText.className = "fw-bold text-warning";
        strengthBar.className = "progress-bar bg-warning";
    } else {
        strengthText.textContent = "Strong";
        strengthText.className = "fw-bold text-success";
        strengthBar.className = "progress-bar bg-success";
    }
}

function copyToClipboard() {
    passwordField.select();
    document.execCommand("copy");
    showAlert("Password copied to clipboard!", "success");
}

function saveToHistory(password) {
    if (passwordHistory.length >= 5) {
        passwordHistory.shift();
    }
    passwordHistory.push(password);
    updateHistoryUI();
}

function updateHistoryUI() {
    historyList.innerHTML = "";
    passwordHistory.forEach(pass => {
        let listItem = document.createElement("li");
        listItem.className = "list-group-item list-group-item-action";
        listItem.textContent = pass;
        listItem.addEventListener("click", () => {
            passwordField.value = pass;
            updateStrength(pass);
        });
        historyList.appendChild(listItem);
    });
}

function clearHistory() {
    passwordHistory = [];
    updateHistoryUI();
    showAlert("Password history cleared!", "info");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        toggleThemeBtn.innerHTML = "☀️ Light Mode";
        toggleThemeBtn.classList.remove("btn-dark");
        toggleThemeBtn.classList.add("btn-light");
    } else {
        toggleThemeBtn.innerHTML = "🌙 Dark Mode";
        toggleThemeBtn.classList.remove("btn-light");
        toggleThemeBtn.classList.add("btn-dark");
    }
}

function showAlert(message, type) {
    // Create a Bootstrap alert dynamically
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed bottom-0 end-0 m-3`;
    alertDiv.style.zIndex = "9999";
    alertDiv.role = "alert";
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);

    // Auto-remove alert after 3 seconds
    setTimeout(() => {
        alertDiv.classList.remove("show");
        alertDiv.addEventListener("transitionend", () => alertDiv.remove());
    }, 3000);
}

// Event Listeners
generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyToClipboard);
toggleThemeBtn.addEventListener("click", toggleDarkMode);
clearHistoryBtn.addEventListener("click", clearHistory);
