package com.nutrify.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nutrify.app.data.TacoDatabase
import com.nutrify.app.model.DiaryEntry
import com.nutrify.app.model.FoodItem
import com.nutrify.app.model.MealType

@Composable
fun DiaryScreen(
    entries: MutableList<DiaryEntry>,
    onAddEntries: (MealType, List<Pair<FoodItem, Double>>) -> Unit,
    onDeleteEntry: (String) -> Unit,
    workoutBonusCalories: Int = 0
) {
    var activeMealForAdd by remember { mutableStateOf<MealType?>(null) }
    var textInput by remember { mutableStateOf("") }
    var selectedDayOffset by remember { mutableStateOf(0) }

    val totalCalories = entries.sumOf { it.calories }
    val totalProtein = Math.round(entries.sumOf { it.protein } * 10.0) / 10.0
    val totalCarbs = Math.round(entries.sumOf { it.carbs } * 10.0) / 10.0
    val totalFat = Math.round(entries.sumOf { it.fat } * 10.0) / 10.0

    val baseCalories = 2100
    val targetCalories = baseCalories + workoutBonusCalories
    val targetProtein = 150.0
    val targetCarbs = 220.0
    val targetFat = 60.0

    val remainingCalories = targetCalories - totalCalories
    val calPercent = (totalCalories.toFloat() / targetCalories.toFloat()).coerceIn(0f, 1f)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Date Switcher Bar (Like original)
        item {
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
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = { selectedDayOffset -= 1 },
                        modifier = Modifier.size(36.dp)
                    ) {
                        Text("◀", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = if (selectedDayOffset == 0) "Hoje" else if (selectedDayOffset == -1) "Ontem" else "Dia $selectedDayOffset",
                            fontWeight = FontWeight.Black,
                            fontSize = 15.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "26 de Outubro",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    IconButton(
                        onClick = { selectedDayOffset += 1 },
                        modifier = Modifier.size(36.dp)
                    ) {
                        Text("▶", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }

        // Calorie & Macro Target Card (Modern Sleek Dark Gradient)
        item {
            Card(
                shape = RoundedCornerShape(26.dp),
                colors = CardDefaults.cardColors(containerColor = Color.Transparent),
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            Brush.linearGradient(
                                listOf(Color(0xFF0F172A), Color(0xFF1E293B))
                            ),
                            RoundedCornerShape(26.dp)
                        )
                        .padding(20.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Balanço Calórico", color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                Row(verticalAlignment = Alignment.Bottom) {
                                    Text(
                                        text = "$totalCalories",
                                        color = Color.White,
                                        fontSize = 28.sp,
                                        fontWeight = FontWeight.Black
                                    )
                                    Text(
                                        text = " / $targetCalories kcal",
                                        color = Color(0xFF94A3B8),
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(bottom = 3.dp, start = 4.dp)
                                    )
                                }
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("Restante", color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                Text(
                                    text = if (remainingCalories >= 0) "$remainingCalories kcal" else "+${-remainingCalories} kcal",
                                    color = if (remainingCalories >= 0) Color(0xFF34D399) else Color(0xFFFB7185),
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Black
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Linear progress
                        LinearProgressIndicator(
                            progress = { calPercent },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp),
                            color = Color(0xFF10B981),
                            trackColor = Color(0xFF334155),
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Macros Breakdown Grid
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            MacroCard("Proteína", totalProtein, targetProtein, Color(0xFF38BDF8), Modifier.weight(1f))
                            MacroCard("Carboidrato", totalCarbs, targetCarbs, Color(0xFFFBBF24), Modifier.weight(1f))
                            MacroCard("Gordura", totalFat, targetFat, Color(0xFFF87171), Modifier.weight(1f))
                        }
                    }
                }
            }
        }

        // Meal Sections
        items(MealType.values()) { meal ->
            val mealEntries = entries.filter { it.meal == meal }
            val mealCals = mealEntries.sumOf { it.calories }

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
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .background(MaterialTheme.colorScheme.primaryContainer, RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(meal.icon, fontSize = 18.sp)
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    meal.displayName,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    "$mealCals kcal • ${mealEntries.size} itens",
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 11.sp
                                )
                            }
                        }

                        Button(
                            onClick = { activeMealForAdd = meal },
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.primaryContainer,
                                contentColor = MaterialTheme.colorScheme.onPrimaryContainer
                            ),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text("✨ IA Adicionar", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    if (mealEntries.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
                        Spacer(modifier = Modifier.height(6.dp))

                        mealEntries.forEach { entry ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        entry.food.name,
                                        fontWeight = FontWeight.SemiBold,
                                        fontSize = 13.sp,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        "${entry.grams.toInt()}g • P:${entry.protein}g C:${entry.carbs}g G:${entry.fat}g",
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        fontSize = 11.sp
                                    )
                                }
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        "${entry.calories} kcal",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    IconButton(
                                        onClick = { onDeleteEntry(entry.id) },
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Text("✕", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    } else {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "Nenhum alimento registrado ainda.",
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                            fontSize = 11.sp,
                            modifier = Modifier.padding(start = 4.dp)
                        )
                    }
                }
            }
        }
    }

    // AI Natural Language Add Food Dialog
    activeMealForAdd?.let { meal ->
        val parsedPreview = remember(textInput) {
            TacoDatabase.parseFreeText(textInput)
        }
        val previewCals = parsedPreview.sumOf { (it.first.calories100 * (it.second / 100.0)).toInt() }
        val previewP = Math.round(parsedPreview.sumOf { it.first.protein100 * (it.second / 100.0) } * 10.0) / 10.0
        val previewC = Math.round(parsedPreview.sumOf { it.first.carbs100 * (it.second / 100.0) } * 10.0) / 10.0
        val previewF = Math.round(parsedPreview.sumOf { it.first.fat100 * (it.second / 100.0) } * 10.0) / 10.0

        AlertDialog(
            onDismissRequest = {
                activeMealForAdd = null
                textInput = ""
            },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("✨ ", fontSize = 18.sp)
                    Text(
                        "Lançamento Inteligente - ${meal.displayName}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        "Digite todos os alimentos e quantidades que a IA calculará tudo instantaneamente:",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    // Quick example suggestion chips
                    val suggestions = listOf(
                        "150gr de arroz, 150gr de batata inglesa, 100gr de frango",
                        "2 ovos cozidos, 2 fatias de pão francês",
                        "1 banana, 30gr aveia, 30gr whey protein"
                    )
                    Text("Exemplos rápidos:", fontSize = 10.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(suggestions) { s ->
                            Box(
                                modifier = Modifier
                                    .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(8.dp))
                                    .clickable { textInput = s }
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(s.take(24) + "...", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface)
                            }
                        }
                    }

                    OutlinedTextField(
                        value = textInput,
                        onValueChange = { textInput = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Ex: 150gr de arroz, 150gr de batata, 100gr de frango...", fontSize = 12.sp) },
                        shape = RoundedCornerShape(12.dp)
                    )

                    if (parsedPreview.isNotEmpty()) {
                        Card(
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
                            ),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        "Total Calculado: $previewCals kcal",
                                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp
                                    )
                                    Text(
                                        "${parsedPreview.size} alimentos",
                                        color = MaterialTheme.colorScheme.primary,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }
                                Text(
                                    "P: ${previewP}g • C: ${previewC}g • G: ${previewF}g",
                                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Medium
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                parsedPreview.forEach { (item, g) ->
                                    Text(
                                        "• ${item.name} (${g.toInt()}g)",
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (parsedPreview.isNotEmpty()) {
                            onAddEntries(meal, parsedPreview)
                            activeMealForAdd = null
                            textInput = ""
                        }
                    },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Text("Lançar Tudo (${previewCals} kcal)", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = {
                    activeMealForAdd = null
                    textInput = ""
                }) {
                    Text("Cancelar")
                }
            }
        )
    }
}

@Composable
fun MacroCard(
    label: String,
    current: Double,
    target: Double,
    color: Color,
    modifier: Modifier = Modifier
) {
    val pct = (current / target).toFloat().coerceIn(0f, 1f)
    Box(
        modifier = modifier
            .background(Color(0xFF1E2638), RoundedCornerShape(16.dp))
            .border(1.dp, Color(0xFF2E384D), RoundedCornerShape(16.dp))
            .padding(10.dp)
    ) {
        Column {
            Text(label, color = color, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                "${current.toInt()}g",
                color = Color.White,
                fontSize = 14.sp,
                fontWeight = FontWeight.Black
            )
            Spacer(modifier = Modifier.height(4.dp))
            LinearProgressIndicator(
                progress = { pct },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp),
                color = color,
                trackColor = Color(0xFF334155)
            )
        }
    }
}
