let input = `   

// semicolons are required after statements and expression statements
// Examples:
// print 'hello world';
// functionCall();

// no semicolons after blocks '{}'
// declare variables with 'declare' for lexically scoped variables
// declare variables with 'global' for globally scoped variables

declare myName = 'Alexander';
declare favFood = 'Pizza';

print 'my name is' + myName + 'and my fav food is' + favFood;



{
  {
    {
      // global myName = 'Peter'; // Error: name already declared in global namespace
      global friendName = "John"; // friendName => 'John' in global namespace
    }
  }
}


// Since variables and functions share the same namespace this is an error

// fn myName() {
//   return 'nothing is here';
// }


// Errors will occur when trying to perform any arithmetic with diff types of operands
// print '2' + 10;
// print 10 / '5';

// cannot divide by zero
// print 10 / 0;

// support for polynomials obviously
print 10 + 5 * 7 + (120 - 60);  //105


// tinyScript supports while loops and for loops with 'while' and 'loop'
// declarations inside of loop initialization are scoped to the body
// the stop keyword can be used to exit the nearest loop
// the continue keyword can be used to immediately start the next loop iteration

// LOOP SYNTAX
// loop(initialization; condition; increment) { body }

// loop with all expressions
// loop(declare i = 0; i < 5; i = i + 1) {
//   print i;
// }


// loop with first two expressions
// loop(declare i = 0; i < 10; ) {
//   print i;
//   i = i + 1;
// }


// loop with only initialization
// loop(declare i = 0; ;) {
//   i = i + 1;
//   if(i == 5) {
//     stop;
//   }
//   print i;
// }


// loop with no expressions
// declare i = 0;
// loop(; ;) {

//   i = i + 1;
//   print i;
//   if(i == 5) {
//     stop;
//   }

// }


// embedded loops
// loop(declare i = 0; i < 5; i = i + 1) {
// print i;
// print 'i';
// declare i = 5;

//   loop(declare k = 0; k < 5; k = k + 1) {
//     print k;
//     print 'k';
//   }

// }


// loop(declare i = 0; i < 5; i = i + 1) {
// print i;
// print 'i';

//   loop(declare k = 0; k < 5; ) {
//     // k = k + 1;
//     print k;
//     print 'k';
//     k = k + 1;
//   }

// }



// embedded while loops

// declare z = 0;
// declare y = 0;

// while(z < 5) {
//   print z;
//   print 'z';
//   z = z + 1;

//   while( y < 5) {
//     print y;
//     print 'y';
//     y = y + 1;
//   }

//   y = 0;
// }



declare a = 'global';

{

  fn showA() {
    print a;
  }

  showA();
  declare a = 'block';
  showA();
}

// global
// block




// declare objTwo = 10;
// declare objThree = true;
// if(objOne < objTwo | objThree) print 100;
// else print 500;
// print 50 / 5;

// fn scope(a) {
//   a = "local";
//   print a;
// }

// scope(5);

// fn makeCounter() {
//   declare i = 0;

//   fn count() {
//     i = i + 7;
//     print i;
//     print o;
//   }

//   declare o = 9;

//   return count;
// }

// makeCounter();

// declare test = makeCounter();
// print test;
print 'before test';
// test();

// global j = 69;
// log('hello world');
// time();

// fn printName(n) {
//   return n;
// }

// no semicolons after blocks

// printName('allen');

// fn count(n) {
//   if (n > 1) count(n - 1);
//   print n;
// }

// count(3);

{ 
  declare blockVar = 'I am blocked';
}

// print count;


// {
//   {
//     {
//       global k = 'I am a global variable';
//       declare peep = 'I am not a global variable';
//       print peep;
//     }
//   }
// }

//   while(objOne < 10) {
//      print objOne;
//      objOne = objOne + 1;
//      if(objOne == 7) {
//       continue;
//      }
//      print 'end of while loop';
//  }


// {

//  loop(declare i = 0; ;) {
//     i = i + 1;
//     if (i == 4) {
//       if (i == 4) {
//         stop;
//       }
//      }
//     print i;
//     // stop;
//     declare test = 50;
//     print test;
//  } 

// }
 
 // print 'printing i outside of loop';
 // print i;

// loop(declare i = 0; i <= 5; ) {
    // i = i + 1;
    // print i;
    // continue;
    // declare test = 50;
    // print test;
// }

// continue;
// if(gfName != myName) return 'they are not equal';
// this is a comment
declare num = 5000;
print num;

  `;

module.exports = { input };