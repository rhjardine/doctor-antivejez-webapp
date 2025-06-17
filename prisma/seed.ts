// prisma/seed.ts
import
{ PrismaClient } from '@prisma/
const
prisma = new PrismaClient
// Mapeo de los rangos de edad del sistema antiguo (1
14)
const
ageRangeMap =
1 { min_age: 21 , max_age: 28 }, 2 { min_age: 28 , max_age: 35 }, 3 { min_age: 35 , max_age: 42
4 { min_age: 42 , max_age: 49 }, 5 { min_age: 49 , max_age: 56 }, 6 { min_age: 56 , max_age: 63
7 { min_age: 63 , max_age: 70 }, 8 { min_age: 70 , max_age: 77 }, 9 { min_age: 77 , max_age: 84
10 { min_age: 84 , max_age: 91 }, 11 { min_age: 91 , max_age: 98 }, 12 { min_age: 98 , max_age:
105
13 { min_age: 105 , max_age: 112 }, 14 { min_age: 112 , max_age: 120
};
// **TODOS los datos del seeder PHP, transcritos y consolidados en un solo array**
const
oldBaremData =
// Grasa Masculina
{ r: 1 , n: 'male_ fat', min: 10 , max: 14 }, { r: 2 , n: 'male_ fat', min: 14 , max: 18 }, { r: 3 , n: 'male_ fat',
min: 18 , max: 21
{ r: 4 , n: 'male_ fat', min: 21 , max: 24 }, { r: 5 , n: 'male_ fat', min: 24 , max: 27 }, { r: 6 , n: 'male_ fat',
min: 27 , max: 30
{ r: 7 , n: 'male_ fat', min: 30 , max: 33 }, { r: 7 , n: 'male_ fat', min: 7 , max: 9.99 , inv: true }, { r: 8 , n:
'male_ fat', min: 33 , max: 36
{ r: 8 , n: 'male_ fat', min: 6 , max: 7 , inv: true }, { r: 9 , n: 'male_ fat', min: 36 , max: 39 }, { r: 9 , n:
'male_ fat', min: 5 , max: 6 , inv: true
{ r: 10 , n: 'male_ fat', min: 39 , max: 42 }, { r: 10 , n: 'male_ fat', min: 4 , max: 5 , inv: true }, { r: 11 , n:
'male_ fat', min: 42 , max: 45
{ r: 11 , n: 'male_ fat', min: 3 , max: 4 , inv: true }, { r: 12 , n: 'male_ fat', min: 45 , max: 48 }, { r: 12 , n:
'male_ fat', min: 2 , max: 3 , inv: true
{ { r:r: 1313, , n:n: 'male_fat''male_fat', , min:min: 4848, , max:max: 5151 }, { }, { r:r: 1313, , n:n: 'male_fat''male_fat', , min:min: 11, , max:max: 22, , inv:inv: truetrue }, { }, { r:r: 1414, , n:n: 'male_fat''male_fat', , min:min: 5151, , max:max: 5454 },},
{ { r:r: 1414, , n:n: 'male_fat''male_fat', , min:min: 00, , max:max: 11, , inv:inv: truetrue },},
// Grasa Masculina Deportiva// Grasa Masculina Deportiva
{ { r:r: 11, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 11, , max:max: 77 }, { }, { r:r: 22, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 77, , max:max: 1414 }, { }, { r:r: 33, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 1414, , max:max: 1717 },},
{ { r:r: 44, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 1717, , max:max: 2121 }, { }, { r:r: 55, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 2121, , max:max: 2525 }, { }, { r:r: 66, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 2525, , max:max: 2828 },},
{ { r:r: 77, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 2828, , max:max: 3131 }, { }, { r:r: 88, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 3131, , max:max: 3434 }, { }, { r:r: 99, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 3434, , max:max: 3737 },},
{ { r:r: 1010, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 3737, , max:max: 4040 }, { }, { r:r: 1111, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 4040, , max:max: 4343 }, { }, { r:r: 1212, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 4343, , max:max: 4646 },},
{ { r:r: 1313, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 4646, , max:max: 4949 }, { }, { r:r: 1414, , n:n: 'sporty_male_fat''sporty_male_fat', , min:min: 4848, , max:max: 5252 },},
// Grasa Femenina// Grasa Femenina
{ { r:r: 11, , n:n: 'female_fat''female_fat', , min:min: 1818, , max:max: 2222 }, { }, { r:r: 22, , n:n: 'female_fat''female_fat', , min:min: 2222, , max:max: 2626 }, { }, { r:r: 33, , n:n: 'female_fat''female_fat', , min:min: 2626, , max:max: 2929 },},
{ { r:r: 44, , n:n: 'female_fat''female_fat', , min:min: 2929, , max:max: 3232 }, { }, { r:r: 55, , n:n: 'female_fat''female_fat', , min:min: 3232, , max:max: 3535 }, { }, { r:r: 66, , n:n: 'female_fat''female_fat', , min:min: 3535, , max:max: 3838 },},
{ { r:r: 77, , n:n: 'female_fat''female_fat', , min:min: 3838, , max:max: 4141 }, { }, { r:r: 77, , n:n: 'female_fat''female_fat', , min:min: 1515, , max:max: 17.9917.99, , inv:inv: truetrue }, { }, { r:r: 88, , n:n: 'female_fat''female_fat', , min:min: 4141, , max:max: 4444 },},
{ { r:r: 88, , n:n: 'female_fat''female_fat', , min:min: 1414, , max:max: 1515, , inv:inv: truetrue }, { }, { r:r: 99, , n:n: 'female_fat''female_fat', , min:min: 4444, , max:max: 4747 }, { }, { r:r: 99, , n:n: 'female_fat''female_fat', , min:min: 1313, , max:max: 1414, , inv:inv: truetrue },},
{ { r:r: 1010, , n:n: 'female_fat''female_fat', , min:min: 4747, , max:max: 5050 }, { }, { r:r: 1010, , n:n: 'female_fat''female_fat', , min:min: 1212, , max:max: 1313, , inv:inv: truetrue }, { }, { r:r: 1111, , n:n: 'female_fat''female_fat', , min:min: 5050, , max:max: 5353 },},
{ { r:r: 1111, , n:n: 'female_fat''female_fat', , min:min: 1111, , max:max: 1212, , inv:inv: truetrue }, { }, { r:r: 1212, , n:n: 'female_fat''female_fat', , min:min: 5353, , max:max: 5656 }, { }, { r:r: 1212, , n:n: 'female_fat''female_fat', , min:min: 1010, , max:max: 1111, , inv:inv: truetrue },},
{ { r:r: 1313, , n:n: 'female_fat''female_fat', , min:min: 5656, , max:max: 5959 }, { }, { r:r: 1313, , n:n: 'female_fat''female_fat', , min:min: 99, , max:max: 1010, , inv:inv: truetrue }, { }, { r:r: 1414, , n:n: 'female_fat''female_fat', , min:min: 5959, , max:max: 6262 },},
{ { r:r: 1414, , n:n: 'female_fat''female_fat', , min:min: 88, , max:max: 99, , inv:inv: truetrue },},
// Grasa Femenina Deportiva// Grasa Femenina Deportiva
{ { r:r: 11, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 11, , max:max: 99 }, { }, { r:r: 22, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 99, , max:max: 1818 }, { }, { r:r: 33, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 1818, , max:max: 2222 },},
{ { r:r: 44, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 2222, , max:max: 2525 }, { }, { r:r: 55, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 2525, , max:max: 2727 }, { }, { r:r: 66, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 2727, , max:max: 3030 },},
{ { r:r: 77, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 3030, , max:max: 3333 }, { }, { r:r: 88, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 3333, , max:max: 3636 }, { }, { r:r: 99, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 3636, , max:max: 3939 },},
{ { r:r: 1010, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 3939, , max:max: 4242 }, { }, { r:r: 1111, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 4242, , max:max: 4545 }, { }, { r:r: 1212, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 4545, , max:max: 4848 },},
{ { r:r: 1313, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 4848, , max:max: 5151 }, { }, { r:r: 1414, , n:n: 'sporty_female_fat''sporty_female_fat', , min:min: 5151, , max:max: 5454 },},
// Masa Corporal (IMC)// Masa Corporal (IMC)
{ { r:r: 11, , n:n: 'body_mass''body_mass', , min:min: 1818, , max:max: 2222 }, { }, { r:r: 22, , n:n: 'body_mass''body_mass', , min:min: 2222, , max:max: 2525 }, { }, { r:r: 33, , n:n: 'body_mass''body_mass', , min:min: 2525, , max:max: 2727 },},
{ { r:r: 44, , n:n: 'body_mass''body_mass', , min:min: 2727, , max:max: 3030 }, { }, { r:r: 55, , n:n: 'body_mass''body_mass', , min:min: 3030, , max:max: 3333 }, { }, { r:r: 66, , n:n: 'body_mass''body_mass', , min:min: 3333, , max:max: 3636 },},
{ { r:r: 77, , n:n: 'body_mass''body_mass', , min:min: 3636, , max:max: 3939 }, { }, { r:r: 88, , n:n: 'body_mass''body_mass', , min:min: 3939, , max:max: 4242 }, { }, { r:r: 88, , n:n: 'body_mass''body_mass', , min:min: 1616, , max:max: 17.9917.99, , inv:inv: truetrue },},
{ { r:r: 99, , n:n: 'body_mass''body_mass', , min:min: 4242, , max:max: 4545 }, { }, { r:r: 99, , n:n: 'body_mass''body_mass', , min:min: 1515, , max:max: 1616, , inv:inv: truetrue }, { }, { r:r: 1010, , n:n: 'body_mass''body_mass', , min:min: 4545, , max:max: 4848 },},
{ { r:r: 1010, , n:n: 'body_mass''body_mass', , min:min: 1414, , max:max: 1515, , inv:inv: truetrue }, { }, { r:r: 1111, , n:n: 'body_mass''body_mass', , min:min: 4848, , max:max: 5151 }, { }, { r:r: 1111, , n:n: 'body_mass''body_mass', , min:min: 1212, , max:max: 1313, , inv:inv: truetrue },},
{ { r:r: 1212, , n:n: 'body_mass''body_mass', , min:min: 5151, , max:max: 5454 }, { }, { r:r: 1212, , n:n: 'body_mass''body_mass', , min:min: 1111, , max:max: 1212, , inv:inv: truetrue }, { }, { r:r: 1313, , n:n: 'body_mass''body_mass', , min:min: 5454, , max:max: 5757 },},
{ { r:r: 1313, , n:n: 'body_mass''body_mass', , min:min: 1010, , max:max: 1111, , inv:inv: truetrue }, { }, { r:r: 1414, , n:n: 'body_mass''body_mass', , min:min: 5757, , max:max: 6060 }, { }, { r:r: 1414, , n:n: 'body_mass''body_mass', , min:min: 99, , max:max: 1010, , inv:inv: truetrue },},
// Reflejos digitales// Reflejos digitales
{ { r:r: 11, , n:n: 'digital_reflections''digital_reflections', , min:min: 5050, , max:max: 4545 }, { }, { r:r: 22, , n:n: 'digital_reflections''digital_reflections', , min:min: 4545, , max:max: 3535 }, { }, { r:r: 33, , n:n: 'digital_reflections''digital_reflections', , min:min: 3535, , max:max: 3030 },},
{ { r:r: 44, , n:n: 'digital_reflections''digital_reflections', , min:min: 3030, , max:max: 2525 }, { }, { r:r: 55, , n:n: 'digital_reflections''digital_reflections', , min:min: 2525, , max:max: 2020 }, { }, { r:r: 66, , n:n: 'digital_reflections''digital_reflections', , min:min: 2020, , max:max: 1515 },},
{ { r:r: 77, , n:n: 'digital_reflections''digital_reflections', , min:min: 1515, , max:max: 1010 }, { }, { r:r: 88, , n:n: 'digital_reflections''digital_reflections', , min:min: 1010, , max:max: 88 }, { }, { r:r: 99, , n:n: 'digital_reflections''digital_reflections', , min:min: 88, , max:max: 66 },},
{ { r:r: 1010, , n:n: 'digital_reflections''digital_reflections', , min:min: 66, , max:max: 44 }, { }, { r:r: 1111, , n:n: 'digital_reflections''digital_reflections', , min:min: 44, , max:max: 33 }, { }, { r:r: 1212, , n:n: 'digital_reflections''digital_reflections', , min:min: 33, , max:max: 22 },},
{ { r:r: 1313, , n:n: 'digital_reflections''digital_reflections', , min:min: 22, , max:max: 11 }, { }, { r:r: 1414, , n:n: 'digital_reflections''digital_reflections', , min:min: 11, , max:max: 00 },},
// Acomodación Visual// Acomodación Visual
{ { r:r: 11, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 00, , max:max: 1010 }, { }, { r:r: 22, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 1010, , max:max: 1515 }, { }, { r:r: 33, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 1515, , max:max: 1818 },},
{ { r:r: 44, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 1818, , max:max: 2121 }, { }, { r:r: 55, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 2121, , max:max: 2424 }, { }, { r:r: 66, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 2424, , max:max: 2727 },},
{ { r:r: 77, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 2727, , max:max: 3030 }, { }, { r:r: 88, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 3030, , max:max: 3333 }, { }, { r:r: 99, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 3333, , max:max: 3737 },},
{ { r:r: 1010, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 3737, , max:max: 4040 }, { }, { r:r: 1111, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 4040, , max:max: 4343 }, { }, { r:r: 1212, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 4343, , max:max: 4747 },},
{ { r:r: 1313, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 4747, , max:max: 5050 }, { }, { r:r: 1414, , n:n: 'visual_accommodation''visual_accommodation', , min:min: 5050, , max:max: 5353 },},
// Balance Estatico// Balance Estatico
{ { r:r: 11, , n:n: 'static_balance''static_balance', , min:min: 120120, , max:max: 3030 }, { }, { r:r: 22, , n:n: 'static_balance''static_balance', , min:min: 3030, , max:max: 2525 }, { }, { r:r: 33, , n:n: 'static_balance''static_balance', , min:min: 2525, , max:max: 2020 },},
{ { r:r: 44, , n:n: 'static_balance''static_balance', , min:min: 2020, , max:max: 1515 }, { }, { r:r: 55, , n:n: 'static_balance''static_balance', , min:min: 1515, , max:max: 1212 }, { }, { r:r: 66, , n:n: 'static_balance''static_balance', , min:min: 1212, , max:max: 99 },},
{ { r:r: 77, , n:n: 'static_balance''static_balance', , min:min: 99, , max:max: 77 }, { }, { r:r: 88, , n:n: 'static_balance''static_balance', , min:min: 77, , max:max: 66 }, { }, { r:r: 99, , n:n: 'static_balance''static_balance', , min:min: 66, , max:max: 55 },},
{ { r:r: 1010, , n:n: 'static_balance''static_balance', , min:min: 55, , max:max: 44 }, { }, { r:r: 1111, , n:n: 'static_balance''static_balance', , min:min: 44, , max:max: 33 }, { }, { r:r: 1212, , n:n: 'static_balance''static_balance', , min:min: 33, , max:max: 22 },},
{ { r:r: 1313, , n:n: 'static_balance''static_balance', , min:min: 22, , max:max: 11 }, { }, { r:r: 1414, , n:n: 'static_balance''static_balance', , min:min: 11, , max:max: 00 },},
// Hidratación Cutánea// Hidratación Cutánea
{ { r:r: 11, , n:n: 'skin_hydration''skin_hydration', , min:min: 00, , max:max: 11 }, { }, { r:r: 22, , n:n: 'skin_hydration''skin_hydration', , min:min: 11, , max:max: 22 }, { }, { r:r: 33, , n:n: 'skin_hydration''skin_hydration', , min:min: 22, , max:max: 44 },},
{ { r:r: 44, , n:n: 'skin_hydration''skin_hydration', , min:min: 44, , max:max: 88 }, { }, { r:r: 55, , n:n: 'skin_hydration''skin_hydration', , min:min: 88, , max:max: 1616 }, { }, { r:r: 66, , n:n: 'skin_hydration''skin_hydration', , min:min: 1616, , max:max: 3232 },},
{ { r:r: 77, , n:n: 'skin_hydration''skin_hydration', , min:min: 3232, , max:max: 6464 }, { }, { r:r: 88, , n:n: 'skin_hydration''skin_hydration', , min:min: 6464, , max:max: 7474 }, { }, { r:r: 99, , n:n: 'skin_hydration''skin_hydration', , min:min: 7474, , max:max: 8484 },},
{ { r:r: 1010, , n:n: 'skin_hydration''skin_hydration', , min:min: 8484, , max:max: 9494 }, { }, { r:r: 1111, , n:n: 'skin_hydration''skin_hydration', , min:min: 9494, , max:max: 104104 }, { }, { r:r: 1212, , n:n: 'skin_hydration''skin_hydration', , min:min: 104104, , max:max: 108108 },},
{ { r:r: 1313, , n:n: 'skin_hydration''skin_hydration', , min:min: 108108, , max:max: 112112 }, { }, { r:r: 1414, , n:n: 'skin_hydration''skin_hydration', , min:min: 112112, , max:max: 120120 },},
// Tensión Arterial sistólica// Tensión Arterial sistólica
{ { r:r: 11, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 100100, , max:max: 110110 }, { }, { r:r: 22, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 110110, , max:max: 120120 }, { }, { r:r: 33, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 120120, , max:max: 130130 },},
{ { r:r: 33, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 9595, , max:max: 99.9999.99, , inv:inv: truetrue }, { }, { r:r: 44, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 130130, , max:max: 140140 }, { }, { r:r: 44, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 9090, , max:max: 9595, , inv:inv: truetrue },},
{ { r:r: 55, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 140140, , max:max: 150150 }, { }, { r:r: 55, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 8585, , max:max: 9090, , inv:inv: truetrue }, { }, { r:r: 66, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 150150, , max:max: 160160 },},
{ { r:r: 66, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 8080, , max:max: 8585, , inv:inv: truetrue }, { }, { r:r: 77, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 160160, , max:max: 170170 }, { }, { r:r: 77, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 7575, , max:max: 8080, , inv:inv: truetrue },},
{ { r:r: 88, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 170170, , max:max: 180180 }, { }, { r:r: 88, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 7070, , max:max: 7575, , inv:inv: truetrue }, { }, { r:r: 99, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 180180, , max:max: 190190 },},
{ { r:r: 99, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 6565, , max:max: 7070, , inv:inv: truetrue }, { }, { r:r: 1010, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 190190, , max:max: 200200 }, { }, { r:r: 1010, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 6060, , max:max: 6565, , inv:inv: truetrue },},
{ { r:r: 1111, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 200200, , max:max: 210210 }, { }, { r:r: 1111, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 5555, , max:max: 6060, , inv:inv: truetrue }, { }, { r:r: 1212, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 210210, , max:max: 220220 },},
{ { r:r: 1212, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 5050, , max:max: 5555,, inv:inv: truetrue }, { }, { r:r: 1313, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 220220, , max:max: 230230 }, { }, { r:r: 1313, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 4545, , max:max: 5050, , inv:inv: truetrue },},
{ { r:r: 1414, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 230230, , max:max: 240240 }, { }, { r:r: 1414, , n:n: 'systolic_blood_pressure''systolic_blood_pressure', , min:min: 4040,, max:max: 4545, , inv:inv: truetrue },},
// Tensión Arterial Diastolica// Tensión Arterial Diastolica
{ { r:r: 11, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 6060, , max:max: 6565 }, { }, { r:r: 22, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 6565, , max:max: 7070 }, { }, { r:r: 33, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 7070, , max:max: 7575 },},
{ { r:r: 44, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 7575, , max:max: 8080 }, { }, { r:r: 55, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 8080, , max:max: 8585 }, { }, { r:r: 66, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 8585, , max:max: 9090 },},
{ { r:r: 77, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 9090, , max:max: 9595 }, { }, { r:r: 77, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 5757, , max:max: 59.9959.99, , inv:inv: truetrue }, { }, { r:r: 88, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 9595, , max:max: 100100 },},
{ { r:r: 88, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 5353, , max:max: 5757, , inv:inv: truetrue }, { }, { r:r: 99, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 100100, , max:max: 110110 }, { }, { r:r: 99, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 5050, , max:max: 5353, , inv:inv: truetrue },},
{ { r:r: 1010, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 110110, , max:max: 120120 }, { }, { r:r: 1010, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 4747, , max:max: 5050, , inv:inv: truetrue }, { }, { r:r: 1111, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 120120, , max:max: 130130 },},
{ { r:r: 1111, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 4444, , max:max: 4747, , inv:inv: truetrue }, { }, { r:r: 1212, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 130130, , max:max: 140140 }, { }, { r:r: 1212, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 4141, , max:max: 4444, , inv:inv: truetrue },},
{ { r:r: 1313, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 140140, , max:max: 150150 }, { }, { r:r: 1313, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 3838, , max:max: 4141, , inv:inv: truetrue }, { }, { r:r: 1414, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 150150, , max:max: 160160 },},
{ { r:r: 1414, , n:n: 'diastolic_blood_pressure''diastolic_blood_pressure', , min:min: 3535, , max:max: 3838, , inv:inv: truetrue },},
];
];
async
async functionfunction mainmain() {() {
console.log('Iniciando el proceso de "seeding" con datos completos...'Iniciando el proceso de "seeding" con datos completos...');
awaitawait prismaprisma..rangerange..deleteManydeleteMany({});({});
awaitawait prismaprisma..boardboard..deleteManydeleteMany({});({});
consoleconsole..loglog(('' Tablas de baremos limpiadas.'Tablas de baremos limpiadas.'););
consoleconsole..loglog(('' Creando los "Boards" (tipos de test)...'Creando los "Boards" (tipos de test)...'););
constconst boardsToCreateboardsToCreate = [= [
{ { name:name: 'fat''fat', , description:description: '% Grasa Corporal''% Grasa Corporal', , inverse:inverse: falsefalse },},
{ { name:name: 'imc''imc', , description:description: 'Índice de Masa Corporal''Índice de Masa Corporal', , inverse:inverse: falsefalse },},
{ { name:name: 'digital_reflex''digital_reflex', , description:description: 'Reflejos Digitales (ms)''Reflejos Digitales (ms)', , inverse:inverse: truetrue },},
{ { name:name: 'visual_accommodation''visual_accommodation', , description:description: 'Acomodación Visual (cm)''Acomodación Visual (cm)', , inverse:inverse: truetrue },},
{ { name:name: 'static_balance''static_balance', , description:description: 'Balance Estático (segundos)''Balance Estático (segundos)', , inverse:inverse: falsefalse }, }, // Más es // Más es mejor = no inverso en nuestra lógica de interpolaciónmejor = no inverso en nuestra lógica de interpolación
{ { name:name: 'skin_hydration''skin_hydration', , description:description: 'Hidratación Cutánea (seg)''Hidratación Cutánea (seg)', , inverse:inverse: truetrue }, }, // Menos es // Menos es mejor (tiempo de retorno)mejor (tiempo de retorno)
{ { name:name: 'systolic''systolic', , description:description: 'Tensión Arterial Sistólica (mmHg)''Tensión Arterial Sistólica (mmHg)', , inverse:inverse: falsefalse },},
{ { name:name: 'diastolic''diastolic', , description:description: 'Tensión Arterial Diastólica (mmHg)''Tensión Arterial Diastólica (mmHg)', , inverse:inverse: falsefalse },},
];];
awaitawait prismaprisma..boardboard..createManycreateMany({ ({ data:data: boardsToCreateboardsToCreate });});
constconst allBoardsallBoards = = awaitawait prismaprisma..boardboard..findManyfindMany();();
constconst boardIdMapboardIdMap = = newnew MapMap((allBoardsallBoards..mapmap((bb =>=> [[bb..namename, , bb..idid]));]));
consoleconsole..loglog((`` ${${allBoardsallBoards..lengthlength}} Boards creados.`Boards creados.`););
consoleconsole..loglog(('' Preparando y traduciendo los "Ranges" (baremos)...'Preparando y traduciendo los "Ranges" (baremos)...'););
constconst rangesToCreaterangesToCreate = [];= [];
forfor ((constconst oldDataoldData ofof oldBaremDataoldBaremData) {) {
constconst ageRangeageRange = = ageRangeMapageRangeMap[[oldDataoldData..rr];];
ifif (!(!ageRangeageRange) ) continuecontinue;;
letlet boardNameboardName = = '''';;
letlet gendergender = = '''';;
letlet is_athleteis_athlete = = falsefalse;;
ifif ((oldDataoldData..nn..includesincludes(('male''male')) )) gendergender = = 'Masculino''Masculino';;
ifif ((oldDataoldData..nn..includesincludes(('female''female')) )) gendergender = = 'Femenino''Femenino';;
ifif ((oldDataoldData..nn..includesincludes(('sporty''sporty')) )) is_athleteis_athlete = = truetrue;;
// Mapeo del nombre del test al nombre del board// Mapeo del nombre del test al nombre del board
ifif ((oldDataoldData..nn..includesincludes(('fat''fat')) )) boardNameboardName = = 'fat''fat';;
elseelse ifif ((oldDataoldData..nn..includesincludes(('mass''mass')) )) boardNameboardName = = 'imc''imc';;
elseelse ifif ((oldDataoldData..nn..includesincludes(('reflection''reflection')) )) boardNameboardName = = 'digital_reflex''digital_reflex';;
elseelse ifif ((oldDataoldData..nn..includesincludes(('accommodation''accommodation')) )) boardNameboardName = = 'visual_accommodation''visual_accommodation';;
elseelse ifif ((oldDataoldData..nn..includesincludes(('balance''balance')) )) boardNameboardName = = 'static_balance''static_balance';;
elseelse ifif ((oldDataoldData..nn..includesincludes(('hydration''hydration')) )) boardNameboardName = = 'skin_hydration''skin_hydration';;
elseelse ifif ((oldDataoldData..nn..includesincludes(('systolic''systolic')) )) boardNameboardName = = 'systolic''systolic';;
elseelse ifif ((oldDataoldData..nn..includesincludes(('diastolic''diastolic')) )) boardNameboardName = = 'diastolic''diastolic';;
constconst boardIdboardId = = boardIdMapboardIdMap..getget((boardNameboardName););
ifif (!(!boardIdboardId) ) continuecontinue;;
rangesToCreaterangesToCreate..pushpush({({
boardId:boardId: boardIdboardId,,
min_age:min_age: ageRangeageRange..min_agemin_age,,
max_age:max_age: ageRangeageRange..max_agemax_age,,
gendergender,,
is_athleteis_athlete,,
min_value:min_value: NumberNumber((oldDataoldData..minmin),),
max_value:max_value: NumberNumber((oldDataoldData..maxmax),),
bio_age_min:bio_age_min: ageRangeageRange..min_agemin_age,,
bio_age_max:bio_age_max: ageRangeageRange..max_agemax_age,,
});});
}}
awaitawait prismaprisma..rangerange..createManycreateMany({({
data:data: rangesToCreaterangesToCreate,,
});});
consoleconsole..loglog((`` ${${rangesToCreaterangesToCreate..lengthlength}} Ranges creados.`Ranges creados.`););
consoleconsole..loglog(('' ¡Proceso de "seeding" completado exitosamente!'¡Proceso de "seeding" completado exitosamente!'););
}
}
main
main()()
..catchcatch((((ee) ) =>=> {{
consoleconsole..errorerror(('' Error durante el proceso de seeding:'Error durante el proceso de seeding:', , ee););
processprocess..exitexit((11););
})})
..finallyfinally((asyncasync () () =>=> {{
awaitawait prismaprisma..$disconnect$disconnect();();
});});