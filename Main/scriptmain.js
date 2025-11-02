// Main/scriptmain.js - исправленная версия
console.log('🔐 Login script loaded');

// Удаляем автоматический редирект - ВАЖНО!
// НЕТ автоматического перехода на калькулятор!

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('🎯 Form submitted');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        // Хеш-функция
        function simpleHash(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                let char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16);
        }
        
        let users = JSON.parse(localStorage.getItem('usersFile') || '{}');
        const hashedPassword = simpleHash(password);
        
        if (users[username] && users[username] !== hashedPassword) {
            alert('Неверный пароль!');
            return;
        }
        
        // Сохраняем пользователя
        users[username] = hashedPassword;
        localStorage.setItem('usersFile', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log('✅ Login successful, redirecting...');
        // ТОЛЬКО после успешного логина переходим
        window.location.href = '../Calculator/index.html';
    } else {
        alert('Заполните все поля!');
    }
});

// УБРАТЬ автоматический редирект при загрузке!
// Оставить ТОЛЬКО ручной переход после логина
