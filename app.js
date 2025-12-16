document.addEventListener('DOMContentLoaded', () => {
    // Views
    const dashboardView = document.getElementById('dashboard-view');
    const weekView = document.getElementById('week-view');
    const workoutDetailView = document.getElementById('workout-detail-view');

    // Dashboard Elements
    const startWorkoutBtn = document.getElementById('start-workout-btn');
    const statStreak = document.getElementById('stat-streak');
    const statTotal = document.getElementById('stat-total');
    const statLast = document.getElementById('stat-last');
    const weeklyChart = document.getElementById('weekly-chart');

    // Existing Elements
    const modal = document.getElementById('exercise-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSets = document.getElementById('modal-sets');
    const modalReps = document.getElementById('modal-reps');
    const modalDesc = document.getElementById('modal-description');
    const modalImage = document.getElementById('modal-image');

    // Estado
    let currentDay = null;
    let isEditMode = false;
    let localWorkoutData = {};
    let userStats = {
        streak: 0,
        totalWorkouts: 0,
        lastWorkoutDate: null,
        history: [] // { date: '2024-01-01', id: 'segunda', rating: 'good' }
    };
    let dashboardChart = null;

    // Inicialização
    init();

    function init() {
        loadData();
        setupNavigation();
        navigateTo('dashboard');
    }

    function loadData() {
        // Workout Data
        const storedData = localStorage.getItem('gymAssistData');
        if (storedData) {
            localWorkoutData = JSON.parse(storedData);
        } else {
            localWorkoutData = JSON.parse(JSON.stringify(workoutData));
            saveData();
        }

        // Stats Data
        const storedStats = localStorage.getItem('gymAssistStats');
        if (storedStats) {
            userStats = JSON.parse(storedStats);
        }
    }

    function saveData() {
        localStorage.setItem('gymAssistData', JSON.stringify(localWorkoutData));
        localStorage.setItem('gymAssistStats', JSON.stringify(userStats));
    }

    // --- Navigation & Dashboard ---

    function setupNavigation() {
        startWorkoutBtn.onclick = () => navigateTo('week-view');

        // Expose to window for inline onclicks in HTML
        window.navigateTo = navigateTo;

        // Reset Week Function
        window.resetWeeklyProgress = () => {
            if (confirm("⚠️ Tem certeza que deseja reiniciar a semana?\n\nIsso irá remover o 'check' de conclusão de todos os treinos da semana atual.\nO histórico (gráfico) NÃO será apagado.")) {
                Object.keys(localWorkoutData).forEach(dayKey => {
                    const day = localWorkoutData[dayKey];
                    if (day.exercises) {
                        day.exercises.forEach(ex => {
                            ex.completed = false;
                            ex.completedSets = 0;
                        });
                    }
                });

                // 2. Clear History (Last 7 Days)
                const today = new Date();
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);

                const originalLength = userStats.history.length;

                // Keep only older than 7 days
                userStats.history = userStats.history.filter(h => {
                    if (!h.date) return false;
                    const hDate = new Date(h.date);
                    return hDate < oneWeekAgo;
                });

                // Update totals
                const removedCount = originalLength - userStats.history.length;
                userStats.totalWorkouts = Math.max(0, userStats.totalWorkouts - removedCount);

                if (userStats.history.length === 0) userStats.streak = 0;

                updateDashboard(); // Refresh chart/stats

                saveData();
                renderWeekGrid(); // Refresh view
                alert("Semana reiniciada! 🔄\nDados e gráfico atualizados.");
            }
        };
    }

    function navigateTo(viewName) {
        // Hide all
        dashboardView.classList.add('hidden');
        weekView.classList.add('hidden');
        workoutDetailView.classList.add('hidden');

        // Show specific
        if (viewName === 'dashboard') {
            updateDashboard();
            dashboardView.classList.remove('hidden');
        } else if (viewName === 'week-view') {
            renderWeekGrid();
            weekView.classList.remove('hidden');
        } else if (viewName === 'workout-detail') {
            workoutDetailView.classList.remove('hidden');
        }
    }

    function updateDashboard() {
        // Update Stats
        statStreak.innerText = userStats.streak;
        statTotal.innerText = userStats.totalWorkouts;

        if (userStats.lastWorkoutDate) {
            const date = new Date(userStats.lastWorkoutDate);
            statLast.innerText = `${date.getDate()}/${date.getMonth() + 1}`;
        } else {
            statLast.innerText = "--";
        }

        // Debug: Show total history items in chart title if possible, or console
        // For user visibility:
        const chartTitle = document.querySelector('#dashboard-view h3');
        if (chartTitle) chartTitle.innerText = `Frequência Semanal (${userStats.history.length})`;

        initDashboardChart();
    }

    function initDashboardChart() {
        const ctx = document.getElementById('activityChart').getContext('2d');
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        const labels = [];
        const dataPoints = [];
        const pointColors = [];

        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            labels.push(days[d.getDay()]);

            // FIX: robust date comparison
            const isSameDay = (d1, d2) =>
                d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();

            const entry = userStats.history.find(h => {
                if (!h.date) return false;
                return isSameDay(new Date(h.date), d);
            });

            if (entry) {
                let val = (entry.percentage !== undefined && entry.percentage !== null) ? entry.percentage : 100;
                dataPoints.push(val);
                if (entry.rating === 'good') pointColors.push('#4ade80');
                else if (entry.rating === 'ok') pointColors.push('#facc15');
                else pointColors.push('#ef4444');
            } else {
                dataPoints.push(0);
                pointColors.push('rgba(255, 255, 255, 0.2)');
            }
        }

        if (dashboardChart) {
            dashboardChart.destroy();
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

        dashboardChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Intensidade (%)',
                    data: dataPoints,
                    borderColor: '#38bdf8',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointBackgroundColor: '#1e293b',
                    pointBorderColor: pointColors,
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#fff',
                        bodyColor: '#cbd5e1',
                        callbacks: {
                            label: (context) => `Conclusão: ${context.raw}%`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 120,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    // --- History Details Logic ---
    const historyModal = document.getElementById('history-modal');
    const closeHistoryBtn = document.getElementById('close-history');
    const historyContent = document.getElementById('history-content');

    if (closeHistoryBtn) {
        closeHistoryBtn.onclick = () => {
            historyModal.classList.add('hidden');
        }
    }

    function showHistoryDetails(entry, pct) {
        // Find workout title
        let workoutTitle = "Treino Removido";
        if (localWorkoutData[entry.workoutId]) {
            workoutTitle = localWorkoutData[entry.workoutId].title;
        }

        const date = new Date(entry.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateFormatted = date.toLocaleDateString('pt-BR', options);

        const percentDisplay = pct || entry.percentage || 100;

        // Icon Mapping
        const icons = {
            'good': '🤩',
            'ok': '😐',
            'bad': '😫'
        };
        const labels = {
            'good': 'Excelente',
            'ok': 'Normal',
            'bad': 'Difícil'
        };

        historyContent.innerHTML = `
            <span class="history-detail-date">${dateFormatted}</span>
            <div class="history-detail-icon">${icons[entry.rating] || '✅'}</div>
            <h3 class="history-detail-title">${workoutTitle}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 5px;">Avaliação: <strong style="color: white">${labels[entry.rating] || 'Concluído'}</strong></p>
            <p style="color: var(--text-secondary)">Conclusão: <strong style="color: var(--accent)">${percentDisplay}%</strong></p>
        `;

        historyModal.classList.remove('hidden');
    }

    // --- Legacy / Modified Renderers ---

    function renderWeekGrid() {
        const grid = document.getElementById('week-grid');
        grid.innerHTML = ''; // Clear existing

        Object.keys(localWorkoutData).forEach(dayKey => {
            const dayData = localWorkoutData[dayKey];
            const card = document.createElement('div');
            card.className = 'day-card';
            card.onclick = () => showWorkout(dayKey);

            card.innerHTML = `
                <h3>${dayData.title}</h3>
                <p>${dayData.focus}</p>
                <div style="margin-top: 10px; font-size: 0.8rem; color: var(--accent);">
                    ${dayData.exercises.length} Exercícios
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function showWorkout(dayKey) {
        currentDay = dayKey;
        isEditMode = false; // Reset edit mode ao abrir
        renderWorkoutView();
    }

    function renderWorkoutView() {
        if (!currentDay) return;
        navigateTo('workout-detail'); // Switch view

        const dayData = localWorkoutData[currentDay];

        workoutDetailView.innerHTML = `
            <div class="workout-view">
                <div class="workout-header">
                    <button id="back-btn" class="back-btn">← Voltar</button>
                    <h2>${dayData.title}</h2>
                    <button id="edit-btn" class="edit-btn">${isEditMode ? 'Salvar' : 'Editar'}</button>
                </div>
                <div class="exercise-list">
                    ${dayData.exercises.map((ex, index) => renderExerciseItem(ex, index)).join('')}
                </div>
                ${isEditMode
                ? `<div class="edit-actions"><button onclick="addExercise()" class="add-btn">+ Adicionar Exercício</button></div>`
                : `<button onclick="finishWorkout()" class="action-btn-large" style="margin-top: 30px;">FINALIZAR TREINO 🎉</button>`
            }
            </div>
        `;

        document.getElementById('back-btn').onclick = () => {
            if (isEditMode) {
                if (confirm("Sair sem salvar?")) {
                    currentDay = null;
                    navigateTo('week-view');
                }
            } else {
                currentDay = null;
                navigateTo('week-view');
            }
        };

        document.getElementById('edit-btn').onclick = toggleEditMode;
    }

    // --- Feedback Logic ---
    const feedbackModal = document.getElementById('feedback-modal');
    const closeFeedbackBtn = document.getElementById('close-feedback');

    window.finishWorkout = () => {
        // Enforce Completion
        if (localWorkoutData[currentDay] && localWorkoutData[currentDay].exercises) {
            const exercises = localWorkoutData[currentDay].exercises;
            const pending = exercises.some(ex => {
                const total = parseInt(ex.sets || 3);
                const done = ex.completedSets || 0;
                // Not completed explicit AND sets not finished
                return !ex.completed && done < total;
            });

            if (pending) {
                alert("Você ainda tem exercícios pendentes! Complete todos para finalizar.");
                return;
            }
        }

        feedbackModal.classList.remove('hidden');
    };

    closeFeedbackBtn.onclick = () => {
        feedbackModal.classList.add('hidden');
    };

    window.submitFeedback = (rating) => {
        completeWorkoutSession(rating);
        feedbackModal.classList.add('hidden');
    };

    function completeWorkoutSession(rating) {
        // Calculate Percentage
        let totalSets = 0;
        let completedSets = 0;
        if (localWorkoutData[currentDay] && localWorkoutData[currentDay].exercises) {
            localWorkoutData[currentDay].exercises.forEach(ex => {
                totalSets += parseInt(ex.sets || 3);
                completedSets += ex.completedSets || 0;
            });
        }
        const percentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 100;

        // Update Stats
        userStats.totalWorkouts++;
        userStats.lastWorkoutDate = new Date().toISOString();

        // Simple streak logic
        // Check if last workout was yesterday (real implementation requires date diff)
        // For now, simple increment
        userStats.streak++;

        userStats.history.push({
            date: new Date().toISOString(),
            workoutId: currentDay,
            rating: rating,
            percentage: percentage,
            completed: true
        });

        saveData();

        // alert("Treino salvo! Voltando ao dashboard...");
        navigateTo('dashboard');
    }

    function renderExerciseItem(ex, index) {
        const weightDisplay = ex.weight ? `${ex.weight}kg` : '';

        if (isEditMode) {
            return `
                <div class="exercise-item edit-mode">
                    <div class="exercise-info" style="width: 100%">
                        <input type="text" class="edit-input name-input" value="${ex.name}" onchange="updateExercise('${currentDay}', ${index}, 'name', this.value)" placeholder="Nome exercício">
                        <div class="exercise-edit-row">
                            <label>Séries: <input type="number" class="edit-input num-input" value="${ex.sets}" onchange="updateExercise('${currentDay}', ${index}, 'sets', this.value)"></label>
                            <input type="text" class="edit-input num-input" value="${ex.reps}" onchange="updateExercise('${currentDay}', ${index}, 'reps', this.value)" placeholder="Reps">
                             <input type="number" class="edit-input num-input" value="${ex.weight || ''}" onchange="updateExercise('${currentDay}', ${index}, 'weight', this.value)" placeholder="Kg" style="width: 60px;">
                        </label>
                    </div>
                    <input type="url" class="edit-input" value="${ex.videoUrl || ''}" onchange="updateExercise('${currentDay}', ${index}, 'videoUrl', this.value)" placeholder="Link YouTube (Opcional)" style="margin-top: 5px; width: 100%">
                </div>
                <button onclick="deleteExercise(${index})" class="delete-btn">🗑️</button>
                </div>
            `;
        } else {
            // Logic for badges
            const totalSets = ex.sets || 3;
            const completedSets = ex.completedSets || 0;
            let statusBadge = '';

            if (completedSets > 0 && !ex.completed) {
                statusBadge = `<span class="status-badge progress">⏳ ${completedSets}/${totalSets}</span>`;
            } else if (ex.completed) {
                // statusBadge = `<span class="status-badge done">✓ Concluído</span>`; 
                // We keep the checkmark logic but visual feedback is good
            }

            return `
                <div class="exercise-item ${ex.completed ? 'completed' : ''}" onclick="openExerciseDetail('${currentDay}', ${index})">
                    <div class="exercise-info">
                        <h4>${ex.name} ${statusBadge}</h4>
                        <span class="exercise-meta">${totalSets} Séries x ${ex.reps} Reps ${weightDisplay ? '• <strong>' + weightDisplay + '</strong>' : ''}</span>
                    </div>
                    <div class="completion-check"></div>
                </div>
            `;
        }
    }

    // New Window Toggle removed - we use internal logic now, or keep for manual overrides
    window.toggleComplete = (dayKey, index) => {
        // Manual toggle (click on check) - Logic adjusted to fill/empty all sets
        const currentState = localWorkoutData[dayKey].exercises[index].completed || false;
        const newState = !currentState;

        localWorkoutData[dayKey].exercises[index].completed = newState;
        // If marking done, set completedSets to max. If undoing, set to 0.
        const maxSets = localWorkoutData[dayKey].exercises[index].sets || 3;
        localWorkoutData[dayKey].exercises[index].completedSets = newState ? maxSets : 0;

        saveData();
        renderWorkoutView();
        event.stopPropagation();
    }

    function toggleEditMode() {
        isEditMode = !isEditMode;
        if (!isEditMode) {
            saveData(); // Salva ao sair do modo edição
        }
        renderWorkoutView();
    }

    // Funções globais para inputs
    window.updateExercise = (dayKey, index, field, value) => {
        localWorkoutData[dayKey].exercises[index][field] = value;
        saveData(); // Auto-save on every change
    };



    window.deleteExercise = (index) => {
        if (confirm("Remover exercício?")) {
            localWorkoutData[currentDay].exercises.splice(index, 1);
            renderWorkoutView();
        }
    };

    // Timer Logic & Session State
    let timerInterval = null;
    let timeLeft = 0;
    let isTimerRunning = false;
    let currentSessionSets = 0;
    let activeExerciseIndex = null;

    // Audio Context para Beep
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();



    // Audio Context para Beep


    function playBeep() {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5); // 0.5 segundos
    }

    const timerDisplay = document.getElementById('timer-display');
    const timerToggleBtn = document.getElementById('timer-toggle');

    window.setTimer = (seconds) => {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timeLeft = seconds;
        updateTimerDisplay();
        timerToggleBtn.innerText = "Iniciar";
        timerToggleBtn.classList.remove('running');
    };

    window.toggleTimer = () => {
        if (timeLeft <= 0 && !isTimerRunning) return;

        if (isTimerRunning) {
            // Pause
            clearInterval(timerInterval);
            isTimerRunning = false;
            timerToggleBtn.innerText = "Continuar";
        } else {
            // Start
            if (timeLeft === 0) timeLeft = 60; // Default
            isTimerRunning = true;
            timerToggleBtn.innerText = "Pausar";

            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();

                if (timeLeft <= 0) {
                    // Timer Acabou!
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    timerToggleBtn.innerText = "Iniciar";

                    finishSet(); // Lógica de fim de descanso
                }
            }, 1000);
        }
    };

    function finishSet() {
        playBeep();

        // New Logic: Increment completed sets
        if (typeof activeExerciseIndex !== 'undefined' && currentDay) {
            let exercise = localWorkoutData[currentDay].exercises[activeExerciseIndex];

            // Initialize if undefined
            if (!exercise.completedSets) exercise.completedSets = 0;

            exercise.completedSets++;

            // Visual Update in Modal
            currentSessionSets = exercise.completedSets; // Update local ref
            const totalSets = parseInt(exercise.sets) || 3;

            // Check completion
            if (exercise.completedSets >= totalSets) {
                exercise.completed = true;
                exercise.completedSets = totalSets; // Clamp

                saveData();
                updateSetsDisplay(totalSets, totalSets); // Show 3/3

                setTimeout(() => {
                    alert("Exercício Concluído! Bom trabalho! 💪");
                    modal.classList.add('hidden');
                    resetTimer();
                    renderWorkoutView(); // Refresh list background
                }, 500);
            } else {
                // Not done yet
                saveData(); // Save partial progress
                updateSetsDisplay(exercise.completedSets, totalSets);

                // Optional: Start rest timer automatically? 
                // For now, allow user to click rest.
            }
        }
    }

    window.resetTimer = () => {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timeLeft = 0;
        updateTimerDisplay();
        timerToggleBtn.innerText = "Iniciar Descanso";
    };

    function updateTimerDisplay() {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        timerDisplay.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function updateSetsDisplay(current, total) {
        modalSets.innerHTML = `<span style="color: var(--accent); font-size: 1.2rem;">${current}</span> / ${total} Concluídas`;
    }

    // Fechar modal (override)
    closeModalBtn.onclick = () => {
        modal.classList.add('hidden');
        resetTimer();
    };

    // Fechar ao clicar fora (override)
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.add('hidden');
            resetTimer();
        }
    };

    // Função exposta globalmente
    window.openExerciseDetail = (dayKey, exerciseIndex) => {
        if (isEditMode) return;

        activeExerciseIndex = exerciseIndex; // Salva para uso no timer
        const exercise = localWorkoutData[dayKey].exercises[exerciseIndex];

        modalTitle.innerText = exercise.name;

        // Setup Sessions Logic
        const totalSets = parseInt(exercise.sets) || 3;
        const currentDone = exercise.completedSets || 0;

        currentSessionSets = currentDone; // Track locally
        updateSetsDisplay(currentDone, totalSets);

        modalReps.innerText = exercise.reps;
        modalDesc.innerText = exercise.description || "Sem descrição.";

        // Weight Input Logic
        const weightInput = document.getElementById('modal-weight');
        if (weightInput) {
            weightInput.value = exercise.weight || '';
            weightInput.onchange = (e) => {
                exercise.weight = e.target.value;
                saveData();
                renderWorkoutView(); // Update list background if visible or to save state
            };
        }

        // Reset Timer Text to context
        timerToggleBtn.innerText = "Iniciar Descanso";

        // Video Logic
        const videoContainer = document.getElementById('video-container');
        const ytId = getYoutubeId(exercise.videoUrl);

        if (ytId) {
            videoContainer.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${ytId}" allowfullscreen></iframe>
                <a href="https://www.youtube.com/watch?v=${ytId}" target="_blank" class="youtube-link">
                    Assistir no YouTube (caso dê erro 153) ↗
                </a>
            `;
            videoContainer.classList.remove('hidden');
            modalImage.style.display = 'none'; // Prioriza vídeo se tiver? Ou mostra ambos? Vamos mostrar ambos se tiver espaço, mas o usuário pediu vídeo para ver como faz.
            // Se tiver vídeo, vídeo é melhor que imagem estática. Vamos manter a imagem se não tiver vídeo ou se o vídeo falhar?
            // Vamos mostrar a imagem SOMENTE se não tiver vídeo, para economizar espaço vertical.
        } else {
            videoContainer.innerHTML = '';
            videoContainer.classList.add('hidden');

            if (exercise.image && !exercise.image.startsWith('placeholder')) {
                modalImage.src = exercise.image;
                modalImage.style.display = 'block';
            } else {
                modalImage.style.display = 'none';
            }
        }

        modal.classList.remove('hidden');

        // Reset timer state
        resetTimer();
    };

    // --- Lógica do Catálogo ---
    const catalogModal = document.getElementById('catalog-modal');
    const catalogList = document.getElementById('catalog-list');
    const closeCatalogBtn = document.getElementById('close-catalog');

    // Substituir a função antiga addExercise para abrir o modal
    window.addExercise = () => {
        renderCatalog('Todos');
        catalogModal.classList.remove('hidden');
    };

    // Auxiliar YouTube
    function getYoutubeId(url) {
        if (!url) return null;
        // Regex robusto para YouTube (inclui Shorts, Mobile, etc)
        const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/shorts\/)|m\.youtube\.com\/watch\?v=)([\w-]{11})/);
        return (match && match[1]) ? match[1] : null;
    }

    closeCatalogBtn.onclick = () => {
        catalogModal.classList.add('hidden');
    };

    window.filterCatalog = (category) => {
        // Atualiza botões visuais
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.innerText === category) btn.classList.add('active');
        });
        renderCatalog(category);
    };

    function renderCatalog(category) {
        catalogList.innerHTML = '';

        const filtered = category === 'Todos'
            ? exerciseLibrary
            : exerciseLibrary.filter(ex => ex.group === category);

        filtered.forEach(ex => {
            const item = document.createElement('div');
            item.className = 'catalog-item';
            item.onclick = () => selectExerciseFromCatalog(ex);
            item.innerHTML = `
                <div class="catalog-item-info">
                    <h4>${ex.name}</h4>
                    <span>${ex.group}</span>
                </div>
                <div class="add-icon">+</div>
            `;
            catalogList.appendChild(item);
        });
    }

    function selectExerciseFromCatalog(exTemplate) {
        const newExercise = {
            id: exTemplate.id, // ou gerar uuid
            name: exTemplate.name,
            sets: 3, // Default
            reps: "10-12", // Default
            description: exTemplate.description,
            image: exTemplate.image
        };

        localWorkoutData[currentDay].exercises.push(newExercise);
        saveData(); // Salvar já

        catalogModal.classList.add('hidden');
        renderWorkoutView(); // Atualiza a tela de fundo

        // Feedback
        // alert(`Adicionado: ${newExercise.name}`);
    }

    window.addCustomExerciseFromCatalog = () => {
        localWorkoutData[currentDay].exercises.push({
            name: "Exercício Personalizado",
            sets: 3,
            reps: "10",
            description: "",
            image: ""
        });
        saveData();
        catalogModal.classList.add('hidden');
        renderWorkoutView();
    };
});
