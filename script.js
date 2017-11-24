window.onload = function () { 
    // Checar suporte do browser para File
    if (window.File && window.FileReader && window.FileList && window.Blob) {
	var cameraFileSelected = document.getElementById('cameraFile');
	cameraFileSelected.addEventListener('change', function (e) { 
            // Pegar o objeto que representa o arquivo escolhido
            var fileTobeRead = cameraFileSelected.files[0];

	    chosencamera = document.getElementById('chosencamera');
	    chosencamera.innerText = fileTobeRead.name + ':';

	    // Inicializar o FileReader para ler o arquivo
	    var fileReader = new FileReader();

	    // Esta função deverá rodar uma vez que o fileReader carregar
	    fileReader.onload = function (e) { 
                var fileContents = document.getElementById('filecontents');
		leitor = new Leitor(fileReader.result);
		cameraValues = leitor.lerCamera();
		// cameraValues é um vetor com
		// os vetores C, N e V cada um (x,y,z),
		// o escalar d
		// e o vetor h (x,y)
		fileContents.innerText = 'Cx: ' + cameraValues.C.x +
		    ', Cy: ' + cameraValues.C.y + ', Cz: ' + cameraValues.C.z +
		    '\nNx: ' + cameraValues.N.x + ', Ny: ' + cameraValues.N.y +
		    ', Nz: ' + cameraValues.N.z + '\nVx: ' + cameraValues.V.x +
		    ', Vy: ' + cameraValues.V.y + ', Vz: ' + cameraValues.V.z +
		    '\nd: ' + cameraValues.d + ', hx: ' + cameraValues.h.x +
		    ', hy: ' + cameraValues.h.y;
	    }
	    
	    // lê o arquivo como texto, eventualmente invocando a função acima
	    fileReader.readAsText(fileTobeRead); 
	}, false);
    } 
    else { 
	alert("Este navegador não suporta Files");
    } 
}
