exports.generateControlCode = function (authorizationnumber, invoicenumber, nitci,
    transactiondate, transactionamount, controlkey) {

    //redondea monto de transaccion 
    transactionamount = roundUp(transactionamount);

    /* ========== PASO 1 ============= */
    invoicenumber = addVerhoeffDigit(invoicenumber, 2);
    nitci = addVerhoeffDigit(nitci, 2);
    transactiondate = addVerhoeffDigit(transactiondate, 2);
    transactionamount = addVerhoeffDigit(transactionamount, 2);
    //se suman todos los valores obtenidos
    var sumOfVariables = Number(invoicenumber)
        + Number(nitci)
        + Number(transactiondate)
        + Number(transactionamount);
    //A la suma total se añade 5 digitos Verhoeff
    var sumOfVariables5Verhoeff = addVerhoeffDigit(sumOfVariables, 5);

    /* ========== PASO 2 ============= */
    var fiveDigitsVerhoeff = sumOfVariables5Verhoeff.substr(sumOfVariables5Verhoeff.length - 5, 5);
    var numbers = fiveDigitsVerhoeff.split("");
    for (i = 0; i < 5; i++) {
        numbers[i] = parseInt(numbers[i]) + 1;
    }

    string1 = controlkey.substr(0, numbers[0]);
    string2 = controlkey.substr(numbers[0], numbers[1]);
    string3 = controlkey.substr(numbers[0] + numbers[1], numbers[2]);
    string4 = controlkey.substr(numbers[0] + numbers[1] + numbers[2], numbers[3]);
    string5 = controlkey.substr(numbers[0] + numbers[1] + numbers[2] + numbers[3], numbers[4]);

    var authorizationnumberDKey = authorizationnumber + string1;
    var invoicenumberdKey = invoicenumber + string2;
    var NITCIDKey = nitci + string3;
    var transactiondateDKey = transactiondate + string4;
    var transactionamountDKey = transactionamount + string5;

    /* ========== PASO 3 ============= */
    //se concatena cadenas de paso 2
    var stringDKey = authorizationnumberDKey.toString() + invoicenumberdKey.toString() +
        NITCIDKey.toString() + transactiondateDKey.toString() + transactionamountDKey.toString();
    //Llave para cifrado + 5 digitos Verhoeff generado en paso 2
    var keyForEncryption = controlkey.toString() + fiveDigitsVerhoeff.toString();
    //se aplica AllegedRC4
    var allegedRC4String = encryptMessageRC4(stringDKey, keyForEncryption, true);

    /* ========== PASO 4 ============= */
    //cadena encriptada en paso 3 se convierte a un Array         
    var chars = allegedRC4String.split("");
    //se suman valores ascii
    var totalAmount = 0;
    var sp1 = 0;
    var sp2 = 0;
    var sp3 = 0;
    var sp4 = 0;
    var sp5 = 0;

    var tmp = 1;
    for (i = 0; i < allegedRC4String.length; i++) {
        totalAmount += chars[i].charCodeAt();//se extrae ascii y se suma
        switch (tmp) {
            case 1: sp1 += chars[i].charCodeAt(); break;
            case 2: sp2 += chars[i].charCodeAt(); break;
            case 3: sp3 += chars[i].charCodeAt(); break;
            case 4: sp4 += chars[i].charCodeAt(); break;
            case 5: sp5 += chars[i].charCodeAt(); break;
        }
        tmp = (tmp < 5) ? tmp + 1 : 1;
    }

    /* ========== PASO 5 ============= */
    //suma total * sumas parciales dividido entre resultados obtenidos 
    //entre el dígito Verhoeff correspondiente más 1 (paso 2)
    var tmp1 = Math.floor(totalAmount * sp1 / numbers[0]);
    var tmp2 = Math.floor(totalAmount * sp2 / numbers[1]);
    var tmp3 = Math.floor(totalAmount * sp3 / numbers[2]);
    var tmp4 = Math.floor(totalAmount * sp4 / numbers[3]);
    var tmp5 = Math.floor(totalAmount * sp5 / numbers[4]);
    //se suman todos los resultados
    var sumProduct = tmp1 + tmp2 + tmp3 + tmp4 + tmp5;
    //se obtiene base64
    var base64SIN = convertBase64(sumProduct);

    /* ========== PASO 6 ============= */
    //Aplicar el AllegedRC4 a la anterior expresión obtenida
    return encryptMessageRC4(base64SIN, controlkey + fiveDigitsVerhoeff);
}


/**
* Añade N digitos Verhoeff a una cadena de texto
* @requires Verhoeff.js
* @param {string} value
* @param {int} max numero de digitos a agregar
* @return {String} cadena original + N digitos Verhoeff
*/
function addVerhoeffDigit(value, max) {
    for (i = 1; i <= max; i++) {
        val = generateVerhoeff(value);
        value += val.toString();
    }
    return value;
}

/**
* Redondea hacia arriba
* @param {String} value cadena con valor numerico de la forma 123 | 123.4 | 123,4
* @return {String} numero redondeado
*/
function roundUp(value) {
    if (Object.prototype.toString.call(value) == "[object Number]") {
        value = String(value);
    }

    var valueformat = value.replace(',', '.');
    //redondea a 0 decimales        
    return Math.round(valueformat);
}

function encryptMessageRC4(message, key, unscripted) {
    var state = new Array(255);
    var x = 0;
    var y = 0;
    var index1 = 0;
    var index2 = 0;
    var nmen = "";
    var messageEncryption = "";

    for (i = 0; i <= 255; i++) {
        state[i] = i;
    }

    for (i = 0; i <= 255; i++) {
        //Index2 = ( ObtieneASCII(key[Index1]) + State[I] + Index2 ) MODULO 256
        index2 = ((key.charAt(index1).charCodeAt()) + state[i] + index2) % 256;
        //IntercambiaValor( State[I], State[Index2] )
        var aux = state[i];
        state[i] = state[index2];
        state[index2] = aux;
        //Index1 = (Index1 + 1) MODULO LargoCadena(Key)
        index1 = (index1 + 1) % key.length;
    }

    //PARA I = 0 HASTA LargoCadena(Mensaje)-1 HACER
    for (i = 0; i < message.length; i++) {
        //X = (X + 1) MODULO 256
        x = (x + 1) % 256;
        //Y = (State[X] + Y) MODULO 256
        y = (state[x] + y) % 256;
        //IntercambiaValor( State[X] , State[Y] )
        var aux = state[x];
        state[x] = state[y];
        state[y] = aux;
        //NMen = ObtieneASCII(Mensaje[I]) XOR State[(State[X] + State[Y]) MODULO 256]
        nmen = ((message.charAt(i)).charCodeAt()) ^ state[(state[x] + state[y]) % 256];
        //MensajeCifrado = MensajeCifrado + "-" + RellenaCero(ConvierteAHexadecimal(NMen))            
        var nmenHex = nmen.toString(16).toUpperCase();
        messageEncryption = messageEncryption + ((unscripted) ? "" : "-") + ((nmenHex.length === 1) ? ('0' + nmenHex) : nmenHex);
    }
    return ((unscripted) ? messageEncryption : messageEncryption.substring(1, messageEncryption.length));

}//encryptMessageRC4:end

function convertBase64(value) {
    var dictionary = new Array(
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
        "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
        "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d",
        "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
        "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
        "y", "z", "+", "/");
    var quotient = 1;
    var word = "";
    var remainder;
    while (quotient > 0) {
        quotient = Math.floor(value / 64);
        remainder = value % 64;
        word = dictionary[remainder] + word;
        value = quotient;
    }
    return word;
}

var d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// permutation table p
var p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

// inverse table inv
var inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

// converts string or number to an array and inverts it
function invArray(array) {

    if (Object.prototype.toString.call(array) == "[object Number]") {
        array = String(array);
    }

    if (Object.prototype.toString.call(array) == "[object String]") {
        array = array.split("").map(Number);
    }

    return array.reverse();
}

// generates checksum
function generateVerhoeff(array) {
    var c = 0;
    var invertedArray = invArray(array);

    for (var i = 0; i < invertedArray.length; i++) {
        c = d[c][p[((i + 1) % 8)][invertedArray[i]]];
    }

    return inv[c];
}

// validates checksum
function validate(array) {
    var c = 0;
    var invertedArray = invArray(array);

    for (var i = 0; i < invertedArray.length; i++) {
        c = d[c][p[(i % 8)][invertedArray[i]]];
    }
    return (c === 0);
}