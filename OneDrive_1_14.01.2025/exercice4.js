/**
 * Vous devez coder une fonction fléchée qui retourne l'animal (donc l'objet js)
 * qui a une menace (threat) de 5 unités.
 */

const animals = [
  { name: "frog", threat: 0 },
  { name: "monkey", threat: 5 },
  { name: "gorilla", threat: 8 },
  { name: "lion", threat: 10 },
];
// Solution utilisant le paradigme procédurale
// A VOUS DE COMPLETER ICI
function searchAnimal(animals) {

    for (h = 0;h < 4;h++){
        if (animals[h].threat == 5){
            return animals[h];
        }
    }
    
return null;
}
// Solution utilisant le paradigme fonctionnel
// A VOUS DE COMPLETER ICI
function searchAnimal1(animals){
    return animals
}

console.log(searchAnimal(animals));

// returns object - {name: "monkey", threat: 5}
