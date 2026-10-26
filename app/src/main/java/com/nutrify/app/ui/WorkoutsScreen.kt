package com.nutrify.app.ui

import androidx.compose.animation.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nutrify.app.data.StravaRepository
import com.nutrify.app.model.ExerciseEquipment
import com.nutrify.app.model.WorkoutExercise
import com.nutrify.app.model.WorkoutSet

@Composable
fun WorkoutsScreen(
    onWorkoutFinished: (Int) -> Unit = {}
) {
    // 0: TREINOS, 1: Músculos Usados, 2: Strava, 3: Modelos
    var activeSubTab by remember { mutableStateOf(0) }

    // Active workout timer
    var workoutSeconds by remember { mutableStateOf(531) } // 08:51
    var restSeconds by remember { mutableStateOf(18) }
    var isTimerRunning by remember { mutableStateOf(true) }

    // Workout completed celebration dialog state
    var showFinishModal by remember { mutableStateOf(false) }
    var finishedWorkoutCalories by remember { mutableStateOf(0) }
    var workoutFinishSuccessMessage by remember { mutableStateOf<String?>(null) }

    val exercises = remember {
        mutableStateListOf(
            WorkoutExercise(
                name = "Supino plano com barra",
                muscleGroup = "Peitoral Maior",
                equipment = ExerciseEquipment.BARBELL_BENCH,
                sets = mutableStateListOf(
                    WorkoutSet(reps = 15, weightKg = 30.0, done = true),
                    WorkoutSet(reps = 12, weightKg = 50.0, done = true),
                    WorkoutSet(reps = 10, weightKg = 70.0, done = false)
                )
            ),
            WorkoutExercise(
                name = "Puxada alta articulada",
                muscleGroup = "Dorsal & Costas",
                equipment = ExerciseEquipment.CABLE_PULLEY,
                sets = mutableStateListOf(
                    WorkoutSet(reps = 12, weightKg = 45.0, done = true),
                    WorkoutSet(reps = 10, weightKg = 55.0, done = false)
                )
            ),
            WorkoutExercise(
                name = "Agachamento livre no rack",
                muscleGroup = "Quadríceps & Glúteos",
                equipment = ExerciseEquipment.POWER_RACK,
                sets = mutableStateListOf(
                    WorkoutSet(reps = 12, weightKg = 60.0, done = false),
                    WorkoutSet(reps = 10, weightKg = 80.0, done = false)
                )
            ),
            WorkoutExercise(
                name = "Rosca alternada com halteres",
                muscleGroup = "Bíceps Braquial",
                equipment = ExerciseEquipment.DUMBBELLS,
                sets = mutableStateListOf(
                    WorkoutSet(reps = 12, weightKg = 14.0, done = true),
                    WorkoutSet(reps = 10, weightKg = 16.0, done = false)
                )
            )
        )
    }

    val totalVolumeKg = exercises.sumOf { ex ->
        ex.sets.filter { it.done }.sumOf { (it.reps * it.weightKg).toInt() }
    }
    val completedSetsCount = exercises.sumOf { ex -> ex.sets.count { it.done } }
    val totalSetsCount = exercises.sumOf { it.sets.size }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // iOS-style Segmented Control for Sub-tabs
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(16.dp))
                .padding(4.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // Renamed from "Treino Zepp" to "TREINOS"
                val tabs = listOf("TREINOS", "Músculos", "Strava ⚡", "Modelos")
                tabs.forEachIndexed { idx, title ->
                    val isSelected = activeSubTab == idx
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(
                                if (isSelected) MaterialTheme.colorScheme.surface else Color.Transparent,
                                RoundedCornerShape(12.dp)
                            )
                            .clickable { activeSubTab = idx }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            title,
                            color = if (isSelected) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.SemiBold,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        workoutFinishSuccessMessage?.let { msg ->
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFECFDF5)),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp)
            ) {
                Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text("✅", fontSize = 16.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(msg, color = Color(0xFF047857), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }

        when (activeSubTab) {
            0 -> {
                // SUB-TAB 0: TREINOS (iOS & Zepp High-Tech Aesthetic)
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    // Top Telemetry Card
                    item {
                        Card(
                            shape = RoundedCornerShape(24.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF13151D)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(18.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceAround
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("TEMPO TOTAL", color = Color(0xFF94A3B8), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                        Text("08:51", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Black)
                                        Text("❤️ 82 bpm", color = Color(0xFFEF4444), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("DESCANSO", color = Color(0xFFF59E0B), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                        Text("0:${String.format("%02d", restSeconds)}", color = Color(0xFFF59E0B), fontSize = 22.sp, fontWeight = FontWeight.Black)
                                        Text("🔥 42 kcal", color = Color(0xFFF59E0B), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("VOLUME TOTAL", color = Color(0xFF94A3B8), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                        Text("$totalVolumeKg kg", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Black)
                                        Text("🎯 $completedSetsCount/$totalSetsCount séries", color = Color(0xFF10B981), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }

                                Spacer(modifier = Modifier.height(14.dp))

                                // Rest Timer Bar Controls (+30s / Saltar)
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(Color(0xFF1F232F), RoundedCornerShape(14.dp))
                                        .padding(horizontal = 14.dp, vertical = 8.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text("⏱️", fontSize = 14.sp)
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Tempo de Descanso", color = Color(0xFFF59E0B), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    }
                                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        Button(
                                            onClick = { restSeconds += 30 },
                                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E3547)),
                                            shape = RoundedCornerShape(10.dp),
                                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                                        ) {
                                            Text("+30s", color = Color(0xFFF59E0B), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        }
                                        Button(
                                            onClick = { restSeconds = 0 },
                                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E3547)),
                                            shape = RoundedCornerShape(10.dp),
                                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                                        ) {
                                            Text("Saltar", color = Color.White, fontSize = 11.sp)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Exercise Items with Apparatus Illustration
                    itemsIndexed(exercises) { exIdx, ex ->
                        Card(
                            shape = RoundedCornerShape(22.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = CardDefaults.outlinedCardBorder().copy(
                                brush = androidx.compose.ui.graphics.SolidColor(MaterialTheme.colorScheme.outline)
                            ),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                // Exercise Header with Apparatus Graphics
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        // Visual Equipment Icon & Apparatus Diagram
                                        EquipmentIllustrationBox(equipment = ex.equipment)
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column {
                                            Text(
                                                ex.name,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 14.sp,
                                                color = MaterialTheme.colorScheme.onSurface
                                            )
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Text(
                                                    ex.muscleGroup,
                                                    color = Color(0xFF059669),
                                                    fontSize = 11.sp,
                                                    fontWeight = FontWeight.Bold
                                                )
                                                Text(
                                                    " • ${ex.equipment.apparatus}",
                                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                    fontSize = 11.sp
                                                )
                                            }
                                        }
                                    }

                                    Box(
                                        modifier = Modifier
                                            .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(8.dp))
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            "${ex.sets.count { it.done }}/${ex.sets.size}",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 11.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                // Sets Table
                                ex.sets.forEachIndexed { sIdx, set ->
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(vertical = 4.dp)
                                            .background(
                                                if (set.done) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.35f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                                                RoundedCornerShape(12.dp)
                                            )
                                            .padding(horizontal = 10.dp, vertical = 6.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            "#${sIdx + 1}",
                                            color = MaterialTheme.colorScheme.primary,
                                            fontWeight = FontWeight.Black,
                                            fontSize = 12.sp
                                        )

                                        // KG adjustment
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            IconButton(
                                                onClick = { set.weightKg = (set.weightKg - 2.5).coerceAtLeast(0.0) },
                                                modifier = Modifier.size(26.dp)
                                            ) {
                                                Text("−", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                            }
                                            Text(
                                                "${set.weightKg.toInt()} kg",
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 12.sp,
                                                color = MaterialTheme.colorScheme.onSurface
                                            )
                                            IconButton(
                                                onClick = { set.weightKg += 2.5 },
                                                modifier = Modifier.size(26.dp)
                                            ) {
                                                Text("+", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                            }
                                        }

                                        // Reps adjustment
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            IconButton(
                                                onClick = { set.reps = (set.reps - 1).coerceAtLeast(1) },
                                                modifier = Modifier.size(26.dp)
                                            ) {
                                                Text("−", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                            }
                                            Text(
                                                "${set.reps} reps",
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 12.sp,
                                                color = MaterialTheme.colorScheme.onSurface
                                            )
                                            IconButton(
                                                onClick = { set.reps += 1 },
                                                modifier = Modifier.size(26.dp)
                                            ) {
                                                Text("+", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                            }
                                        }

                                        // Checkmark Completion Button
                                        IconButton(
                                            onClick = {
                                                set.done = !set.done
                                                if (set.done) restSeconds = 60
                                            },
                                            modifier = Modifier
                                                .size(28.dp)
                                                .background(
                                                    if (set.done) Color(0xFF10B981) else MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
                                                    CircleShape
                                                )
                                        ) {
                                            Text(
                                                if (set.done) "✓" else "",
                                                color = Color.White,
                                                fontWeight = FontWeight.Black,
                                                fontSize = 13.sp
                                            )
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(6.dp))

                                TextButton(
                                    onClick = { ex.sets.add(WorkoutSet(reps = 10, weightKg = 20.0)) },
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text("+ Adicionar Série", color = MaterialTheme.colorScheme.primary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }

                    // FINALIZAR TREINO BUTTON (100% RESPONSIVE)
                    item {
                        Button(
                            onClick = {
                                finishedWorkoutCalories = (totalVolumeKg * 0.08).toInt().coerceAtLeast(180)
                                showFinishModal = true
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Text("🏁 FINALIZAR TREINO", color = Color.White, fontWeight = FontWeight.Black, fontSize = 14.sp)
                        }
                        Spacer(modifier = Modifier.height(20.dp))
                    }
                }
            }

            1 -> {
                // SUB-TAB 1: MÚSCULOS USADOS (Real Anatomical Muscular Heatmap)
                MusclesHeatmapScreen(
                    totalVolumeKg = totalVolumeKg
                )
            }

            2 -> {
                // SUB-TAB 2: STRAVA (100% Functional Connection)
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    item {
                        StravaIntegrationCard(
                            onSyncSuccess = { cals ->
                                onWorkoutFinished(cals)
                            }
                        )
                    }

                    item {
                        Text(
                            "Atividades Strava Importadas",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }

                    itemsIndexed(StravaRepository.activities) { _, act ->
                        Card(
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = CardDefaults.outlinedCardBorder().copy(
                                brush = androidx.compose.ui.graphics.SolidColor(MaterialTheme.colorScheme.outline)
                            ),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(42.dp)
                                            .background(
                                                when (act.type) {
                                                    "Run" -> Color(0xFFFC4C02)
                                                    "Ride" -> Color(0xFF0284C7)
                                                    else -> Color(0xFF10B981)
                                                },
                                                RoundedCornerShape(12.dp)
                                            ),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            when (act.type) {
                                                "Run" -> "🏃"
                                                "Ride" -> "🚴"
                                                else -> "🏋️"
                                            },
                                            fontSize = 20.sp
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column {
                                        Text(act.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface)
                                        Text(
                                            "${act.date} • ${act.durationFormatted}",
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                            fontSize = 11.sp
                                        )
                                    }
                                }

                                Column(horizontalAlignment = Alignment.End) {
                                    Text("${act.caloriesBurned} kcal", fontWeight = FontWeight.Black, fontSize = 13.sp, color = Color(0xFFFC4C02))
                                    if (act.distanceKm > 0) {
                                        Text("${act.distanceKm} km", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 11.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            3 -> {
                // SUB-TAB 3: MODELOS DE TREINO COM ILUSTRAÇÕES DE APARELHOS
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    item {
                        Text(
                            "Rotinas Pré-definidas com Aparelhos:",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }

                    val presetRoutines = listOf(
                        Triple("Treino A - Peito, Ombros e Tríceps", "Supino, Peck Deck, Barra Paralela", ExerciseEquipment.BARBELL_BENCH),
                        Triple("Treino B - Costas e Bíceps", "Puxada Pulley, Remada Baixa, Rosca Halteres", ExerciseEquipment.CABLE_PULLEY),
                        Triple("Treino C - Pernas, Glúteos e Abdômen", "Agachamento Rack, Leg Press 45°, Prancha", ExerciseEquipment.POWER_RACK)
                    )

                    itemsIndexed(presetRoutines) { _, (title, desc, equip) ->
                        Card(
                            shape = RoundedCornerShape(20.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = CardDefaults.outlinedCardBorder().copy(
                                brush = androidx.compose.ui.graphics.SolidColor(MaterialTheme.colorScheme.outline)
                            ),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        EquipmentIllustrationBox(equipment = equip)
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column {
                                            Text(title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface)
                                            Text(desc, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 11.sp)
                                        }
                                    }

                                    Button(
                                        onClick = {
                                            activeSubTab = 0
                                        },
                                        shape = RoundedCornerShape(10.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                    ) {
                                        Text("Iniciar", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // FINALIZAR TREINO MODAL (Completamente Responsivo)
    if (showFinishModal) {
        AlertDialog(
            onDismissRequest = { showFinishModal = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("🎉 ", fontSize = 22.sp)
                    Text("Treino Concluído!", fontWeight = FontWeight.Black, fontSize = 17.sp)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        "Excelente sessão! Seu progresso e calorias foram computados:",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Volume Total Levantado:", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("$totalVolumeKg kg", fontWeight = FontWeight.Black, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                            }
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Séries Concluídas:", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("$completedSetsCount séries", fontWeight = FontWeight.Black, fontSize = 12.sp, color = Color(0xFF10B981))
                            }
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Gasto Estimado:", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("$finishedWorkoutCalories kcal", fontWeight = FontWeight.Black, fontSize = 13.sp, color = Color(0xFFF59E0B))
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        onWorkoutFinished(finishedWorkoutCalories)
                        workoutFinishSuccessMessage = "Treino finalizado! +$finishedWorkoutCalories kcal adicionadas ao seu balanço diário."
                        showFinishModal = false
                    },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
                ) {
                    Text("Salvar no Diário", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showFinishModal = false }) {
                    Text("Fechar")
                }
            }
        )
    }
}

/**
 * Visual illustration of gym equipment (Barbell Bench, Dumbbells, Pulley, Power Rack, Leg Press)
 */
@Composable
fun EquipmentIllustrationBox(equipment: ExerciseEquipment) {
    Box(
        modifier = Modifier
            .size(46.dp)
            .background(Color(0xFF1A1F2C), RoundedCornerShape(14.dp))
            .border(1.dp, Color(0xFF2E384D), RoundedCornerShape(14.dp)),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(34.dp)) {
            val w = size.width
            val h = size.height

            when (equipment) {
                ExerciseEquipment.BARBELL_BENCH -> {
                    // Bench pad
                    drawRoundRect(Color(0xFF38BDF8), topLeft = Offset(w * 0.15f, h * 0.55f), size = Size(w * 0.70f, h * 0.12f), cornerRadius = CornerRadius(4f))
                    // Bench legs
                    drawLine(Color(0xFF64748B), start = Offset(w * 0.25f, h * 0.67f), end = Offset(w * 0.25f, h * 0.90f), strokeWidth = 3f)
                    drawLine(Color(0xFF64748B), start = Offset(w * 0.75f, h * 0.67f), end = Offset(w * 0.75f, h * 0.90f), strokeWidth = 3f)
                    // Barbell shaft
                    drawLine(Color.White, start = Offset(w * 0.05f, h * 0.32f), end = Offset(w * 0.95f, h * 0.32f), strokeWidth = 3f)
                    // Barbell plates
                    drawRoundRect(Color(0xFFEF4444), topLeft = Offset(w * 0.12f, h * 0.18f), size = Size(w * 0.08f, h * 0.28f), cornerRadius = CornerRadius(2f))
                    drawRoundRect(Color(0xFFEF4444), topLeft = Offset(w * 0.80f, h * 0.18f), size = Size(w * 0.08f, h * 0.28f), cornerRadius = CornerRadius(2f))
                }
                ExerciseEquipment.DUMBBELLS -> {
                    // Two hexagonal dumbbells
                    // Left Dumbbell
                    drawLine(Color.White, start = Offset(w * 0.25f, h * 0.25f), end = Offset(w * 0.25f, h * 0.75f), strokeWidth = 3f)
                    drawCircle(Color(0xFFF59E0B), radius = 6f, center = Offset(w * 0.25f, h * 0.25f))
                    drawCircle(Color(0xFFF59E0B), radius = 6f, center = Offset(w * 0.25f, h * 0.75f))
                    // Right Dumbbell
                    drawLine(Color.White, start = Offset(w * 0.75f, h * 0.25f), end = Offset(w * 0.75f, h * 0.75f), strokeWidth = 3f)
                    drawCircle(Color(0xFFF59E0B), radius = 6f, center = Offset(w * 0.75f, h * 0.25f))
                    drawCircle(Color(0xFFF59E0B), radius = 6f, center = Offset(w * 0.75f, h * 0.75f))
                }
                ExerciseEquipment.CABLE_PULLEY -> {
                    // Pulley Tower
                    drawLine(Color(0xFF64748B), start = Offset(w * 0.5f, h * 0.08f), end = Offset(w * 0.5f, h * 0.92f), strokeWidth = 4f)
                    // Top wheel
                    drawCircle(Color(0xFF38BDF8), radius = 5f, center = Offset(w * 0.5f, h * 0.15f))
                    // Lat bar
                    drawLine(Color.White, start = Offset(w * 0.15f, h * 0.35f), end = Offset(w * 0.85f, h * 0.35f), strokeWidth = 3f)
                    // Weight stack plates
                    for (i in 0..3) {
                        drawRoundRect(Color(0xFF94A3B8), topLeft = Offset(w * 0.3f, h * 0.55f + (i * 7)), size = Size(w * 0.4f, 5f), cornerRadius = CornerRadius(1f))
                    }
                }
                ExerciseEquipment.POWER_RACK -> {
                    // 4 upright posts of the rack
                    drawLine(Color(0xFF64748B), start = Offset(w * 0.15f, h * 0.10f), end = Offset(w * 0.15f, h * 0.90f), strokeWidth = 3f)
                    drawLine(Color(0xFF64748B), start = Offset(w * 0.85f, h * 0.10f), end = Offset(w * 0.85f, h * 0.90f), strokeWidth = 3f)
                    // Top crossbar
                    drawLine(Color(0xFF64748B), start = Offset(w * 0.15f, h * 0.15f), end = Offset(w * 0.85f, h * 0.15f), strokeWidth = 3f)
                    // Barbell on J-hooks
                    drawLine(Color.White, start = Offset(w * 0.05f, h * 0.45f), end = Offset(w * 0.95f, h * 0.45f), strokeWidth = 3f)
                    drawRoundRect(Color(0xFF10B981), topLeft = Offset(w * 0.12f, h * 0.35f), size = Size(w * 0.07f, h * 0.20f), cornerRadius = CornerRadius(2f))
                    drawRoundRect(Color(0xFF10B981), topLeft = Offset(w * 0.81f, h * 0.35f), size = Size(w * 0.07f, h * 0.20f), cornerRadius = CornerRadius(2f))
                }
                else -> {
                    // Generic machine/bench
                    drawRoundRect(Color(0xFF38BDF8), topLeft = Offset(w * 0.2f, h * 0.4f), size = Size(w * 0.6f, h * 0.3f), cornerRadius = CornerRadius(4f))
                    drawLine(Color.White, start = Offset(w * 0.1f, h * 0.3f), end = Offset(w * 0.9f, h * 0.3f), strokeWidth = 3f)
                }
            }
        }
    }
}

/**
 * Realistic Human Anatomical Muscular Heatmap (Front & Back Views)
 */
@Composable
fun MusclesHeatmapScreen(totalVolumeKg: Int) {
    var selectedExerciseTarget by remember { mutableStateOf(0) } // 0: Peito/Tríceps, 1: Costas/Bíceps, 2: Pernas/Glúteos

    Card(
        shape = RoundedCornerShape(26.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF11141C)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            // Training effect dials (Zepp style)
            Text("EFEITO DO TREINO & METABOLISMO", color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1B1F2C)),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Aeróbico", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("0.8", color = Color(0xFF38BDF8), fontSize = 24.sp, fontWeight = FontWeight.Black)
                        Text("Efeito regenerativo", color = Color(0xFF94A3B8), fontSize = 10.sp)
                    }
                }

                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1B1F2C)),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Anaeróbico", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("3.2", color = Color(0xFFF59E0B), fontSize = 24.sp, fontWeight = FontWeight.Black)
                        Text("Alto estímulo muscular", color = Color(0xFFF59E0B), fontSize = 10.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Exercise filter selector for heatmap
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF1E2230), RoundedCornerShape(12.dp))
                    .padding(3.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                val targets = listOf("Peito/Braços", "Costas/Dorsal", "Pernas/Glúteos")
                targets.forEachIndexed { idx, t ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(if (selectedExerciseTarget == idx) Color(0xFF2C3246) else Color.Transparent, RoundedCornerShape(9.dp))
                            .clickable { selectedExerciseTarget = idx }
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            t,
                            fontSize = 10.sp,
                            fontWeight = if (selectedExerciseTarget == idx) FontWeight.Bold else FontWeight.Normal,
                            color = if (selectedExerciseTarget == idx) Color.White else Color(0xFF94A3B8)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            Divider(color = Color(0xFF242938))
            Spacer(modifier = Modifier.height(14.dp))

            Text("ANATOMIA MUSCULAR ATIVADA", color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(10.dp))

            // Realistic Muscular Body Heatmap Drawing
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(230.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // FRONT VIEW (Frente)
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("FRENTE", color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    RealisticFrontMusclesCanvas(target = selectedExerciseTarget)
                }

                // BACK VIEW (Costas)
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("COSTAS", color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    RealisticBackMusclesCanvas(target = selectedExerciseTarget)
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Heatmap Legend
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(9.dp).background(Color(0xFFEF4444), CircleShape))
                    Spacer(modifier = Modifier.width(5.dp))
                    Text("Músculo Primário", color = Color(0xFFCBD5E1), fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(9.dp).background(Color(0xFFF59E0B), CircleShape))
                    Spacer(modifier = Modifier.width(5.dp))
                    Text("Secundário", color = Color(0xFFCBD5E1), fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(9.dp).background(Color(0xFF334155), CircleShape))
                    Spacer(modifier = Modifier.width(5.dp))
                    Text("Não alvo", color = Color(0xFF94A3B8), fontSize = 11.sp)
                }
            }
        }
    }
}

/**
 * Realistic anatomical canvas drawing for Anterior/Front Muscles
 */
@Composable
fun RealisticFrontMusclesCanvas(target: Int) {
    Canvas(modifier = Modifier.size(105.dp, 190.dp)) {
        val w = size.width
        val h = size.height

        // Colors
        val primary = Color(0xFFEF4444)
        val secondary = Color(0xFFF59E0B)
        val neutral = Color(0xFF334155)

        val chestColor = if (target == 0) primary else neutral
        val shoulderColor = if (target == 0) secondary else neutral
        val bicepsColor = if (target == 0 || target == 1) secondary else neutral
        val absColor = if (target == 2) secondary else neutral
        val quadsColor = if (target == 2) primary else neutral

        // Head and Neck
        drawCircle(Color(0xFF64748B), radius = 11f, center = Offset(w * 0.5f, 15f))
        drawRoundRect(Color(0xFF475569), topLeft = Offset(w * 0.45f, 24f), size = Size(w * 0.10f, 12f), cornerRadius = CornerRadius(2f))

        // Trapezius anterior
        drawPath(
            Path().apply {
                moveTo(w * 0.35f, 32f)
                lineTo(w * 0.5f, 26f)
                lineTo(w * 0.65f, 32f)
                lineTo(w * 0.5f, 36f)
                close()
            },
            color = Color(0xFF475569)
        )

        // Deltoids (Shoulders Left & Right)
        drawRoundRect(shoulderColor, topLeft = Offset(w * 0.20f, 32f), size = Size(w * 0.16f, 26f), cornerRadius = CornerRadius(10f))
        drawRoundRect(shoulderColor, topLeft = Offset(w * 0.64f, 32f), size = Size(w * 0.16f, 26f), cornerRadius = CornerRadius(10f))

        // Pectorals (Chest Left & Right with sternum cleft)
        drawRoundRect(chestColor, topLeft = Offset(w * 0.29f, 34f), size = Size(w * 0.20f, 28f), cornerRadius = CornerRadius(8f))
        drawRoundRect(chestColor, topLeft = Offset(w * 0.51f, 34f), size = Size(w * 0.20f, 28f), cornerRadius = CornerRadius(8f))

        // Biceps (Left & Right)
        drawRoundRect(bicepsColor, topLeft = Offset(w * 0.14f, 58f), size = Size(w * 0.12f, 30f), cornerRadius = CornerRadius(6f))
        drawRoundRect(bicepsColor, topLeft = Offset(w * 0.74f, 58f), size = Size(w * 0.12f, 30f), cornerRadius = CornerRadius(6f))

        // Forearms
        drawRoundRect(neutral, topLeft = Offset(w * 0.09f, 88f), size = Size(w * 0.11f, 34f), cornerRadius = CornerRadius(5f))
        drawRoundRect(neutral, topLeft = Offset(w * 0.80f, 88f), size = Size(w * 0.11f, 34f), cornerRadius = CornerRadius(5f))

        // Abdominal Rectus (Six-Pack 3 pairs)
        for (row in 0..2) {
            val yPos = 64f + (row * 11)
            drawRoundRect(absColor, topLeft = Offset(w * 0.38f, yPos), size = Size(w * 0.11f, 9f), cornerRadius = CornerRadius(3f))
            drawRoundRect(absColor, topLeft = Offset(w * 0.51f, yPos), size = Size(w * 0.11f, 9f), cornerRadius = CornerRadius(3f))
        }

        // External Obliques
        drawRoundRect(neutral, topLeft = Offset(w * 0.29f, 66f), size = Size(w * 0.08f, 28f), cornerRadius = CornerRadius(4f))
        drawRoundRect(neutral, topLeft = Offset(w * 0.63f, 66f), size = Size(w * 0.08f, 28f), cornerRadius = CornerRadius(4f))

        // Quadriceps (Left & Right Thighs with teardrop curve)
        drawRoundRect(quadsColor, topLeft = Offset(w * 0.26f, 100f), size = Size(w * 0.22f, 54f), cornerRadius = CornerRadius(10f))
        drawRoundRect(quadsColor, topLeft = Offset(w * 0.52f, 100f), size = Size(w * 0.22f, 54f), cornerRadius = CornerRadius(10f))

        // Knees
        drawCircle(Color(0xFF475569), radius = 5f, center = Offset(w * 0.37f, 156f))
        drawCircle(Color(0xFF475569), radius = 5f, center = Offset(w * 0.63f, 156f))

        // Calves (Tibialis & Gastrocnemius front)
        drawRoundRect(neutral, topLeft = Offset(w * 0.29f, 162f), size = Size(w * 0.16f, 40f), cornerRadius = CornerRadius(7f))
        drawRoundRect(neutral, topLeft = Offset(w * 0.55f, 162f), size = Size(w * 0.16f, 40f), cornerRadius = CornerRadius(7f))
    }
}

/**
 * Realistic anatomical canvas drawing for Posterior/Back Muscles
 */
@Composable
fun RealisticBackMusclesCanvas(target: Int) {
    Canvas(modifier = Modifier.size(105.dp, 190.dp)) {
        val w = size.width
        val h = size.height

        val primary = Color(0xFFEF4444)
        val secondary = Color(0xFFF59E0B)
        val neutral = Color(0xFF334155)

        val latsColor = if (target == 1) primary else neutral
        val trapsColor = if (target == 1) secondary else neutral
        val tricepsColor = if (target == 0) secondary else neutral
        val glutesColor = if (target == 2) primary else neutral
        val hamstringsColor = if (target == 2) secondary else neutral

        // Head and Neck posterior
        drawCircle(Color(0xFF64748B), radius = 11f, center = Offset(w * 0.5f, 15f))

        // Trapezius (Diamond shaped muscle on upper back)
        drawPath(
            Path().apply {
                moveTo(w * 0.5f, 24f)
                lineTo(w * 0.68f, 38f)
                lineTo(w * 0.5f, 60f)
                lineTo(w * 0.32f, 38f)
                close()
            },
            color = trapsColor
        )

        // Rear Deltoids
        drawRoundRect(neutral, topLeft = Offset(w * 0.20f, 32f), size = Size(w * 0.15f, 22f), cornerRadius = CornerRadius(8f))
        drawRoundRect(neutral, topLeft = Offset(w * 0.65f, 32f), size = Size(w * 0.15f, 22f), cornerRadius = CornerRadius(8f))

        // Latissimus Dorsi (V-Taper back wings)
        drawPath(
            Path().apply {
                moveTo(w * 0.32f, 40f)
                lineTo(w * 0.26f, 68f)
                lineTo(w * 0.40f, 84f)
                lineTo(w * 0.50f, 60f)
                close()
            },
            color = latsColor
        )
        drawPath(
            Path().apply {
                moveTo(w * 0.68f, 40f)
                lineTo(w * 0.74f, 68f)
                lineTo(w * 0.60f, 84f)
                lineTo(w * 0.50f, 60f)
                close()
            },
            color = latsColor
        )

        // Triceps (Horseshoe Left & Right)
        drawRoundRect(tricepsColor, topLeft = Offset(w * 0.14f, 54f), size = Size(w * 0.12f, 32f), cornerRadius = CornerRadius(6f))
        drawRoundRect(tricepsColor, topLeft = Offset(w * 0.74f, 54f), size = Size(w * 0.12f, 32f), cornerRadius = CornerRadius(6f))

        // Forearms posterior
        drawRoundRect(neutral, topLeft = Offset(w * 0.09f, 88f), size = Size(w * 0.11f, 34f), cornerRadius = CornerRadius(5f))
        drawRoundRect(neutral, topLeft = Offset(w * 0.80f, 88f), size = Size(w * 0.11f, 34f), cornerRadius = CornerRadius(5f))

        // Lower Back (Erector Spinae)
        drawRoundRect(neutral, topLeft = Offset(w * 0.41f, 68f), size = Size(w * 0.18f, 26f), cornerRadius = CornerRadius(4f))

        // Gluteus Maximus (Glúteos Left & Right)
        drawRoundRect(glutesColor, topLeft = Offset(w * 0.27f, 96f), size = Size(w * 0.22f, 30f), cornerRadius = CornerRadius(12f))
        drawRoundRect(glutesColor, topLeft = Offset(w * 0.51f, 96f), size = Size(w * 0.22f, 30f), cornerRadius = CornerRadius(12f))

        // Hamstrings (Posterior Thighs)
        drawRoundRect(hamstringsColor, topLeft = Offset(w * 0.27f, 128f), size = Size(w * 0.21f, 42f), cornerRadius = CornerRadius(8f))
        drawRoundRect(hamstringsColor, topLeft = Offset(w * 0.52f, 128f), size = Size(w * 0.21f, 42f), cornerRadius = CornerRadius(8f))

        // Calves (Gastrocnemius posterior - Heart shaped)
        drawRoundRect(neutral, topLeft = Offset(w * 0.28f, 172f), size = Size(w * 0.18f, 34f), cornerRadius = CornerRadius(8f))
        drawRoundRect(neutral, topLeft = Offset(w * 0.54f, 172f), size = Size(w * 0.18f, 34f), cornerRadius = CornerRadius(8f))
    }
}
