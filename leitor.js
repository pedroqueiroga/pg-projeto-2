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
	C.x = leitor.proximoFloat();
	C.y = leitor.proximoFloat();
	C.z = leitor.proximoFloat();

	N.x = leitor.proximoFloat();
	N.y = leitor.proximoFloat();
	N.z = leitor.proximoFloat();

	V.x = leitor.proximoFloat();
	V.y = leitor.proximoFloat();
	V.z = leitor.proximoFloat();

	d = leitor.proximoFloat();

	h.x = leitor.proximoFloat();
	h.y = leitor.proximoFloat();
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
	Pl.x = leitor.proximoFloat();
	Pl.y = leitor.proximoFloat();
	Pl.z = leitor.proximoFloat();

	ka = leitor.proximoFloat();

	Ia.r = leitor.proximoInt();
	Ia.g = leitor.proximoInt();
	Ia.b = leitor.proximoInt();

	kd = leitor.proximoFloat();

	Od.r = leitor.proximoInt();
	Od.g = leitor.proximoInt();
	Od.b = leitor.proximoInt();

	ks = leitor.proximoFloat();

	Il.r = leitor.proximoInt();
	Il.g = leitor.proximoInt();
	Il.b = leitor.proximoInt();

	n = leitor.proximoFloat();
    } catch (err) {
	throw 'Arquivo não está no formato correto de iluminação';
    }
    return {Pl, ka, Ia, kd, Od, ks, Il, n};
}
