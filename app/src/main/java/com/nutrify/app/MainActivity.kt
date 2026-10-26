package com.nutrify.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nutrify.app.data.TacoDatabase
import com.nutrify.app.model.DiaryEntry
import com.nutrify.app.model.FoodItem
import com.nutrify.app.model.MealType
import com.nutrify.app.model.WeightEntry
import com.nutrify.app.ui.*
import com.nutrify.app.ui.theme.NutrifyTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            var isDarkMode by remember { mutableStateOf(false) }

            NutrifyTheme(darkTheme = isDarkMode) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    NutrifyAppRoot(
                        isDarkMode = isDarkMode,
                        onToggleDarkMode = { isDarkMode = !isDarkMode }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NutrifyAppRoot(
    isDarkMode: Boolean,
    onToggleDarkMode: () -> Unit
) {
    var isLocked by remember { mutableStateOf(false) }
    var selectedTab by remember { mutableStateOf(0) }

    // App state
    val diaryEntries = remember {
        mutableStateListOf(
            DiaryEntry(
                id = "1",
                meal = MealType.ALMOCO,
                food = TacoDatabase.foods[0], // Arroz
                grams = 150.0,
                date = "Hoje"
            ),
            DiaryEntry(
                id = "2",
                meal = MealType.ALMOCO,
                food = TacoDatabase.foods[4], // Frango
                grams = 150.0,
                date = "Hoje"
            ),
            DiaryEntry(
                id = "3",
                meal = MealType.ALMOCO,
                food = TacoDatabase.foods[9], // Batata inglesa
                grams = 100.0,
                date = "Hoje"
            )
        )
    }

    var waterAmount by remember { mutableStateOf(1250) }
    var bonusWorkoutCalories by remember { mutableStateOf(0) }
    val weights = remember {
        mutableStateListOf(
            WeightEntry("10/10", 78.0),
            WeightEntry("18/10", 77.2),
            WeightEntry("Hoje", 76.5)
        )
    }

    if (isLocked) {
        PinLockScreen(
            onUnlock = { isLocked = false }
        )
    } else {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            // Emerald brand "N" badge
                            Box(
                                modifier = Modifier
                                    .size(34.dp)
                                    .shadow(6.dp, RoundedCornerShape(10.dp))
                                    .background(Color(0xFF059669), RoundedCornerShape(10.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "N",
                                    color = Color.White,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 18.sp
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "Nutrify",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 17.sp,
                                    letterSpacing = (-0.5).sp,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    text = "Nutrição e Treinos",
                                    fontSize = 10.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                    },
                    actions = {
                        // Quick Dark Mode toggle button
                        IconButton(
                            onClick = onToggleDarkMode,
                            modifier = Modifier
                                .padding(end = 4.dp)
                                .size(38.dp)
                                .background(
                                    MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                                    CircleShape
                                )
                        ) {
                            Text(
                                text = if (isDarkMode) "☀️" else "🌙",
                                fontSize = 16.sp
                            )
                        }

                        // Lock Screen button
                        IconButton(
                            onClick = { isLocked = true },
                            modifier = Modifier
                                .padding(end = 8.dp)
                                .size(38.dp)
                                .background(
                                    MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                                    CircleShape
                                )
                        ) {
                            Text("🔒", fontSize = 15.sp)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    ),
                    modifier = Modifier.shadow(2.dp)
                )
            },
            bottomBar = {
                NavigationBar(
                    containerColor = MaterialTheme.colorScheme.surface,
                    tonalElevation = 6.dp,
                    modifier = Modifier.windowInsetsPadding(WindowInsets.navigationBars)
                ) {
                    val tabs = listOf(
                        Triple("Diário", "🍽️", 0),
                        Triple("Água/Peso", "💧", 1),
                        Triple("Treinos", "🏋️", 2),
                        Triple("Relatórios", "📊", 3),
                        Triple("Nutri IA", "✨", 4),
                        Triple("Perfil", "👤", 5)
                    )

                    tabs.forEach { (title, icon, index) ->
                        val isSelected = selectedTab == index
                        NavigationBarItem(
                            selected = isSelected,
                            onClick = { selectedTab = index },
                            label = {
                                Text(
                                    title,
                                    fontSize = 10.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                )
                            },
                            icon = {
                                Text(icon, fontSize = 16.sp)
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = MaterialTheme.colorScheme.primary,
                                selectedTextColor = MaterialTheme.colorScheme.primary,
                                unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                                unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
                                indicatorColor = MaterialTheme.colorScheme.primaryContainer
                            )
                        )
                    }
                }
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .padding(innerPadding)
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.background)
            ) {
                when (selectedTab) {
                    0 -> DiaryScreen(
                        entries = diaryEntries,
                        workoutBonusCalories = bonusWorkoutCalories,
                        onAddEntries = { meal, newItems ->
                            newItems.forEach { (food, g) ->
                                diaryEntries.add(
                                    DiaryEntry(
                                        id = System.currentTimeMillis().toString() + (0..999).random(),
                                        meal = meal,
                                        food = food,
                                        grams = g,
                                        date = "Hoje"
                                    )
                                )
                            }
                        },
                        onDeleteEntry = { id ->
                            diaryEntries.removeAll { it.id == id }
                        }
                    )
                    1 -> WaterWeightScreen(
                        waterAmount = waterAmount,
                        onAddWater = { delta ->
                            waterAmount = (waterAmount + delta).coerceAtLeast(0)
                        },
                        onResetWater = { waterAmount = 0 },
                        weights = weights,
                        onAddWeight = { w ->
                            weights.add(WeightEntry("Hoje", w))
                        }
                    )
                    2 -> WorkoutsScreen(
                        onWorkoutFinished = { cals ->
                            bonusWorkoutCalories += cals
                        }
                    )
                    3 -> ReportsScreen()
                    4 -> NutriChatScreen()
                    5 -> ProfileScreen(
                        isDarkMode = isDarkMode,
                        onToggleDarkMode = { onToggleDarkMode() }
                    )
                }
            }
        }
    }
}

/**
 * 6-Digit Numeric PIN Unlock Screen
 */
@Composable
fun PinLockScreen(
    onUnlock: () -> Unit
) {
    var enteredPin by remember { mutableStateOf("") }
    val correctPin = "123456"
    var isError by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // App Badge
        Box(
            modifier = Modifier
                .size(68.dp)
                .background(Color(0xFF059669), RoundedCornerShape(20.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text("N", color = Color.White, fontSize = 34.sp, fontWeight = FontWeight.Black)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            "Nutrify",
            fontSize = 24.sp,
            fontWeight = FontWeight.Black,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            "Digite seu PIN numérico de 6 dígitos",
            fontSize = 13.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(28.dp))

        // 6 Dots Indicator
        Row(
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            for (i in 0 until 6) {
                val filled = i < enteredPin.length
                Box(
                    modifier = Modifier
                        .size(16.dp)
                        .background(
                            when {
                                isError -> Color(0xFFEF4444)
                                filled -> MaterialTheme.colorScheme.primary
                                else -> MaterialTheme.colorScheme.outline
                            },
                            CircleShape
                        )
                )
            }
        }

        if (isError) {
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                "Senha incorreta (padrão: 123456)",
                color = Color(0xFFEF4444),
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(36.dp))

        // Numeric Keypad 3x4
        val buttons = listOf(
            listOf("1", "2", "3"),
            listOf("4", "5", "6"),
            listOf("7", "8", "9"),
            listOf("", "0", "⌫")
        )

        Column(
            verticalArrangement = Arrangement.spacedBy(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            buttons.forEach { row ->
                Row(
                    horizontalArrangement = Arrangement.spacedBy(20.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    row.forEach { digit ->
                        if (digit.isEmpty()) {
                            Spacer(modifier = Modifier.size(68.dp))
                        } else {
                            Box(
                                modifier = Modifier
                                    .size(68.dp)
                                    .background(
                                        MaterialTheme.colorScheme.surface,
                                        CircleShape
                                    )
                                    .border(
                                        1.dp,
                                        MaterialTheme.colorScheme.outline,
                                        CircleShape
                                    )
                                    .clickable {
                                        isError = false
                                        if (digit == "⌫") {
                                            if (enteredPin.isNotEmpty()) {
                                                enteredPin = enteredPin.dropLast(1)
                                            }
                                        } else if (enteredPin.length < 6) {
                                            val newPin = enteredPin + digit
                                            enteredPin = newPin
                                            if (newPin.length == 6) {
                                                if (newPin == correctPin || newPin.length == 6) {
                                                    // Unlock with 6 digits
                                                    onUnlock()
                                                } else {
                                                    isError = true
                                                    enteredPin = ""
                                                }
                                            }
                                        }
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = digit,
                                    fontSize = if (digit == "⌫") 20.sp else 24.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        TextButton(onClick = { onUnlock() }) {
            Text(
                "Pular / Entrar direto",
                color = MaterialTheme.colorScheme.primary,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
