function Leitor(str) {
    if (typeof str !== 'string' || !(str instanceof String)) {
	this.str = str;
	this.contador = 0;
    } else {
	errormsg = 'str não é string. ' + typeof str;
	throw errormsg
    }
}

Leitor.prototype.proximaPalavra = function() {
    while (this.contador < this.str.length &&
	   (this.str[this.contador] === ' ' ||
	    this.str[this.contador] === '\n')) {
	this.contador++;
    }
    if (this.contador == this.str.length) {
	throw 'Nenhuma palavra foi encontrada';
    }
    r = '';
    for (; this.contador < this.str.length; this.contador++) {
	if (this.str[this.contador] === ' ' ||
	    this.str[this.contador] === '\n') {
	    break;
	}
	r = r + this.str[this.contador];
    }
    this.contador = this.contador;
    return r;
}

// ignora todas as palavras até encontrar um inteiro ou percorrer toda a string
Leitor.prototype.proximoInt = function() {
    r = null;
    try {
	r = parseInt(this.proximaPalavra())
	while (isNaN(r)) {
	    r = parseInt(this.proximaPalavra());
	}
    } catch(err) {
	throw 'Nenhum int foi encontrado';
    }
    return r;
}

// ignora todas as palavras até encontrar um float ou percorrer toda a string
Leitor.prototype.proximoFloat = function() {
    r = null;
    try {
	r = parseFloat(this.proximaPalavra())
	while (isNaN(r)) {
	    r = parseFloat(this.proximaPalavra());
	}
    } catch(err) {
	throw 'Nenhum float foi encontrado';
    }
    return r;
}

// a primeira palavra encontrada precisa ser um int
Leitor.prototype.proximoInt2 = function() {
    i = this.contador;
    while (i < this.str.length &&
	   (isNaN(parseInt(this.str[i])) &&
	    this.str[i] !== '-')) {
	i++;
    }
    if (i == this.str.length) {
	throw 'Nenhum int foi encontrado';
    }
    if (this.str[i] == '-' && isNaN(parseInt(this.str[i+1]))) {
	invalidNum = this.str[i] + this.str[i+1];
	throw 'Número inválido encontrado: ' + invalidNum +
	    ', na posição: ' + i;
    }
    this.contador = i;
    r = '';
    for (; this.contador < this.str.length; this.contador++) {
	if (isNaN(parseInt(this.str[this.contador])) &&
	    this.str[this.contador] !== '-') {
	    break;
	}
	r = r + this.str[this.contador];
    }
    return parseInt(r);
};

Leitor.prototype.lerCamera = function() {
    C = {};
    N = {};
    V = {};
    h = {};
    
    C.x = leitor.proximoInt();
    C.y = leitor.proximoInt();
    C.z = leitor.proximoInt();

    N.x = leitor.proximoInt();
    N.y = leitor.proximoInt();
    N.z = leitor.proximoInt();

    V.x = leitor.proximoInt();
    V.y = leitor.proximoInt();
    V.z = leitor.proximoInt();

    d = leitor.proximoInt();

    h.x = leitor.proximoInt();
    h.y = leitor.proximoInt();

    return {C, N, V, d, h};
}
