/* ==========================================
   CareMate AI - script.js
   Part 1
   Core App Logic + Profile + Dashboard
========================================== */

/* ========= Local Storage Keys ========= */

const STORAGE_KEYS = {
    profile: "caremate_profile",
    water: "caremate_water",
    waterGoal: "caremate_water_goal",
    nutrition: "caremate_nutrition",
    medicines: "caremate_medicines",
    sleep: "caremate_sleep",
    chat: "caremate_chat",
    healthScore: "caremate_health_score"
};

/* ========= Screen References ========= */

const splashScreen = document.getElementById("splashScreen");
const profileScreen = document.getElementById("profileScreen");
const dashboardScreen = document.getElementById("dashboardScreen");

const getStartedBtn = document.getElementById("getStartedBtn");

const profileForm = document.getElementById("profileForm");
const editProfileBtn = document.getElementById("editProfileBtn");

/* ========= Dashboard References ========= */

const greeting = document.getElementById("greeting");
const currentDate = document.getElementById("currentDate");

const healthScoreEl = document.getElementById("healthScore");

const dashboardWater = document.getElementById("dashboardWater");

const dashboardMeals = document.getElementById("dashboardMeals");

const dashboardMedicines = document.getElementById("dashboardMedicines");

const pendingReminders = document.getElementById("pendingReminders");

/* ========= Utility Functions ========= */

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getData(key, defaultValue = null) {
    const data = localStorage.getItem(key);

    if (!data) {
        return defaultValue;
    }

    return JSON.parse(data);
}

function showScreen(screen) {

    document.querySelectorAll(".screen")
        .forEach(section => {
            section.classList.remove("active");
        });

    screen.classList.add("active");
}

function todayDate() {

    return new Date().toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}

/* ========= App Initialization ========= */

window.addEventListener("load", () => {

    initializeApp();

});

/* ========= Initialize ========= */

function initializeApp() {

    currentDate.textContent = todayDate();

    const profile = getData(STORAGE_KEYS.profile);

    if (profile) {

        setTimeout(() => {

            showScreen(dashboardScreen);

            updateDashboard();

        }, 1500);

    } else {

        setTimeout(() => {

            showScreen(splashScreen);

        }, 1000);

    }

}

/* ========= Splash ========= */

getStartedBtn.addEventListener("click", () => {

    const profile = getData(STORAGE_KEYS.profile);

    if (profile) {

        showScreen(dashboardScreen);

        updateDashboard();

    } else {

        showScreen(profileScreen);

    }

});

/* ========= Profile Save ========= */

profileForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const profileData = {

        name:
            document.getElementById("name").value,

        age:
            document.getElementById("age").value,

        gender:
            document.getElementById("gender").value,

        height:
            document.getElementById("height").value,

        weight:
            document.getElementById("weight").value,

        diseases:
            document.getElementById("diseases").value,

        emergencyName:
            document.getElementById("emergencyName").value,

        emergencyNumber:
            document.getElementById("emergencyNumber").value

    };

    saveData(
        STORAGE_KEYS.profile,
        profileData
    );

    alert("Profile saved successfully.");

    showScreen(dashboardScreen);

    updateDashboard();

});

/* ========= Edit Profile ========= */

editProfileBtn.addEventListener("click", () => {

    const profile = getData(STORAGE_KEYS.profile);

    if (!profile) return;

    document.getElementById("name").value =
        profile.name || "";

    document.getElementById("age").value =
        profile.age || "";

    document.getElementById("gender").value =
        profile.gender || "";

    document.getElementById("height").value =
        profile.height || "";

    document.getElementById("weight").value =
        profile.weight || "";

    document.getElementById("diseases").value =
        profile.diseases || "";

    document.getElementById("emergencyName").value =
        profile.emergencyName || "";

    document.getElementById("emergencyNumber").value =
        profile.emergencyNumber || "";

    showScreen(profileScreen);

});

/* ========= Dashboard ========= */

function updateDashboard() {

    updateGreeting();

    updateHealthScore();

    updateWaterDashboard();

    updateMealDashboard();

    updateMedicineDashboard();

}

/* ========= Greeting ========= */

function updateGreeting() {

    const profile =
        getData(STORAGE_KEYS.profile);

    if (!profile) return;

    greeting.textContent =
        `Hello, ${profile.name} 👋`;

}

/* ========= Water ========= */

function updateWaterDashboard() {

    const water =
        getData(STORAGE_KEYS.water, 0);

    dashboardWater.textContent =
        `${water} mL`;

}

/* ========= Meals ========= */

function updateMealDashboard() {

    const meals =
        getData(STORAGE_KEYS.nutrition, []);

    dashboardMeals.textContent =
        meals.length;

}

/* ========= Medicines ========= */

function updateMedicineDashboard() {

    const medicines =
        getData(STORAGE_KEYS.medicines, []);

    let taken = 0;
    let pending = 0;

    medicines.forEach(med => {

        if (med.status === "Taken") {

            taken++;

        } else {

            pending++;

        }

    });

    dashboardMedicines.textContent =
        taken;

    pendingReminders.textContent =
        pending;

}

/* ========= Health Score ========= */

function updateHealthScore() {

    let score = calculateHealthScore();

    healthScoreEl.textContent =
        `${score}/100`;

    saveData(
        STORAGE_KEYS.healthScore,
        score
    );

}

/* ========= AI Health Engine ========= */

function calculateHealthScore() {

    let score = 100;

    /* Water */

    const water =
        getData(STORAGE_KEYS.water, 0);

    const goal =
        getData(STORAGE_KEYS.waterGoal, 2000);

    if (water < goal * 0.5) {

        score -= 15;

    } else if (water < goal) {

        score -= 5;

    }

    /* Nutrition */

    const meals =
        getData(STORAGE_KEYS.nutrition, []);

    if (meals.length < 3) {

        score -= 10;

    }

    /* Medicines */

    const medicines =
        getData(STORAGE_KEYS.medicines, []);

    medicines.forEach(med => {

        if (med.status === "Missed") {

            score -= 5;

        }

    });

    /* Sleep */

    const sleep =
        getData(STORAGE_KEYS.sleep, 7);

    if (sleep < 6) {

        score -= 10;

    }

    if (score < 0) {

        score = 0;

    }

    return score;

}

/* ========= Quick Actions ========= */

document
    .querySelectorAll(".action-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const target =
                button.dataset.target;

            if (!target) return;

            document
                .querySelectorAll(".module-section")
                .forEach(section => {

                    section.classList.remove(
                        "active"
                    );

                });

            const selected =
                document.getElementById(
                    target
                );

            if (selected) {

                selected.classList.add(
                    "active"
                );

                selected.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

/* ========= Service Worker ========= */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("service-worker.js")
            .then(() => {

                console.log(
                    "Service Worker Registered"
                );

            })
            .catch(error => {

                console.error(
                    "Service Worker Error:",
                    error
                );

            });

    });

  }
/* ==========================================
   CareMate AI - script.js
   Part 2
   Water Tracker + Nutrition + Sleep
========================================== */

/* ========= WATER TRACKER ========= */

const waterGoalInput =
    document.getElementById("waterGoal");

const saveWaterGoalBtn =
    document.getElementById("saveWaterGoal");

const waterProgress =
    document.getElementById("waterProgress");

const waterPercentage =
    document.getElementById("waterPercentage");

const waterAI =
    document.getElementById("waterAI");

/* Save Water Goal */

saveWaterGoalBtn?.addEventListener("click", () => {

    const goal =
        parseInt(waterGoalInput.value);

    if (!goal || goal <= 0) {

        alert("Please enter a valid water goal.");

        return;
    }

    saveData(
        STORAGE_KEYS.waterGoal,
        goal
    );

    alert("Daily hydration goal saved.");

    updateWaterTracker();
});

/* Quick Water Buttons */

document
    .querySelectorAll(".water-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const amount =
                parseInt(button.dataset.amount);

            let currentWater =
                getData(
                    STORAGE_KEYS.water,
                    0
                );

            currentWater += amount;

            saveData(
                STORAGE_KEYS.water,
                currentWater
            );

            updateWaterTracker();

            updateDashboard();
        });

    });

/* Water Tracker UI */

function updateWaterTracker() {

    const intake =
        getData(STORAGE_KEYS.water, 0);

    const goal =
        getData(
            STORAGE_KEYS.waterGoal,
            2000
        );

    const percentage =
        Math.min(
            Math.round(
                (intake / goal) * 100
            ),
            100
        );

    if (waterProgress) {

        waterProgress.style.width =
            percentage + "%";
    }

    if (waterPercentage) {

        waterPercentage.textContent =
            `${percentage}% completed`;
    }

    /* AI Analysis */

    if (waterAI) {

        if (percentage < 50) {

            waterAI.textContent =
                "Your hydration is low. Please drink more water.";

        } else if (percentage >= 100) {

            waterAI.textContent =
                "Excellent hydration habits.";

        } else {

            waterAI.textContent =
                "Good progress. Keep drinking water regularly.";
        }

    }

}

/* ========= NUTRITION TRACKER ========= */

const mealType =
    document.getElementById("mealType");

const foodInput =
    document.getElementById("foodInput");

const logMealBtn =
    document.getElementById("logMealBtn");

const nutritionSummary =
    document.getElementById("nutritionSummary");

const nutritionAI =
    document.getElementById("nutritionAI");

/* Log Meal */

logMealBtn?.addEventListener("click", () => {

    const food =
        foodInput.value.trim();

    if (!food) {

        alert("Please enter food consumed.");

        return;
    }

    const meals =
        getData(
            STORAGE_KEYS.nutrition,
            []
        );

    const meal = {

        type: mealType.value,

        food: food,

        protein: 10,

        carbs: 20,

        fiber: 5,

        fats: 5,

        date:
            new Date().toLocaleDateString()

    };

    meals.push(meal);

    saveData(
        STORAGE_KEYS.nutrition,
        meals
    );

    foodInput.value = "";

    alert("Meal logged successfully.");

    updateNutrition();

    updateDashboard();

});

/* Nutrition Summary */

function updateNutrition() {

    const meals =
        getData(
            STORAGE_KEYS.nutrition,
            []
        );

    let protein = 0;
    let carbs = 0;
    let fiber = 0;
    let fats = 0;

    meals.forEach(meal => {

        protein += meal.protein;
        carbs += meal.carbs;
        fiber += meal.fiber;
        fats += meal.fats;

    });

    if (nutritionSummary) {

        nutritionSummary.textContent =
            `Protein: ${protein}g | Carbs: ${carbs}g | Fiber: ${fiber}g | Fats: ${fats}g`;
    }

    /* AI Suggestions */

    if (nutritionAI) {

        let suggestions = [];

        if (protein < 40) {

            suggestions.push(
                "Protein intake appears low."
            );

        }

        if (fiber < 20) {

            suggestions.push(
                "Increase fruit and vegetable consumption."
            );

        }

        if (fiber >= 20) {

            suggestions.push(
                "Fiber intake is adequate."
            );

        }

        nutritionAI.textContent =
            suggestions.join(" ");
    }

}

/* ========= SLEEP TRACKER ========= */

const sleepHours =
    document.getElementById("sleepHours");

const saveSleepBtn =
    document.getElementById("saveSleepBtn");

const sleepInsight =
    document.getElementById("sleepInsight");

/* Save Sleep */

saveSleepBtn?.addEventListener("click", () => {

    const hours =
        parseFloat(sleepHours.value);

    if (!hours || hours < 0) {

        alert("Please enter valid sleep hours.");

        return;
    }

    saveData(
        STORAGE_KEYS.sleep,
        hours
    );

    updateSleep();

    updateDashboard();

    alert("Sleep record saved.");

});

/* Sleep Analysis */

function updateSleep() {

    const sleep =
        getData(
            STORAGE_KEYS.sleep,
            7
        );

    if (!sleepInsight) return;

    if (sleep < 6) {

        sleepInsight.textContent =
            "Your sleep duration is inadequate.";

    } else if (sleep >= 7) {

        sleepInsight.textContent =
            "Good sleep habits detected.";

    } else {

        sleepInsight.textContent =
            "Aim for consistent sleep schedules.";
    }

}

/* ========= INITIALIZE PART 2 ========= */

updateWaterTracker();

updateNutrition();

updateSleep();
/* ==========================================
   CareMate AI - script.js
   Part 3A
   Medicine Reminder Module
========================================== */

/* ========= MEDICINE ELEMENTS ========= */

const medicineName =
    document.getElementById("medicineName");

const medicineDose =
    document.getElementById("medicineDose");

const medicineFrequency =
    document.getElementById("medicineFrequency");

const medicineTime =
    document.getElementById("medicineTime");

const addMedicineBtn =
    document.getElementById("addMedicineBtn");

const medicineList =
    document.getElementById("medicineList");


/* ========= ADD MEDICINE ========= */

addMedicineBtn?.addEventListener("click", () => {

    const name = medicineName.value.trim();
    const dose = medicineDose.value.trim();
    const frequency = medicineFrequency.value.trim();
    const time = medicineTime.value;

    if (!name || !dose || !frequency || !time) {

        alert("Please fill all medicine details.");

        return;
    }

    const medicines =
        getData(
            STORAGE_KEYS.medicines,
            []
        );

    medicines.push({

        id: Date.now(),

        name: name,

        dosage: dose,

        frequency: frequency,

        time: time,

        status: "Pending"

    });

    saveData(
        STORAGE_KEYS.medicines,
        medicines
    );

    /* Clear Inputs */

    medicineName.value = "";
    medicineDose.value = "";
    medicineFrequency.value = "";
    medicineTime.value = "";

    alert("Medicine added successfully.");

    renderMedicines();

    updateDashboard();

});


/* ========= RENDER MEDICINES ========= */

function renderMedicines() {

    if (!medicineList) return;

    const medicines =
        getData(
            STORAGE_KEYS.medicines,
            []
        );

    medicineList.innerHTML = "";

    if (medicines.length === 0) {

        medicineList.innerHTML = `
            <div class="card">
                <p>No medicines added yet.</p>
            </div>
        `;

        return;
    }

    medicines.forEach(med => {

        const card =
            document.createElement("div");

        card.className =
            "medicine-item";

        card.innerHTML = `

            <h3>💊 ${med.name}</h3>

            <p>
                Dosage:
                ${med.dosage}
            </p>

            <p>
                Frequency:
                ${med.frequency}
            </p>

            <p>
                Time:
                ${med.time}
            </p>

            <p>
                Status:
                <strong>
                    ${med.status}
                </strong>
            </p>

            <div class="medicine-actions">

                <button
                    class="taken-btn"
                    onclick="markMedicineStatus(
                        ${med.id},
                        'Taken'
                    )"
                >
                    Taken
                </button>

                <button
                    class="missed-btn"
                    onclick="markMedicineStatus(
                        ${med.id},
                        'Missed'
                    )"
                >
                    Missed
                </button>

            </div>

        `;

        medicineList.appendChild(card);

    });

    updateMedicineAdherence();

}


/* ========= MARK STATUS ========= */

function markMedicineStatus(
    medicineId,
    status
) {

    const medicines =
        getData(
            STORAGE_KEYS.medicines,
            []
        );

    const updated =
        medicines.map(med => {

            if (med.id === medicineId) {

                med.status = status;

            }

            return med;

        });

    saveData(
        STORAGE_KEYS.medicines,
        updated
    );

    renderMedicines();

    updateDashboard();

}


/* ========= ADHERENCE ========= */

function updateMedicineAdherence() {

    const medicines =
        getData(
            STORAGE_KEYS.medicines,
            []
        );

    if (medicines.length === 0) {

        return;
    }

    const taken =
        medicines.filter(med =>
            med.status === "Taken"
        ).length;

    const adherence =
        Math.round(
            (taken / medicines.length) * 100
        );

    console.log(
        "Medicine Adherence:",
        adherence + "%"
    );

    /* Alert if poor adherence */

    if (
        adherence < 70 &&
        medicines.length > 0
    ) {

        console.warn(
            "Please avoid skipping medications and consult healthcare professionals regarding dosage concerns."
        );

    }

}


/* ========= MEDICINE INSIGHT ========= */

function getMedicineInsight() {

    const medicines =
        getData(
            STORAGE_KEYS.medicines,
            []
        );

    if (medicines.length === 0) {

        return "No medicines scheduled.";
    }

    const taken =
        medicines.filter(med =>
            med.status === "Taken"
        ).length;

    const adherence =
        Math.round(
            (taken / medicines.length) * 100
        );

    if (adherence >= 90) {

        return "Excellent medication adherence.";

    } else if (adherence >= 70) {

        return "Medication adherence is satisfactory.";

    } else {

        return "Please avoid skipping medications.";
    }

}


/* ========= INITIALIZE ========= */

renderMedicines();
/* ==========================================
   CareMate AI - script.js
   Part 3B
   AI Insights + Disease Recommendations
   + Family Dashboard
========================================== */

/* ========= AI INSIGHTS ELEMENTS ========= */

const insightScore =
    document.getElementById("insightScore");

const hydrationInsight =
    document.getElementById("hydrationInsight");

const nutritionInsight =
    document.getElementById("nutritionInsight");

const medicineInsight =
    document.getElementById("medicineInsight");

const diseaseInsight =
    document.getElementById("diseaseInsight");

const personalSuggestions =
    document.getElementById("personalSuggestions");


/* ========= FAMILY DASHBOARD ELEMENTS ========= */

const familyHealth =
    document.getElementById("familyHealth");

const familyHydration =
    document.getElementById("familyHydration");

const familyNutrition =
    document.getElementById("familyNutrition");

const familyMedicine =
    document.getElementById("familyMedicine");

const familyEmergency =
    document.getElementById("familyEmergency");

const familyAI =
    document.getElementById("familyAI");


/* ========= DISEASE RECOMMENDATIONS ========= */

function getDiseaseRecommendations() {

    const profile =
        getData(
            STORAGE_KEYS.profile,
            {}
        );

    const diseases =
        (
            profile.diseases || ""
        ).toLowerCase();

    let recommendations = [];

    if (diseases.includes("diabetes")) {

        recommendations.push(
            "Avoid sugary snacks."
        );

        recommendations.push(
            "Eat balanced meals."
        );

        recommendations.push(
            "Maintain hydration."
        );

    }

    if (
        diseases.includes(
            "hypertension"
        )
    ) {

        recommendations.push(
            "Reduce salt intake."
        );

        recommendations.push(
            "Take medicines regularly."
        );

        recommendations.push(
            "Perform light exercise."
        );

    }

    if (
        diseases.includes(
            "arthritis"
        )
    ) {

        recommendations.push(
            "Stay physically active."
        );

        recommendations.push(
            "Protect your joints."
        );

    }

    if (
        diseases.includes(
            "heart"
        )
    ) {

        recommendations.push(
            "Follow a heart-healthy diet."
        );

        recommendations.push(
            "Monitor blood pressure regularly."
        );

    }

    if (
        diseases.includes(
            "kidney"
        )
    ) {

        recommendations.push(
            "Stay hydrated as advised by your doctor."
        );

        recommendations.push(
            "Avoid excessive salt."
        );

    }

    if (
        diseases.includes(
            "osteoporosis"
        )
    ) {

        recommendations.push(
            "Increase calcium intake."
        );

        recommendations.push(
            "Perform weight-bearing exercises."
        );

    }

    if (
        diseases.includes(
            "thyroid"
        )
    ) {

        recommendations.push(
            "Take medications consistently."
        );

        recommendations.push(
            "Attend routine check-ups."
        );

    }

    if (
        recommendations.length === 0
    ) {

        recommendations.push(
            "No disease-specific recommendations available."
        );

    }

    return recommendations;

}


/* ========= PERSONALIZED AI ========= */

function generateSuggestions() {

    let suggestions = [];

    /* Hydration */

    const water =
        getData(
            STORAGE_KEYS.water,
            0
        );

    const goal =
        getData(
            STORAGE_KEYS.waterGoal,
            2000
        );

    if (water < goal * 0.5) {

        suggestions.push(
            "Increase your water intake."
        );

    }

    /* Nutrition */

    const meals =
        getData(
            STORAGE_KEYS.nutrition,
            []
        );

    if (meals.length < 3) {

        suggestions.push(
            "Consider adding protein-rich foods."
        );

    }

    /* Medicines */

    const medicines =
        getData(
            STORAGE_KEYS.medicines,
            []
        );

    const missed =
        medicines.filter(med =>
            med.status === "Missed"
        ).length;

    if (missed > 0) {

        suggestions.push(
            "Please avoid skipping medications."
        );

    }

    /* Sleep */

    const sleep =
        getData(
            STORAGE_KEYS.sleep,
            7
        );

    if (sleep < 6) {

        suggestions.push(
            "Improve your sleep schedule."
        );

    }

    /* Disease */

    suggestions.push(
        ...getDiseaseRecommendations()
    );

    return suggestions;

}


/* ========= UPDATE INSIGHTS ========= */

function updateAIInsights() {

    if (insightScore) {

        insightScore.textContent =
            calculateHealthScore() +
            "/100";
    }

    /* Hydration */

    if (hydrationInsight) {

        const water =
            getData(
                STORAGE_KEYS.water,
                0
            );

        const goal =
            getData(
                STORAGE_KEYS.waterGoal,
                2000
            );

        if (water < goal * 0.5) {

            hydrationInsight.textContent =
                "Hydration is below recommended levels.";

        } else {

            hydrationInsight.textContent =
                "Hydration status looks good.";
        }

    }

    /* Nutrition */

    if (nutritionInsight) {

        const meals =
            getData(
                STORAGE_KEYS.nutrition,
                []
            );

        nutritionInsight.textContent =
            meals.length >= 3
                ? "Nutrition appears balanced."
                : "Nutrition quality could be improved.";

    }

    /* Medicines */

    if (medicineInsight) {

        medicineInsight.textContent =
            getMedicineInsight();

    }

    /* Disease */

    if (diseaseInsight) {

        diseaseInsight.textContent =
            getDiseaseRecommendations()
                .join(" ");

    }

    /* Suggestions */

    if (personalSuggestions) {

        personalSuggestions.textContent =
            generateSuggestions()
                .join(" ");

    }

}


/* ========= FAMILY DASHBOARD ========= */

function updateFamilyDashboard() {

    if (familyHealth) {

        familyHealth.textContent =
            calculateHealthScore() +
            "/100";
    }

    if (familyHydration) {

        const water =
            getData(
                STORAGE_KEYS.water,
                0
            );

        const goal =
            getData(
                STORAGE_KEYS.waterGoal,
                2000
            );

        familyHydration.textContent =
            `${water}/${goal} mL`;
    }

    if (familyNutrition) {

        const meals =
            getData(
                STORAGE_KEYS.nutrition,
                []
            );

        familyNutrition.textContent =
            `${meals.length} meals logged`;
    }

    if (familyMedicine) {

        familyMedicine.textContent =
            getMedicineInsight();

    }

    if (familyEmergency) {

        familyEmergency.textContent =
            "No emergency alerts.";

    }

    if (familyAI) {

        familyAI.textContent =
            generateSuggestions()
                .slice(0, 3)
                .join(" ");
    }

}


/* ========= INITIALIZE ========= */

updateAIInsights();

updateFamilyDashboard();
