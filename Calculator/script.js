// Calculator/script.js - исправленная версия
console.log('🧮 Calculator script loaded');

let currentExpression = '';

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Calculator DOM ready');
    
    // ПРОВЕРКА АВТОРИЗАЦИИ - если не залогинен, на главную
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        console.log('❌ Not logged in, redirecting to login...');
        window.location.href = '../Main/main.html';
        return;
    }
    
    // ПОЛУЧАЕМ username - исправляем "User"
    const username = localStorage.getItem('currentUser') || 'User';
    console.log('✅ Current user:', username);
    
    // ОБЯЗАТЕЛЬНО устанавливаем имя пользователя
    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) {
        usernameDisplay.textContent = username;
    } else {
        console.error('❌ usernameDisplay element not found!');
    }
    
    // ПРОВЕРКА АДМИНА
    const tempAdminUser = localStorage.getItem('tempAdmin_user');
    const tempAdminExpire = localStorage.getItem('tempAdmin_expire');
    
    if (username === 'arbuzzz') {
        console.log('⭐ Permanent admin access');
        createAdminButton();
    } else if (tempAdminUser === username && tempAdminExpire) {
        const timeLeft = parseInt(tempAdminExpire) - Date.now();
        if (timeLeft > 0) {
            console.log('⭐ Temporary admin access');
            createAdminButton();
        } else {
            localStorage.removeItem('tempAdmin_user');
            localStorage.removeItem('tempAdmin_expire');
        }
    }
    
    // Загружаем историю
    displayHistory();
    
    // Кнопка выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            console.log('🚪 Logging out...');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = '../Main/main.html';
        });
    } else {
        console.error('❌ logoutBtn element not found!');
    }
});

// Создаем кнопку админа
function createAdminButton() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) {
        console.error('❌ User menu not found');
        return;
    }
    
    const adminBtn = document.createElement('div');
    adminBtn.className = 'admin-btn';
    adminBtn.textContent = '👑 Админка';
    adminBtn.onclick = function() {
        const users = JSON.parse(localStorage.getItem('usersFile') || '{}');
        let message = '👑 Админка\\n\\n';
        Object.entries(users).forEach(([user, hash], i) => {
            message += `${i+1}. 👤 ${user}\\n   🔐 ${hash}\\n\\n`;
        });
        message += `Всего: ${Object.keys(users).length} пользователей`;
        alert(message);
    };
    
    userMenu.insertBefore(adminBtn, userMenu.querySelector('.username'));
}

// Функции калькулятора
function appendToDisplay(value) {
    currentExpression += value;
    document.getElementById('result').value = currentExpression;
}

function clearDisplay() {
    currentExpression = '';
    document.getElementById('result').value = '';
    document.getElementById('history').textContent = '';
}

function deleteLast() {
    currentExpression = currentExpression.slice(0, -1);
    document.getElementById('result').value = currentExpression;
}

function calculate() {
    try {
        const username = localStorage.getItem('currentUser') || 'unknown';
        const result = eval(currentExpression);
        const calculation = `${currentExpression} = ${result}`;
        
        let userHistory = JSON.parse(localStorage.getItem(`calcHistory_${username}`) || '[]');
        userHistory.unshift(calculation);
        
        if (userHistory.length > 10) {
            userHistory = userHistory.slice(0, 10);
        }
        
        localStorage.setItem(`calcHistory_${username}`, JSON.stringify(userHistory));
        
        document.getElementById('history').textContent = currentExpression;
        document.getElementById('result').value = result;
        currentExpression = result.toString();
        
        displayHistory();
        
    } catch (error) {
        document.getElementById('result').value = 'Error';
        currentExpression = '';
    }
}

function displayHistory() {
    const username = localStorage.getItem('currentUser') || 'unknown';
    const userHistory = JSON.parse(localStorage.getItem(`calcHistory_${username}`) || '[]');
    const historyList = document.getElementById('historyList');
    
    if (!historyList) {
        console.error('❌ historyList element not found!');
        return;
    }
    
    historyList.innerHTML = '';
    
    userHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = item;
        historyList.appendChild(historyItem);
    });
}
