// Calculator script - исправленная версия
console.log('🧮 Calculator script loaded');

let currentExpression = '';

// Безопасная функция вычисления (замена eval)
function safeEval(expression) {
    try {
        // Удаляем все символы кроме цифр, операторов и точек
        const cleanExpression = expression.replace(/[^0-9+\-*/.()]/g, '');
        
        // Проверяем валидность выражения
        if (!/^[0-9+\-*/().\s]+$/.test(cleanExpression)) {
            throw new Error('Invalid expression');
        }
        
        // Используем Function как более безопасную альтернативу eval
        return new Function('return ' + cleanExpression)();
    } catch (error) {
        throw new Error('Calculation error');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Calculator DOM ready');
    
    // Проверяем авторизацию
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        console.log('❌ Not logged in, redirecting...');
        window.location.href = '../Main/main.html';
        return;
    }
    
    // Проверяем время сессии (24 часа)
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime && Date.now() - parseInt(loginTime) > 86400000) {
        console.log('⏰ Session expired');
        logout();
        return;
    }
    
    // Показываем имя пользователя
    const username = localStorage.getItem('currentUser');
    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
        console.log('✅ User:', username);
        
        // Админка для arbuzzz
        if (username === 'arbuzzz') {
            console.log('⭐ Admin access granted');
            createAdminButton();
        }
    }
    
    // Загружаем историю
    displayHistory();
    
    // Кнопка выхода
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Обработчики клавиатуры
    document.addEventListener('keydown', handleKeyPress);
    
    console.log('✅ Calculator initialized');
});

function logout() {
    console.log('🚪 Logging out...');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
    window.location.href = '../Main/main.html';
}

// Создаем кнопку админа
function createAdminButton() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) return;
    
    const adminBtn = document.createElement('div');
    adminBtn.className = 'admin-btn';
    adminBtn.textContent = 'Admin';
    adminBtn.onclick = showAllUsers;
    
    userMenu.insertBefore(adminBtn, userMenu.querySelector('.username'));
    console.log('✅ Admin button created');
}

// Показать всех пользователей (без паролей)
function showAllUsers() {
    const usersData = localStorage.getItem('usersFile');
    if (usersData) {
        const users = JSON.parse(usersData);
        let userList = '📊 Все пользователи:\n\n';
        
        Object.keys(users).forEach((username, index) => {
            userList += `${index + 1}. 👤 ${username}\n`;
        });
        
        userList += `\nВсего: ${Object.keys(users).length} пользователей`;
        alert(userList);
    } else {
        alert('😴 Пользователей еще нет!');
    }
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
        if (!currentExpression) return;
        
        const username = localStorage.getItem('currentUser');
        const result = safeEval(currentExpression);
        const calculation = `${currentExpression} = ${result}`;
        
        // Сохраняем историю для пользователя
        let userHistory = JSON.parse(localStorage.getItem(`calcHistory_${username}`) || '[]');
        userHistory.unshift({
            expression: currentExpression,
            result: result,
            timestamp: new Date().toLocaleString()
        });
        
        // Ограничиваем историю 10 записями
        if (userHistory.length > 10) {
            userHistory = userHistory.slice(0, 10);
        }
        
        localStorage.setItem(`calcHistory_${username}`, JSON.stringify(userHistory));
        
        // Показываем результат
        document.getElementById('history').textContent = currentExpression;
        document.getElementById('result').value = result;
        currentExpression = result.toString();
        
        // Обновляем историю на экране
        displayHistory();
        
    } catch (error) {
        document.getElementById('result').value = 'Error';
        currentExpression = '';
        setTimeout(() => {
            document.getElementById('result').value = '';
        }, 1500);
    }
}

function displayHistory() {
    const username = localStorage.getItem('currentUser');
    const userHistory = JSON.parse(localStorage.getItem(`calcHistory_${username}`) || '[]');
    const historyList = document.getElementById('historyList');
    
    historyList.innerHTML = '';
    
    userHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div>${item.expression}</div>
            <div><strong>= ${item.result}</strong></div>
            <div style="font-size: 10px; color: #888;">${item.timestamp}</div>
        `;
        historyList.appendChild(historyItem);
    });
}

// Обработка клавиатуры
function handleKeyPress(e) {
    if (e.key >= '0' && e.key <= '9') {
        appendToDisplay(e.key);
    } else if (['+', '-', '*', '/', '.'].includes(e.key)) {
        appendToDisplay(e.key);
    } else if (e.key === 'Enter') {
        calculate();
    } else if (e.key === 'Escape') {
        clearDisplay();
    } else if (e.key === 'Backspace') {
        deleteLast();
    }
}
