function Triangulo(a, b, c) {
    if (!(a instanceof Ponto) ||
	!(b instanceof Ponto) ||
	!(c instanceof Ponto)) {
	console.log('a: ' + JSON.stringify(a) + '\n' +
		    'b: ' + JSON.stringify(b) + '\n' +
		    'c: ' + JSON.stringify(c));
	throw 'Não são pontos';
    }
    const ab = a.menos(b);
    const ac = a.menos(c);
    const bc = b.menos(c);

    if ((ab.norma + ac.norma <= bc.norma) ||
	(ab.norma + bc.norma <= ac.norma) ||
	(ac.norma + bc.norma <= ab.norma)) {
	console.log('a: ' + JSON.stringify(a) + '\n' +
		    'b: ' + JSON.stringify(b) + '\n' +
		    'c: ' + JSON.stringify(c));
	console.log('ab: ' + ab.norma + '\n' +
		    'ac: ' + ac.norma + '\n' +
		    'bc: ' + bc.norma);
	
	throw 'Pontos não formam um triângulo:\n' +
	    'ab: ' + ab.norma + '\n' +
	    'ac: ' + ac.norma + '\n' +
	    'bc: ' + bc.norma;
    }
    
    this.a = a;
    this.b = b;
    this.c = c;
    // não sei a necessidade de ter o comprimento dos lados ainda
}
