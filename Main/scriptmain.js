// Исправленная версия scriptmain.js
console.log('🔧 scriptmain.js loaded');

// Проверяем авторизацию
if (localStorage.getItem('isLoggedIn') === 'true') {
    console.log('✅ Already logged in, redirecting...');
    window.location.href = '../Calculator/index.html';
}

// Простая функция хеширования (в реальном проекте используй bcrypt)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
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
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Please fill in all fields!');
            return;
        }
        
        // Получаем пользователей из localStorage
        let usersData = localStorage.getItem('usersFile');
        let users = usersData ? JSON.parse(usersData) : {};
        
        // Проверяем существование пользователя
        if (!users[username]) {
            // Регистрируем нового пользователя
            const hashedPassword = simpleHash(password);
            users[username] = hashedPassword;
            localStorage.setItem('usersFile', JSON.stringify(users));
            console.log('✅ New user registered:', username);
        } else {
            // Проверяем пароль существующего пользователя
            const hashedInputPassword = simpleHash(password);
            if (users[username] !== hashedInputPassword) {
                alert('Wrong password!');
                return;
            }
        }
        
        // Сохраняем сессию
        localStorage.setItem('currentUser', username);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', Date.now().toString());
        
        console.log('✅ Login successful, redirecting...');
        window.location.href = '../Calculator/index.html';
    });
});
