// Правильная версия - без повторного объявления CONFIG
console.log('🔧 scriptmain.js loaded');

// Только проверяем CONFIG, но не объявляем заново
if (typeof CONFIG === 'undefined') {
    console.error('❌ Config file not found!');
    // Используем window.CONFIG чтобы не конфликтовать
    window.CONFIG = {
        ADMIN_USERNAME: 'arbuzzz',
        SESSION_TIMEOUT: 86400000
    };
} else {
    console.log('✅ Config loaded successfully');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded');
    
    const form = document.getElementById('loginForm');
    if (!form) {
        console.error('❌ Login form not found!');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('🎯 Login form submitted');
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Please fill in all fields!');
            return;
        }
        
        // Простая логика входа
        let usersData = localStorage.getItem('usersFile');
        let users = usersData ? JSON.parse(usersData) : {};
        
        if (users[username] && users[username] !== password) {
            alert('Wrong password!');
            return;
        }
        
        // Сохраняем пользователя
        users[username] = password;
        localStorage.setItem('usersFile', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log('✅ Login successful, redirecting...');
        window.location.href = '../Calculator/index.html';
    });
});

// Проверка существующего входа
if (localStorage.getItem('isLoggedIn') === 'true') {
    console.log('✅ Already logged in, redirecting...');
    window.location.href = '../Calculator/index.html';
}
