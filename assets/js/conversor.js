const form = document.getElementById("formulario"); // llamando a mi etiqueta form que es la caja donde tengo todo dentro mi input, elijir moneda dolar,euro,uf y tengo el button buscar y el total calulado
const chartss = document.getElementById("myChartt"); // este es donde voy a pintar mi grafico
let myChart; // solo la estoy llamando nomas, esto esta en la biblioteca, En realidad, el nombre de la clase que proporciona la biblioteca Chart.js es Chart

//aqui traemos la informacion de la api
const obtenerDatosMoneda = async (moneda) => {
  //aqui le pase moneda como parametro, ya que quiero este aqui la informacion, donde sale dolar,euro,uf, en mi html le tengo selec name="moneda" por eso
  try {
    const valores = await fetch(`https://mindicador.cl/api/${moneda}`);
    const resultados = await valores.json();
    return resultados.serie; //serie es un array que trae ese array que yo le estoy pidiendo, en este caso moneda
  } catch (error) {
    alert(error.message);
  }
};

// esta es la logica cuando se convierta la moneda
const calcularTotalEnMoneda = (valor, datos) => {
  const valorMoneda = datos[0].valor; //aqui le estoy diciendo que me pase el primer valor de euroo,dolar,uf osea el mas actualizado, osea tendria el valor del dolar mas reciente
  const total = valor / valorMoneda; // en este que caso supongamos que le pasamos un valor : 1000  / entonces se divide por el dolar actual supongamos que esta a 800
  return Math.round(total * 100) / 100; // el math.round lo que hace esque el resultado me lo dara hasta en 2 decimales nomas, osino serian muchos,
};

//esta es la logica para cuando queremos pintar el resulado de la conversion de la moneda, la pintamos aca
const mostrarTotalEnPantalla = (total) => {
  document.getElementById("total-valor").innerHTML = total;
};
//aqui yo estoy obteniendo los valores
const tenerValores = (datos) => {
  //esto es para obtener los valores de la moneda , es solo la logica
  return datos.map((item) => item.valor);
};
// aqui estoy obteniendo las fechas
const tenerFechas = (datos) => {
  return datos
    .map((item) => new Date(item.fecha).toLocaleDateString("en-US"))
    .slice(0, 10); // tolocaleDateString, es cambiar el formato de la fecha y le pasamos la de estados unidos quedaria mm//dd//a
};

//esto es para cuando yo cambie de dolar a euro y quiero mostrar nuevamente el grafico, esto hace que se me elimine el grafico anterior, para que asi no se copie
const borrarGraficoAnterior = () => {
  if (myChart) {
    myChart.destroy();
  }
};

const calcularValorMonedaActual = async (valor, moneda) => {
  const datos = await obtenerDatosMoneda(moneda);
  mostrarGrafico(datos, valor); // me va a mostrar el cambio de la moneda calculada y el cambio del grafico
};

const mostrarGrafico = (datos, valor) => {
  const total = calcularTotalEnMoneda(valor, datos);
  mostrarTotalEnPantalla(total);
  const labels = tenerFechas(datos); //obtengo las fechas
  const values = tenerValores(datos); //obtengo los datos, el tipo de moneda
  const datasets = [
    {
      label: "Moneda",
      borderColor: "gold",
      data: values,
    },
  ];
  const config = {
    type: "line",
    data: { labels, datasets },
  };

  borrarGraficoAnterior();
  chartss.style.backgroundColor = "white";
  chartss.style.borderRadius = "1rem";
  chartss.style.border = "4px rgb(1, 33, 59) solid";

  myChart = new Chart(chartss, config); // se va a crear un grafico nuevo
};

form.addEventListener("submit", async (event) => {
  //el beneficio de ocupar form esque se actualiza solo
  event.preventDefault(); //loque hace es que no se actualiza el formulario por defecto
  const valor = form.elements["valor"].value; //valor del input que va a escribir el usuario
  const moneda = form.elements["moneda"].value; //moneda es el nombre de nuestro select, que es cuando seleccione
  if (!valor) {
    alert("Ingresar Monto");
    return;
  }

  if (!moneda) {
    alert("Seleccione Tipo De Cambio");
    return;
  }

  await calcularValorMonedaActual(valor, moneda);
});

//cambiando tittle
window.addEventListener("blur", () => {
  previousTittle = document.title;
  document.title = "Te Espera El Cambio😎";
});
window.addEventListener("focus", () => {
  document.title = previousTittle;
});
