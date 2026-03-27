/* Project Standarts:
- Logging standarts
- Naming standarts:
  - function, method, variable => camelCase
  - class, enum => PascalCase
  - folder, file => kebab-case
  - css => snake_case
- Error handling
*/

/* Request:
  Traditional API
  Rest API
  GraphQL API
  ...
*/

/* Frontend Development:
  Traditional FD => SSR => EJS
  Modern FD => SPA => REACT / VUE / ANGULAR
*/

/* Cookies
  request join
  self destroy
*/

/* Validation:
  Frontend validation
  Backend validation
  Database validation
*/



// -----------> MIT TASKS:
// TASK-ZH:
// Shunday function yozing, u berilgan array parametrni ichidagi eng katta raqamgacha tushib qolgan raqamlarni bir arrayda qaytarsin. 
// MASALAN: findDisappearedNumbers([1, 3, 4, 7]) return [2, 5, 6]

function findDisappearedNumbers(arr: number[]): number[] {
  let max = Math.max(...arr);
  let result: number[] = [];
  for (let i = 1; i <= max; i++) {
    if (!arr.includes(i)) {
      result.push(i);
    }
  }
  return result;
}
console.log(findDisappearedNumbers([1, 3, 4, 7]));


// TASK-ZG:
// Shunday function yozing, u berilgan string parametrni snake casega otkazib qaytarsin. 
// MASALAN: capitalizeWords('name should be a string') return 'name_should_be_a_string'

// function toSnakeCase(str: string): string {
//   return str.split(" ").join("_");
// }
// console.log(toSnakeCase("name should be a string"));

// TASK-ZF:
// Shunday function yozing, uni string parametri bolsin. String ichidagi har bir sozni bosh harflarini katta harf qilib qaytarsin lekin 1 yoki 2 harfdan iborat sozlarni esa oz holicha qoldirsin.
// MASALAN: capitalizeWords('name should be a string') return 'Name Should be a String'

// function capitalizeWords(str: string): string {
//   let words = str.split(" ");
//   let result = [];
//   for (let word of words) {
//     if (word.length > 2) {
//       result.push(word[0].toUpperCase() + word.slice(1));
//     } else {
//       result.push(word);
//     }
//   }
//   return result.join(" ");
// }
// console.log(capitalizeWords("name should be a string"));

// TASK ZE:
// Shunday function yozing, uni  string parametri bolsin. String ichida takrorlangan harflarni olib tashlab qolganini qaytarsin
// MASALAN: removeDuplicate('stringg') return 'string'

// function removeDuplicate(str: string): string {
//   let result: string = "";
//   for (let i = 0; i < str.length; i++) {
//     if (!result.includes(str[i])) {
//       result += str[i];
//     }
//   }
//   return result;
// }
// console.log(removeDuplicate('stringg'));
// console.log(removeDuplicate('mississippi')); 



// TASK ZD
// Shunday function yozing. Bu function o'ziga, parametr sifatida
// birinchi oddiy number, keyin yagona array va uchinchi bo'lib oddiy number
// qabul qilsin. Berilgan birinchi number parametr, arrayning tarkibida indeks bo'yicha hisoblanib,
// shu aniqlangan indeksni uchinchi number parametr bilan alashtirib, natija sifatida
// yangilangan arrayni qaytarsin.
// MASALAN: changeNumberInArray(1, [1,3,7,2], 2) return [1,2,7,2];
// Yuqoridagi misolda, birinchi raqam bu '1' va arrayning '1'chi indeksi bu 3.
// Bizning function uchinchi berilgan '2' raqamini shu '3' bilan almashtirib,
// yangilangan arrayni qaytarmoqda.

// function changeNumberInArray(index: number, arr: number[], newValue: number): number[] {
//   if (index >= 0 && index < arr.length) {
//     arr[index] = newValue;}
//   return arr;
// }
// console.log(changeNumberInArray(1, [1, 3, 7, 2], 2));


// TASK ZC
// Selisy (°C) shkalasi bo'yicha raqam qabul qilib, uni
// Ferenhayt (°F) shkalisaga o'zgaritib beradigan function yozing.
// MASALAN: celsiusToFahrenheit(0) return 32;
// MASALAN: celsiusToFahrenheit(10) return 50;
// Yuqoridagi misolda, 0°C, 32°F'ga teng.
// Yoki 10 gradus Selsiy, 50 Farenhaytga teng.
// °C va °F => Tempraturani o'lchashda ishlatiladigan o'lchov birligi.

// function celsiusToFahrenheit(celsius: number): number {
//   return (celsius * 9) / 5 + 32;
// }
// console.log(celsiusToFahrenheit(0));
// console.log(celsiusToFahrenheit(10));


// TASK-ZB:
// Shunday function yozing, uni 2 ta number parametri bolsin va berilgan sonlar orasidan random raqam return qilsin
// MASALAN: randomBetween(30, 50) return 45

// function randomBetween(a: number, b: number): number {
//   return Math.floor(Math.random() * (b - a)) + a;
// }
// console.log(randomBetween(30, 50));


// TASK Z
// Shunday function yozing. Bu function sonlardan iborat array
// qabul qilsin. Function'ning vazifasi array tarkibidagi juft
// sonlarni topib ularni yig'disini qaytarsin.
// MASALAN:
// sumEvens([1, 2, 3]); return 2;
// sumEvens([1, 2, 3, 2]); return 4;
// Yuqoridagi misolda, bizning funktsiya
// berilayotgan array tarkibidagi sonlar ichidan faqatgina juft bo'lgan
// sonlarni topib, ularni hisoblab yig'indisini qaytarmoqda.


// function sumEvens(arr: number[]): number {
//   let sum = 0;
//   for (let num of arr) {
//     if (num % 2 === 0) {
//       sum += num;
//     }
//   }
//   return sum;
// }
// console.log(sumEvens([1,2,3])); 
// console.log(sumEvens([1,2,3,2]));


// TASK Y
// Shunday function yozing, uni 2'ta array parametri bo'lsin.
// Bu function ikkala arrayda ham ishtirok etgan bir xil
// qiymatlarni yagona arrayga joylab qaytarsin.
// MASALAN: findIntersection([1,2,3], [3,2,0]) return [2,3]
// Yuqoridagi misolda, argument sifatida berilayotgan array'larda
// o'xshash sonlar mavjud. Function'ning vazifasi esa ana shu
// ikkala array'da ishtirok etgan o'xshash sonlarni yagona arrayga
// joylab return qilmoqda.

// function findIntersection(arr1: number[], arr2: number[]): number[] {
//   // Natijani saqlash uchun bo'sh array
//   const result: number[] = [];
//   // Birinchi array bo'ylab yuramiz
//   for (let i: number = 0; i < arr1.length; i++) {
//     // Ikkinchi array bo'ylab yuramiz
//     for (let j: number = 0; j < arr2.length; j++) {
//       // Agar qiymatlar teng bo'lsa
//       if (arr1[i] === arr2[j]) {
//         // Agar result ichida hali mavjud bo'lmasa
//         if (!result.includes(arr1[i])) {
//           // result arrayga qo'shamiz
//           result.push(arr1[i]);
//         }
//       }
//     }
//   }
//   // Oxirida natijani qaytaramiz
//   return result;
// }
// console.log(findIntersection([1, 2, 3], [3, 2, 0]));

// TASK X
// Shunday function yozing, uni object va string parametrlari bo'lsin.
// Bu function, birinchi object parametri tarkibida, kalit sifatida ikkinchi string parametri
// necha marotaba takrorlanganlini sanab qaytarsin.
// Eslatma => Nested object'lar ham sanalsin
// MASALAN: countOccurrences({model: 'Bugatti', steer: {model: 'HANKOOK', size: 30}}, 'model') return 2
// Yuqoridagi misolda, birinchi argument object, ikkinchi argument 'model'.
// Funktsiya, shu ikkinchi argument 'model', birinchi argument object
// tarkibida kalit sifatida 2 marotaba takrorlanganligi uchun 2 soni return qilmoqda

// function countOccurrences(obj: unknown, key: string): number {
//   // null yoki object bo'lmasa => ichiga kira olmaymiz
//   if (obj === null || typeof obj !== "object") return 0;
//   let count = 0;
//   // Array ham object hisoblanadi, shuning uchun uni ham yurib chiqamiz
//   if (Array.isArray(obj)) {
//     for (const item of obj) {
//       count += countOccurrences(item, key);
//     }
//     return count;
//   }
//   // Oddiy object
//   const record = obj as Record<string, unknown>;
//   for (const k in record) {
//     if (Object.prototype.hasOwnProperty.call(record, k)) {
//       if (k === key) count++;
//       // nested object bo'lsa ichiga kirib ketamiz
//       count += countOccurrences(record[k], key);
//     }
//   }
//   return count;
// }
// console.log(
//   countOccurrences(
//     { model: "Bugatti", steer: { model: "HANKOOK", size: 30 } },
//     "model"
//   )
// );

// TASK W
// Shunday function yozing, u o'ziga parametr sifatida
// yagona array va number qabul qilsin. Siz tuzgan function
// arrayni numberda berilgan uzunlikda kesib bo'laklarga
// ajratgan holatida qaytarsin.
// MASALAN: chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
// return [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];
// Yuqoridagi namunada berilayotgan array ikkinchi parametr 3'ga
// asoslanib 3 bo'lakga bo'linib qaytmoqda. Qolgani esa o'z holati qolyapti

// function chunkArray(arr: number[], size: number): number[][] {
//   const result: number[][] = [];
//   let temp: number[] = [];

//   for (let i = 0; i < arr.length; i++) {
//     temp.push(arr[i]);

//     if (temp.length === size) {
//       result.push(temp);
//       temp = [];
//     }
//   }
//   // Agar oxirida qolgan elementlar bo‘lsa
//   if (temp.length > 0) {
//     result.push(temp);
//   }
//   return result;
// }
// console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3));

// TASK V
// Shunday function yozing, uni string parametri bo'lsin.
// Va bu function stringdagi har bir harfni o'zi bilan
// necha marotaba taktorlanganligini ko'rsatuvchi object qaytarsin.
// MASALAN: countChars("hello") return {h: 1, e: 1, l: 2, o: 1}
// Yuqoridagi misolda, 'hello' so'zi tarkibida
// qatnashgan harflar necha marotaba takrorlangini bilan
// object sifatida qaytarilmoqda.

// function countChars(str: string): { [key: string]: number } {
//   const result: { [key: string]: number } = {};
//   for (let char of str) {
//     if (result[char]) {
//       result[char]++;
//     } else {
//       result[char] = 1;
//     }
//   }
//   return result;
// }
// console.log(countChars("hello"));

// TASK U
// Shunday function tuzing, uni number parametri bo'lsin.
// Va bu function berilgan parametrgacha, 0'dan boshlab
// oraliqda nechta toq sonlar borligini aniqlab return qilsi.
// MASALAN: sumOdds(9) return 4; sumOdds(11) return 5;
// Yuqoridagi birinchi misolda, argument sifatida, 9 berilmoqda.
// Va 0'dan boshlab sanaganda 9'gacha 4'ta toq son mavjud.
// Keyingi namunada ham xuddi shunday xolat takrorlanmoqda.

// function sumOdds(n: number):number {
//   let count = 0;
//   for (let i = 0; i < n; i++) {
//     if (i % 2 !== 0) {
//       count++;
//     }
//   }
//   return count;
// }
// console.log(sumOdds(9));
// console.log(sumOdds(11));

// TASK T=
// Shunday function tuzing, u sonlardan tashkil topgan 2'ta array qabul qilsin.
// Va ikkala arraydagi sonlarni tartiblab bir arrayda qaytarsin.
// MASALAN: mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]); return [0, 3, 4, 4, 6, 30, 31];
// Yuqoridagi misolda, ikkala arrayni birlashtirib, tartib raqam bo'yicha tartiblab qaytarmoqda.

// function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
//   let result: number[] = [];
//   // 1-array elementlarini qo'shamiz
//   for (let i = 0; i < arr1.length; i++) {
//     result.push(arr1[i]);
//   }
//   // 2-array elementlarini qo'shamiz
//   for (let i = 0; i < arr2.length; i++) {
//     result.push(arr2[i]);
//   }
//   // Tartiblaymiz
//   result.sort((a, b) => a - b);
//   return result;
// }
// console.log(mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]));
// // [0, 3, 4, 4, 6, 30, 31]

// TASK-S:
// Shunday function yozing, u numberlardan tashkil topgan array qabul qilsin va osha numberlar orasidagi tushib qolgan sonni topib uni return qilsin. MASALAN: missingNumber([3, 0, 1]) return 2

// function missingNumber(arr: number[]): number {
//   arr.sort((a, b) => a - b);
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] !== i) {
//       return i;
//     }
//   }
//   return arr.length;
// }
// console.log(missingNumber([3, 0, 1]));

// TASK R
// Shunday function yozing, u string parametrga ega bo'lsin.
// Agar argument sifatida berilayotgan string, "1 + 2" bo'lsa,
// string ichidagi sonlarin yig'indisni hisoblab, number holatida qaytarsin
// MASALAN: calculate("1 + 3"); return 4;
// 1 + 3 = 4, shu sababli 4 natijani qaytarmoqda.

// function calculate(str: string): number {
//   const parts = str.split(" + ");
//   const num1 = Number(parts[0]);
//   const num2 = Number(parts[1]);
//   return num1 + num2;
// }
// console.log(calculate("1 + 3"));

// TASK Q:
// Shunday function yozing, u 2 ta parametrga ega bo'lib
// birinchisi object, ikkinchisi string bo'lsin.
// Agar qabul qilinayotgan ikkinchi string, objectning
// biror bir propertysiga mos kelsa, 'true', aks holda mos kelmasa 'false' qaytarsin.
// MASALAN: hasProperty({ name: "BMW", model: "M3" }, "model"); return true;
// Ushbu misolda, 'model' string, objectning propertysiga mos kelganligi uchun 'true' natijani qaytarmoqda

// function hasProperty(obj: any, key: string): boolean {
//   for (let prop in obj) {
//     if (prop === key) {
//       return true;
//     }
//   }
//   return false;
// }
// console.log(hasProperty({ name: "BMW", model: "M3" }, "model"));

// TASK P:
// Parametr sifatida yagona object qabul qiladigan function yozing. Qabul qilingan objectni nested array sifatida convert qilib qaytarsin. MASALAN: objectToAray( {a: 10, b: 20}) return [['a', 10], ['b', 20]]

// function objectToArray(obj: Record<string, any>): [string, any][] {
//   let result: [string, any][] = [];
//   for (let key in obj) {
//     result.push([key, obj[key]]);
//   }
//   return result;
// }
// console.log(objectToArray({ a: 10, b: 20 }));

// TASK O:
// Shunday function yozing va u har xil qiymatlardan iborat array qabul qilsin. Va array ichidagi sonlar yig'indisini hisoblab chiqgan javobni qaytarsin. MASALAN: calculateSumOfNumbers([10, "10", {son: 10}, true, 35]); return 45. Yuqoridagi misolda array tarkibida faqatgina ikkita yagona son mavjud bular 10 hamda 35. Qolganlari nested bo'lib yoki type'lari number emas.

// function calculateSum(arr: unknown[]): number {
//   let sum = 0;
//   for (const item of arr) {
//     if (item === Number(item)) {
//       sum += item as number;
//     }
//   }
//   return sum;
// }
// const result = calculateSum([10, "10", { son: 10 }, true, 35]);
// console.log("Sum:", result)

// TASK N:
// Shunday function yozing, u string qabul qilsin va string palindrom yani togri oqilganda ham, orqasidan oqilganda ham bir hil oqiladigan soz ekanligini aniqlab boolean qiymat qaytarsin. MASALAN: palindromCheck("dad") return true;  palindromCheck("son") return false;

// function palindromCheck(word: string): boolean {
//   let reversed = word.split("").reverse().join("");

//   if (word === reversed) {

//     return true;
//   } else {
//     return false;
//   }
// }
// console.log(palindromCheck("dad"));
// console.log(palindromCheck("son"));

// TASK M:
// Shunday function yozing, u raqamlardan tashkil topgan array qabul qilsin va array ichidagi har bir raqam uchun raqamni ozi va hamda osha raqamni kvadratidan tashkil topgan object hosil qilib, hosil bolgan objectlarni array ichida qaytarsin.MASALAN: getSquareNumbers([1, 2, 3]) return [{number: 1, square: 1}, {number: 2, square: 4}, {number: 3, square: 9}];

// function getSquareNumbers(arr: number[]): {number: number, square: number}[] {
//   // 1. Natijani saqlash uchun bo‘sh array
//   let result = [];
//   // 2. Array ichidan bitta-bitta raqam olish
//   for (let i = 0; i < arr.length; i++) {
//     // 3. Har bir raqam uchun object yaratish
//     let obj = {
//       number: arr[i],           // raqamning o‘zi
//       square: arr[i] * arr[i]   // raqamning kvadrati
//     };
//     // 4. Object’ni result arrayga qo‘shish
//     result.push(obj);
//   }
//   // 5. Hosil bo‘lgan arrayni qaytarish
//   return result;
// }
// console.log(getSquareNumbers([1, 2, 3]));
// console.log(getSquareNumbers([4, 5, 6]));

// TASK L:
// Shunday function yozing, u string qabul qilsin va string ichidagi hamma sozlarni chappasiga yozib va sozlar ketma-ketligini buzmasdan stringni qaytarsin. MASALAN: reverseSentence("we like coding!") return "ew ekil gnidoc";

// function reverseSentence(str: string): string {
//   let words = str.split(" ");
//   let result = [];
//   for (let i = 0; i < words.length; i++) {
//     let reversedWord = "";
//     let word = words[i];
//     for (let j = word.length - 1; j >= 0; j--) {
//       reversedWord += word[j];
//     }
//     result.push(reversedWord);
//   }
//   return result.join(" ");
// }
// console.log(reverseSentence("we like coding!"));

// Task K:
// Shunday function yozing, u string qabul qilsin va string ichidagi unli harflar sonini qaytarsin.
// MASALAN: countVowels("string") return 1;

// function countVowels(str: string): number {
//   let count = 0;
//   const vowels = "aeiouAEIOU";
//   for (let ch of str) {
//     if (vowels.includes(ch)) {
//       count++;
//     }
//   }
//   return count;
// }
// console.log(countVowels("string"));
// console.log(countVowels("Uzbekistan"));

// TASK J:
// Shunday function tuzing, u string qabul qilsin.
// Va string ichidagi eng uzun so'zni qaytarsin. MASALAN: findLongestWord("I came from Uzbekistan!"); return "Uzbekistan!". Yuqoridagi text tarkibida 'Uzbekistan'
// eng uzun so'z bo'lganligi uchun 'Uzbekistan'ni qaytarmoqda

// function findLongestWord(str: string): string {
//   let words = str.split(" ");
//   let longest = "";

//   for (let word of words) {
//     if (word.length > longest.length) {
//       longest = word;
//     }
//   }

//   return longest;
// }
// console.log(findLongestWord("I came from Uzbekistan!"));

// TASK-I:
// Shunday function tuzing, u parametrdagi array ichida eng ko'p
// takrorlangan raqamni topib qaytarsin. MASALAN: majorityElement([1, 2, 3, 4, 5, 4, 3, 4]); return 4. Yuqoridag misolda argument sifatida kiritilayotgan array tarkibida 4 soni ko'p takrorlanganligi uchun 4'ni return qilmoqda.

// function majorityElement(arr: number[]): number {
//   let maxCount = 0;
//   let result = arr[0];
//   for (let i = 0; i < arr.length; i++) {
//     let count = 0;
//     for (let j = 0; j < arr.length; j++) {
//       if (arr[i] === arr[j]) {
//         count++;
//       }
//     }
//     if (count > maxCount) {
//       maxCount = count;
//       result = arr[i];
//     }
//   }
//   return result;
// }
// console.log(majorityElement([1, 2, 3, 4, 5, 4, 3, 4]));
// console.log(majorityElement([7, 8, 7, 9, 7, 10, 8, 7]));

// TASK H2:
// Shunday function tuzing, unga string argument pass bolsin. Function ushbu agrumentdagi digitlarni yangi stringda return qilsin. MASALAN: getDigits("m14i1t") return qiladi "141"
// function getDigits(str: string): string {
//   let a: string = "";

//   for (let i of str) {
//     if (i >= "0" && i <= "9") {
//       a += i;
//     }
//   }
//   return a;
// }
// console.log(getDigits("m14i1t"));
// console.log(getDigits("a98fbhw24gjj6bh1"));

// TASK H:
// shunday function tuzing, u integerlardan iborat arrayni argument sifatida qabul qilib, faqat positive qiymatlarni olib string holatda return qilsin. MASALAN: getPositive([1, -4, 2]) return qiladi "12"

// function getPositive(arr: number[]):string {
//     let result:string = "";

//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i] > 0) {
//             result = result + String(arr[i]);
//         }
//     }

//     return result;
// }

// console.log(getPositive([1, -4, 2]));
// console.log(getPositive([3, -4, 5, 7, -9]));

// ========================================================

// TASK G:
// Yagona parametrga ega function tuzing.
// Va bu function parametr orqalik integer ma'lumot turlariga ega bo'lgan bir arrayni qabul qilsin.
// Ushbu function bizga arrayning tarkibidagi birinchi eng katta qiymatning indeksini qaytarsin.
// MASALAN: getHighestIndex([5, 21, 12, 21 ,8]); return qiladi 1 sonini
// Yuqoridagi misolda, birinchi indeksda 21 joylashgan.
// Va bu 21 soni arrayning tarkibidagi birinchi eng katta son hisobladi va bizga uning indeksi 1 qaytadi.

// function getHighestIndex(arr) {
//     let max = arr[0];
//     let maxIndex = 0;

//     for (let i = 1; i < arr.length; i++) {
//         if (arr[i] > max) {
//             max = arr[i];
//             maxIndex = i;
//         }
//     }

//     return maxIndex;
// }
// console.log(getHighestIndex([5, 21, 12, 21, 8]));
// console.log(getHighestIndex([3, 7, 2, 1]));

// ========================================================

// TASK F:
// Yagona string argumentga ega findDoublers nomli function tuzing
// Agar stringda bittadan ortiq bir xil harflar ishtirok etgan bo'lsa
// true yokida false natija qaytarsin. MASALAN: findDoublers("hello"); natija true qaytadi. Sababi ikki marotaba takrorlangan 'll' harfi mavjud!

// function findDoublers(str) {
//     for (let i = 0; i < str.length; i++) {
//         for (let j = i + 1; j < str.length; j++) {
//             if (str[i] === str[j]) {
//                 return true;
//             }
//         }
//     }
//     return false;
// }
// console.log(findDoublers("hello"));
// console.log(findDoublers("abc"));
// console.log(findDoublers("apple"));
// console.log(findDoublers("world"));

// ========================================================

// TASK E:
// Shunday function tuzing, u bitta string argumentni qabul qilib osha stringni teskari qilib return qilsin.
// MASALAN: getReverse("hello") return qilsin "olleh"

// function getReverse(str) {
//     return str.split("").reverse().join("");
// }
// console.log(getReverse("play"));
// console.log(getReverse("maker"));

// ========================================================

// TASK-D
// Shunday function tuzing, u 2ta string parametr ega bolsin, hamda agar har ikkala string bir hil harflardan iborat bolsa true aks holda false qaytarsin. MASALAN checkContent("mitgroup", "gmtiprou") return qiladi true;

// function checkContent(str1, str2) {
//     // Uzunlikni tekshiramiz
//     if (str1.length !== str2.length) {
//         return false;
//     }
//     // Harflarni tartiblash
//     let sorted1 = str1.split('').sort().join('');
//     let sorted2 = str2.split('').sort().join('');
//     // Taqqoslash
//     return sorted1 === sorted2;
// }
// console.log(checkContent("mitgroup", "gmtiprou"));
// console.log(checkContent("hello", "ollhe"));
// console.log(checkContent("hello", "helloo"));
// console.log(checkContent("abc", "abd"));

// ========================================================

// // Task-C
// //Shunday class tuzing tuzing nomi Shop, va uni constructoriga 3 hil mahsulot pass bolsin, hamda classning 3ta methodi bolsin, biri qoldiq, biri sotish va biri qabul. Har bir method ishga tushgan vaqt ham log qilinsin. MASALAN: const shop = new Shop(4, 5, 2); shop.qoldiq() return hozir 20:40da 4ta non, 5ta lagmon va 2ta cola mavjud! shop.sotish('non', 3) & shop.qabul('cola', 4) & shop.qoldiq() return hozir 20:50da 1ta non, 5ta lagmon va 6ta cola mavjud!

// class Shop {
//   // Do‘kon ochilganda boshlang‘ich mahsulotlar
//   constructor(non, lagmon, cola) {
//     this.non = non;
//     this.lagmon = lagmon;
//     this.cola = cola;
//   }
//   // Hozirgi vaqtni olish
//   getTime() {
//     const now = new Date();
//     return now.getHours() + ":" + now.getMinutes();
//   }
//   // Qoldiqni ko‘rsatish
//   qoldiq() {
//     console.log(
//       "Hozir " + this.getTime() + "da " +
//       this.non + "ta non, " +
//       this.lagmon + "ta lagmon va " +
//       this.cola + "ta cola mavjud!"
//     );
//   }
//   // Mahsulot sotish
//   sotish(mahsulot, son) {
//     if (mahsulot === "non") {
//       this.non = this.non - son;
//     }
//     if (mahsulot === "lagmon") {
//       this.lagmon = this.lagmon - son;
//     }
//     if (mahsulot === "cola") {
//       this.cola = this.cola - son;
//     }
//     console.log(this.getTime() + "da " + son + "ta " + mahsulot + " sotildi");
//   }
//   // Mahsulot qabul qilish
//   qabul(mahsulot, son) {
//     if (mahsulot === "non") {
//       this.non = this.non + son;
//     }
//     if (mahsulot === "lagmon") {
//       this.lagmon = this.lagmon + son;
//     }
//     if (mahsulot === "cola") {
//       this.cola = this.cola + son;
//     }
//     console.log(this.getTime() + "da " + son + "ta " + mahsulot + " qabul qilindi");
//   }
// }

// const shop = new Shop(4, 5, 2);

// shop.qoldiq();          // Hozirgi qoldiq
// shop.sotish("non", 3);  // 3 ta non sotildi
// shop.qabul("cola", 4);  // 4 ta cola qabul qilindi
// shop.qoldiq();          // Yangi qoldiq

// ========================================================

// Task-B
///Shunday function tuzing, u 1ta string parametrga ega bolsin, hamda osha stringda qatnashgan raqamlarni sonini bizga return qilsin. MASALAN countDigits("ad2a54y79wet0sfgb9") 7ni return qiladi.

// function countDigits(str) {
//   let count = 0;
//   for (let i = 0; i < str.length; i++) {
//     if (!isNaN(str[i]) && str[i] !== ' ') {
//       count++;
//     }
//   }
//   return count;
// }
// console.log(countDigits("ad2a54y79we3t0sfgb9"));

// ========================================================

// Task-A
//Shunday 2 parametrli function tuzing, hamda birinchi parametrdagi letterni ikkinchi parametrdagi sozdan qatnashga sonini return qilishi kerak boladi.MASALAN countLetter("e", "engineer") 3ni return qiladi.
// function countLetter(letter, word) {
//   let count = 0;
//   for (let i = 0; i < word.length; i++) {
//     if (word[i] === letter) {
//       count++;
//     }
//   }
//   return count;
// }
// console.log(countLetter('e', 'engineer'));
// console.log(countLetter('n', 'banana'));
