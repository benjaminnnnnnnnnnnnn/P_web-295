/**
 * Vous devez constuire un tableau contenant tous les jours où la temperature est >= à 35 degrés
 */

const weatherData = [
  { date: '01-01-2021', temperature: 30 },
  { date: '01-02-2021', temperature: 35 },
  { date: '01-03-2021', temperature: 40 },
  { date: '01-04-2021', temperature: 38 },
];

hotDays = [];
// Solution utilisant le paradigme procédurale
// A VOUS DE COMPLETER ICI

for (h = 0; h < weatherData.length; h++) {
  if (weatherData[h].temperature >= 35) {
    hotDays[h] = weatherData[h];
  }
}

// Solution utilisant le paradigme fonctionnel
// A VOUS DE COMPLETER ICI

console.log(`Les jours de canicules sont : ${hotDays.map(day => day.date)}`);
// Les jours de canicules sont : 01-02-2021,01-03-2021,01-04-2021
