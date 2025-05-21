export interface Training {
  type: string,
  MET: number;
}

export const trainings: Training[] = [
  { type: "Силове тренування", MET: 5.0 },
  { type: "Біг", MET: 8.0 },
  { type: "Плавання", MET: 7.0 },
  { type: "Велоспорт", MET: 6.0 },
  { type: "Йога", MET: 2.5 },
  { type: "ВІІТ", MET: 8.0 },
  { type: "Пілатес", MET: 3.0 },
  { type: "Спортивна ходьба", MET: 3.5 },
  { type: "Танці", MET: 5.5 },
  { type: "Бокс", MET: 7.0 },
  { type: "Футбол", MET: 7.0 },
  { type: "Баскетбол", MET: 6.5 },
  { type: "Волейбол", MET: 4.0 },
  { type: "Теніс", MET: 7.3 },
  { type: "Бадмінтон", MET: 5.5 },
  { type: "Альпінізм", MET: 8.0 },
  { type: "Садівництво", MET: 4.0 },
  { type: "Домашнє прибирання (інтенсивне)", MET: 3.8 },
  { type: "Перенесення важких предметів", MET: 6.5 },
  { type: "Веслування", MET: 7.0 },
];