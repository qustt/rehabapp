
        document.addEventListener('DOMContentLoaded', function() {
            // Навигация между экранами
            const navLinks = document.querySelectorAll('.nav-link');
            const screens = document.querySelectorAll('.screen');
            
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetScreen = this.getAttribute('data-screen');
                    
                    // Обновляем активную ссылку в меню
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Показываем целевой экран
                    screens.forEach(screen => {
                        screen.classList.remove('active');
                        if (screen.id === `${targetScreen}-screen`) {
                            screen.classList.add('active');
                        }
                    });
                });
            });
            
            // Предопределенные вопросы в чате
            const questionButtons = document.querySelectorAll('.question-btn');
            const chatInput = document.querySelector('.chat-input input');
            const chatMessages = document.querySelector('.chat-messages');
            const sendButton = document.querySelector('.send-btn');
            
            questionButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const question = this.getAttribute('data-question');
                    chatInput.value = question;
                });
            });
            
            // Отправка сообщений
            sendButton.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            function sendMessage() {
                const message = chatInput.value.trim();
                if (message) {
                    addMessage(message, 'user');
                    chatInput.value = '';
                    
                    // Имитация ответа AI
                    setTimeout(() => {
                        let response = '';
                        
                        if (message.includes('болит спина') || message.includes('заболела спина')) {
                            response = 'Умеренная мышечная боль после первых занятий — это частое явление. Рекомендую сделать легкую разминку и принять теплый душ. Важно: если боль острая, не проходит или усиливается, немедленно свяжитесь с вашим куратором. Хотите, я найду для вас статью о том, как правильно восстанавливаться после ЛФК?';
                        } else if (message.includes('врач') || message.includes('ЛФК') || message.includes('остеоартроз')) {
                            response = 'Конечно, я подберу для вас подходящих специалистов по лечебной физкультуре, которые специализируются на работе с остеоартрозом и принимают рядом с Новогиреево. Сейчас открою для вас список с подборкой.';
                            // Переключаемся на экран специалистов
                            document.querySelector('[data-screen="specialists"]').click();
                        } else if (message.includes('стул для душа')) {
                            response = 'Вот подходящие варианты из каталога. Также по вашей программе реабилитации на этот товар может распространяться компенсация. Хотите узнать подробнее?';
                            // Переключаемся на экран товаров
                            document.querySelector('[data-screen="products"]').click();
                        } else {
                            response = 'Я еще учусь и не совсем понимаю ваш вопрос. Можете переформулировать его или выбрать один из готовых вопросов выше.';
                        }
                        
                        addMessage(response, 'ai');
                    }, 1000);
                }
            }
            
            function addMessage(text, sender) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', sender);
                
                const messageContent = document.createElement('div');
                messageContent.classList.add('message-content');
                
                const messageParagraph = document.createElement('p');
                messageParagraph.textContent = text;
                
                const messageTime = document.createElement('div');
                messageTime.classList.add('message-time');
                
                const now = new Date();
                messageTime.textContent = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
                
                messageContent.appendChild(messageParagraph);
                messageContent.appendChild(messageTime);
                messageElement.appendChild(messageContent);
                
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            // Поиск товаров и специалистов
            const searchButtons = document.querySelectorAll('.search-btn');
            
            searchButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const searchInput = this.previousElementSibling;
                    if (searchInput.value.trim()) {
                        alert(`Выполняется поиск: ${searchInput.value}`);
                    }
                });
            });
        });

        // Функционал для задач и истории
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация истории из localStorage
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    
    // Переключение между табами
    const tabs = document.querySelectorAll('.tab');
    const containers = document.querySelectorAll('[data-container]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            // Обновляем активный таб
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Показываем соответствующий контейнер
            containers.forEach(container => {
                container.classList.remove('active');
                if (container.getAttribute('data-container') === target) {
                    container.classList.add('active');
                }
            });
            
            // Если открыли историю, обновляем её
            if (target === 'history') {
                updateHistoryDisplay();
            }
        });
    });
    
    // Обработка отметки выполнения задач
    const completeButtons = document.querySelectorAll('.complete-btn');
    
    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskCard = this.closest('.task-card');
            const taskId = taskCard.getAttribute('data-task-id');
            const taskTitle = taskCard.querySelector('.task-title').textContent;
            
            // Отмечаем задачу выполненной
            taskCard.classList.add('completed');
            this.textContent = 'Выполнено';
            this.disabled = true;
            
            // Добавляем задачу в историю
            const completedTask = {
                id: taskId,
                title: taskTitle,
                date: new Date().toLocaleString('ru-RU')
            };
            
            completedTasks.push(completedTask);
            localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
            
            // Показываем уведомление
            showNotification(`Задача "${taskTitle}" отмечена выполненной`);
        });
    });
    
    // Функция обновления отображения истории
    function updateHistoryDisplay() {
        const historyList = document.querySelector('.history-list');
        
        if (completedTasks.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>Вы еще не выполнили ни одной задачи</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = '';
        
        // Сортируем задачи по дате (новые сверху)
        const sortedTasks = [...completedTasks].reverse();
        
        sortedTasks.forEach(task => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.innerHTML = `
                <div class="history-info">
                    <div class="history-task">${task.title}</div>
                    <div class="history-date">Выполнено: ${task.date}</div>
                </div>
                <button class="btn delete-history" data-task-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            historyList.appendChild(historyItem);
        });
        
        // Добавляем обработчики для кнопок удаления
        const deleteButtons = document.querySelectorAll('.delete-history');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const taskId = this.getAttribute('data-task-id');
                deleteHistoryItem(taskId);
            });
        });
    }
    
    // Функция удаления элемента из истории
    function deleteHistoryItem(taskId) {
        completedTasks = completedTasks.filter(task => task.id !== taskId);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        updateHistoryDisplay();
        
        showNotification('Запись удалена из истории');
    }
    
    // Функция показа уведомлений
    function showNotification(message) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--secondary)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '6px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Убираем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            // Удаляем элемент после анимации
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // При загрузке страницы проверяем, какие задачи уже выполнены
    function checkCompletedTasks() {
        completedTasks.forEach(task => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                const button = taskElement.querySelector('.complete-btn');
                taskElement.classList.add('completed');
                button.textContent = 'Выполнено';
                button.disabled = true;
            }
        });
    }
    
    // Вызываем проверку при загрузке
    checkCompletedTasks();
});
    