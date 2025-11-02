// Версия с хешированием паролей
console.log('🔐 Login with password hashing loaded');

// Простая хеш-функция
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('🔑 Login attempt:', username);
    
    if (username && password) {
        let users = JSON.parse(localStorage.getItem('usersFile') || '{}');
        const hashedPassword = simpleHash(password);
        
        console.log('📊 Stored hash for user:', users[username]);
        console.log('🔢 Input hash:', hashedPassword);
        
        if (users[username]) {
            // Пользователь существует - проверяем хеш
            if (users[username] === hashedPassword) {
                console.log('✅ Password correct!');
                loginSuccess(username);
            } else {
                console.log('❌ Wrong password!');
                alert('Неверный пароль!');
            }
        } else {
            // Новый пользователь - сохраняем хеш
            users[username] = hashedPassword;
            localStorage.setItem('usersFile', JSON.stringify(users));
            console.log('👤 New user created with hash:', hashedPassword);
            loginSuccess(username);
        }
    } else {
        alert('Заполните все поля!');
    }
});

function loginSuccess(username) {
    localStorage.setItem('currentUser', username);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginTime', Date.now());
    
    console.log('🚀 Login successful, redirecting...');
    window.location.href = '../Calculator/index.html';
}

// Проверка существующего входа
if (localStorage.getItem('isLoggedIn') === 'true') {
    console.log('✅ Already logged in, redirecting...');
    window.location.href = '../Calculator/index.html';
}

// Функция для сброса пароля (для админа)
function resetUserPassword(username, newPassword) {
    let users = JSON.parse(localStorage.getItem('usersFile') || '{}');
    users[username] = simpleHash(newPassword);
    localStorage.setItem('usersFile', JSON.stringify(users));
    console.log(`✅ Password for ${username} reset to: ${newPassword}`);
    return `Пароль для ${username} сброшен на: ${newPassword}`;
}
