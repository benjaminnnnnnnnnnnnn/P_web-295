/**
 * A l'aide de l'opération de déconstruction `spread`, vous devez
 * créer l'objet javascript : { id: 12, name: 'monkey', threat: 5, food: 'banana' }
 */

const information_part1 = { name: "monkey", threat: 5 };

const information_part2 = { id: 12, food: "banana" };

/*
Pour plus d'information sur l'opérateur spread
https://herewecode.io/fr/blog/operateur-spread-javascript/
*/
const monkey = {
   ...information_part1,
   ...information_part2
};

console.log(monkey);
// doit afficher exactement cela
// { id: 12, name: 'monkey', threat: 5, food: 'banana' }
