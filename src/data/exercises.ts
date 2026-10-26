import { MuscleGroup } from '../types';

export interface ExerciseDefinition {
  name: string;
  muscle_group: MuscleGroup;
}

export const MUSCLE_GROUPS_PT: Record<MuscleGroup, string> = {
  peito: 'Peito',
  costas: 'Costas',
  ombros: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  pernas: 'Pernas',
  gluteos: 'Glúteos',
  panturrilha: 'Panturrilha',
  abdomen: 'Abdômen',
  corpo_inteiro: 'Corpo inteiro',
  outro: 'Outro',
};

export const EXERCISES_CATALOG: ExerciseDefinition[] = [
  // Peito
  { name: 'Supino reto com barra', muscle_group: 'peito' },
  { name: 'Supino inclinado com barra', muscle_group: 'peito' },
  { name: 'Supino declinado com barra', muscle_group: 'peito' },
  { name: 'Supino reto com halteres', muscle_group: 'peito' },
  { name: 'Supino inclinado com halteres', muscle_group: 'peito' },
  { name: 'Supino na máquina', muscle_group: 'peito' },
  { name: 'Crucifixo com halteres', muscle_group: 'peito' },
  { name: 'Crucifixo na máquina (peck deck)', muscle_group: 'peito' },
  { name: 'Crossover na polia', muscle_group: 'peito' },
  { name: 'Flexão de braço', muscle_group: 'peito' },
  { name: 'Mergulho nas paralelas', muscle_group: 'peito' },

  // Costas
  { name: 'Puxada frontal na polia', muscle_group: 'costas' },
  { name: 'Puxada com pegada supinada', muscle_group: 'costas' },
  { name: 'Barra fixa', muscle_group: 'costas' },
  { name: 'Remada curvada com barra', muscle_group: 'costas' },
  { name: 'Remada unilateral com halter (serrote)', muscle_group: 'costas' },
  { name: 'Remada baixa na polia', muscle_group: 'costas' },
  { name: 'Remada cavalinho', muscle_group: 'costas' },
  { name: 'Remada na máquina', muscle_group: 'costas' },
  { name: 'Pullover com halter', muscle_group: 'costas' },
  { name: 'Levantamento terra', muscle_group: 'costas' },

  // Ombros
  { name: 'Desenvolvimento com barra', muscle_group: 'ombros' },
  { name: 'Desenvolvimento com halteres', muscle_group: 'ombros' },
  { name: 'Desenvolvimento na máquina', muscle_group: 'ombros' },
  { name: 'Elevação lateral com halteres', muscle_group: 'ombros' },
  { name: 'Elevação frontal com halteres', muscle_group: 'ombros' },
  { name: 'Crucifixo inverso', muscle_group: 'ombros' },
  { name: 'Remada alta', muscle_group: 'ombros' },
  { name: 'Encolhimento com halteres', muscle_group: 'ombros' },
  { name: 'Face pull', muscle_group: 'ombros' },

  // Bíceps
  { name: 'Rosca direta com barra', muscle_group: 'biceps' },
  { name: 'Rosca alternada com halteres', muscle_group: 'biceps' },
  { name: 'Rosca martelo', muscle_group: 'biceps' },
  { name: 'Rosca concentrada', muscle_group: 'biceps' },
  { name: 'Rosca Scott', muscle_group: 'biceps' },
  { name: 'Rosca na polia', muscle_group: 'biceps' },
  { name: 'Rosca inversa', muscle_group: 'biceps' },

  // Tríceps
  { name: 'Tríceps pulley com corda', muscle_group: 'triceps' },
  { name: 'Tríceps pulley com barra reta', muscle_group: 'triceps' },
  { name: 'Tríceps testa', muscle_group: 'triceps' },
  { name: 'Tríceps francês', muscle_group: 'triceps' },
  { name: 'Tríceps coice', muscle_group: 'triceps' },
  { name: 'Mergulho no banco', muscle_group: 'triceps' },
  { name: 'Supino fechado', muscle_group: 'triceps' },

  // Pernas
  { name: 'Agachamento livre', muscle_group: 'pernas' },
  { name: 'Agachamento no Smith', muscle_group: 'pernas' },
  { name: 'Agachamento hack', muscle_group: 'pernas' },
  { name: 'Agachamento sumô', muscle_group: 'pernas' },
  { name: 'Agachamento búlgaro', muscle_group: 'pernas' },
  { name: 'Leg press 45°', muscle_group: 'pernas' },
  { name: 'Cadeira extensora', muscle_group: 'pernas' },
  { name: 'Mesa flexora', muscle_group: 'pernas' },
  { name: 'Cadeira flexora', muscle_group: 'pernas' },
  { name: 'Stiff', muscle_group: 'pernas' },
  { name: 'Afundo (passada)', muscle_group: 'pernas' },
  { name: 'Cadeira adutora', muscle_group: 'pernas' },
  { name: 'Cadeira abdutora', muscle_group: 'pernas' },

  // Glúteos
  { name: 'Elevação pélvica (hip thrust)', muscle_group: 'gluteos' },
  { name: 'Ponte de glúteos', muscle_group: 'gluteos' },
  { name: 'Glúteo na polia (coice)', muscle_group: 'gluteos' },
  { name: 'Abdução de quadril na polia', muscle_group: 'gluteos' },

  // Panturrilha
  { name: 'Panturrilha em pé', muscle_group: 'panturrilha' },
  { name: 'Panturrilha sentado', muscle_group: 'panturrilha' },
  { name: 'Panturrilha no leg press', muscle_group: 'panturrilha' },

  // Abdômen
  { name: 'Abdominal crunch', muscle_group: 'abdomen' },
  { name: 'Elevação de pernas', muscle_group: 'abdomen' },
  { name: 'Prancha', muscle_group: 'abdomen' },
  { name: 'Abdominal na polia', muscle_group: 'abdomen' },
  { name: 'Abdominal bicicleta', muscle_group: 'abdomen' },
  { name: 'Abdominal oblíquo', muscle_group: 'abdomen' },
  { name: 'Roda abdominal', muscle_group: 'abdomen' },

  // Corpo inteiro
  { name: 'Burpee', muscle_group: 'corpo_inteiro' },
  { name: 'Kettlebell swing', muscle_group: 'corpo_inteiro' },
  { name: 'Agachamento com salto', muscle_group: 'corpo_inteiro' },
  { name: 'Mountain climber', muscle_group: 'corpo_inteiro' },
  { name: 'Thruster', muscle_group: 'corpo_inteiro' },
];

/**
 * Estimate calories burned during weight lifting session:
 * MET for moderate/vigorous resistance training is ~5.0.
 * Calories = MET * weight_kg * (duration_min / 60)
 */
export function estimateCaloriesBurned(durationMin: number, weightKg: number): number {
  if (durationMin <= 0 || weightKg <= 0) return 0;
  return Math.round(5.0 * weightKg * (durationMin / 60));
}
