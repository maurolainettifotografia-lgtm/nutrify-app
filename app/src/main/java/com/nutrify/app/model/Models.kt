package com.nutrify.app.model

import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.snapshots.SnapshotStateList

data class FoodItem(
    val id: String,
    val name: String,
    val source: String,
    val kcalPer100g: Double,
    val proteinPer100g: Double,
    val carbsPer100g: Double,
    val fatPer100g: Double
) {
    val calories100: Double get() = kcalPer100g
    val protein100: Double get() = proteinPer100g
    val carbs100: Double get() = carbsPer100g
    val fat100: Double get() = fatPer100g
}

enum class MealType(val displayName: String, val icon: String) {
    CAFE_DA_MANHA("Café da Manhã", "☕"),
    ALMOCO("Almoço", "🍽️"),
    LANCHE("Lanche da Tarde", "🍎"),
    JANTAR("Jantar", "🍲"),
    CEIA("Ceia", "🌙")
}

data class DiaryEntry(
    val id: String,
    val meal: MealType,
    val food: FoodItem,
    val grams: Double,
    val date: String = "Hoje"
) {
    val calories: Int get() = Math.round((food.kcalPer100g * grams) / 100.0).toInt()
    val protein: Double get() = (food.proteinPer100g * grams) / 100.0
    val carbs: Double get() = (food.carbsPer100g * grams) / 100.0
    val fat: Double get() = (food.fatPer100g * grams) / 100.0
}

data class WeightEntry(
    val date: String,
    val weight: Double,
    val bodyFat: Double? = null
) {
    val weightKg: Double get() = weight
}

data class WorkoutSet(
    var reps: Int,
    var weightKg: Double,
    var done: Boolean = false
)

enum class ExerciseEquipment(val label: String, val apparatus: String) {
    BARBELL_BENCH("Barra Olímpica", "Banco Horizontal"),
    DUMBBELLS("Halteres", "Livre"),
    CABLE_PULLEY("Cabo / Polia", "Torre Pulley"),
    POWER_RACK("Gaiola / Rack", "Barra Livre"),
    LEG_PRESS("Leg Press 45°", "Máquina Inclinada"),
    MACHINE_FLY("Peck Deck", "Máquina Articulada")
}

data class WorkoutExercise(
    val name: String,
    val muscleGroup: String,
    val equipment: ExerciseEquipment = ExerciseEquipment.BARBELL_BENCH,
    val sets: SnapshotStateList<WorkoutSet> = mutableStateListOf()
)

data class WorkoutRoutine(
    val id: String,
    val title: String,
    val targetMuscles: String = "Corpo Inteiro",
    val exercises: List<WorkoutExercise> = emptyList()
)

data class ChatMessage(
    val role: String,
    val text: String
)

data class StravaActivity(
    val id: String,
    val name: String,
    val type: String, // "Run", "Ride", "WeightTraining"
    val distanceKm: Double,
    val durationSeconds: Int,
    val caloriesBurned: Int,
    val date: String,
    val averageHeartRate: Int? = null,
    val elevationGainMeters: Int? = null
) {
    val durationFormatted: String
        get() {
            val mins = durationSeconds / 60
            val secs = durationSeconds % 60
            return "${mins}m ${String.format("%02d", secs)}s"
        }
}

data class StravaProfile(
    val isConnected: Boolean = true,
    val athleteName: String = "Mauro Lainetti",
    val athleteCity: String = "São Paulo, Brasil",
    val profilePhotoUrl: String = "",
    val autoSyncCalories: Boolean = true,
    val lastSyncTime: String = "Hoje às 07:15"
)
