bgColor = 128;
window.cameraFileChooser = document.getElementById('cameraFile');
window.lightFileChooser = document.getElementById('lightFile');
window.objectFileChooser = document.getElementById('objectFile');
window.botao = document.getElementById('initialSteps');
window.zPlus = document.getElementById('ZH');
window.zMinus = document.getElementById('ZAH');
window.yPlus = document.getElementById('YH');
window.yMinus = document.getElementById('YAH');
window.xPlus = document.getElementById('XH');
window.xMinus = document.getElementById('XAH');
window.degrees = document.getElementById('degrees');
window.rotate = document.getElementById('rotate');
window.rotateText = document.getElementById('rotateStack');

window.waitingSong = new Audio('../assets/wii.mp3');

disabledButtons(true);
disableRotateButtons(true);

window.rotationStack = [];

function disableRotateButtons(b) {
    zPlus.disabled = b;
    zMinus.disabled = b;
    yPlus.disabled = b;
    yMinus.disabled = b;
    xPlus.disabled = b;
    xMinus.disabled = b;
    degrees.disabled = b;
    rotate.disabled = b;
}

function disabledButtons(b) {
    window.cameraFileChooser.disabled = b;
    window.lightFileChooser.disabled = b;
    window.objectFileChooser.disabled = b;
    window.botao.disabled = b;
}

window.waitingSong.oncanplay = function() {
    window.waitingSong.loop = true;
    window.onkeydown = arrowKANYE;
    debugger;

    window.cv = document.getElementById("canvas");
    // window.cv.width = window.cv.clientWidth;
    // window.cv.height = window.cv.clientHeight;
    window.gl = cv.getContext("webgl");
    if (!window.gl) {
	alert("webgl não suportado");
    }

    window.program =
	webglUtils.createProgramFromScripts(gl,
					    ["2d-vertex-shader",
					     "2d-fragment-shader"]);
    window.positionAttributeLocation = gl.getAttribLocation(program,
							    "a_position");

    window.normalAttributeLocation = gl.getAttribLocation(program,
							  "a_normal");
    window.pointAttributeLocation = gl.getAttribLocation(program,
							 "a_p");

    window.resolutionUniformLocation = gl.getUniformLocation(program,
							     "u_resolution");
    window.PlUniformLocation = gl.getUniformLocation(program,
						     "u_Pl");
    window.IaUniformLocation = gl.getUniformLocation(program,
						     "u_Ia");
    window.OdUniformLocation = gl.getUniformLocation(program,
						     "u_Od");
    window.IlUniformLocation = gl.getUniformLocation(program,
						     "u_Il");


    window.KaUniformLocation = gl.getUniformLocation(program,
						     "u_ka");
    window.KsUniformLocation = gl.getUniformLocation(program,
						     "u_ks");
    window.KdUniformLocation = gl.getUniformLocation(program,
						     "u_kd");
    window.RugosidadeUniformLocation = gl.getUniformLocation(program,
							     "u_n");
    
    window.positionBuffer = gl.createBuffer();
    window.normalBuffer = gl.createBuffer();
    window.pointBuffer = gl.createBuffer();
    
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.enableVertexAttribArray(pointAttributeLocation);

    gl.uniform2f(resolutionUniformLocation,
		 gl.drawingBufferWidth,
		 gl.drawingBufferHeight);

    // Checar suporte do browser para File
    if (window.File && window.FileReader && window.FileList && window.Blob) {
	window.cameraFileChooser.addEventListener('change',
						  fileReadingRoutine,
						  false);
	window.lightFileChooser.addEventListener('change',
						 fileReadingRoutine,
						 false);
	window.objectFileChooser.addEventListener('change',
						  fileReadingRoutine,
						  false);
	window.botao.addEventListener('click',
				      initialSteps,
				      false);
	disabledButtons(false);
    } 
    else { 
	alert("Este navegador não suporta Files");
    }
    window.zPlus.addEventListener('click',
				  rot,
				  false);
    window.zMinus.addEventListener('click',
				   rot,
				   false);
    window.yPlus.addEventListener('click',
				  rot,
				  false);
    window.yMinus.addEventListener('click',
				   rot,
				   false);
    window.xPlus.addEventListener('click',
				  rot,
				  false);
    window.xMinus.addEventListener('click',
				   rot,
				   false);
    window.rotate.addEventListener('click',
				   execRotate,
				   false);
};

function rot(evt) {
    var deg = parseInt(degrees.value);
    
    if (isNaN(deg)) deg = 180;

    deg = deg * Math.PI/180;
    
    var id = evt.target.id;
    var cosine, sine;
    cosine = Math.cos(deg);
    sine = Math.sin(deg);
    if (id.indexOf("AH") !== -1) {
	sine = -sine;
    }
    rotationStack.push([id, sine, cosine]);
    if (rotateText.innerHTML.length == 0) {
	rotateText.innerHTML = "(" + id + ", " + Math.round((deg + 0.00001) * 100) / 100 + "rad)";
    } else {
	rotateText.innerHTML = rotateText.innerHTML + " -> " +  "(" + id + ", " + Math.round((deg + 0.00001) * 100) / 100 + "rad)";
    }
}

function execRotate() {
    if (rotationStack.length == 0) return;
    playit();
    disableRotateButtons(true);
    // como as normais são vetores, uma classe de equipolência,
    // não podemos transladar elas, elas estão soltas...

    // o ideal seria computar o miolo e só aplicar a transalação em uma,
    // assim não repetiríamos as contas tantas vezes, mas a ordem faz
    // diferença, então não sei bem como evitar isso.
    var rotMatrix = [[1, 0, 0, 0],
	 	     [0, 1, 0, 0],
		     [0, 0, 1, 0],
		     [0, 0, 0, 1]];
    var toOrigin = [[1, 0, 0, -window.objeto.COM.x],
	 	    [0, 1, 0, -window.objeto.COM.y],
		    [0, 0, 1, -window.objeto.COM.z],
		    [0, 0, 0, 1]];

    var fromOrigin = [[1, 0, 0, window.objeto.COM.x],
	 	      [0, 1, 0, window.objeto.COM.y],
		      [0, 0, 1, window.objeto.COM.z],
		      [0, 0, 0, 1]];
    
    var translatedRotMatrix = [[1, 0, 0, 0],
	 		       [0, 1, 0, 0],
			       [0, 0, 1, 0],
			       [0, 0, 0, 1]];
    while (rotationStack.length > 0) {
	var matRot;
	var rotation = rotationStack.pop();
	var cosine, sine;
	sine = rotation[1]; cosine = rotation[2];

	switch (rotation[0]) {
	case 'ZAH':
	case 'ZH':
	    matRot = [[cosine, sine, 0, 0],
		      [-sine, cosine, 0, 0],
		      [0, 0, 1, 0],
		      [0, 0, 0, 1]];
	    translatedRotMatrix = matrizvMatriz4d(matRot, translatedRotMatrix);
	    break;
	case 'YAH':
	case 'YH':
	    matRot = [[cosine, 0, -sine, 0],
		      [0, 1, 0, 0],
		      [sine, 0, cosine, 0],
		      [0, 0, 0, 1]];
	    translatedRotMatrix = matrizvMatriz4d(toOrigin, translatedRotMatrix);
	    translatedRotMatrix = matrizvMatriz4d(matRot, translatedRotMatrix);
	    translatedRotMatrix = matrizvMatriz4d(fromOrigin, translatedRotMatrix);
	    break;
	case 'XAH':
	case 'XH':
	    matRot = [[1, 0, 0, 0],
		      [0, cosine, -sine, 0],
		      [0, sine, cosine, 0],
		      [0, 0, 0, 1]];
	    translatedRotMatrix = matrizvMatriz4d(toOrigin, translatedRotMatrix);
	    translatedRotMatrix = matrizvMatriz4d(matRot, translatedRotMatrix);
	    translatedRotMatrix = matrizvMatriz4d(fromOrigin, translatedRotMatrix);
	    break;
	}
	rotMatrix = matrizvMatriz4d(matRot, rotMatrix);
    }
    for (var i = 0; i < (window.objeto.V.length); i++) {
	var N = window.objeto.V[i].N;
	window.objeto.V[i] = vetorMatriz4d(window.objeto.V[i], translatedRotMatrix);
	window.objeto.V[i].N = vvetorMatriz4d(N, rotMatrix).normalizado();
    }
    // rotaciona COM agora
    window.objeto.COM = vetorMatriz4d(window.objeto.COM, translatedRotMatrix);

    // reordenando as faces pois os Zs provavelmente mudaram bastante
    window.objeto.F = window.objeto.F.sort(function(f1, f2) {
	var f1_mediaZ = (window.objeto.V[f1.a].z +
			 window.objeto.V[f1.b].z +
			 window.objeto.V[f1.c].z)/3;
	var f2_mediaZ = (window.objeto.V[f2.a].z +
			 window.objeto.V[f2.b].z +
			 window.objeto.V[f2.c].z)/3;
	return f1_mediaZ - f2_mediaZ;
    });
    setTimeout(hmmm, 0);
}

function arrowKANYE(e) {
    e = e || window.event;
    debugger;
    if (['38', '40', '37', '39', '90', '88'].indexOf(''+e.keyCode) != -1) {
	translate(e.keyCode);
    } else return;
}

function translate(dir) {
    if (!window.objeto) return;
    playit();
    var moveAmount = parseInt(degrees.value);
    
    if (isNaN(moveAmount)) moveAmount = 10;

    // converter de pixel pra camera

    var xtr = 0, ytr = 0, ztr = 0;
    if (dir == '38') {
	// ^
	var minY = window.window.ponto2d[0].y;
	var maxY = minY;
	var vminY = 0;
	var vmaxY = 0;
	for (var i = 1; i < window.ponto2d.length; i++) {
	    var curY = window.ponto2d[i].y;
	    if (curY < minY) {
		minY = curY;
		vminY = window.ponto2d[i].originalVertex;
	    }
	    if (curY > maxY) {
		maxY = curY;
		vmaxY = window.ponto2d[i].originalVertex;
	    }
	}
	var dyPixel = Math.abs(minY - maxY)*(cv.clientHeight/cv.height);
	var distanceRatio = Math.abs(window.objeto.V[vminY].y -
				     window.objeto.V[vmaxY].y);
	distanceRatio = distanceRatio/dyPixel;
	moveAmount *= distanceRatio;
	ytr = moveAmount;
    } else if (dir  == '40') {
	// v
	var minY = window.ponto2d[0].y;
	var maxY = minY;
	var vminY = 0;
	var vmaxY = 0;
	for (var i = 1; i < window.ponto2d.length; i++) {
	    var curY = window.ponto2d[i].y;
	    if (curY < minY) {
		minY = curY;
		vminY = window.ponto2d[i].originalVertex;
	    }
	    if (curY > maxY) {
		maxY = curY;
		vmaxY = window.ponto2d[i].originalVertex;
	    }
	}
	var dyPixel = Math.abs(minY - maxY)*(cv.clientHeight/cv.height);
	var distanceRatio = Math.abs(window.objeto.V[vminY].y -
				     window.objeto.V[vmaxY].y);
	distanceRatio = distanceRatio/dyPixel;
	moveAmount *= distanceRatio;
	ytr = -moveAmount;
    } else if (dir == '39') {
	// ->
	var minX = window.ponto2d[0].x;
	var maxX = minX;
	var vminX = 0;
	var vmaxX = 0;
	for (var i = 1; i < window.ponto2d.length; i++) {
	    var curX = window.ponto2d[i].x;
	    if (curX < minX) {
		minX = curX;
		vminX = window.ponto2d[i].originalVertex;
	    }
	    if (curX > maxX) {
		maxX = curX;
		vmaxX = window.ponto2d[i].originalVertex;
	    }
	}
	var dyPixel = Math.abs(minX - maxX)*(cv.clientWidth/cv.width);
	var distanceRatio = Math.abs(window.objeto.V[vminX].x -
				     window.objeto.V[vmaxX].x);
	distanceRatio = distanceRatio/dyPixel;
	moveAmount *= distanceRatio;
	xtr = moveAmount;
    } else if (dir == '37') {
	// <-
	var minX = window.ponto2d[0].x;
	var maxX = minX;
	var vminX = 0;
	var vmaxX = 0;
	for (var i = 1; i < window.ponto2d.length; i++) {
	    var curX = window.ponto2d[i].x;
	    if (curX < minX) {
		minX = curX;
		vminX = window.ponto2d[i].originalVertex;
	    }
	    if (curX > maxX) {
		maxX = curX;
		vmaxX = window.ponto2d[i].originalVertex;
	    }
	}
	var dyPixel = Math.abs(minX - maxX)*(cv.clientWidth/cv.width);
	var distanceRatio = Math.abs(window.objeto.V[vminX].x -
				     window.objeto.V[vmaxX].x);
	distanceRatio = distanceRatio/dyPixel;
	moveAmount *= distanceRatio;
	xtr = -moveAmount;
    } else if (dir == '90') {
	// z, z entrando
	ztr = moveAmount;
    } else if (dir == '88') {
	// x, z saindo
	ztr = -moveAmount;
    } else return;

    var translateMatrix = [[1, 0, 0, xtr],
	 		   [0, 1, 0, ytr],
			   [0, 0, 1, ztr],
			   [0, 0, 0, 1]];

    
    for (var i = 0; i < (window.objeto.V.length); i++) {
	var N = window.objeto.V[i].N;
	window.objeto.V[i] = vetorMatriz4d(window.objeto.V[i], translateMatrix);
	window.objeto.V[i].N = N;
    }
    // translada COM agora
    window.objeto.COM = vetorMatriz4d(window.objeto.COM, translateMatrix);

    // reordenando as faces por precaucao, mas logicamente nenhum Z
    // mudou relativo a outro
    window.objeto.F = window.objeto.F.sort(function(f1, f2) {
	var f1_mediaZ = (window.objeto.V[f1.a].z +
			 window.objeto.V[f1.b].z +
			 window.objeto.V[f1.c].z)/3;
	var f2_mediaZ = (window.objeto.V[f2.a].z +
			 window.objeto.V[f2.b].z +
			 window.objeto.V[f2.c].z)/3;
	return f1_mediaZ - f2_mediaZ;
    });
    setTimeout(hmmm, 0);
}

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
	var OdIl = window.iluminacao.Od.produtoComponentes(window.iluminacao.Il);
	var Iamb = window.iluminacao.Ia.produtoEscalar(window.iluminacao.ka);
	var Is = OdIl.produtoEscalar(0.5 * window.iluminacao.kd);
	var Id = window.iluminacao.Il.produtoEscalar(Math.pow(0.5, window.iluminacao.n) * window.iluminacao.ks);
	var I = Iamb.mais(Is).mais(Id);

	document.getElementsByTagName("body")[0].style.background =
	    "rgb(" + Math.min(I.x, 255) + "," + Math.min(I.y, 255) +
	    "," + Math.min(I.z, 255) + ")";
    } catch (err) {
	window.alert(err);
    }
    try {
	leitor = new Leitor(window.objFileTxt);
	window.objeto = null;
	window.objeto = leitor.lerObjeto();
	window.objeto.COM = new Ponto(0, 0, 0);
    } catch (err) {
	window.alert(err);
    }

}

function initialSteps() {
    setTimeout(initialStep, 0);
}

function initialStep() {
    disabledButtons(true);
    
    playit();
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

    var CASum = {x: 0, y: 0, z: 0};
    var areasSum = 0;

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

	var ab = window.objeto.V[b].menos(window.objeto.V[a]);
	var ac = window.objeto.V[c].menos(window.objeto.V[a]);

	var cx = (window.objeto.V[a].x +
		  window.objeto.V[b].x +
		  window.objeto.V[c].x) / 3;
	var cy = (window.objeto.V[a].y +
		  window.objeto.V[b].y +
		  window.objeto.V[c].y) / 3;
	var cz = (window.objeto.V[a].z +
		  window.objeto.V[b].z +
		  window.objeto.V[c].z) / 3;

	var area = ab.produtoVetorial(ac).norma * 0.5;
	areasSum += area;
	CASum.x += cx * area;
	CASum.y += cy * area;
	CASum.z += cz * area;

    }

    window.objeto.COM.x = CASum.x/areasSum;
    window.objeto.COM.y = CASum.y/areasSum;
    window.objeto.COM.z = CASum.z/areasSum;

    // ordenando as faces pelo menor Z para melhorar o desempenho do zbuffer
    window.objeto.F = window.objeto.F.sort(function(f1, f2) {
	var f1_mediaZ = (window.objeto.V[f1.a].z +
			 window.objeto.V[f1.b].z +
			 window.objeto.V[f1.c].z)/3;
	var f2_mediaZ = (window.objeto.V[f2.a].z +
			 window.objeto.V[f2.b].z +
			 window.objeto.V[f2.c].z)/3;
	return f1_mediaZ - f2_mediaZ;
    });

    for (i = 0; i < (window.objeto.V.length); i++) {
	// normalizando as normais dos vértices
	window.objeto.V[i].N = (window.objeto.V[i].N).normalizado();

    }

    gl.uniform3f(PlUniformLocation,
		 window.iluminacao.Pl.x,
		 window.iluminacao.Pl.y,
		 window.iluminacao.Pl.z);
    
    gl.uniform3f(IaUniformLocation,
		 window.iluminacao.Ia.x,
		 window.iluminacao.Ia.y,
		 window.iluminacao.Ia.z);
    
    gl.uniform3f(OdUniformLocation,
		 window.iluminacao.Od.x,
		 window.iluminacao.Od.y,
		 window.iluminacao.Od.z);

    gl.uniform3f(IlUniformLocation,
		 window.iluminacao.Il.x,
		 window.iluminacao.Il.y,
		 window.iluminacao.Il.z);

    gl.uniform1f(KaUniformLocation,
		 window.iluminacao.ka);
    
    gl.uniform1f(KsUniformLocation,
		 window.iluminacao.ks);
    
    gl.uniform1f(KdUniformLocation,
		 window.iluminacao.kd);
    
    gl.uniform1f(RugosidadeUniformLocation,
		 window.iluminacao.n);

    console.log('ok');
    setTimeout(hmmm, 0);
}

function fileReadingRoutine(evt) {
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

function playit() {
    window.waitingSong.play();
}



function hmmm() {
    // projetar pontos pra coordenadas da tela
    window.ponto2d = createArray(window.objeto.V.length);
    for (var i = 0; i < (window.objeto.V.length); i++) {
	window.ponto2d[i] = Ponto2d.threeDPD(window.objeto.V[i], i,
					     cv.width, cv.height);
    }

    window.zBuffer = createArray(cv.width, cv.height);
    window.nBuffer = createArray(cv.width, cv.height);
    window.pBuffer = createArray(cv.width, cv.height);
    window.corBuffer = createArray(cv.width, cv.height);
    for (i = 0; i < window.zBuffer.length; i++) {
	window.zBuffer[i] = window.zBuffer[i].fill(Infinity);
    }
    renderObj();
    var positions = [], normals = [], points = [];
    var cores = [];
    for (i = 0; i < window.corBuffer.length; i++) {
	for (var j = 0; j < window.corBuffer[i].length; j++) {
	    if (window.zBuffer[i][j] < Infinity) {
		positions.push(i);
		positions.push(j);

		var normie = window.nBuffer[i][j];

		normals.push(normie.x);
		normals.push(normie.y);
		normals.push(normie.z);

		var pt = window.pBuffer[i][j];

		points.push(pt.x);
		points.push(pt.y);
		points.push(pt.z);
	    }
	}
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
	positionAttributeLocation, size, type, normalize, stride, offset);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    size = 3;
    gl.vertexAttribPointer(
	normalAttributeLocation, size, type, normalize, stride, offset);


    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    size = 3;
    gl.vertexAttribPointer(
	pointAttributeLocation, size, type, normalize, stride, offset);

    

    gl.clearColor(bgColor/255, bgColor/255, bgColor/255, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, positions.length / 2);
    setTimeout(function() {
	window.waitingSong.pause();
	disabledButtons(false);
	disableRotateButtons(false);
	rotationStack = [];
	rotateText.innerHTML = "";
    }, 500);
}

// function zBufHorizontal(xf, scanlineY, v1, v2, a, b, P4, N4) {
//     var lp = lerp(xf, v1, v2);
//     var P, N;
//     var objVa, objVb;
//     if (!a && a != 0) {
// 	objVa = P4;
// 	objVa.N = N4;
//     } else {
// 	objVa = window.objeto.V[a];
//     }
//     if (!b && b != 0) {
// 	objVb = P4;
// 	objVb.N = N4;
//     } else {
// 	objVb = window.objeto.V[b];
//     }
//     if (isNaN(lp.v)) {
// 	if (objVa.z <= objVb.z) {
// 	    P = new Ponto(objVa.x,
// 			  objVa.y,
// 			  objVa.z);
// 	    N = new Vetor(objVa.N.x,
// 			  objVa.N.y,
// 			  objVa.N.z);
// 	} else {
// 	    P = new Ponto(objVb.x,
// 			  objVb.y,
// 			  objVb.z);
// 	    N = new Vetor(objVb.N.x,
// 			  objVb.N.y,
// 			  objVb.N.z);
// 	}
//     } else {
// 	P = new Ponto(objVa.x * lp.u +
// 		      objVb.x * lp.v,
// 		      objVa.y * lp.u +
// 		      objVb.y * lp.v,
// 		      objVa.z * lp.u +
// 		      objVb.z * lp.v);
// 	N = new Vetor(objVa.N.x * lp.u +
// 		      objVb.N.x * lp.v,
// 		      objVa.N.y * lp.u +
// 		      objVb.N.y * lp.v ,
// 		      objVa.N.z * lp.u +
// 		      objVb.N.z * lp.v);
//     }
//     if (xf >= 0 && scanlineY >= 0 &&
// 	xf < cv.width && scanlineY < cv.height &&
// 	P.z <= window.zBuffer[xf][scanlineY]) {
// 	if (P.z <= -1000) {
// 	    debugger;
// 	}
// 	window.zBuffer[xf][scanlineY] = P.z;
// 	window.nBuffer[xf][scanlineY] = N;
// 	window.pBuffer[xf][scanlineY] = P;

// 	//	phong(N, P, xf, scanlineY);
//     }
// }

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
    window.corBuffer[xf][y] = [Math.round(I.x),
			       Math.round(I.y),
			       Math.round(I.z)];
    //	p.stroke(Math.floor(Math.abs(N.x) * 255), Math.floor(Math.abs(N.y) * 255), Math.floor(Math.abs(N.z) * 255));
    //point(xf, y);
}

// function zBufVertical(xf, y, v1, v2, a, b, P4, N4) {
//     var lp = lerp(y, v1, v2);
//     var P, N;
//     var objVa, objVb;
//     if (!a && a != 0) {
// 	objVa = P4;
// 	objVa.N = N4;
//     } else {
// 	objVa = window.objeto.V[a];
//     }
//     if (!b && b != 0) {
// 	objVb = P4;
// 	objVb.N = N4;
//     } else {
// 	objVb = window.objeto.V[b];
//     }
//     if (isNaN(lp.v)) {
// 	if (objVa.z <= objVb.z) {
// 	    P = new Ponto(objVa.x,
// 			  objVa.y,
// 			  objVa.z);
// 	    N = new Vetor(objVa.N.x,
// 			  objVa.N.y,
// 			  objVa.N.z);
// 	} else {
// 	    P = new Ponto(objVb.x,
// 			  objVb.y,
// 			  objVb.z);
// 	    N = new Vetor(objVb.N.x,
// 			  objVb.N.y,
// 			  objVb.N.z);
// 	}
//     } else {
// 	P = new Ponto(objVa.x * lp.u +
// 		      objVb.x * lp.v,
// 		      objVa.y * lp.u +
// 		      objVb.y * lp.v,
// 		      objVa.z * lp.u +
// 		      objVb.z * lp.v);
// 	N = new Vetor(objVa.N.x * lp.u +
// 		      objVb.N.x * lp.v,
// 		      objVa.N.y * lp.u +
// 		      objVb.N.y * lp.v ,
// 		      objVa.N.z * lp.u +
// 		      objVb.N.z * lp.v);
//     }
//     if (xf >= 0 && y >= 0 &&
// 	xf < cv.width && y < cv.height &&
// 	P.z <= window.zBuffer[xf][y]) {
// 	if (P.z <= -1000) {
// 	    debugger;
// 	}
// 	window.zBuffer[xf][y] = P.z;
// 	window.nBuffer[xf][y] = N;
// 	window.pBuffer[xf][y] = P;
	
// 	// phong(N, P, xf, y);
//     }
// }

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
	return;
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
	xf < cv.width && scanlineY < cv.height &&
	P.z <= window.zBuffer[xf][scanlineY]) {
	if (P.z <= -1000) {
	    debugger;
	}
	window.zBuffer[xf][scanlineY] = P.z;
	window.nBuffer[xf][scanlineY] = N;
	window.pBuffer[xf][scanlineY] = P;
	//	phong(N, P, xf, scanlineY);
    }

}

function fillBottomFlatTriangle(v1, v2, v3, a, b, c, P, N) {
    //debugger;
    var invslope1 = (v2.x - v1.x) / (v2.y - v1.y);
    var invslope2 = (v3.x - v1.x) / (v3.y - v1.y);

    var curx1 = v1.x;
    var curx2 = v1.x;

    if (v1.y == v2.y) {
	// caso de uma linha horizontal
	// ou um ponto
	// var arrX = [v1, v2, v3];
	// arrX = arrX.sort(function(a, b) {
	//     return a.x - b.x;
	// });
	// var x0 = arrX[0];
	// var xm = arrX[1];
	// var xf = arrX[2];
	// for (var i = x0.x; i <= xm.x; i++) {
	//     zBufHorizontal(i, v1.y, x0.x, xm.x, x0.originalVertex, xm.originalVertex, P, N);
	// }
	// for (i = xm.x; i <= xf.x; i++) {
	//     zBufHorizontal(i, v1.y, xm.x, xf.x, xm.originalVertex, xf.originalVertex, P, N);
	// }
	// for (i = x0.x; i <= xf.x; i++) {
	//     zBufHorizontal(i, v1.y, x0.x, xf.x, x0.originalVertex, xf.originalVertex, P, N);
	// }
	return;
    } else if (v1.x == v2.x && v1.x == v3.x) {
	// caso de uma linha vertical
	// var arrX = [v1, v2, v3];
	// // v1.y <= v2.y == v3.y
	// for (var i = v1.y; i <= v2.y; i++) {
	//     zBufVertical(v1.x, i, v1.y, v2.y, v1.originalVertex, v2.originalVertex, P, N);
	// }
	// for (i = v2.y; i <= v3.y; i++) {
	//     zBufVertical(v2.x, i, v2.y, v3.y, v2.originalVertex, v3.originalVertex, P, N);
	// }
	// for (i = v3.y; i >= v1.y; i--) {
	//     zBufVertical(v3.x, i, v3.y, v1.y, v3.originalVertex, v1.originalVertex, P, N);
	// }
	return;
    } else {
	for (var scanlineY = v1.y; scanlineY <= v2.y; scanlineY++) {
	    var x = curx1 < curx2 ? curx1 : curx2;
	    var span = Math.abs(curx1 - curx2);
	    for (var i = 0; i <= span; i++, x++) {
		var xf = Math.round(x);
		if (xf < cv.width && scanlineY < cv.height &&
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
    //debugger;
    var v0 = b.menos(a), v1 = c.menos(a), v2 = p.menos(a);
    var invden = 1 / (v0.x * v1.y - v1.x * v0.y);
    var v = (v2.x * v1.y - v1.x * v2.y) * invden;
    var w = (v0.x * v2.y - v2.x * v0.y) * invden;
    var u = 1 - v - w;
    return {u, v, w};
}

function fillTopFlatTriangle(v1, v2, v3, a, b, c, P, N) {
    //debugger;
    var invslope1 = (v3.x - v1.x) / (v3.y - v1.y);
    var invslope2 = (v3.x - v2.x) / (v3.y - v2.y);

    var curx1 = v3.x;
    var curx2 = v3.x;
    if (v1.y == v3.y) {
	// caso de uma linha horizontal
	// ou um ponto
	// var arrX = [v1, v2, v3];
	// arrX = arrX.sort(function(a, b) {
	//     return a.x - b.x;
	// });
	// var x0 = arrX[0];
	// var xm = arrX[1];
	// var xf = arrX[2];
	// for (var i = x0.x; i <= xm.x; i++) {
	//     zBufHorizontal(i, v1.y, x0.x, xm.x, x0.originalVertex, xm.originalVertex, P, N);
	// }
	// for (i = xm.x; i <= xf.x; i++) {
	//     zBufHorizontal(i, v1.y, xm.x, xf.x, xm.originalVertex, xf.originalVertex, P, N);
	// }
	// for (i = x0.x; i <= xf.x; i++) {
	//     zBufHorizontal(i, v1.y, x0.x, xf.x, x0.originalVertex, xf.originalVertex, P, N);
	// }
	return;
    } else if (v1.x == v2.x && v1.x == v3.x) {
	// // caso de uma linha vertical
	// var arrX = [v1, v2, v3];
	// // v1.y <= v2.y == v3.y
	// for (var i = v1.y; i <= v2.y; i++) {
	//     zBufVertical(v1.x, i, v1.y, v2.y, v1.originalVertex, v2.originalVertex, P, N);
	// }
	// for (i = v2.y; i <= v3.y; i++) {
	//     zBufVertical(v2.x, i, v2.y, v3.y, v2.originalVertex, v3.originalVertex, P, N);
	// }
	// for (i = v3.y; i >= v1.y; i--) {
	//     zBufVertical(v3.x, i, v3.y, v1.y, v3.originalVertex, v1.originalVertex, P, N);
	// }
	return;
    } else {
	for (var scanlineY = v3.y; scanlineY > v1.y; scanlineY--) {
	    var x = curx1 < curx2 ? curx1 : curx2;
	    var span = Math.abs(curx1 - curx2);
	    for (var i = 0; i <= span; i++, x++) {
		var xf = Math.round(x);
		if (xf < cv.width && scanlineY < cv.height &&
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
	//debugger;
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
