# Nutrify App

Aplicativo completo de nutrição, treinos e bem-estar baseado na Tabela Brasileira de Composição de Alimentos (TACO - UNICAMP) e treinos de força no padrão Zepp (Amazfit).

## Funcionalidades Principais

1. **Adição Inteligente de Alimentos com IA (Texto Livre)**:
   - Digite ou cole tudo o que você for comer de uma só vez (ex: `150gr de arroz, 150gr de batata inglesa, 100gr de frango, 2 ovos cozidos`).
   - A IA/NLP decompõe cada alimento e porção automaticamente, busca na tabela TACO e calcula calorias, proteínas, carboidratos e gorduras instantaneamente.
   - Lançamento de todas as refeições no diário com 1 clique.

2. **Treino de Força & Mapa Muscular Anatômico (Estilo Zepp Amazfit)**:
   - Gráfico de **Músculos Usados** com visão anterior e posterior do corpo humano:
     - Músculo primário usado (Vermelho)
     - Músculo secundário usado (Laranja/Âmbar)
     - Músculo não alvo (Cinza)
   - Indicadores de **Efeito do Treino** (Mostradores de Aeróbico e Anaeróbico).
   - Cronômetro de tempo de treino, descanso regressivo (+30s / Saltar) e volume total levantado (kg).
   - Tabela de séries com incrementos `+` e `-` para Carga (kg) e Repetições, estimativa de 1RM e botão de conclusão da série.
   - Figura ilustrativa e guia "Como fazer?" para cada exercício da biblioteca.

3. **Autenticação Rápida com Senha Numérica (PIN de 6 dígitos)**:
   - Login e cadastro simplificados com teclado numérico direto no smartphone.

4. **Ícone Themed Adaptive Icon (Padrão Android Material You)**:
   - Camadas de ícone adaptativo e monocromático (`ic_launcher_monochrome.xml`) para suporte a cores dinâmicas no Android 13+.

5. **Diário Nutricional Completo**:
   - Metas de calorias e macros calculadas por Mifflin-St Jeor com piso de segurança à saúde.
   - Refeições padrão brasileiras: Café da manhã, Lanche da manhã, Almoço, Lanche da tarde, Jantar e Ceia.
   - Modo Atleta: soma calorias de treinos finalizados à meta do dia.

6. **Hidratação & Peso**:
   - Registro visual de consumo de água com cálculo personalizado (35ml/kg).
   - Histórico e progresso de peso corporal.

7. **Nutri IA (Assistente Nutricional)**:
   - Chat contextual com sugestões de refeições brasileiras usando itens da TACO para atingir os macros restantes do dia.

## Execução e Compilação

### Android (Gradle / APK)
```bash
gradle assembleDebug
```
O APK é gerado em `app/build/outputs/apk/debug/app-debug.apk`.

### Web Preview
```bash
npm run dev
```
Disponível em `http://0.0.0.0:3000`.
