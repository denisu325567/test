// Получаем элементы интерфейса
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filter');
const totalTasks = document.getElementById('total-tasks');
const completedTasks = document.getElementById('completed-tasks');
const historyButton = document.getElementById('show-history');
const historyList = document.getElementById('history-list');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Установка начальной темы
document.body.classList.add(localStorage.getItem('theme') || 'light-mode');
darkModeToggle.checked = localStorage.getItem('theme') === 'dark-mode';

// Применение текущей темы к истории при загрузке
applyThemeToHistory();

// Переключение темы
darkModeToggle.addEventListener('change', () => {
    const theme = darkModeToggle.checked ? 'dark-mode' : 'light-mode';
    document.body.className = theme;
    localStorage.setItem('theme', theme);
    applyThemeToHistory(); // Применяем тему к истории
});

// Загрузка задач из localStorage
window.addEventListener('load', () => {
    loadTasks();
    loadHistory();
    updateStats();
});

// Добавление новой задачи
taskForm.addEventListener('submit', event => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
        addTask(taskText);
        saveTasks(); // Сохраняем задачи
        taskInput.value = '';
        updateStats();
    }
});

// Функция добавления задачи
function addTask(taskText, completed = false) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="${completed ? 'task-completed' : ''}">${taskText}</span>
        <div>
            <button class="complete">✓</button>
            <button class="delete">✗</button>
        </div>
    `;

    // Логика отметки задачи как выполненной
    li.querySelector('.complete').addEventListener('click', () => {
        const taskSpan = li.querySelector('span');
        taskSpan.classList.toggle('task-completed');
        if (taskSpan.classList.contains('task-completed')) {
            addToHistory(taskText);
        }
        saveTasks();
        updateStats();
        applyFilter();
    });

    // Логика удаления задачи
    li.querySelector('.delete').addEventListener('click', () => {
        li.remove();
        saveTasks();
        updateStats();
    });

    taskList.appendChild(li);
}

// Сохранение задач в localStorage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(task => {
        tasks.push({
            text: task.querySelector('span').textContent,
            completed: task.querySelector('span').classList.contains('task-completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Загрузка задач из localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.text, task.completed));
}

// Применение темы к истории
function applyThemeToHistory() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
        historyList.classList.add('dark-history');
    } else {
        historyList.classList.remove('dark-history');
    }
}

// Обновление статистики
function updateStats() {
    const tasks = taskList.querySelectorAll('li');
    const completed = taskList.querySelectorAll('.task-completed').length;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
}

// Применение текущего фильтра
function applyFilter() {
    const filterType = document.querySelector('.filter.active').getAttribute('data-filter');
    const tasks = taskList.querySelectorAll('li');

    tasks.forEach(task => {
        const isCompleted = task.querySelector('span').classList.contains('task-completed');
        if (filterType === 'all') {
            task.style.display = 'flex';
        } else if (filterType === 'completed') {
            task.style.display = isCompleted ? 'flex' : 'none';
        } else if (filterType === 'incomplete') {
            task.style.display = !isCompleted ? 'flex' : 'none';
        }
    });
}

// Логика переключения фильтров
filters.forEach(filter => {
    filter.addEventListener('click', () => {
        filters.forEach(btn => btn.classList.remove('active'));
        filter.classList.add('active');
        applyFilter();
    });
});

// Добавление задачи в историю
function addToHistory(taskText) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    if (!history.includes(taskText)) {
        history.push(taskText);
        localStorage.setItem('history', JSON.stringify(history));
    }
}

// Загрузка истории из localStorage
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    if (history.length === 0) {
        historyList.innerHTML = '<li>История пуста</li>';
    } else {
        historyList.innerHTML = history.map(task => `<li>${task}</li>`).join('');
    }
}

// Логика отображения истории
historyButton.addEventListener('click', () => {
    historyList.style.display = historyList.style.display === 'none' || historyList.style.display === ''
        ? 'block'
        : 'none';
});