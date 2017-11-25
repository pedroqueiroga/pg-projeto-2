var adicao = function(a,b) {
	return {
		x: a.x + b.x,
		y: a.y + b.y,
		z: a.z + b.z
	};
};

var subtracao = function(a,b) {
	return adicao(a,produtoEscalar(b,-1));
}

var produtoComponentes = function(a,b) {
	return {
		x:(a.x * b.x),
		y:(a.y * b.y),
		z:(a.z * b.z)
	};
};

var produtoEscalar = function(vetor, escalar) {
	return {
		x: vetor.x * escalar,
		y: vetor.y * escalar,
		z: vetor.z * escalar
	};
};

var produtoInterno = function(a,b) {
	return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
};

var produtoVetorial = function(a,b) {
	return {
		x:(a.y * b.z - a.z * b.y),
		y:(a.z * b.x - a.x * b.z),
		z:(a.x * b.y - a.y * b.x)
	};
};

//projecao de a sobre b
var projecao = function(a,b) {
	return produtoEscalar(b, produtoInterno(a,b)/produtoInterno(b,b));
};

var norma = function(a) {
	return Math.sqrt(produtoInterno(a,a));
};

var normaliza = function(a) {
	var n = norma(a);
	return {
		x: a.x/n,
		y: a.y/n,
		z: a.z/n
	};
};

var identidade = function(a,b,c) {
	var det = 1/(a.x*b.y*c.z - a.x*b.z*c.y - a.y*b.x*c.z + a.y*b.z*c.x + a.z*b.x*c.y - a.z*b.y*c.x);
	return {
		xtox: ((b.y*c.z - b.z*c.y)*det),
		ytox: ((b.z*c.x - b.x*c.z)*det),
		ztox: ((b.x*c.y - b.y*c.x)*det),
		
		xtoy: ((a.z*c.y - a.y*c.z)*det),
		ytoy: ((a.x*c.z - a.z*c.x)*det),
		ztoy: ((a.y*c.x - a.x*c.y)*det),
		
		xtoz: ((a.y*b.z - a.z*b.y)*det),
		ytoz: ((a.z*b.x - a.x*b.z)*det),
		ztoz: ((a.x*b.y - a.y*b.x)*det)
	};
};

var multiplicacaoMatrizVetor = function (M, v) {
	return {
		x: M.xtox * v.x + M.ytox * v.y + M.ztox * v.z,
		y: M.xtoy * v.x + M.ytoy * v.y + M.ztoy * v.z,
		z: M.xtoz * v.x + M.ytoz * v.y + M.ztoz * v.z
	};
};