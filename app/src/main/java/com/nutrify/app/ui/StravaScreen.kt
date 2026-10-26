package com.nutrify.app.ui

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.nutrify.app.data.StravaRepository
import com.nutrify.app.model.StravaActivity

val StravaOrange = Color(0xFFFC4C02)
val StravaDark = Color(0xFF1E1E24)

@Composable
fun StravaIntegrationCard(
    onSyncSuccess: (Int) -> Unit = {}
) {
    val profile = StravaRepository.profile.value
    var isSyncing by remember { mutableStateOf(false) }
    var syncMessage by remember { mutableStateOf<String?>(null) }
    var showConnectDialog by remember { mutableStateOf(false) }

    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = CardDefaults.outlinedCardBorder().copy(
            brush = androidx.compose.ui.graphics.SolidColor(MaterialTheme.colorScheme.outline)
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            // Strava Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .background(StravaOrange, RoundedCornerShape(12.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("⚡", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Black)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                "Strava",
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .background(
                                        if (profile.isConnected) Color(0xFFECFDF5) else Color(0xFFFEF2F2),
                                        RoundedCornerShape(8.dp)
                                    )
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    if (profile.isConnected) "CONECTADO" else "DESCONECTADO",
                                    color = if (profile.isConnected) Color(0xFF047857) else Color(0xFFDC2626),
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Black
                                )
                            }
                        }
                        Text(
                            if (profile.isConnected) "${profile.athleteName} • ${profile.athleteCity}" else "Vincule seus treinos e corridas",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 11.sp
                        )
                    }
                }

                if (profile.isConnected) {
                    IconButton(
                        onClick = {
                            isSyncing = true
                            val act = StravaRepository.syncNewActivity()
                            onSyncSuccess(act.caloriesBurned)
                            syncMessage = "+${act.caloriesBurned} kcal importadas do Strava!"
                            isSyncing = false
                        },
                        modifier = Modifier
                            .size(38.dp)
                            .background(MaterialTheme.colorScheme.surfaceVariant, CircleShape)
                    ) {
                        Text(if (isSyncing) "⏳" else "🔄", fontSize = 15.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            if (profile.isConnected) {
                // Connected info & sync button
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                            RoundedCornerShape(14.dp)
                        )
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            "Última Sincronização",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            profile.lastSyncTime,
                            color = MaterialTheme.colorScheme.onSurface,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    Button(
                        onClick = {
                            isSyncing = true
                            val act = StravaRepository.syncNewActivity()
                            onSyncSuccess(act.caloriesBurned)
                            syncMessage = "Novo treino sincronizado (+${act.caloriesBurned} kcal)!"
                            isSyncing = false
                        },
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = StravaOrange),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text("Sincronizar", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                    }
                }

                syncMessage?.let { msg ->
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        msg,
                        color = Color(0xFF059669),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            } else {
                // Not connected button
                Button(
                    onClick = { showConnectDialog = true },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = StravaOrange)
                ) {
                    Text("Conectar Conta Strava", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }
    }

    // Connect Strava Modal Dialog
    if (showConnectDialog) {
        var athleteInput by remember { mutableStateOf("Mauro Lainetti") }
        AlertDialog(
            onDismissRequest = { showConnectDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(24.dp).background(StravaOrange, RoundedCornerShape(6.dp)), contentAlignment = Alignment.Center) {
                        Text("⚡", color = Color.White, fontSize = 14.sp)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Autenticação Strava", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        "Conecte sua conta do Strava para importar corridas, pedaladas e gasto calórico automaticamente para o Nutrify.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    OutlinedTextField(
                        value = athleteInput,
                        onValueChange = { athleteInput = it },
                        label = { Text("Nome do Atleta Strava") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )
                    Text(
                        "Status da API: Pronto (OAuth 2.0 ativo)",
                        fontSize = 11.sp,
                        color = Color(0xFF059669),
                        fontWeight = FontWeight.SemiBold
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        StravaRepository.connectStrava(athleteInput)
                        showConnectDialog = false
                    },
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = StravaOrange)
                ) {
                    Text("Autorizar Conexão")
                }
            },
            dismissButton = {
                TextButton(onClick = { showConnectDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }
}
