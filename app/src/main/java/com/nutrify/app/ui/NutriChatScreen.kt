package com.nutrify.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nutrify.app.model.ChatMessage

@Composable
fun NutriChatScreen() {
    var messageInput by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            ChatMessage("bot", "Olá! Sou a Nutri, sua assistente nutricional com foco na tabela TACO brasileira. Como posso ajudar com suas calorias e metas hoje?")
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Chat Header
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("✨", fontSize = 26.sp)
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text("Nutri IA", color = Color.White, fontWeight = FontWeight.Black, fontSize = 16.sp)
                    Text("Nutricionista Virtual • Alimentos da Tabela TACO", color = Color.White.copy(alpha = 0.85f), fontSize = 11.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Quick suggestions
        val suggestions = listOf("Fontes de proteína TACO", "Sugestão de almoço", "Pré-treino ideal")
        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            items(suggestions) { s ->
                Box(
                    modifier = Modifier
                        .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(10.dp))
                        .clickable { messageInput = s }
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Text(s, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, fontWeight = FontWeight.Medium)
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Message List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(messages) { msg ->
                val isUser = msg.role == "user"
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
                ) {
                    Card(
                        shape = RoundedCornerShape(
                            topStart = 16.dp,
                            topEnd = 16.dp,
                            bottomStart = if (isUser) 16.dp else 4.dp,
                            bottomEnd = if (isUser) 4.dp else 16.dp
                        ),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isUser) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface
                        ),
                        border = if (!isUser) CardDefaults.outlinedCardBorder().copy(
                            brush = androidx.compose.ui.graphics.SolidColor(MaterialTheme.colorScheme.outline)
                        ) else null,
                        modifier = Modifier.widthIn(max = 290.dp)
                    ) {
                        Text(
                            text = msg.text,
                            color = if (isUser) Color.White else MaterialTheme.colorScheme.onSurface,
                            modifier = Modifier.padding(12.dp),
                            fontSize = 13.sp,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Input Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = messageInput,
                onValueChange = { messageInput = it },
                placeholder = { Text("Pergunte à Nutri IA...", fontSize = 12.sp) },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Button(
                onClick = {
                    if (messageInput.isNotBlank()) {
                        val text = messageInput.trim()
                        messages.add(ChatMessage("user", text))
                        messageInput = ""

                        val reply = when {
                            text.contains("proteína", ignoreCase = true) ->
                                "Pela tabela TACO brasileira, as melhores fontes magras de proteína por 100g são:\n• Frango grelhado: 32g de proteína\n• Filé de tilápia: 26g de proteína\n• Patinho bovino grelhado: 35.9g de proteína\n• Ovos inteiros cozidos: 13.3g de proteína"
                            text.contains("jantar", ignoreCase = true) || text.contains("almoço", ignoreCase = true) ->
                                "Uma excelente combinação equilibrada:\n• 150g de filé de frango ou patinho moído\n• 150g de arroz integral ou batata inglesa cozida\n• 80g de feijão carioca\n• Salada de alface e tomate à vontade!"
                            text.contains("pré-treino", ignoreCase = true) ->
                                "Para energia rápida sem pesar no estômago:\n• 1 banana média (26g carbos)\n• 30g de aveia em flocos (19g carbos)\n• Opcional: 1 dose (30g) de whey protein concentrado para suporte muscular."
                            else ->
                                "Excelente ponto! Lembre-se que bater sua meta calórica e a quantidade de água diária (35ml por kg) faz toda a diferença para seus resultados."
                        }
                        messages.add(ChatMessage("bot", reply))
                    }
                },
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
            ) {
                Text("Enviar", fontWeight = FontWeight.Bold)
            }
        }
    }
}
