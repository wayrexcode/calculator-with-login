// В Calculator/script.js замени проверку админа на:

// Проверка админских прав
function isUserAdmin(username) {
    // Постоянные админы
    const permanentAdmins = ['arbuzzz'];
    
    // Временная админка
    const tempAdminUser = localStorage.getItem('tempAdmin_user');
    const tempAdminExpire = localStorage.getItem('tempAdmin_expire');
    
    // Проверка постоянного админа
    if (permanentAdmins.includes(username)) {
        return true;
    }
    
    // Проверка временной админки
    if (tempAdminUser === username && tempAdminExpire && Date.now() < parseInt(tempAdminExpire)) {
        console.log('⭐ Временная админка активна для:', username);
        return true;
    }
    
    // Если время истекло - очищаем
    if (tempAdminExpire && Date.now() > parseInt(tempAdminExpire)) {
        localStorage.removeItem('tempAdmin_user');
        localStorage.removeItem('tempAdmin_expire');
        console.log('🕒 Временная админка истекла');
    }
    
    return false;
}

// Затем в DOMContentLoaded замени проверку на:
if (isUserAdmin(username)) {
    console.log('⭐ Admin access granted to:', username);
    createAdminButton();
}
