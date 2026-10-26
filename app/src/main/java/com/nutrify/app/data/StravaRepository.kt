package com.nutrify.app.data

import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import com.nutrify.app.model.StravaActivity
import com.nutrify.app.model.StravaProfile

object StravaRepository {
    var profile = mutableStateOf(
        StravaProfile(
            isConnected = true,
            athleteName = "Mauro Lainetti",
            athleteCity = "São Paulo, Brasil",
            autoSyncCalories = true,
            lastSyncTime = "Hoje às 07:15"
        )
    )

    val activities = mutableStateListOf(
        StravaActivity(
            id = "str_1",
            name = "Corrida Matinal no Ibirapuera",
            type = "Run",
            distanceKm = 6.42,
            durationSeconds = 2054, // ~34 min
            caloriesBurned = 465,
            date = "Hoje, 06:40",
            averageHeartRate = 148,
            elevationGainMeters = 42
        ),
        StravaActivity(
            id = "str_2",
            name = "Pedal Noturno - Ciclovia Pinheiros",
            type = "Ride",
            distanceKm = 21.8,
            durationSeconds = 3120, // 52 min
            caloriesBurned = 580,
            date = "Ontem, 19:15",
            averageHeartRate = 136,
            elevationGainMeters = 85
        ),
        StravaActivity(
            id = "str_3",
            name = "Treino de Força & Musculação",
            type = "WeightTraining",
            distanceKm = 0.0,
            durationSeconds = 2700, // 45 min
            caloriesBurned = 285,
            date = "24 de Outubro",
            averageHeartRate = 122,
            elevationGainMeters = 0
        )
    )

    fun connectStrava(athleteName: String = "Mauro Lainetti") {
        profile.value = profile.value.copy(
            isConnected = true,
            athleteName = athleteName,
            lastSyncTime = "Sincronizado agora"
        )
    }

    fun disconnectStrava() {
        profile.value = profile.value.copy(
            isConnected = false
        )
    }

    fun syncNewActivity(): StravaActivity {
        val newAct = StravaActivity(
            id = "str_" + System.currentTimeMillis(),
            name = "Treino Strava Sincronizado",
            type = "Run",
            distanceKm = 5.1,
            durationSeconds = 1620,
            caloriesBurned = 360,
            date = "Hoje, há poucos minutos",
            averageHeartRate = 142,
            elevationGainMeters = 25
        )
        activities.add(0, newAct)
        profile.value = profile.value.copy(
            lastSyncTime = "Sincronizado agora"
        )
        return newAct
    }
}
