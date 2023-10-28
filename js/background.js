// Обработчик для проверки доступа и ввода пароля
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({ passwordEnabled: false });
  });
  
  // Функция для проверки введенного пароля
  function checkPassword(password) {
    // Ваш код проверки пароля
    return password === 'mypassword';
  }
  
  // Обработчик для открытия попапа с вводом пароля
  chrome.browserAction.onClicked.addListener(function() {
    chrome.storage.local.get('passwordEnabled', function(result) {
      const passwordEnabled = result.passwordEnabled;
      if (passwordEnabled) {
        chrome.windows.create({
          url: 'password.html',
          type: 'popup',
          width: 400,
          height: 300
        });
      } else {
        // Открывать расширение без ввода пароля
        chrome.tabs.create({ url: 'index.html' });
      }
    });
  });
  