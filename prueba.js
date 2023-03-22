let num = "234.575akdh.83u";

if(!isNaN(num)){
    console.log('Si es numero');
}else{
    console.log('No es numero');
}

//isNaN me devuelve 'true' si no es un numero


function esEntero(cadena){
    return /^\d+$/.test(cadena);
}