// Calculator script - исправленная версия
console.log('🧮 Calculator script loaded');

let currentExpression = '';

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Calculator DOM ready');
    
    // Проверяем авторизацию
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        console.log('❌ Not logged in, redirecting...');
        window.location.href = '../Main/main.html';
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
    document.getElementById('logoutBtn').addEventListener('click', function() {
        console.log('🚪 Logging out...');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = '../Main/main.html';
    });
    
    console.log('✅ Calculator initialized');
});

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

// Показать всех пользователей
function showAllUsers() {
    const usersData = localStorage.getItem('usersFile');
    if (usersData) {
        const users = JSON.parse(usersData);
        let userList = '📊 Все пользователи:\n\n';
        
        Object.entries(users).forEach(([username, password], index) => {
            userList += `${index + 1}. 👤 ${username}\n   🔑 ${password}\n\n`;
        });
        
        userList += `Всего: ${Object.keys(users).length} пользователей`;
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
        const username = localStorage.getItem('currentUser');
        const result = eval(currentExpression);
        const calculation = `${currentExpression} = ${result}`;
        
        // Сохраняем историю для пользователя
        let userHistory = JSON.parse(localStorage.getItem(`calcHistory_${username}`) || '[]');
        userHistory.unshift(calculation);
        
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
        historyItem.textContent = item;
        historyList.appendChild(historyItem);
    });
}
