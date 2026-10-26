package com.nutrify.app.data

import com.nutrify.app.model.FoodItem

object TacoDatabase {
    val foods = listOf(
        FoodItem("1", "Arroz, tipo 1, cozido", "TACO", 128.0, 2.5, 28.1, 0.2),
        FoodItem("2", "Arroz, integral, cozido", "TACO", 124.0, 2.6, 25.8, 1.0),
        FoodItem("3", "Feijão, carioca, cozido", "TACO", 76.0, 4.8, 13.6, 0.5),
        FoodItem("4", "Feijão, preto, cozido", "TACO", 77.0, 4.5, 14.0, 0.5),
        FoodItem("5", "Frango, peito, sem pele, grelhado", "TACO", 159.0, 32.0, 0.0, 2.5),
        FoodItem("6", "Carne, bovina, patinho, grelhado", "TACO", 219.0, 35.9, 0.0, 7.3),
        FoodItem("7", "Carne, bovina, acém, moído, cozido", "TACO", 212.0, 26.7, 0.0, 10.9),
        FoodItem("8", "Filé de tilápia grelhado", "Referência", 128.0, 26.0, 0.0, 2.7),
        FoodItem("9", "Ovo, de galinha, inteiro, cozido", "TACO", 146.0, 13.3, 0.6, 9.5),
        FoodItem("10", "Batata, inglesa, cozida", "TACO", 52.0, 1.2, 11.9, 0.0),
        FoodItem("11", "Batata, doce, cozida", "TACO", 77.0, 0.6, 18.4, 0.1),
        FoodItem("12", "Mandioca, cozida", "TACO", 125.0, 0.6, 30.1, 0.3),
        FoodItem("13", "Macarrão cozido simples", "Referência", 158.0, 5.8, 30.9, 0.9),
        FoodItem("14", "Tapioca (goma hidratada)", "Referência", 240.0, 0.0, 60.0, 0.0),
        FoodItem("15", "Purê de batata com leite", "Referência", 89.0, 2.0, 13.0, 3.3),
        FoodItem("16", "Pão, trigo, francês", "TACO", 300.0, 8.0, 58.6, 3.1),
        FoodItem("17", "Queijo, mozarela", "TACO", 280.0, 22.6, 3.0, 20.1),
        FoodItem("18", "Whey protein concentrado 80%", "Referência", 400.0, 80.0, 8.0, 6.0),
        FoodItem("19", "Aveia, flocos, crua", "TACO", 394.0, 13.9, 66.6, 8.5),
        FoodItem("20", "Banana, prata, crua", "TACO", 98.0, 1.3, 26.0, 0.1),
        FoodItem("21", "Maçã, fuji, com casca", "TACO", 56.0, 0.3, 15.2, 0.2),
        FoodItem("22", "Iogurte grego natural", "Referência", 120.0, 5.0, 14.0, 5.0),
        FoodItem("23", "Pasta de amendoim integral", "Referência", 588.0, 25.0, 20.0, 50.0),
        FoodItem("24", "Tomate, com semente, cru", "TACO", 15.0, 1.1, 3.1, 0.2),
        FoodItem("25", "Alface, lisa, crua", "TACO", 14.0, 1.7, 2.4, 0.1)
    )

    fun parseFreeText(input: String): List<Pair<FoodItem, Double>> {
        val results = mutableListOf<Pair<FoodItem, Double>>()
        val segments = input.split(Regex("[,\n;+]|\\s+e\\s+")).map { it.trim() }.filter { it.length > 1 }

        for (seg in segments) {
            val lower = seg.lowercase()
            // Extract quantity
            val qtyMatch = Regex("(\\d+(?:[.,]\\d+)?)\\s*(gr|gramas|g|kg|ovos|ovo|fatias|fatia|unidades|unidade)?").find(lower)
            var grams = 100.0
            if (qtyMatch != null) {
                val num = qtyMatch.groupValues[1].replace(",", ".").toDoubleOrNull() ?: 100.0
                val unit = qtyMatch.groupValues[2]
                grams = when (unit) {
                    "kg" -> num * 1000.0
                    "ovo", "ovos" -> num * 50.0
                    "fatia", "fatias" -> num * 30.0
                    "unidade", "unidades" -> num * 100.0
                    else -> num
                }
            }

            // Find matching food
            val match = foods.firstOrNull { f ->
                val fn = f.name.lowercase()
                lower.contains("arroz") && fn.contains("arroz") ||
                lower.contains("batata inglesa") && fn.contains("batata, inglesa") ||
                lower.contains("batata doce") && fn.contains("batata, doce") ||
                lower.contains("frango") && fn.contains("frango") ||
                lower.contains("feij") && fn.contains("feijão") ||
                lower.contains("ovo") && fn.contains("ovo") ||
                lower.contains("carne") && fn.contains("carne") ||
                lower.contains("tilapia") && fn.contains("tilápia") ||
                lower.contains("mandioca") && fn.contains("mandioca") ||
                lower.contains("pao") && fn.contains("pão") ||
                lower.contains("queijo") && fn.contains("queijo") ||
                lower.contains("whey") && fn.contains("whey") ||
                lower.contains("aveia") && fn.contains("aveia") ||
                lower.contains("banana") && fn.contains("banana") ||
                lower.contains("tapioca") && fn.contains("tapioca")
            } ?: foods.firstOrNull { f ->
                lower.split(" ").any { token -> token.length > 3 && f.name.lowercase().contains(token) }
            }

            if (match != null) {
                results.add(Pair(match, grams))
            }
        }
        return results
    }
}
