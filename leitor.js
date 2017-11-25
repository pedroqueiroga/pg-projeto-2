function Leitor(str) {
    if (typeof str !== 'string' || !(str instanceof String)) {
	this.str = str;
	this.contador = 0;
    } else {
	var errormsg = 'str não é string. ' + typeof str;
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
    var r = '';
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
    var r = null;
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
    var r = null;
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
    var i = this.contador;
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
    var C = {},
	N = {},
	V = {},
	h = {};

    try {
	C.x = this.proximoFloat();
	C.y = this.proximoFloat();
	C.z = this.proximoFloat();

	N.x = this.proximoFloat();
	N.y = this.proximoFloat();
	N.z = this.proximoFloat();

	V.x = this.proximoFloat();
	V.y = this.proximoFloat();
	V.z = this.proximoFloat();

	d = this.proximoFloat();

	h.x = this.proximoFloat();
	h.y = this.proximoFloat();
    } catch (err) {
	throw 'Arquivo não está no formato correto de câmera';
    }
    return {C, N, V, d, h};
}

Leitor.prototype.lerIluminacao = function() {
    var Pl = {},
	ka,
	Ia = {},
	kd,
	Od = {},
	ks,
	Il = {},
	n;
    try {
	Pl.x = this.proximoFloat();
	Pl.y = this.proximoFloat();
	Pl.z = this.proximoFloat();

	ka = this.proximoFloat();

	Ia.r = this.proximoInt();
	Ia.g = this.proximoInt();
	Ia.b = this.proximoInt();

	kd = this.proximoFloat();

	Od.r = this.proximoInt();
	Od.g = this.proximoInt();
	Od.b = this.proximoInt();

	ks = this.proximoFloat();

	Il.r = this.proximoInt();
	Il.g = this.proximoInt();
	Il.b = this.proximoInt();

	n = this.proximoFloat();
    } catch (err) {
	throw 'Arquivo não está no formato correto de iluminação';
    }
    return {Pl, ka, Ia, kd, Od, ks, Il, n};
}
