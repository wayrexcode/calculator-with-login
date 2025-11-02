// Calculator script with admin tools
console.log('🧮 Calculator with admin tools loaded');

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
        localStorage.removeItem('loginTime');
        window.location.href = '../Main/main.html';
    });
});

// Создаем кнопку админа
function createAdminButton() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) return;
    
    const adminBtn = document.createElement('div');
    adminBtn.className = 'admin-btn';
    adminBtn.textContent = 'Admin';
    adminBtn.onclick = showAdminPanel;
    
    userMenu.insertBefore(adminBtn, userMenu.querySelector('.username'));
    console.log('✅ Admin button created');
}

// Админская панель
function showAdminPanel() {
    const usersData = localStorage.getItem('usersFile');
    if (!usersData) {
        alert('😴 Пользователей еще нет!');
        return;
    }
    
    const users = JSON.parse(usersData);
    let adminMenu = '👑 Admin Panel\n\n';
    
    Object.entries(users).forEach(([username, hash], index) => {
        adminMenu += `${index + 1}. 👤 ${username}\n   🔐 Хеш: ${hash}\n\n`;
    });
    
    adminMenu += `Всего пользователей: ${Object.keys(users).length}\n\n`;
    adminMenu += '⚙️ Команды для консоли:\n';
    adminMenu += 'resetUserPassword("username", "newpass") - сброс пароля\n';
    adminMenu += 'localStorage.usersFile - просмотр всех хешей';
    
    alert(adminMenu);
}

// Функции калькулятора (без изменений)
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

// Функция для сброса паролей (доступна в консоли)
function resetUserPassword(username, newPassword) {
    let users = JSON.parse(localStorage.getItem('usersFile') || '{}');
    
    // Простая хеш-функция (такая же как в scriptmain.js)
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    
    users[username] = simpleHash(newPassword);
    localStorage.setItem('usersFile', JSON.stringify(users));
    console.log(`✅ Password for ${username} reset to: ${newPassword}`);
    return `Пароль для ${username} сброшен на: ${newPassword}`;
}
