function Camera(values) {
    var proj = (values.V).projecao(values.N);
    this.V = (values.V).menos(proj);

    this.V = (this.V).normalizado();

    this.N = (values.N).normalizado();

    this.U = (this.N).produtoVetorial(this.V);

    this.h = values.h;
    this.d = values.d;

//    this.I_e_alfa = 
}
