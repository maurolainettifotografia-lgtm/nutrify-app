package com.nutrify.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// iOS 18 Cupertino Aesthetic Theme Palette
private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF30D158), // Apple Fitness Green
    onPrimary = Color(0xFF003912),
    primaryContainer = Color(0xFF0A401B),
    onPrimaryContainer = Color(0xFFA6F6BE),
    secondary = Color(0xFF0A84FF), // iOS System Blue
    onSecondary = Color(0xFF002B55),
    secondaryContainer = Color(0xFF004080),
    onSecondaryContainer = Color(0xFFCCE4FF),
    tertiary = Color(0xFFFF9F0A), // iOS System Orange
    onTertiary = Color(0xFF452200),
    background = Color(0xFF000000), // OLED Pure Black (iOS Dark)
    onBackground = Color(0xFFFFFFFF),
    surface = Color(0xFF1C1C1E), // iOS Secondary System Grouped Dark
    onSurface = Color(0xFFFFFFFF),
    surfaceVariant = Color(0xFF2C2C2E), // iOS Tertiary System Grouped Dark
    onSurfaceVariant = Color(0xFF8E8E93), // iOS System Gray
    outline = Color(0xFF38383A) // iOS Separator Dark
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF34C759), // iOS System Green
    onPrimary = Color.White,
    primaryContainer = Color(0xFFD4F7DC),
    onPrimaryContainer = Color(0xFF08481A),
    secondary = Color(0xFF007AFF), // iOS System Blue
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFD9ECFF),
    onSecondaryContainer = Color(0xFF003A70),
    tertiary = Color(0xFFFF9500), // iOS System Orange
    onTertiary = Color.White,
    background = Color(0xFFF2F2F7), // iOS System Grouped Background Light
    onBackground = Color(0xFF000000),
    surface = Color(0xFFFFFFFF), // iOS Secondary System Grouped Light
    onSurface = Color(0xFF000000),
    surfaceVariant = Color(0xFFE5E5EA), // iOS Tertiary System Grouped Light
    onSurfaceVariant = Color(0xFF8E8E93), // iOS System Gray Light
    outline = Color(0xFFD1D1D6) // iOS Separator Light
)

@Composable
fun NutrifyTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
