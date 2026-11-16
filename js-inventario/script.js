const productos = [
    { nombre: "Arroz", categoria: "Granos", precio: 4500, cantidad: 25, minimo: 10 },
    { nombre: "Aceite", categoria: "Despensa", precio: 12000, cantidad: 3, minimo: 5 },
    { nombre: "Azúcar", categoria: "Despensa", precio: 3800, cantidad: 0, minimo: 8 },
    { nombre: "Café", categoria: "Bebidas", precio: 18500, cantidad: 8, minimo: 4 },
    { nombre: "Leche", categoria: "Lácteos", precio: 4200, cantidad: 2, minimo: 6 },
    { nombre: "Panela", categoria: "Despensa", precio: 3000, cantidad: 15, minimo: 10 },
    { nombre: "Queso", categoria: "Lácteos", precio: 9800, cantidad: 4, minimo: 5 },
    { nombre: "Jugo", categoria: "Bebidas", precio: 5200, cantidad: 4, minimo: 3 }
];

const cuerpoTabla = document.getElementById("cuerpo-tabla");
const resumen = document.getElementById("resumen");
const formatoMoneda = (valor) => "$" + valor.toLocaleString("es-CO");

function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
}

function agregarDatoResumen(etiqueta, valor, esTotal = false) {
    const elemento = document.createElement("p");
    elemento.classList.add("resumen-item");
    if (esTotal) {
        elemento.classList.add("resumen-item-total");
    }

    elemento.textContent = etiqueta;
    const valorElemento = document.createElement("strong");
    valorElemento.textContent = valor;
    elemento.appendChild(valorElemento);
    resumen.appendChild(elemento);
}

function mostrarInventario() {
    cuerpoTabla.innerHTML = "";
    resumen.innerHTML = "";

    let totalAgotados = 0;
    let totalBajoStock = 0;
    let unidadesAPedir = 0;
    let valorInventario = 0;
    let mayorSubtotal = -1;
    let filaMayor = null;
    let nombreMayor = "";

    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        const subtotal = producto.precio * producto.cantidad;
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(producto.nombre));

        const tdCategoria = document.createElement("td");
        const etiqueta = document.createElement("span");
        etiqueta.textContent = producto.categoria;
        etiqueta.classList.add("etiqueta");

        if (producto.categoria === "Granos") {
            etiqueta.style.backgroundColor = "#8d6e63";
        } else if (producto.categoria === "Despensa") {
            etiqueta.style.backgroundColor = "#6f42c1";
        } else if (producto.categoria === "Bebidas") {
            etiqueta.style.backgroundColor = "#0d6efd";
        } else if (producto.categoria === "Lácteos") {
            etiqueta.style.backgroundColor = "#20c997";
        } else {
            etiqueta.style.backgroundColor = "gray";
        }
        tdCategoria.appendChild(etiqueta);
        fila.appendChild(tdCategoria);

        const tdPrecio = crearCelda(formatoMoneda(producto.precio));
        if (producto.precio > 10000) {
            tdPrecio.style.fontWeight = "bold";
        }
        fila.appendChild(tdPrecio);

        const tdCantidad = document.createElement("td");
        const controles = document.createElement("div");
        controles.classList.add("controles-cantidad");

        const btnMenos = document.createElement("button");
        btnMenos.type = "button";
        btnMenos.textContent = "−";
        btnMenos.classList.add("btn", "btn-menos");
        btnMenos.setAttribute("aria-label", "Disminuir cantidad de " + producto.nombre);
        btnMenos.disabled = producto.cantidad === 0;
        btnMenos.addEventListener("click", function () {
            if (productos[i].cantidad > 0) {
                productos[i].cantidad--;
                mostrarInventario();
            }
        });

        const numero = document.createElement("span");
        numero.textContent = producto.cantidad;
        numero.classList.add("numero");
        numero.setAttribute("aria-label", producto.cantidad + " unidades");

        const btnMas = document.createElement("button");
        btnMas.type = "button";
        btnMas.textContent = "+";
        btnMas.classList.add("btn", "btn-mas");
        btnMas.setAttribute("aria-label", "Aumentar cantidad de " + producto.nombre);
        btnMas.addEventListener("click", function () {
            productos[i].cantidad++;
            mostrarInventario();
        });

        controles.appendChild(btnMenos);
        controles.appendChild(numero);
        controles.appendChild(btnMas);
        tdCantidad.appendChild(controles);
        fila.appendChild(tdCantidad);

        fila.appendChild(crearCelda(producto.minimo));
        fila.appendChild(crearCelda(formatoMoneda(subtotal)));

        const tdEstado = document.createElement("td");
        const estado = document.createElement("span");
        estado.classList.add("estado-texto");
        if (producto.cantidad === 0) {
            fila.classList.add("agotado");
            const faltan = producto.minimo;
            estado.textContent = "AGOTADO - pedir " + faltan;
            estado.classList.add("estado-agotado");
            totalAgotados++;
            unidadesAPedir += faltan;
        } else if (producto.cantidad < producto.minimo) {
            fila.classList.add("bajo-stock");
            const faltan = producto.minimo - producto.cantidad;
            estado.textContent = "Bajo stock - pedir " + faltan;
            estado.classList.add("estado-bajo");
            totalBajoStock++;
            unidadesAPedir += faltan;
        } else {
            fila.classList.add("disponible");
            estado.textContent = "OK";
            estado.classList.add("estado-disponible");
        }
        tdEstado.appendChild(estado);
        fila.appendChild(tdEstado);
        cuerpoTabla.appendChild(fila);

        valorInventario += subtotal;
        if (subtotal > mayorSubtotal) {
            mayorSubtotal = subtotal;
            filaMayor = fila;
            nombreMayor = producto.nombre;
        }
    }

    if (filaMayor) {
        filaMayor.classList.add("destacado");
    }

    agregarDatoResumen("Productos agotados", totalAgotados);
    agregarDatoResumen("Productos con bajo stock", totalBajoStock);
    agregarDatoResumen("Unidades a pedir", unidadesAPedir);
    agregarDatoResumen("Producto con mayor valor", nombreMayor + " (" + formatoMoneda(mayorSubtotal) + ")");
    agregarDatoResumen("Valor total del inventario", formatoMoneda(valorInventario), true);
}

mostrarInventario();
