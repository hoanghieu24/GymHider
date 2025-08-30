// State management
        const userState = {
            currentDay: 0,
            started: false,
            completedExercises: {},
            completedDays: {},
            calorieIntake: {},
            startDate: null,
            completedDates: {},
            todayCompleted: false,
            weekNumber: 1
        };

        // DOM Elements
        const startDayBtn = document.getElementById('startDayBtn');
        const completeDayBtn = document.getElementById('completeDayBtn');
        const newWeekBtn = document.getElementById('newWeekBtn');
        const showAllDaysBtn = document.getElementById('showAllDaysBtn');
        const showAllExercisesBtn = document.getElementById('showAllExercisesBtn');
        const currentDayElement = document.getElementById('currentDay');
        const dayProgressElement = document.getElementById('dayProgress');
        const todayCaloriesElement = document.getElementById('todayCalories');
        const calorieGoalElement = document.getElementById('calorieGoal');
        const exerciseCompletionElement = document.getElementById('exerciseCompletion');
        const exerciseProgressElement = document.getElementById('exerciseProgress');
        const progressTimelineElement = document.getElementById('progressTimeline');
        const aiAnalysisElement = document.getElementById('aiAnalysis');
        const aiSuggestionsElement = document.getElementById('aiSuggestions');
        const aiQuestionInput = document.getElementById('aiQuestionInput');
        const askAIButton = document.getElementById('askAIButton');
        const aiConversationElement = document.getElementById('aiConversation');
        const aiThinkingElement = document.getElementById('aiThinking');
        const completedDaysCountElement = document.getElementById('completedDaysCount');
        const totalExercisesElement = document.getElementById('totalExercises');
        const avgCompletionElement = document.getElementById('avgCompletion');
        const weightLossElement = document.getElementById('weightLoss');
        const viewDetailsBtn = document.getElementById('viewDetailsBtn');
        const startNewWeekBtn = document.getElementById('startNewWeekBtn');
        const weekSummaryElement = document.getElementById('weekSummary');
        const resetAllBtn = document.getElementById('resetAllBtn');

        // Initialize from localStorage
        function initializeApp() {
            const savedState = localStorage.getItem('fitnessAppState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                Object.assign(userState, parsedState);

                if (userState.started) {
                    updateUI();
                    updateWeekSummary();
                }
            }
            updateButtonStates();

            // Ẩn phần thống kê nếu chưa có dữ liệu
            if (userState.currentDay === 0) {
                weekSummaryElement.classList.add('d-none');
            }
        }
        resetAllBtn.addEventListener('click', function () {
            if (confirm("Bạn có chắc chắn muốn xóa hết dữ liệu và bắt đầu lại từ đầu? Hành động này không thể hoàn tác!")) {
                // Reset toàn bộ state về mặc định
                userState.currentDay = 0;
                userState.started = false;
                userState.completedExercises = {};
                userState.completedDays = {};
                userState.calorieIntake = {};
                userState.startDate = null;
                userState.completedDates = {};
                userState.todayCompleted = false;
                userState.weekNumber = 1;
                userState.streak = 0;
                userState.level = 1;
                userState.xp = 0;
                userState.achievements = [];
                userState.completedDaysThisWeek = 0;
                userState.lastCompletedDate = null;

                // Reset tất cả checkboxes
                document.querySelectorAll('.exercise-checkbox').forEach(checkbox => {
                    checkbox.checked = false;
                    const exerciseItem = checkbox.closest('.exercise-item');
                    if (exerciseItem) {
                        exerciseItem.classList.remove('completed');
                    }
                });

                // Reset day toggles
                document.querySelectorAll('.day-toggle').forEach(toggle => {
                    toggle.checked = false;
                });

                // Reset charts
                progressChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
                progressChart.update();
                weeklyChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
                weeklyChart.update();

                // Reset UI elements
                document.getElementById('currentDay').textContent = 'Chưa bắt đầu';
                document.getElementById('dayProgress').style.width = '0%';
                document.getElementById('todayCalories').textContent = '0 kcal';
                document.getElementById('exerciseCompletion').textContent = '0%';
                document.getElementById('exerciseProgress').style.width = '0%';
                document.getElementById('streakCount').textContent = '0 ngày';
                document.getElementById('userLevel').textContent = 'Mới bắt đầu';
                document.getElementById('xpPoints').textContent = '0 XP';
                document.getElementById('levelProgressBar').style.width = '0%';
                document.getElementById('levelProgressText').textContent = '0%';
                document.getElementById('weeklyGoalProgress').style.width = '0%';
                document.getElementById('weeklyGoalText').textContent = 'Bạn đã hoàn thành 0/5 ngày tập';
                document.getElementById('achievementsContainer').innerHTML = '<p class="text-center">Chưa có thành tích nào. Hãy bắt đầu tập luyện!</p>';

                // Reset timeline
                document.getElementById('progressTimeline').innerHTML = `
            <div class="timeline-item">
                <div class="timeline-content">
                    <h5>Chưa có dữ liệu</h5>
                    <p>Hãy bắt đầu ngày mới và hoàn thành bài tập để theo dõi tiến trình</p>
                </div>
            </div>
        `;

                // Clear localStorage
                localStorage.removeItem('fitnessAppState');

                // Update UI
                updateUI();
                updateButtonStates();

                alert('Đã reset toàn bộ dữ liệu! Bạn có thể bắt đầu lại từ đầu.');
            }
        });

        function updateButtonStates() {
            if (userState.started && !userState.todayCompleted) {
                completeDayBtn.disabled = false;
            } else {
                completeDayBtn.disabled = true;
            }

            // Hiển thị nút tuần mới nếu đã hoàn thành 7 ngày
            if (userState.currentDay >= 7 && userState.todayCompleted) {
                newWeekBtn.classList.remove('d-none');
            } else {
                newWeekBtn.classList.add('d-none');
            }
        }

        // Save state to localStorage
        function saveState() {
            localStorage.setItem('fitnessAppState', JSON.stringify(userState));
        }

        // Update UI based on current state
        function updateUI() {
            // Update current day display
            if (userState.currentDay > 0) {
                currentDayElement.textContent = `Ngày ${userState.currentDay}/7`;
                dayProgressElement.style.width = `${(userState.currentDay / 7) * 100}%`;
            }

            // Update exercise completion
            updateExerciseCompletion();

            // Update timeline
            updateProgressTimeline();

            // Update AI analysis
            updateAIAnalysis();

            // Update week summary
            updateWeekSummary();

            // Update button states
            updateButtonStates();
        }

        // Update exercise completion percentage
        function updateExerciseCompletion() {
            if (userState.currentDay > 0) {
                const dayKey = `day${userState.currentDay}`;
                const exercises = userState.completedExercises[dayKey] || {};
                const totalExercises = document.querySelectorAll(`.exercise-checkbox[data-day="${userState.currentDay}"]`).length;
                const completedExercises = Object.values(exercises).filter(val => val).length;

                const completionPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
                exerciseCompletionElement.textContent = `${Math.round(completionPercentage)}%`;
                exerciseProgressElement.style.width = `${completionPercentage}%`;

                // Update calorie intake for current day
                const calorieIntake = userState.calorieIntake[dayKey] || 0;
                todayCaloriesElement.textContent = `${calorieIntake} kcal`;

                // Set goal based on day
                const calorieGoals = [0, 1200, 1250, 1180, 1220, 1190, 1210, 1230];
                if (userState.currentDay <= 7) {
                    calorieGoalElement.textContent = calorieGoals[userState.currentDay];
                }
            }
        }

        // Update progress timeline
        function updateProgressTimeline() {
            if (userState.currentDay > 0) {
                let timelineHTML = '';

                for (let day = 1; day <= userState.currentDay; day++) {
                    const dayKey = `day${day}`;
                    const exercises = userState.completedExercises[dayKey] || {};
                    const totalExercises = document.querySelectorAll(`.exercise-checkbox[data-day="${day}"]`).length;
                    const completedExercises = Object.values(exercises).filter(val => val).length;
                    const completionPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

                    timelineHTML += `
                        <div class="timeline-item">
                            <div class="timeline-content">
                                <h5>Ngày ${day}</h5>
                                <p>Hoàn thành: ${Math.round(completionPercentage)}%</p>
                                <p class="${completionPercentage >= 80 ? 'text-success' : completionPercentage >= 50 ? 'text-warning' : 'text-danger'}">
                                    <i class="fas ${completionPercentage >= 80 ? 'fa-check-circle' : completionPercentage >= 50 ? 'fa-spinner' : 'fa-exclamation-circle'}"></i> 
                                    ${completionPercentage >= 80 ? 'Hoàn thành tốt' : completionPercentage >= 50 ? 'Đang thực hiện' : 'Cần cố gắng'}
                                </p>
                            </div>
                        </div>
                    `;
                }

                progressTimelineElement.innerHTML = timelineHTML;
            }
        }

        // Update week summary
        function updateWeekSummary() {
            if (userState.currentDay > 0) {
                let completedDays = 0;
                let totalExercisesCompleted = 0;
                let totalExercisesPossible = 0;
                let totalCompletion = 0;

                for (let day = 1; day <= userState.currentDay; day++) {
                    const dayKey = `day${day}`;
                    const exercises = userState.completedExercises[dayKey] || {};
                    const totalExercises = document.querySelectorAll(`.exercise-checkbox[data-day="${day}"]`).length;
                    const completedExercises = Object.values(exercises).filter(val => val).length;

                    if (completedExercises > 0) {
                        completedDays++;
                    }

                    totalExercisesCompleted += completedExercises;
                    totalExercisesPossible += totalExercises;

                    const completionPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
                    totalCompletion += completionPercentage;
                }

                const avgCompletion = userState.currentDay > 0 ? totalCompletion / userState.currentDay : 0;

                // Hiển thị thống kê
                weekSummaryElement.classList.remove('d-none');
                completedDaysCountElement.textContent = completedDays;
                totalExercisesElement.textContent = totalExercisesCompleted;
                avgCompletionElement.textContent = `${Math.round(avgCompletion)}%`;

                // Ước tính giảm cân (dựa trên completion rate và calorie deficit)
                const estimatedWeightLoss = (totalExercisesCompleted * 0.01 + (avgCompletion / 100) * 0.5).toFixed(1);
                weightLossElement.textContent = `${estimatedWeightLoss} kg`;
            }
        }

        // Update AI analysis based on user progress
        function updateAIAnalysis() {
            if (userState.currentDay > 0) {
                let totalCompletion = 0;
                let daysWithData = 0;

                for (let day = 1; day <= userState.currentDay; day++) {
                    const dayKey = `day${day}`;
                    const exercises = userState.completedExercises[dayKey] || {};
                    const totalExercises = document.querySelectorAll(`.exercise-checkbox[data-day="${day}"]`).length;

                    if (totalExercises > 0) {
                        const completedExercises = Object.values(exercises).filter(val => val).length;
                        totalCompletion += (completedExercises / totalExercises) * 100;
                        daysWithData++;
                    }
                }

                const avgCompletion = daysWithData > 0 ? totalCompletion / daysWithData : 0;

                let analysisHTML = '';
                if (avgCompletion >= 80) {
                    analysisHTML = `
                        <p>Bạn đang tuân thủ <strong>${Math.round(avgCompletion)}%</strong> kế hoạch - rất tuyệt vời!</p>
                        <p>Lượng calorie trung bình: ${Object.values(userState.calorieIntake).reduce((a, b) => a + b, 0) / Object.keys(userState.calorieIntake).length} kcal/ngày</p>
                        <p>Tỷ lệ hoàn thành bài tập: ${Math.round(avgCompletion)}%</p>
                        <p class="text-success">Dự đoán giảm 0.8-1.2 kg/tuần nếu duy trì</p>
                    `;
                } else if (avgCompletion >= 50) {
                    analysisHTML = `
                        <p>Bạn đang tuân thủ <strong>${Math.round(avgCompletion)}%</strong> kế hoạch - khá tốt!</p>
                        <p>Lượng calorie trung bình: ${Object.values(userState.calorieIntake).reduce((a, b) => a + b, 0) / Object.keys(userState.calorieIntake).length} kcal/ngày</p>
                        <p>Tỷ lệ hoàn thành bài tập: ${Math.round(avgCompletion)}%</p>
                        <p class="text-warning">Dự đoán giảm 0.5-0.8 kg/tuần nếu duy trì</p>
                    `;
                } else {
                    analysisHTML = `
                        <p>Bạn đang tuân thủ <strong>${Math.round(avgCompletion)}%</strong> kế hoạch - cần cố gắng hơn!</p>
                        <p>Lượng calorie trung bình: ${Object.values(userState.calorieIntake).reduce((a, b) => a + b, 0) / Object.keys(userState.calorieIntake).length} kcal/ngày</p>
                        <p>Tỷ lệ hoàn thành bài tập: ${Math.round(avgCompletion)}%</p>
                        <p class="text-danger">Hãy cố gắng hoàn thành ít nhất 80% bài tập mỗi ngày</p>
                    `;
                }

                aiAnalysisElement.innerHTML = analysisHTML;

                // Generate suggestions
                const suggestions = [
                    "Tăng cường uống nước (2.5L/ngày)",
                    "Bổ sung thêm rau xanh vào bữa tối",
                    "Ngủ đủ 7-8 tiếng mỗi đêm",
                    "Thêm 5 phút cardio vào buổi sáng"
                ];

                let suggestionsHTML = "<ul>";
                suggestions.forEach(suggestion => {
                    suggestionsHTML += `<li>${suggestion}</li>`;
                });
                suggestionsHTML += "</ul>";

                aiSuggestionsElement.innerHTML = suggestionsHTML;
            }
        }

        // Call Gemini API for real AI responses
        async function getAIResponse(question) {
            const googleApiKey = "AIzaSyBmnhbC58Ih-Viu4edR2uyjJqQGhQGhJCg";
            const MODEL_NAME = "gemini-2.0-flash";
            const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/"
                + MODEL_NAME + ":generateContent?key=" + googleApiKey;

            // Hiển thị trạng thái đang suy nghĩ
            aiThinkingElement.style.display = 'block';

            try {
                // Tạo prompt phù hợp với vai trò huấn luyện viên
                const prompt = `Bạn là một huấn luyện viên thể hình và dinh dưỡng chuyên nghiệp, thân thiện. 
                Hãy trả lời câu hỏi sau đây với tư cách là một người bạn đáng tin cậy, am hiểu về giảm cân và thể dục:
                "${question}"
                
                Hãy đưa ra lời khuyên thiết thực, dễ hiểu và động viên người dùng. Nếu có thể, hãy liên hệ đến chế độ ăn 
                và tập luyện trong kế hoạch 7 ngày giảm cân.
                Quy tắc trả lời:
        - Giới hạn 2-3 câu ngắn gọn
        - Tập trung vào giảm cân và sức khỏe
        - Đưa ra lời khuyên cụ thể
        - Kết thúc bằng câu động viên ngắn`;

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                });

                const data = await response.json();
                aiThinkingElement.style.display = 'none';

                if (data.candidates && data.candidates[0].content.parts[0].text) {
                    return data.candidates[0].content.parts[0].text;
                } else {
                    return "Xin lỗi, tôi không thể trả lời câu hỏi này ngay lúc này. Hãy thử lại sau.";
                }
            } catch (error) {
                console.error('Error calling Gemini API:', error);
                aiThinkingElement.style.display = 'none';

                // Fallback responses if API fails
                const fallbackResponses = {
                    "default": "Tôi là trợ lý AI chuyên về giảm cân và thể dục. Dựa trên kế hoạch của bạn, tôi khuyên bạn nên tuân thủ chặt chẽ thực đơn và lịch tập. Hãy uống đủ nước và ngủ đủ giấc để đạt kết quả tốt nhất!",
                    "ức gà": "Bạn có thể thay thế ức gà bằng cá hồi, đậu phụ, các loại đậu hoặc nấm để đa dạng hóa bữa ăn mà vẫn đảm bảo protein.",
                    "tập": "Hãy cố gắng hoàn thành ít nhất 80% bài tập mỗi ngày. Nếu cảm thấy quá sức, hãy giảm cường độ nhưng vẫn duy trì thói quen tập luyện.",
                    "calo": "Lượng calo mỗi ngày được thiết kế phù hợp để giảm cân an toàn. Không nên cắt giảm quá nhiều so với kế hoạch.",
                    "đói": "Nếu cảm thấy đói giữa các bữa ăn, hãy uống nước hoặc ăn nhẹ với rau củ luộc. Đảm bảo bữa chính có đủ protein và chất xơ.",
                    "mệt": "Cảm giác mệt mỏi khi mới bắt đầu là bình thường. Hãy đảm bảo ngủ đủ giấc và bổ sung đủ nước. Nếu mệt kéo dài, hãy nghỉ ngơi nhiều hơn."
                };

                question = question.toLowerCase();
                for (const [key, response] of Object.entries(fallbackResponses)) {
                    if (question.includes(key)) {
                        return response;
                    }
                }

                return fallbackResponses.default;
            }
        }

        // Event Listeners
        startDayBtn.addEventListener('click', function () {
            if (userState.currentDay < 7) {
                userState.currentDay++;
                userState.started = true;

                const dayKey = `day${userState.currentDay}`;
                if (!userState.completedExercises[dayKey]) {
                    userState.completedExercises[dayKey] = {};
                }

                // Set calorie intake for the day (random for demo)
                const calorieGoals = [0, 1200, 1250, 1180, 1220, 1190, 1210, 1230];
                userState.calorieIntake[dayKey] = Math.floor(calorieGoals[userState.currentDay] * (0.9 + Math.random() * 0.2));

                if (!userState.startDate) {
                    userState.startDate = new Date().toISOString();
                }
                userState.todayCompleted = false;
                updateButtonStates();
                saveState();
                updateUI();

                alert(`Bắt đầu Ngày ${userState.currentDay}! Hãy hoàn thành các bài tập và bữa ăn theo kế hoạch.`);
            } else {
                alert("Bạn đã hoàn thành 7 ngày! Hãy bắt đầu tuần mới.");
            }
        });

        // New Week Button
        newWeekBtn.addEventListener('click', function () {
            if (confirm("Bạn có chắc chắn muốn bắt đầu một tuần mới? Dữ liệu tuần hiện tại sẽ được lưu lại.")) {
                // Lưu dữ liệu tuần cũ (nếu cần)
                const oldWeekData = {
                    weekNumber: userState.weekNumber,
                    completedExercises: { ...userState.completedExercises },
                    completedDays: { ...userState.completedDays },
                    calorieIntake: { ...userState.calorieIntake }
                };

                // Reset state
                userState.weekNumber++;
                userState.currentDay = 0;
                userState.started = false;
                userState.completedExercises = {};
                userState.completedDays = {};
                userState.calorieIntake = {};
                userState.todayCompleted = false;

                // Reset tất cả checkboxes
                document.querySelectorAll('.exercise-checkbox').forEach(checkbox => {
                    checkbox.checked = false;
                    const exerciseItem = checkbox.closest('.exercise-item');
                    if (exerciseItem) {
                        exerciseItem.classList.remove('completed');
                    }
                });

                // Reset day toggles
                document.querySelectorAll('.day-toggle').forEach(toggle => {
                    toggle.checked = false;
                });

                // Reset progress chart
                progressChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
                progressChart.update();

                // Reset weekly chart
                weeklyChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
                weeklyChart.update();

                // Reset các hiển thị
                document.getElementById('currentDay').textContent = 'Chưa bắt đầu';
                document.getElementById('dayProgress').style.width = '0%';
                document.getElementById('todayCalories').textContent = '0 kcal';
                document.getElementById('exerciseCompletion').textContent = '0%';
                document.getElementById('exerciseProgress').style.width = '0%';

                saveState();
                updateUI();
                alert(`Bắt đầu Tuần ${userState.weekNumber}! Chúc bạn đạt được mục tiêu mới.`);
            }
        });

        // Start New Week from Statistics
        startNewWeekBtn.addEventListener('click', function () {
            newWeekBtn.click();
        });

        showAllDaysBtn.addEventListener('click', function () {
            document.querySelectorAll('.more-days').forEach(el => {
                el.classList.toggle('d-none');
            });

            if (showAllDaysBtn.textContent === 'Xem Tất Cả 7 Ngày') {
                showAllDaysBtn.textContent = 'Ẩn Bớt';
            } else {
                showAllDaysBtn.textContent = 'Xem Tất Cả 7 Ngày';
            }
        });

        showAllExercisesBtn.addEventListener('click', function () {
            document.querySelectorAll('.more-exercises').forEach(el => {
                el.classList.toggle('d-none');
            });

            if (showAllExercisesBtn.textContent === 'Xem Lịch Tập Đầy Đủ') {
                showAllExercisesBtn.textContent = 'Ẩn Bớt';
            } else {
                showAllExercisesBtn.textContent = 'Xem Lịch Tập Đầy Đủ';
            }
        });

        // Exercise checkbox event delegation
        document.getElementById('exerciseContainer').addEventListener('change', function (e) {
            if (e.target.classList.contains('exercise-checkbox')) {
                const day = e.target.getAttribute('data-day');
                const exercise = e.target.getAttribute('data-exercise');
                const dayKey = `day${day}`;

                if (!userState.completedExercises[dayKey]) {
                    userState.completedExercises[dayKey] = {};
                }

                userState.completedExercises[dayKey][exercise] = e.target.checked;

                // Update exercise item style
                const exerciseItem = e.target.closest('.exercise-item');
                if (e.target.checked) {
                    exerciseItem.classList.add('completed');
                } else {
                    exerciseItem.classList.remove('completed');
                }

                saveState();
                updateExerciseCompletion();
                updateAIAnalysis();
            }
        });

        // Day toggle event delegation
        document.getElementById('exerciseContainer').addEventListener('change', function (e) {
            if (e.target.classList.contains('day-toggle')) {
                const day = e.target.getAttribute('data-day');
                const dayKey = `day${day}`;
                const checkboxes = document.querySelectorAll(`.exercise-checkbox[data-day="${day}"]`);

                checkboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;

                    const exercise = checkbox.getAttribute('data-exercise');
                    if (!userState.completedExercises[dayKey]) {
                        userState.completedExercises[dayKey] = {};
                    }

                    userState.completedExercises[dayKey][exercise] = e.target.checked;

                    // Update exercise item style
                    const exerciseItem = checkbox.closest('.exercise-item');
                    if (e.target.checked) {
                        exerciseItem.classList.add('completed');
                    } else {
                        exerciseItem.classList.remove('completed');
                    }
                });

                saveState();
                updateExerciseCompletion();
                updateAIAnalysis();
            }
        });

        // AI question handler
        askAIButton.addEventListener('click', async function () {
            const question = aiQuestionInput.value.trim();

            if (question) {
                // Add user question to conversation
                const userMessage = document.createElement('div');
                userMessage.className = 'card mb-3';
                userMessage.innerHTML = `
                    <div class="card-body">
                        <p><strong>Bạn:</strong> ${question}</p>
                    </div>
                `;
                aiConversationElement.appendChild(userMessage);

                // Get AI response
                const response = await getAIResponse(question);

                // Add AI response to conversation
                const aiMessage = document.createElement('div');
                aiMessage.className = 'card mb-3';
                aiMessage.innerHTML = `
                    <div class="card-body">
                        <p><strong>AI:</strong> ${response}</p>
                    </div>
                `;
                aiConversationElement.appendChild(aiMessage);

                // Scroll to bottom
                aiConversationElement.scrollTop = aiConversationElement.scrollHeight;

                // Clear input
                aiQuestionInput.value = '';
            }
        });

        // Allow pressing Enter to send message
        aiQuestionInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                askAIButton.click();
            }
        });

        // Complete day button
        completeDayBtn.addEventListener('click', function () {
            if (userState.currentDay > 0 && !userState.todayCompleted) {
                const today = new Date().toISOString().split('T')[0];
                const dayKey = `day${userState.currentDay}`;

                // Lưu thông tin hoàn thành
                userState.completedDates[today] = {
                    day: userState.currentDay,
                    exercises: { ...userState.completedExercises[dayKey] },
                    calories: userState.calorieIntake[dayKey]
                };

                userState.todayCompleted = true;

                // Cập nhật chart
                progressChart.data.datasets[0].data[userState.currentDay - 1] = userState.calorieIntake[dayKey];
                progressChart.update();

                // Cập nhật UI và lưu state
                saveState();
                updateUI();
                updateButtonStates();

                // Tính toán tỷ lệ hoàn thành
                const completion = calculateDayCompletion(dayKey);

                // Hiển thị modal thông báo hoàn thành
                showCompletionModal(completion);
            }
        });

        // Function tính toán tỷ lệ hoàn thành
        function calculateDayCompletion(dayKey) {
            const exercises = userState.completedExercises[dayKey] || {};
            const totalExercises = document.querySelectorAll(`.exercise-checkbox[data-day="${dayKey.replace('day', '')}"]`).length;
            const completedExercises = Object.values(exercises).filter(val => val).length;
            return totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
        }

        function calculateCaloriesByCompletion(day, completionPercentage) {
            const calorieGoals = [0, 1200, 1250, 1180, 1220, 1190, 1210, 1230];

            if (day > 0 && day <= 7) {
                const baseCalories = calorieGoals[day];
                // Tính calories thực tế dựa trên phần trăm hoàn thành
                // Giả sử nếu hoàn thành 100% thì đạt đúng calories mục tiêu
                const actualCalories = Math.round(baseCalories * (completionPercentage / 100));
                return actualCalories;
            }
            return 0;
        }


        // Function hiển thị modal
        function showCompletionModal(completion) {
            const dayKey = `day${userState.currentDay}`;
            const completionPercentage = completion;

            // Tính calories dựa trên phần trăm hoàn thành
            const actualCalories = calculateCaloriesByCompletion(userState.currentDay, completionPercentage);

            const message = `
        Chúc mừng! Bạn đã hoàn thành Ngày ${userState.currentDay}
        Tỷ lệ hoàn thành: ${Math.round(completionPercentage)}%
        Calories tiêu thụ: ${actualCalories} kcal
    `;

            const modalHtml = `
        <div class="modal fade" id="completionModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Hoàn Thành Ngày ${userState.currentDay}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <i class="fas fa-check-circle text-success fa-3x"></i>
                        </div>
                        <p>${message.replace(/\n/g, '<br>')}</p>
                        <div class="progress">
                            <div class="progress-bar bg-success" style="width: ${Math.round(completionPercentage)}%">
                                ${Math.round(completionPercentage)}%
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    `;

            // Thêm modal vào body và hiển thị
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const modal = new bootstrap.Modal(document.getElementById('completionModal'));
            modal.show();

            // Xóa modal sau khi đóng
            document.getElementById('completionModal').addEventListener('hidden.bs.modal', function () {
                this.remove();
            });
        }

        // Cập nhật function updateExerciseCompletion
        function updateExerciseCompletion() {
            if (userState.currentDay > 0) {
                const dayKey = `day${userState.currentDay}`;
                const exercises = userState.completedExercises[dayKey] || {};
                const totalExercises = document.querySelectorAll(`.exercise-checkbox[data-day="${userState.currentDay}"]`).length;
                const completedExercises = Object.values(exercises).filter(val => val).length;

                const completionPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
                exerciseCompletionElement.textContent = `${Math.round(completionPercentage)}%`;
                exerciseProgressElement.style.width = `${completionPercentage}%`;

                // Cập nhật calorie intake dựa trên phần trăm hoàn thành
                const actualCalories = calculateCaloriesByCompletion(userState.currentDay, completionPercentage);
                userState.calorieIntake[dayKey] = actualCalories;
                todayCaloriesElement.textContent = `${actualCalories} kcal`;

                // Set goal based on day
                const calorieGoals = [0, 1200, 1250, 1180, 1220, 1190, 1210, 1230];
                if (userState.currentDay <= 7) {
                    calorieGoalElement.textContent = calorieGoals[userState.currentDay];
                }
            }
        }
        // Initialize the app
        initializeApp();

        // Initialize chart
        const ctx = document.getElementById('progressChart').getContext('2d');
        const progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7'],
                datasets: [{
                    label: 'Calories tiêu thụ',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#4CAF50',
                    tension: 0.1,
                    fill: false
                }, {
                    label: 'Mục tiêu calories',
                    data: [1200, 1250, 1180, 1220, 1190, 1210, 1230],
                    borderColor: '#2196F3',
                    borderDash: [5, 5],
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Theo Dõi Lượng Calories Theo Ngày'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Calories'
                        }
                    }
                }
            }
        });

        // Initialize weekly chart
        const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
        const weeklyChart = new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7'],
                datasets: [{
                    label: 'Tỷ lệ hoàn thành (%)',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: '#4CAF50',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Hiệu Suất Tập Luyện Theo Ngày'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Tỷ lệ hoàn thành (%)'
                        }
                    }
                }
            }
        });
        // State management mở rộng
        const extendedState = {
            streak: 0,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            achievements: [],
            dailyQuote: "",
            weeklyGoal: 5,
            completedDaysThisWeek: 0,
            lastCompletedDate: null
        };

        // Kết hợp state
        Object.assign(userState, extendedState);

        // Các câu quote động lực
        const motivationQuotes = [
            "Không có gì là không thể với người biết cố gắng!",
            "Mỗi ngày là một cơ hội mới để thay đổi bản thân!",
            "Thành công là kết quả của sự kiên trì!",
            "Cơ thể khỏe mạnh là món quà tuyệt vời nhất bạn có thể tự tặng mình!",
            "Đừng dừng lại khi bạn mệt. Dừng lại khi bạn hoàn thành!",
            "Sức mạnh không đến từ thể chất. Nó đến từ ý chí bất khuất!",
            "Hôm nay khó khăn, ngày mai đau nhức, nhưng ngày kia bạn sẽ thành công!",
            "Tập luyện không chỉ thay đổi cơ thể bạn, nó thay đổi cả tâm trí, thái độ và tâm trạng của bạn!",
            "Bạn không cần phải tuyệt vời để bắt đầu, nhưng bạn phải bắt đầu để trở nên tuyệt vời!",
            "Thất bại duy nhất là không dám thử!"
        ];

        // Các thành tích có thể đạt được
        const achievementsList = [
            { id: "first_day", name: "Ngày đầu tiên", description: "Hoàn thành ngày tập đầu tiên", xp: 50, achieved: false },
            { id: "three_days", name: "Kiên trì", description: "Hoàn thành 3 ngày tập", xp: 100, achieved: false },
            { id: "one_week", name: "Tuần đầu tiên", description: "Hoàn thành trọn vẹn 7 ngày tập", xp: 200, achieved: false },
            { id: "perfect_day", name: "Ngày hoàn hảo", description: "Hoàn thành 100% bài tập một ngày", xp: 75, achieved: false },
            { id: "five_perfect", name: "Chuyên gia", description: "5 ngày hoàn thành 100% bài tập", xp: 250, achieved: false },
            { id: "early_bird", name: "Chim sớm", description: "Bắt đầu tập trước 8h sáng", xp: 50, achieved: false },
            { id: "weekend_warrior", name: "Chiến binh cuối tuần", description: "Tập luyện vào cả thứ 7 và chủ nhật", xp: 100, achieved: false }
        ];

        // Các cấp độ và XP cần thiết
        const levels = [
            { level: 1, name: "Mới bắt đầu", xpRequired: 0 },
            { level: 2, name: "Tập luyện viên", xpRequired: 100 },
            { level: 3, name: "Người kiên trì", xpRequired: 300 },
            { level: 4, name: "Chiến binh", xpRequired: 600 },
            { level: 5, name: "Chuyên gia", xpRequired: 1000 },
            { level: 6, name: "Bậc thầy", xpRequired: 1500 },
            { level: 7, name: "Huyền thoại", xpRequired: 2100 }
        ];

        // Khởi tạo mở rộng
        function initializeExtendedApp() {
            // Lấy ngày hiện tại
            const today = new Date().toDateString();

            // Thiết lập quote ngẫu nhiên hàng ngày
            const dailyQuote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
            document.getElementById('dailyQuote').textContent = dailyQuote;
            userState.dailyQuote = dailyQuote;

            // Kiểm tra streak (chuỗi ngày tập liên tiếp)
            checkStreak();

            // Cập nhật hiển thị
            updateMotivationUI();
        }

        // Kiểm tra streak
        function checkStreak() {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (userState.lastCompletedDate) {
                const lastDate = new Date(userState.lastCompletedDate);
                const isConsecutive = lastDate.toDateString() === yesterday.toDateString();

                if (isConsecutive) {
                    userState.streak++;
                } else if (lastDate.toDateString() !== today.toDateString()) {
                    userState.streak = 1; // Reset streak nếu không liên tiếp
                }
            }

            document.getElementById('streakCount').textContent = `${userState.streak} ngày`;
        }

        // Cập nhật giao diện động lực
        function updateMotivationUI() {
            // Cập nhật level và XP
            let currentLevel = 1;
            let nextLevelXp = 100;

            for (let i = levels.length - 1; i >= 0; i--) {
                if (userState.xp >= levels[i].xpRequired) {
                    currentLevel = levels[i].level;
                    userState.level = currentLevel;
                    userState.xpToNextLevel = i < levels.length - 1 ? levels[i + 1].xpRequired - userState.xp : 0;
                    break;
                }
            }

            const levelName = levels.find(l => l.level === currentLevel)?.name || "Mới bắt đầu";
            document.getElementById('userLevel').textContent = levelName;
            document.getElementById('xpPoints').textContent = `${userState.xp} XP`;

            // Cập nhật thanh tiến trình level
            const currentLevelInfo = levels.find(l => l.level === currentLevel);
            const nextLevelInfo = levels.find(l => l.level === currentLevel + 1);

            if (nextLevelInfo) {
                const xpForCurrentLevel = userState.xp - currentLevelInfo.xpRequired;
                const xpNeededForNextLevel = nextLevelInfo.xpRequired - currentLevelInfo.xpRequired;
                const progressPercentage = (xpForCurrentLevel / xpNeededForNextLevel) * 100;

                document.getElementById('levelProgressBar').style.width = `${progressPercentage}%`;
                document.getElementById('levelProgressText').textContent = `${Math.round(progressPercentage)}%`;
            } else {
                document.getElementById('levelProgressBar').style.width = '100%';
                document.getElementById('levelProgressText').textContent = 'Cấp tối đa!';
            }

            // Cập nhật thành tích
            updateAchievements();

            // Cập nhật mục tiêu tuần
            updateWeeklyGoal();
        }

        // Cập nhật thành tích
        function updateAchievements() {
            const achievementsContainer = document.getElementById('achievementsContainer');
            let achievementsHTML = '';

            let achievedCount = 0;
            userState.achievements.forEach(achievement => {
                if (achievement.achieved) {
                    achievedCount++;
                    achievementsHTML += `
                <div class="achievement-badge">
                    <i class="fas fa-trophy"></i> ${achievement.name}
                </div>
            `;
                }
            });

            if (achievedCount === 0) {
                achievementsHTML = '<p class="text-center">Chưa có thành tích nào. Hãy bắt đầu tập luyện!</p>';
            }

            achievementsContainer.innerHTML = achievementsHTML;
        }

        // Kiểm tra và cấp thành tích
        function checkAchievements() {
            const totalCompletedDays = Object.keys(userState.completedDates).length;
            const perfectDays = Object.values(userState.completedExercises).filter(exercises => {
                const completed = Object.values(exercises).filter(val => val).length;
                const total = Object.keys(exercises).length;
                return completed === total;
            }).length;

            // Kiểm tra thành tích
            achievementsList.forEach(achievement => {
                if (!userState.achievements.find(a => a.id === achievement.id)?.achieved) {
                    let achieved = false;

                    switch (achievement.id) {
                        case 'first_day':
                            achieved = totalCompletedDays >= 1;
                            break;
                        case 'three_days':
                            achieved = totalCompletedDays >= 3;
                            break;
                        case 'one_week':
                            achieved = totalCompletedDays >= 7;
                            break;
                        case 'perfect_day':
                            achieved = perfectDays >= 1;
                            break;
                        case 'five_perfect':
                            achieved = perfectDays >= 5;
                            break;
                        case 'early_bird':
                            const now = new Date();
                            achieved = now.getHours() < 8;
                            break;
                        case 'weekend_warrior':
                            const saturdayCompleted = userState.completedExercises['day6'] &&
                                Object.values(userState.completedExercises['day6']).some(val => val);
                            const sundayCompleted = userState.completedExercises['day7'] &&
                                Object.values(userState.completedExercises['day7']).some(val => val);
                            achieved = saturdayCompleted && sundayCompleted;
                            break;
                    }

                    if (achieved) {
                        userState.achievements.push({ ...achievement, achieved: true });
                        userState.xp += achievement.xp;

                        // Hiển thị thông báo thành tích
                        showAchievementNotification(achievement);
                    }
                }
            });
        }

        // Hiển thị thông báo thành tích
        function showAchievementNotification(achievement) {
            const notification = document.createElement('div');
            notification.className = 'alert alert-success achievement-notification';
            notification.innerHTML = `
        <h4><i class="fas fa-trophy"></i> Thành tích mới!</h4>
        <p>Bạn đã đạt được: <strong>${achievement.name}</strong></p>
        <p>${achievement.description}</p>
        <p>+${achievement.xp} XP</p>
    `;

            document.body.appendChild(notification);

            // Tự động ẩn sau 5 giây
            setTimeout(() => {
                notification.remove();
            }, 5000);
        }

        // Cập nhật mục tiêu tuần
        function updateWeeklyGoal() {
            const weeklyGoal = parseInt(document.getElementById('weeklyGoal').value);
            userState.weeklyGoal = weeklyGoal;

            // Đếm số ngày đã hoàn thành trong tuần này
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay()); // Chủ nhật đầu tuần

            let completedThisWeek = 0;
            Object.entries(userState.completedDates).forEach(([date, data]) => {
                const completedDate = new Date(date);
                if (completedDate >= startOfWeek) {
                    completedThisWeek++;
                }
            });

            userState.completedDaysThisWeek = completedThisWeek;
            const progressPercentage = Math.min(100, (completedThisWeek / weeklyGoal) * 100);

            document.getElementById('weeklyGoalProgress').style.width = `${progressPercentage}%`;
            document.getElementById('weeklyGoalProgress').textContent = `${Math.round(progressPercentage)}%`;
            document.getElementById('weeklyGoalText').textContent = `Bạn đã hoàn thành ${completedThisWeek}/${weeklyGoal} ngày tập`;
        }

        // Cập nhật trạng thái hiển thị theo phần trăm hoàn thành
        function updateCompletionStatus(completionPercentage) {
            // Cập nhật trạng thái theo phần trăm hoàn thành
            let statusElement = document.querySelector(`.timeline-item:nth-child(${userState.currentDay}) .timeline-content p:nth-child(3)`);

            if (!statusElement) return;

            let statusText = '';
            let statusClass = '';

            if (completionPercentage >= 90) {
                statusText = 'Xuất sắc!';
                statusClass = 'text-success';
            } else if (completionPercentage >= 70) {
                statusText = 'Tốt!';
                statusClass = 'text-primary';
            } else if (completionPercentage >= 50) {
                statusText = 'Khá';
                statusClass = 'text-info';
            } else if (completionPercentage >= 30) {
                statusText = 'Cần cố gắng';
                statusClass = 'text-warning';
            } else {
                statusText = 'Chưa đạt';
                statusClass = 'text-danger';
            }

            statusElement.innerHTML = `<span class="${statusClass}"><i class="fas fa-${completionPercentage >= 50 ? 'check' : 'exclamation'}-circle"></i> ${statusText}</span>`;
        }

        // Gọi hàm khởi tạo mở rộng
        initializeExtendedApp();

        // Thêm sự kiện cho select mục tiêu tuần
        document.getElementById('weeklyGoal').addEventListener('change', function () {
            userState.weeklyGoal = parseInt(this.value);
            updateWeeklyGoal();
            saveState();
        });

        // Trong function completeDayBtn click handler, thêm các dòng sau:
        // Sau khi hoàn thành ngày
        userState.lastCompletedDate = new Date().toISOString();
        checkStreak();
        userState.xp += 20; // Thêm XP mỗi ngày
        checkAchievements();
        updateMotivationUI();

        // Trong function updateExerciseCompletion, thêm:
        updateCompletionStatus(completionPercentage);

        // Trong function updateProgressTimeline, thêm vòng lặp gọi updateCompletionStatus
        for (let day = 1; day <= userState.currentDay; day++) {
            const dayKey = `day${day}`;
            const exercises = userState.completedExercises[dayKey] || {};
            const totalExercises = document.querySelectorAll(`.exercise-checkbox[data-day="${day}"]`).length;
            const completedExercises = Object.values(exercises).filter(val => val).length;
            const completionPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

            updateCompletionStatus(completionPercentage);
        };