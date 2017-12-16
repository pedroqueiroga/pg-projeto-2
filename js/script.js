window.onload = function () { 
    // Checar suporte do browser para File
    if (window.File && window.FileReader && window.FileList && window.Blob) {
	var cameraFileChooser = document.getElementById('cameraFile');
	var lightFileChooser = document.getElementById('lightFile');
	var objectFileChooser = document.getElementById('objectFile');
	var botao = document.getElementById('initialSteps');
	cameraFileChooser.addEventListener('change',
					   fileReadingRoutine,
					   false);
	lightFileChooser.addEventListener('change',
					  fileReadingRoutine,
					  false);
	objectFileChooser.addEventListener('change',
					   fileReadingRoutine,
					   false);
	botao.addEventListener('click',
			       initialSteps,
			       false);
    } 
    else { 
	alert("Este navegador não suporta Files");
    } 
};

function leArquivos() {
    var leitor;
    try {
	leitor = new Leitor(window.camFileTxt);
	var values;

	window.camera = null;
	values = leitor.lerCamera();
	window.camera = new Camera(values);
	// Matriz de Mudanca de Base pra camera
	window.MMBcamera = new Matriz((window.camera).U,
				      (window.camera).V,
				      (window.camera).N);
    } catch (err) {
	window.alert(err);
    }
    try {
	leitor = new Leitor(window.lightFileTxt);
	window.iluminacao = null;
	window.iluminacao = leitor.lerIluminacao();
    } catch (err) {
	window.alert(err);
    }
    try {
	leitor = new Leitor(window.objFileTxt);
	window.objeto = null;
	window.objeto = leitor.lerObjeto();
    } catch (err) {
	window.alert(err);
    }

}

function initialSteps() {
    leArquivos();

    var Pl_vista, P_objeto_vista;
    // transforma a posição da luz para coordenadas da câmera
    Pl_vista = (window.MMBcamera).vezesVetor(
	((window.iluminacao).Pl).menos((window.camera).C));
    window.iluminacao.Pl = new Ponto(Pl_vista.x, Pl_vista.y, Pl_vista.z);

    // transforma vértices do objeto para coordenadas da câmera
    for (var i = 0; i < (window.objeto.V.length); i++) {
	P_objeto_vista = (window.MMBcamera).vezesVetor(
	    (window.objeto.V[i]).menos(window.camera.C));
	window.objeto.V[i] = new Ponto(P_objeto_vista.x,
				       P_objeto_vista.y,
				       P_objeto_vista.z);
    }

    for (i = 0; i < (window.objeto.F.length); i++) {
	// criando triângulos e suas normais
	var a, b, c;

	a = window.objeto.F[i].a;
	b = window.objeto.F[i].b;
	c = window.objeto.F[i].c;
	window.objeto.F[i] = new Triangulo(window.objeto.V[a],
					   window.objeto.V[b],
					   window.objeto.V[c],
					   a, b, c);
	// adicionando a normal dos triângulos a cada vértice daquele triângulo
	window.objeto.V[a].N = (window.objeto.V[a].N)
	    .mais(window.objeto.F[i].N);
	window.objeto.V[b].N = (window.objeto.V[b].N)
	    .mais(window.objeto.F[i].N);
	window.objeto.V[c].N = (window.objeto.V[c].N)
	    .mais(window.objeto.F[i].N);
    }

    for (i = 0; i < (window.objeto.V.length); i++) {
	// normalizando as normais dos vértices
	window.objeto.V[i].N = (window.objeto.V[i].N).normalizado();
    }
    console.log('ok');

    if (window.myp5) {
	window.myp5.remove();
    }
    window.myp5 = new p5(s);
}

function fileReadingRoutine(evt) {
    if (window.myp5) {
	window.myp5.remove();
    }
    var id = evt.target.id;
    // Pegar o objeto que representa o arquivo escolhido
    var fileTobeRead = document.getElementById(id).files[0];

    // Inicializar o FileReader para ler o arquivo
    var fileReader = new FileReader();

    // Esta função deverá rodar uma vez que o fileReader carregar
    // ela guarda o arquivo, para facilitar recliques do botão
    fileReader.onload = function (e) {
	if (id === 'cameraFile') {
	    window.camFileTxt = fileReader.result;
	} else if (id === 'lightFile') {
	    window.lightFileTxt = fileReader.result;
	} else if (id === 'objectFile') {
	    window.objFileTxt = fileReader.result;
	}
    };
    
    // lê o arquivo como texto, eventualmente invocando a função acima
    fileReader.readAsText(fileTobeRead);
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

var s = function(p) {

    p.setup = function() {
        p.createCanvas(1024, 768);
	p.background(128);

	// projetar pontos pra coordenadas da tela
	window.ponto2d = createArray(window.objeto.V.length);
	for (i = 0; i < (window.objeto.V.length); i++) {
	    window.ponto2d[i] = Ponto2d.threeDPD(window.objeto.V[i], i,
						 p.width, p.height);
	}

	window.zBuffer = createArray(p.width, p.height);
	for (var i = 0; i < window.zBuffer.length; i++) {
	    window.zBuffer[i] = window.zBuffer[i].fill(Infinity);
	}
	renderObj();
    };

    function zBufHorizontal(xf, scanlineY, v1, v2, a, b, P4, N4) {
	var lp = lerp(xf, v1, v2);
	var P, N;
	var objVa, objVb;
	if (!a && a != 0) {
	    objVa = P4;
	    objVa.N = N4;
	} else {
	    objVa = window.objeto.V[a];
	}
	if (!b && b != 0) {
	    objVb = P4;
	    objVb.N = N4;
	} else {
	    objVb = window.objeto.V[b];
	}
	if (isNaN(lp.v)) {
	    if (objVa.z <= objVb.z) {
		P = new Ponto(objVa.x,
			      objVa.y,
			      objVa.z);
		N = new Vetor(objVa.N.x,
			      objVa.N.y,
			      objVa.N.z);
	    } else {
		P = new Ponto(objVb.x,
			      objVb.y,
			      objVb.z);
		N = new Vetor(objVb.N.x,
			      objVb.N.y,
			      objVb.N.z);
	    }
	} else {
	    P = new Ponto(objVa.x * lp.u +
			  objVb.x * lp.v,
			  objVa.y * lp.u +
			  objVb.y * lp.v,
			  objVa.z * lp.u +
			  objVb.z * lp.v);
	    N = new Vetor(objVa.N.x * lp.u +
			  objVb.N.x * lp.v,
			  objVa.N.y * lp.u +
			  objVb.N.y * lp.v ,
			  objVa.N.z * lp.u +
			  objVb.N.z * lp.v);
	}
	if (xf >= 0 && scanlineY >= 0 &&
	    xf < p.width && scanlineY < p.height &&
	    P.z <= window.zBuffer[xf][scanlineY]) {
	    if (P.z <= -1000) {
		debugger;
	    }
	    window.zBuffer[xf][scanlineY] = P.z;

	    phong(N, P, xf, scanlineY);
	}
    }

    function phong(N, P, xf, y) {

	N = N.normalizado();
	var L = window.iluminacao.Pl.menos(P).normalizado();
	var V = new Vetor(-P.x, -P.y, -P.z).normalizado();
	var R = (N.produtoEscalar(((N.produtoInterno(L)) * 2))).menos(L);
	R = R.normalizado();
	var ka = window.iluminacao.ka;
	var ks = window.iluminacao.ks;
	var kd = window.iluminacao.kd;
	var Ia = window.iluminacao.Ia;
	var Od = window.iluminacao.Od;
	var Il = window.iluminacao.Il;
	var n = window.iluminacao.n;
	if (V.produtoInterno(N) < 0) {
	    N = N.produtoEscalar(-1);
	}
	var cosLN = L.produtoInterno(N);
	var cosRV = R.produtoInterno(V);
	if (L.produtoInterno(N) < 0) {
	    kd = 0;
	    ks = 0;
	}
	if (R.produtoInterno(V) < 0) {
	    ks = 0;
	}

	var OdIl = Od.produtoComponentes(Il);
	var Iamb = Ia.produtoEscalar(ka);
	var Is = OdIl.produtoEscalar(kd * cosLN);
	var Id = Il.produtoEscalar(ks * Math.pow(cosRV, n));

	var I = Iamb.mais(Id).mais(Is);
	I.x = Math.min(I.x, 255);
	I.y = Math.min(I.y, 255);
	I.z = Math.min(I.z, 255);
	p.stroke(Math.round(I.x), Math.round(I.y), Math.round(I.z));
	//	p.stroke(Math.floor(Math.abs(N.x) * 255), Math.floor(Math.abs(N.y) * 255), Math.floor(Math.abs(N.z) * 255));
	p.point(xf, y);
    }

    function zBufVertical(xf, y, v1, v2, a, b, P4, N4) {
	var lp = lerp(y, v1, v2);
	var P, N;
	var objVa, objVb;
	if (!a && a != 0) {
	    objVa = P4;
	    objVa.N = N4;
	} else {
	    objVa = window.objeto.V[a];
	}
	if (!b && b != 0) {
	    objVb = P4;
	    objVb.N = N4;
	} else {
	    objVb = window.objeto.V[b];
	}
	if (isNaN(lp.v)) {
	    if (objVa.z <= objVb.z) {
		P = new Ponto(objVa.x,
			      objVa.y,
			      objVa.z);
		N = new Vetor(objVa.N.x,
			      objVa.N.y,
			      objVa.N.z);
	    } else {
		P = new Ponto(objVb.x,
			      objVb.y,
			      objVb.z);
		N = new Vetor(objVb.N.x,
			      objVb.N.y,
			      objVb.N.z);
	    }
	} else {
	    P = new Ponto(objVa.x * lp.u +
			  objVb.x * lp.v,
			  objVa.y * lp.u +
			  objVb.y * lp.v,
			  objVa.z * lp.u +
			  objVb.z * lp.v);
	    N = new Vetor(objVa.N.x * lp.u +
			  objVb.N.x * lp.v,
			  objVa.N.y * lp.u +
			  objVb.N.y * lp.v ,
			  objVa.N.z * lp.u +
			  objVb.N.z * lp.v);
	}
	if (xf >= 0 && y >= 0 &&
	    xf < p.width && y < p.height &&
	    P.z <= window.zBuffer[xf][y]) {
	    if (P.z <= -1000) {
		debugger;
	    }
	    window.zBuffer[xf][y] = P.z;
	    phong(N, P, xf, y);
	}
    }

    function zBuf(xf, scanlineY, v1, v2, v3, a, b, c, P4, N4) {
	var bar = baricentro(new Ponto2d(xf, scanlineY),
			     v1,
			     v2,
			     v3);
	var P, N;
	var objVa, objVb, objVc;
	if (a === null) {
	    objVa = P4;
	    objVa.N = N4;
	} else {
	    objVa = window.objeto.V[a];
	}
	if (b === null) {
	    objVb = P4;
	    objVb.N = N4;
	} else {
	    objVb = window.objeto.V[b];
	}
	if (c === null) {
	    objVc = P4;
	    objVc.N = N4;
	} else {
	    objVc = window.objeto.V[c];
	}
	
	if (isNaN(bar.u) || isNaN(bar.v) || isNaN(bar.w)) {
	    // diagonal
	    var lp1 = lerp2d({x: xf, y: scanlineY},
			     v1, v2);
	    var lp2 = lerp2d({x: xf, y: scanlineY},
			     v1, v3);
	    var lp3 = lerp2d({x: xf, y: scanlineY},
			     v2, v3);
	    var z1 = objVa.z * lp1.u +
		objVb.z * lp1.v;
	    var z2 = objVa.z * lp2.u +
		objVc.z * lp2.v;
	    var z3 = objVb.z * lp3.u +
		objVc.z * lp3.v;
	    z1 = isNaN(z1) ? Infinity : z1;
	    z2 = isNaN(z2) ? Infinity : z2;
	    z3 = isNaN(z3) ? Infinity : z3;
	    if (z1 <= z2 && z1 <= z3) {
		P = new Ponto(objVa.x * lp1.u +
			      objVb.x * lp1.v,
			      objVa.y * lp1.u +
			      objVb.y * lp1.v,
			      z1,
			      true);
		N = new Vetor(objVa.N.x * lp1.u +
			      objVb.N.x * lp1.v,
			      objVa.N.y * lp1.u +
			      objVb.N.y * lp1.v,
			      objVa.N.z * lp1.u +
			      objVb.N.z * lp1.v);
	    } else if (z2 <= z1 && z2 <= z3) {
		P = new Ponto(objVa.x * lp2.u +
			      objVc.x * lp2.v,
			      objVa.y * lp2.u +
			      objVc.y * lp2.v,
			      z2,
			      true);
		N = new Vetor(objVa.N.x * lp2.u +
			      objVc.N.x * lp2.v,
			      objVa.N.y * lp2.u +
			      objVc.N.y * lp2.v,
			      objVa.N.z * lp2.u +
			      objVc.N.z * lp2.v);

	    } else {
		P = new Ponto(objVb.x * lp3.u +
			      objVc.x * lp3.v,
			      objVb.y * lp3.u +
			      objVc.y * lp3.v,
			      z3,
			      true);
		N = new Vetor(objVb.N.x * lp3.u +
			      objVc.N.x * lp3.v,
			      objVb.N.y * lp3.u +
			      objVc.N.y * lp3.v,
			      objVb.N.z * lp3.u +
			      objVc.N.z * lp3.v);
	    }
	    
	} else {
	    // alfa*v1_3d + beta*v2_3d + gamma*v3_3d
	    P = new Ponto(objVa.x * bar.u +
			  objVb.x * bar.v +
			  objVc.x * bar.w,
			  objVa.y * bar.u +
			  objVb.y * bar.v +
			  objVc.y * bar.w,
			  objVa.z * bar.u +
			  objVb.z * bar.v +
			  objVc.z * bar.w,
			  true);
	    N = new Vetor(objVa.N.x * bar.u +
	    		  objVb.N.x * bar.v +
	    		  objVc.N.x * bar.w,
	    		  objVa.N.y * bar.u +
	    		  objVb.N.y * bar.v +
	    		  objVc.N.y * bar.w,
	    		  objVa.N.z * bar.u +
	    		  objVb.N.z * bar.v +
	    		  objVc.N.z * bar.w);
	    
	    
	}
	if (xf >= 0 && scanlineY >= 0 &&
	    xf < p.width && scanlineY < p.height &&
	    P.z <= window.zBuffer[xf][scanlineY]) {
	    if (P.z <= -1000) {
		debugger;
	    }
	    window.zBuffer[xf][scanlineY] = P.z;
	    phong(N, P, xf, scanlineY);
	}

    }

    function fillBottomFlatTriangle(v1, v2, v3, a, b, c, P, N) {
	debugger;
	var invslope1 = (v2.x - v1.x) / (v2.y - v1.y);
	var invslope2 = (v3.x - v1.x) / (v3.y - v1.y);

	var curx1 = v1.x;
	var curx2 = v1.x;

	if (v1.y == v2.y) {
	    // caso de uma linha horizontal
	    // ou um ponto
	    var arrX = [v1, v2, v3];
	    arrX = arrX.sort(function(a, b) {
		if (a.x < b.x) {
		    return -1;
		}
		if (a.x > b.x) {
		    return 1;
		}
		return 0;
	    });
	    var x0 = arrX[0];
	    var xm = arrX[1];
	    var xf = arrX[2];
	    for (var i = x0.x; i <= xm.x; i++) {
		zBufHorizontal(i, v1.y, x0.x, xm.x, x0.originalVertex, xm.originalVertex, P, N);
	    }
	    for (i = xm.x; i <= xf.x; i++) {
		zBufHorizontal(i, v1.y, xm.x, xf.x, xm.originalVertex, xf.originalVertex, P, N);
	    }
	    for (i = x0.x; i <= xf.x; i++) {
		zBufHorizontal(i, v1.y, x0.x, xf.x, x0.originalVertex, xf.originalVertex, P, N);
	    }
	} else if (v1.x == v2.x && v1.x == v3.x) {
	    // caso de uma linha vertical
	    var arrX = [v1, v2, v3];
	    // v1.y <= v2.y == v3.y
	    for (var i = v1.y; i <= v2.y; i++) {
		zBufVertical(v1.x, i, v1.y, v2.y, v1.originalVertex, v2.originalVertex, P, N);
	    }
	    for (i = v2.y; i <= v3.y; i++) {
		zBufVertical(v2.x, i, v2.y, v3.y, v2.originalVertex, v3.originalVertex, P, N);
	    }
	    for (i = v3.y; i >= v1.y; i--) {
		zBufVertical(v3.x, i, v3.y, v1.y, v3.originalVertex, v1.originalVertex, P, N);
	    }
	} else {
	    for (var scanlineY = v1.y; scanlineY <= v2.y; scanlineY++) {
		var x = curx1 < curx2 ? curx1 : curx2;
		var span = Math.abs(curx1 - curx2);
		for (var i = 0; i <= span; i++, x++) {
		    var xf = Math.round(x);
		    if (xf < p.width && scanlineY < p.height &&
			xf >= 0 && scanlineY >= 0) {
			zBuf(xf, scanlineY, v1, v2, v3, a, b, c, P, N);
		    }
		}
		curx1 += invslope1;
		curx2 += invslope2;
	    }
	}
    }

    function lerp(p, a, b) {
	var v = Math.abs((p-b)/(a-b));
	var u = 1 - v;
	return {u, v};
    }

    function lerp2d(p, a, b) {
	// u = vol1(p,b)/vol1(a,b)
	var v = Math.sqrt((p.x-b.x)*(p.x-b.x) + (p.y-b.y)*(p.y-b.y)) /
	    Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));
	var u = 1 - v;
	return {u, v};
    }

    // encontra as coordenadas baricentricas
    function baricentro(p, a, b, c) {
	debugger;
	var v0 = b.menos(a), v1 = c.menos(a), v2 = p.menos(a);
	var invden = 1 / (v0.x * v1.y - v1.x * v0.y);
	var v = (v2.x * v1.y - v1.x * v2.y) * invden;
	var w = (v0.x * v2.y - v2.x * v0.y) * invden;
	var u = 1 - v - w;
	return {u, v, w};
    }
    
    function fillTopFlatTriangle(v1, v2, v3, a, b, c, P, N) {
	debugger;
	var invslope1 = (v3.x - v1.x) / (v3.y - v1.y);
	var invslope2 = (v3.x - v2.x) / (v3.y - v2.y);

	var curx1 = v3.x;
	var curx2 = v3.x;
	if (v1.y == v3.y) {
	    // caso de uma linha horizontal
	    // ou um ponto
	    var arrX = [v1, v2, v3];
	    arrX = arrX.sort(function(a, b) {
		if (a.x < b.x) {
		    return -1;
		}
		if (a.x > b.x) {
		    return 1;
		}
		return 0;
	    });
	    var x0 = arrX[0];
	    var xm = arrX[1];
	    var xf = arrX[2];
	    for (var i = x0.x; i <= xm.x; i++) {
		zBufHorizontal(i, v1.y, x0.x, xm.x, x0.originalVertex, xm.originalVertex, P, N);
	    }
	    for (i = xm.x; i <= xf.x; i++) {
		zBufHorizontal(i, v1.y, xm.x, xf.x, xm.originalVertex, xf.originalVertex, P, N);
	    }
	    for (i = x0.x; i <= xf.x; i++) {
		zBufHorizontal(i, v1.y, x0.x, xf.x, x0.originalVertex, xf.originalVertex, P, N);
	    }
	} else if (v1.x == v2.x && v1.x == v3.x) {
	    // caso de uma linha vertical
	    var arrX = [v1, v2, v3];
	    // v1.y <= v2.y == v3.y
	    for (var i = v1.y; i <= v2.y; i++) {
		zBufVertical(v1.x, i, v1.y, v2.y, v1.originalVertex, v2.originalVertex, P, N);
	    }
	    for (i = v2.y; i <= v3.y; i++) {
		zBufVertical(v2.x, i, v2.y, v3.y, v2.originalVertex, v3.originalVertex, P, N);
	    }
	    for (i = v3.y; i >= v1.y; i--) {
		zBufVertical(v3.x, i, v3.y, v1.y, v3.originalVertex, v1.originalVertex, P, N);
	    }
	} else {
	    for (var scanlineY = v3.y; scanlineY > v1.y; scanlineY--) {
		var x = curx1 < curx2 ? curx1 : curx2;
		var span = Math.abs(curx1 - curx2);
		for (var i = 0; i <= span; i++, x++) {
		    var xf = Math.round(x);
		    if (xf < p.width && scanlineY < p.height &&
			xf >= 0 && scanlineY >= 0) {
			zBuf(xf, scanlineY, v1, v2, v3, a, b, c, P, N);
		    }
		}
		curx1 -= invslope1;
		curx2 -= invslope2;
	    }
	}
    }

    function drawTriangle(triangle) {
	/* at first sort the three vertices by y-coordinate ascending so v1 is the topmost vertice */

	var vertices = createArray(3);
	vertices[0] = window.ponto2d[triangle.a];
	vertices[1] = window.ponto2d[triangle.b];
	vertices[2] = window.ponto2d[triangle.c];
	vertices = Ponto2d.sortPoints(vertices);
	var v1 = vertices[0];
	var v2 = vertices[1];
	var v3 = vertices[2];

	/* here we know that v1.y <= v2.y <= v3.y */
	/* check for trivial case of bottom-flat triangle */
	if (v2.y == v3.y) {
	    fillBottomFlatTriangle(v1, v2, v3, v1.originalVertex, v2.originalVertex, v3.originalVertex);
	}
	/* check for trivial case of top-flat triangle */
	else if (v1.y == v2.y) {
	    fillTopFlatTriangle(v1, v2, v3, v1.originalVertex, v2.originalVertex, v3.originalVertex);
	}
	else {
	    debugger;
	    //general case - split the triangle in a topflat and bottom-flat one
	    var v4 = new Ponto2d(
		Math.round((v1.x + ((v2.y - v1.y) / (v3.y - v1.y)) * (v3.x - v1.x))), v2.y);
	    var lp = baricentro(v4, v1, v2, v3);
	    var P = new Ponto(window.objeto.V[v1.originalVertex].x * lp.u +
			      window.objeto.V[v2.originalVertex].x * lp.v +
			      window.objeto.V[v3.originalVertex].x * lp.w,
			      window.objeto.V[v1.originalVertex].y * lp.u +
			      window.objeto.V[v2.originalVertex].y * lp.v +
			      window.objeto.V[v3.originalVertex].y * lp.w,
			      window.objeto.V[v1.originalVertex].z * lp.u +
			      window.objeto.V[v2.originalVertex].z * lp.v +
			      window.objeto.V[v3.originalVertex].z * lp.w);
	    var N = new Vetor(window.objeto.V[v1.originalVertex].N.x * lp.u +
			      window.objeto.V[v2.originalVertex].N.x * lp.v +
			      window.objeto.V[v3.originalVertex].N.x * lp.w,
			      window.objeto.V[v1.originalVertex].N.y * lp.u +
			      window.objeto.V[v2.originalVertex].N.y * lp.v +
			      window.objeto.V[v3.originalVertex].N.y * lp.w,
			      window.objeto.V[v1.originalVertex].N.z * lp.u +
			      window.objeto.V[v2.originalVertex].N.z * lp.v +
			      window.objeto.V[v3.originalVertex].N.z * lp.w);
	    fillBottomFlatTriangle(v1, v2, v4, v1.originalVertex, v2.originalVertex, null, P, N);
	    fillTopFlatTriangle(v2, v4, v3, v2.originalVertex, null, v3.originalVertex, P, N);
	}
    }

    function renderObj() {
	var faces = window.objeto.F;
	for (const face of faces) {
	    drawTriangle(face);
	}
    }
};
