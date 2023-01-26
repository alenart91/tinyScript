
// let input = `function myfn() {
//     // this is a comment
//     let a = 90;
//     let mystring = "alex";
//     if(myString == undefined) {
//         return 'string is not defined';
//     } else {
//         return a;
//     }
// }`;

let inputTwo = `routine name<> { }`;

let inputThree = `function myfn() {
    let a = 'my string';
    // this variable is a string
}`;


// let input = `1 + 2 * 3`;

let input = `5 + 3 + 8 * 1`;


module.exports = { input };







// {
//   type: 'AssignmentExpression',
//   operator: '=',
  
//   left: {
//     type: 'Identifier',
//     name: 'x'
//   },

//   right: {
//     type: 'BinaryExpression',

//     left: {
//       type: 'Literal',
//       value: 1
//     },

//     operator: '+',

//     right: {
//       type: 'BinaryExpression',

//       left: {
//         type: 'Literal',
//         value: 2
//       },

//       operator: '*',

//       right: {
//         type: 'Literal',
//         value: 3
//       }
//     }
//   }
// }