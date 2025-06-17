// src/app/api/boards/mock-data.ts

export const ranges = [
  { id: 1, min_value: 20, max_value: 29 },
  { id: 2, min_value: 30, max_value: 39 },
  { id: 3, min_value: 40, max_value: 49 },
  { id: 4, min_value: 50, max_value: 59 },
  { id: 5, min_value: 60, max_value: 69 },
  { id: 6, min_value: 70, max_value: 79 },
];

export const biophysicsBoards = [
  // Grasa corporal masculina
  { id: 1, range_id: 1, name: 'male_fat', min: '8.0', max: '12.0', inverse: 0 },
  { id: 2, range_id: 2, name: 'male_fat', min: '10.0', max: '15.0', inverse: 0 },
  { id: 3, range_id: 3, name: 'male_fat', min: '12.0', max: '18.0', inverse: 0 },
  { id: 4, range_id: 4, name: 'male_fat', min: '14.0', max: '20.0', inverse: 0 },
  { id: 5, range_id: 5, name: 'male_fat', min: '16.0', max: '22.0', inverse: 0 },
  { id: 6, range_id: 6, name: 'male_fat', min: '18.0', max: '25.0', inverse: 0 },

  // Grasa corporal femenina
  { id: 7, range_id: 1, name: 'female_fat', min: '16.0', max: '20.0', inverse: 0 },
  { id: 8, range_id: 2, name: 'female_fat', min: '18.0', max: '23.0', inverse: 0 },
  { id: 9, range_id: 3, name: 'female_fat', min: '20.0', max: '25.0', inverse: 0 },
  { id: 10, range_id: 4, name: 'female_fat', min: '22.0', max: '27.0', inverse: 0 },
  { id: 11, range_id: 5, name: 'female_fat', min: '24.0', max: '30.0', inverse: 0 },
  { id: 12, range_id: 6, name: 'female_fat', min: '26.0', max: '32.0', inverse: 0 },

  // IMC (Body Mass Index)
  { id: 13, range_id: 1, name: 'body_mass', min: '18.5', max: '24.9', inverse: 0 },
  { id: 14, range_id: 2, name: 'body_mass', min: '18.5', max: '24.9', inverse: 0 },
  { id: 15, range_id: 3, name: 'body_mass', min: '18.5', max: '24.9', inverse: 0 },
  { id: 16, range_id: 4, name: 'body_mass', min: '18.5', max: '24.9', inverse: 0 },
  { id: 17, range_id: 5, name: 'body_mass', min: '18.5', max: '24.9', inverse: 0 },
  { id: 18, range_id: 6, name: 'body_mass', min: '18.5', max: '24.9', inverse: 0 },

  // Reflejo digital (ms) - inverso (menor tiempo = mejor)
  { id: 19, range_id: 1, name: 'digital_reflex', min: '150', max: '200', inverse: 1 },
  { id: 20, range_id: 2, name: 'digital_reflex', min: '160', max: '220', inverse: 1 },
  { id: 21, range_id: 3, name: 'digital_reflex', min: '170', max: '240', inverse: 1 },
  { id: 22, range_id: 4, name: 'digital_reflex', min: '180', max: '260', inverse: 1 },
  { id: 23, range_id: 5, name: 'digital_reflex', min: '190', max: '280', inverse: 1 },
  { id: 24, range_id: 6, name: 'digital_reflex', min: '200', max: '300', inverse: 1 },

  // Balance estático (segundos) - directo (más tiempo = mejor)
  { id: 25, range_id: 1, name: 'static_balance', min: '25', max: '30', inverse: 0 },
  { id: 26, range_id: 2, name: 'static_balance', min: '20', max: '28', inverse: 0 },
  { id: 27, range_id: 3, name: 'static_balance', min: '18', max: '25', inverse: 0 },
  { id: 28, range_id: 4, name: 'static_balance', min: '15', max: '22', inverse: 0 },
  { id: 29, range_id: 5, name: 'static_balance', min: '12', max: '20', inverse: 0 },
  { id: 30, range_id: 6, name: 'static_balance', min: '10', max: '18', inverse: 0 },

  // Acomodación visual (dioptrías) - inverso (menor = mejor)
  { id: 31, range_id: 1, name: 'visual_accommodation', min: '8', max: '12', inverse: 1 },
  { id: 32, range_id: 2, name: 'visual_accommodation', min: '6', max: '10', inverse: 1 },
  { id: 33, range_id: 3, name: 'visual_accommodation', min: '4', max: '8', inverse: 1 },
  { id: 34, range_id: 4, name: 'visual_accommodation', min: '3', max: '6', inverse: 1 },
  { id: 35, range_id: 5, name: 'visual_accommodation', min: '2', max: '4', inverse: 1 },
  { id: 36, range_id: 6, name: 'visual_accommodation', min: '1', max: '3', inverse: 1 },

  // Hidratación de la piel (%) - directo (más = mejor)
  { id: 37, range_id: 1, name: 'skin_hydration', min: '45', max: '55', inverse: 0 },
  { id: 38, range_id: 2, name: 'skin_hydration', min: '40', max: '50', inverse: 0 },
  { id: 39, range_id: 3, name: 'skin_hydration', min: '35', max: '45', inverse: 0 },
  { id: 40, range_id: 4, name: 'skin_hydration', min: '30', max: '40', inverse: 0 },
  { id: 41, range_id: 5, name: 'skin_hydration', min: '25', max: '35', inverse: 0 },
  { id: 42, range_id: 6, name: 'skin_hydration', min: '20', max: '30', inverse: 0 },

  // Presión sistólica (mmHg) - inverso (menor = mejor)
  { id: 43, range_id: 1, name: 'systolic_blood_pressure', min: '110', max: '120', inverse: 1 },
  { id: 44, range_id: 2, name: 'systolic_blood_pressure', min: '115', max: '125', inverse: 1 },
  { id: 45, range_id: 3, name: 'systolic_blood_pressure', min: '120', max: '130', inverse: 1 },
  { id: 46, range_id: 4, name: 'systolic_blood_pressure', min: '125', max: '135', inverse: 1 },
  { id: 47, range_id: 5, name: 'systolic_blood_pressure', min: '130', max: '140', inverse: 1 },
  { id: 48, range_id: 6, name: 'systolic_blood_pressure', min: '135', max: '145', inverse: 1 },

  // Presión diastólica (mmHg) - inverso (menor = mejor)
  { id: 49, range_id: 1, name: 'diastolic_blood_pressure', min: '70', max: '80', inverse: 1 },
  { id: 50, range_id: 2, name: 'diastolic_blood_pressure', min: '72', max: '82', inverse: 1 },
  { id: 51, range_id: 3, name: 'diastolic_blood_pressure', min: '74', max: '84', inverse: 1 },
  { id: 52, range_id: 4, name: 'diastolic_blood_pressure', min: '76', max: '86', inverse: 1 },
  { id: 53, range_id: 5, name: 'diastolic_blood_pressure', min: '78', max: '88', inverse: 1 },
  { id: 54, range_id: 6, name: 'diastolic_blood_pressure', min: '80', max: '90', inverse: 1 },

  // Pulso en reposo (bpm) - inverso (menor = mejor)
  { id: 55, range_id: 1, name: 'resting_pulse', min: '60', max: '70', inverse: 1 },
  { id: 56, range_id: 2, name: 'resting_pulse', min: '65', max: '75', inverse: 1 },
  { id: 57, range_id: 3, name: 'resting_pulse', min: '70', max: '80', inverse: 1 },
  { id: 58, range_id: 4, name: 'resting_pulse', min: '75', max: '85', inverse: 1 },
  { id: 59, range_id: 5, name: 'resting_pulse', min: '80', max: '90', inverse: 1 },
  { id: 60, range_id: 6, name: 'resting_pulse', min: '85', max: '95', inverse: 1 },

  // Atletas - Pulso en reposo (bpm) - valores más bajos
  { id: 61, range_id: 1, name: 'resting_pulse_athlete', min: '45', max: '55', inverse: 1 },
  { id: 62, range_id: 2, name: 'resting_pulse_athlete', min: '50', max: '60', inverse: 1 },
  { id: 63, range_id: 3, name: 'resting_pulse_athlete', min: '55', max: '65', inverse: 1 },
  { id: 64, range_id: 4, name: 'resting_pulse_athlete', min: '60', max: '70', inverse: 1 },
  { id: 65, range_id: 5, name: 'resting_pulse_athlete', min: '65', max: '75', inverse: 1 },
  { id: 66, range_id: 6, name: 'resting_pulse_athlete', min: '70', max: '80', inverse: 1 },

  // Atletas - Grasa corporal masculina (valores más bajos)
  { id: 67, range_id: 1, name: 'male_fat_athlete', min: '5.0', max: '8.0', inverse: 0 },
  { id: 68, range_id: 2, name: 'male_fat_athlete', min: '6.0', max: '10.0', inverse: 0 },
  { id: 69, range_id: 3, name: 'male_fat_athlete', min: '7.0', max: '12.0', inverse: 0 },
  { id: 70, range_id: 4, name: 'male_fat_athlete', min: '8.0', max: '14.0', inverse: 0 },
  { id: 71, range_id: 5, name: 'male_fat_athlete', min: '9.0', max: '16.0', inverse: 0 },
  { id: 72, range_id: 6, name: 'male_fat_athlete', min: '10.0', max: '18.0', inverse: 0 },

  // Atletas - Grasa corporal femenina (valores más bajos)
  { id: 73, range_id: 1, name: 'female_fat_athlete', min: '12.0', max: '16.0', inverse: 0 },
  { id: 74, range_id: 2, name: 'female_fat_athlete', min: '14.0', max: '18.0', inverse: 0 },
  { id: 75, range_id: 3, name: 'female_fat_athlete', min: '16.0', max: '20.0', inverse: 0 },
  { id: 76, range_id: 4, name: 'female_fat_athlete', min: '18.0', max: '22.0', inverse: 0 },
  { id: 77, range_id: 5, name: 'female_fat_athlete', min: '20.0', max: '24.0', inverse: 0 },
  { id: 78, range_id: 6, name: 'female_fat_athlete', min: '22.0', max: '26.0', inverse: 0 },
];