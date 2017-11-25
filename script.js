window.onload = function () { 
    // Checar suporte do browser para File
    if (window.File && window.FileReader && window.FileList && window.Blob) {
	var cameraFileChooser = document.getElementById('cameraFile');
	var lightFileChooser = document.getElementById('lightFile');
	var objectFileChooser = document.getElementById('objectFile');
	cameraFileChooser.addEventListener('change',
					   fileReadingRoutine,
					   false);
	lightFileChooser.addEventListener('change',
					  fileReadingRoutine,
					  false);
	objectFileChooser.addEventListener('change',
					   fileReadingRoutine,
					   false);
    } 
    else { 
	alert("Este navegador não suporta Files");
    } 
};

function fileReadingRoutine(evt) {
    var id = evt.target.id;
    // Pegar o objeto que representa o arquivo escolhido
    var fileTobeRead = document.getElementById(id).files[0];

    // Inicializar o FileReader para ler o arquivo
    var fileReader = new FileReader();

    // Esta função deverá rodar uma vez que o fileReader carregar
    fileReader.onload = function (e) {
	leitor = new Leitor(fileReader.result);
	var values;
	if (id === 'cameraFile') {
	    try {
		values = leitor.lerCamera();
		camera = new Camera(values);
	    	output(syntaxHighlight(JSON.stringify(camera, null, 4)),
		       'chosencamera');} catch (err) {
		window.alert(err);
	    }
	} else if (id === 'lightFile') {
	    try {
		values = leitor.lerIluminacao();
		output(syntaxHighlight(JSON.stringify(values, null, 4)),
		       'chosenlight');
	    } catch (err) {
		window.alert(err);
	    }
	} else if (id === 'objectFile') {
	    try {
		values = leitor.lerObjeto();
		output(syntaxHighlight(JSON.stringify(values, null, 4)),
		       'chosenobject');
	    } catch (err) {
		window.alert(err);
	    }
	}
    };
    
    // lê o arquivo como texto, eventualmente invocando a função acima
    fileReader.readAsText(fileTobeRead);
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;')
	.replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function output(inp, id) {
    var div = document.getElementById(id);
    div.innerHTML = '';
    div.appendChild(document.createElement('pre'))
	.innerHTML = inp;
}
