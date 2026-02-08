let currentLanguage = 'ru';


// Статичный пароль (измените его на свой)
const STATIC_PASSWORD = "mqo5wsafn12"; // Замените на свой пароль

// Функция для настройки модального окна пароля
function setupPasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    const submitPassword = document.getElementById('submitPassword');
    const passwordError = document.getElementById('passwordError');
    const mobileContainer = document.querySelector('.mobile-container');

    // Скрыть основной контент до ввода пароля
    if (mobileContainer) {
        mobileContainer.style.display = 'none';
    }

    // Показать окно пароля
    if (passwordModal) {
        passwordModal.style.display = 'block';
    }

    // Проверка пароля
    function checkPassword() {
        const enteredPassword = passwordInput.value.trim();
        
        if (enteredPassword === STATIC_PASSWORD) {
            // Правильный пароль
            passwordModal.style.display = 'none';
            if (mobileContainer) {
                mobileContainer.style.display = 'flex';
            }
            
            // Сохраняем в localStorage, что пароль был введен (на текущую сессию)
            sessionStorage.setItem('passwordEntered', 'true');
        } else {
            // Неверный пароль
            passwordError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    // Обработчик для кнопки входа
    if (submitPassword) {
        submitPassword.addEventListener('click', checkPassword);
    }

    // Обработчик для нажатия Enter в поле ввода
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }

    // Проверить, был ли уже введен пароль в текущей сессии
    if (sessionStorage.getItem('passwordEntered') === 'true') {
        passwordModal.style.display = 'none';
        if (mobileContainer) {
            mobileContainer.style.display = 'flex';
        }
    }
}



// Функция для настройки модального окна с предупреждением
function setupWarningModal() {
    console.log('setupWarningModal function called');
    
    const warningModal = document.getElementById('warningModal');
    const understandButton = document.getElementById('understandButton');
    const passwordModal = document.getElementById('passwordModal');

    console.log('Warning modal elements found:', {
        warningModal, 
        understandButton
    });

    // Обработка кнопки "Понятно"
    if (understandButton) {
        understandButton.addEventListener('click', function() {
            console.log('Understand button clicked');
            
            // Скрываем модальное окно с предупреждением
            warningModal.style.display = 'none';
            
            // Сохраняем в localStorage, что пользователь принял предупреждение
            localStorage.setItem('warningAccepted', 'true');
            
            // Показываем окно пароля
            if (passwordModal) {
                passwordModal.style.display = 'block';
                document.getElementById('passwordInput')?.focus();
            }
        });
    }

    // Проверяем, было ли уже принято предупреждение
    const warningAccepted = localStorage.getItem('warningAccepted');
    if (warningAccepted === 'true') {
        warningModal.style.display = 'none';
        console.log('Warning already accepted');
    }
}

function updateLanguage(lang) {
  currentLanguage = lang;
  
  // Обновляем все элементы с data-key
  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    if (translations[lang] && translations[lang][key]) {
      if (element.placeholder !== undefined) {
        element.placeholder = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });
  
  // Сохраняем выбор в localStorage
  localStorage.setItem('preferredLanguage', lang);
  
  // Обновляем активный класс в переключателе языка
  document.querySelectorAll('.language-option').forEach(option => {
    option.classList.remove('active');
    if (option.getAttribute('data-lang') === lang) {
      option.classList.add('active');
    }
  });
}

// Функция показа уведомления о смене языка
function showLanguageNotification(lang) {
  const notification = document.createElement('div');
  notification.className = 'language-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid fa-language"></i>
      <span>${getLanguageChangeText(lang)}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function getLanguageChangeText(lang) {
  const texts = {
    ru: 'Язык изменен на Русский',
    en: 'Language changed to English', 
    uz: 'Til O\'zbek tiliga o\'zgartirildi',
    kg: 'Тил Кыргыз тилине өзгөртүлдү',
    tj: 'Забон ба забони тоҷикӣ иваз шуд'
  };
  return texts[lang] || texts['ru'];
}

// ОДИН блок DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Сначала настраиваем окно пароля
    setupPasswordModal();
    
    // Загрузка сохраненного языка
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'ru';
    updateLanguage(savedLanguage);

    const sendModal = document.getElementById('sendModal');
    const loadingModal = document.getElementById('loadingModal');
    const resultModal = document.getElementById('resultModal');
    const sendForm = document.getElementById('sendForm');
    const closeButtons = document.querySelectorAll('.close');
    const contactSupportBtn = document.getElementById('contactSupport');
    
    const sendButton = document.querySelector('.btn-send');
    
    // Открытие модального окна отправки
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            sendModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Закрытие модальных окон
    if (closeButtons.length) {
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                sendModal.style.display = 'none';
                loadingModal.style.display = 'none';
                resultModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // Закрытие модальных окон по клику вне их
    window.addEventListener('click', function(event) {
        if (event.target === sendModal) {
            sendModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === loadingModal) {
            loadingModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === resultModal) {
            resultModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Обработка отправки формы
    if (sendForm) {
        sendForm.addEventListener('submit', function(event) {
            event.preventDefault();
            sendModal.style.display = 'none';
            loadingModal.style.display = 'block';
            
            setTimeout(function() {
                loadingModal.style.display = 'none';
                resultModal.style.display = 'block';
            }, 2000);
        });
    }
    
    // Обработка кнопки связи с поддержкой (исправленная версия)
    if (contactSupportBtn) {
        console.log('Setting up contact support button');
        contactSupportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Contact support button clicked');
            window.open('https://t.me/coinbase_xizmat');
        });
    }
    
    // Форматирование номера карты
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            this.value = formattedValue;
        });
    }

    // === КОД ДЛЯ ДЕТАЛЬНОГО ОКНА WrappedARC ===
    const assetCard = document.querySelector('.asset-card');
    const assetDetailModal = document.getElementById('assetDetailModal');
    const assetCloseButtons = document.querySelectorAll('#assetDetailModal .close');

    if (assetCard && assetDetailModal) {
        assetCard.addEventListener('click', function() {
            assetDetailModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (assetCloseButtons.length) {
        assetCloseButtons.forEach(button => {
            button.addEventListener('click', function() {
                assetDetailModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        });
    }

    // === КОД ДЛЯ КНОПКИ "ОБМЕН" В ДЕТАЛЬНОМ ОКНЕ ===
    document.querySelector('.btn-swap-action')?.addEventListener('click', function() {
        if (assetDetailModal) assetDetailModal.style.display = 'none';
        if (exchangeCurrencyModal) {
            exchangeCurrencyModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });

    // === КОД ДЛЯ КНОПКИ "ОБМЕН" ===
    const exchangeButton = document.querySelector('.btn-exchange');
    const exchangeCurrencyModal = document.getElementById('exchangeModal');
    const exchangeFormModal = document.getElementById('exchangeModalForm');
    const currencyItems = document.querySelectorAll('.currency-item');
    const confirmCurrencyButton = document.querySelector('.btn-confirm-currency');
    const exchangeForm = document.getElementById('exchangeForm');
    let selectedCurrency = 'UZS';

    // Открытие окна выбора валюты
    if (exchangeButton && exchangeCurrencyModal) {
        exchangeButton.addEventListener('click', function() {
            exchangeCurrencyModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            currencyItems.forEach(item => item.classList.remove('selected'));
            const selectedItem = document.querySelector(`[data-currency="${selectedCurrency}"]`);
            if (selectedItem) selectedItem.classList.add('selected');
            
            if (confirmCurrencyButton) confirmCurrencyButton.disabled = false;
        });
    }

    // Выбор валюты
    if (currencyItems.length) {
        currencyItems.forEach(item => {
            item.addEventListener('click', function() {
                currencyItems.forEach(currency => currency.classList.remove('selected'));
                this.classList.add('selected');
                selectedCurrency = this.getAttribute('data-currency') || 'UZS';
                if (confirmCurrencyButton) confirmCurrencyButton.disabled = false;
            });
        });
    }

    // Подтверждение выбора валюты - открываем форму обмена
    if (confirmCurrencyButton && exchangeCurrencyModal && exchangeFormModal) {
        confirmCurrencyButton.addEventListener('click', function() {
            exchangeCurrencyModal.style.display = 'none';
            exchangeFormModal.style.display = 'block';
        });
    }

    // Обработка формы обмена
    if (exchangeForm) {
        exchangeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (exchangeFormModal) exchangeFormModal.style.display = 'none';
            if (loadingModal) loadingModal.style.display = 'block';
            
            setTimeout(function() {
                if (loadingModal) loadingModal.style.display = 'none';
                if (resultModal) resultModal.style.display = 'block';
            }, 2000);
        });
    }

    // Закрытие окон обмена
    window.addEventListener('click', function(event) {
        if (exchangeCurrencyModal && event.target === exchangeCurrencyModal) {
            exchangeCurrencyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (exchangeFormModal && event.target === exchangeFormModal) {
            exchangeFormModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Закрытие по кнопке закрытия окон обмена
    document.querySelectorAll('#exchangeModal .close, #exchangeModalForm .close').forEach(button => {
        button.addEventListener('click', function() {
            if (exchangeCurrencyModal) exchangeCurrencyModal.style.display = 'none';
            if (exchangeFormModal) exchangeFormModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Форматирование номера карты для формы обмена
    const exchangeCardNumberInput = document.getElementById('exchangeCardNumber');
    if (exchangeCardNumberInput) {
        exchangeCardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            this.value = formattedValue;
        });
    }

    // === КОД ДЛЯ МЕНЮ НАСТРОЕК ===
    const settingsIcon = document.querySelector('.fa-gear');
    const settingsMenu = document.getElementById('settingsMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const themeSwitch = document.querySelector('.switch-track');
    const languageOptions = document.querySelectorAll('.language-option');

    if (settingsIcon && settingsMenu && menuOverlay) {
        settingsIcon.addEventListener('click', function() {
            settingsMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (menuOverlay && settingsMenu) {
        menuOverlay.addEventListener('click', function() {
            settingsMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    // Выбор языка
    if (languageOptions.length) {
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const selectedLang = this.getAttribute('data-lang');
                if (selectedLang !== currentLanguage) {
                    updateLanguage(selectedLang);
                    showLanguageNotification(selectedLang);
                }
            });
        });
    }

    // Обработка кликабельных пунктов меню
    document.querySelectorAll('.menu-item:not(.non-clickable)').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('logout')) {
                if (confirm('Вы уверены, что хотите выйти?')) {
                    console.log('Выход из системы');
                }
            } else {
                const text = this.querySelector('span').textContent;
                console.log('Выбран пункт:', text);
            }
        });
    });

    // Переключение между вкладками
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем активный класс у всех вкладок
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Скрываем весь контент
            document.querySelectorAll('.crypto-content, .partners-content').forEach(content => {
                content.classList.remove('active-content');
            });
            
            // Показываем соответствующий контент
            const tabKey = this.getAttribute('data-key');
            if (tabKey === 'crypto') {
                document.querySelector('.crypto-content')?.classList.add('active-content');
            } else if (tabKey === 'partners') {
                document.querySelector('.partners-content')?.classList.add('active-content');
            }
        });
    });

    // Добавляем обработчики клика на карточки партнеров
    document.querySelectorAll('.partner-card').forEach(card => {
        card.addEventListener('click', function() {
            const partnerName = this.querySelector('.partner-name').textContent;
            alert(`Переход к партнеру: ${partnerName}\n\nСпециальные условия для держателей WARC!`);
        });
    });
});