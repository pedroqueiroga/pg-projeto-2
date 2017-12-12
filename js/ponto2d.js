class Ponto2d {
    constructor(x, y, i) {
	if (typeof x !== 'number' ||
	    typeof y !== 'number') {
	    console.log('x: ' + x + '\n' +
			'y: ' + y);
	    throw 'Não é um ponto';
	}
	this.x = x;
	this.y = y;
	this.originalVertex = i;
    }

    static threeDPD(ponto3d, i, width, height) {
	// xp = x/(z*d), onde d é a distância
	// da origem pro plano de projeção, aqui 1.
	var watX = ponto3d.x/(ponto3d.z);
	var watY = ponto3d.y/(ponto3d.z);
	
	// normalizar x e y pro espaço [0, 1]
	// o que está sendo feito aqui é (P'.x + width/2)/width
	// do espaço, que como era [-1, 1], width é 2.
	// mesma coisa pra y.
	watX = (watX + 1) / 2;
	watY = (watY + 1) / 2;

	// desnormalizar pro canvas!
	watX = Math.floor(watX * width);
	watY = Math.floor((1 - watY) * height);

	return new Ponto2d(watX, watY, i);
    }

    static sortPoints(array) {
	return array.sort(function(a, b) {
	    if (a.y < b.y) {
		return -1;
	    }
	    if (a.y > b.y) {
		return 1;
	    }
	    // ordenar por x pois empate em y
	    if (a.x < b.x) {
		return -1;
	    }
	    if (a.x > b.x) {
		return 1;
	    }
	    // empate até em x
	    return 0;
	});
    }
}
