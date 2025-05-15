let preguntas = [];
let preguntasFiltradas = [];
let indice = 0;
let puntaje = 0;
let timerInterval;
let tipoSeleccionado = "";

const temaSelect = document.getElementById('temaSelect');
const tipoSelect = document.getElementById('tipoSelect');
const iniciarBtn = document.getElementById('iniciarBtn');
const contenido = document.getElementById('contenido');
const preguntaContainer = document.getElementById('pregunta-container');
const opcionesContainer = document.getElementById('opciones-container');
const respuestaContainer = document.getElementById('respuesta-container');
const mostrarRespuestaBtn = document.getElementById('mostrarRespuestaBtn');
const siguienteBtn = document.getElementById('siguienteBtn');
const resultadoContainer = document.getElementById('resultado-container');
const timerBar = document.getElementById('timer');

fetch('datos.json')
  .then(res => res.json())
  .then(data => {
    preguntas = data;
    const temasUnicos = [...new Set(preguntas.map(p => p.tema))];
    temasUnicos.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      temaSelect.appendChild(opt);
    });
  })
  .catch(err => {
    console.error('Error cargando preguntas:', err);
  });

iniciarBtn.addEventListener('click', () => {
  if (iniciarBtn.textContent === "Volver al inicio") {
    // Reset al inicio
    contenido.classList.add('oculto');
    resultadoContainer.classList.add('oculto');
    iniciarBtn.textContent = "Iniciar";
    temaSelect.disabled = false;
    tipoSelect.disabled = false;
    temaSelect.value = "";
    tipoSelect.value = "";
    return;
  }

  const tema = temaSelect.value;
  tipoSeleccionado = tipoSelect.value;

  if (!tema) return alert('Por favor selecciona un tema');
  if (!tipoSeleccionado) return alert('Por favor selecciona un tipo');

  preguntasFiltradas = preguntas.filter(p => p.tema === tema && p.tipo === tipoSeleccionado);
  if (preguntasFiltradas.length === 0) {
    alert('No hay preguntas para este tema y tipo seleccionado');
    return;
  }
  indice = 0;
  puntaje = 0;

  contenido.classList.remove('oculto');
  resultadoContainer.classList.add('oculto');

  temaSelect.disabled = true;
  tipoSelect.disabled = true;
  iniciarBtn.disabled = true;

  mostrarPregunta();
});

function mostrarPregunta() {
  clearInterval(timerInterval);
  timerBar.style.background = 'green';
  timerBar.style.width = '100%';

  const actual = preguntasFiltradas[indice];
  preguntaContainer.textContent = actual.pregunta;
  opcionesContainer.innerHTML = '';
  respuestaContainer.classList.add('oculto');
  mostrarRespuestaBtn.classList.add('oculto');
  siguienteBtn.classList.add('oculto');
  timerBar.classList.remove('oculto');

  if (tipoSeleccionado === 'quiz') {
    const opciones = [actual.respuesta, actual.opcion_1, actual.opcion_2, actual.opcion_3];
    opcionesContainer.classList.remove('oculto');
    opciones.forEach((op, i) => {
      const btn = document.createElement('button');
      btn.textContent = op || '---';
      btn.onclick = () => {
        if (i === actual.correcta) {
          btn.style.background = 'green';
          puntaje++;
        } else {
          btn.style.background = 'red';
        }
        Array.from(opcionesContainer.children).forEach(b => b.disabled = true);
        siguienteBtn.classList.remove('oculto');
        clearInterval(timerInterval);
        timerBar.classList.add('oculto');
      };
      opcionesContainer.appendChild(btn);
    });
  } else {
    // Reflexión
    opcionesContainer.classList.add('oculto');
    respuestaContainer.textContent = actual.respuesta;
    mostrarRespuestaBtn.classList.remove('oculto');
    iniciarTemporizador();
  }
}

function iniciarTemporizador() {
  let duracion = 58;
  timerInterval = setInterval(() => {
    duracion--;
    timerBar.style.width = `${(duracion / 58) * 100}%`;
    if (duracion <= 20) timerBar.style.background = 'yellow';
    if (duracion <= 10) timerBar.style.background = 'red';
    if (duracion <= 0) {
      clearInterval(timerInterval);
      mostrarRespuestaBtn.classList.remove('oculto');
      siguienteBtn.classList.remove('oculto');
    }
  }, 1000);
}

mostrarRespuestaBtn.addEventListener('click', () => {
  respuestaContainer.classList.remove('oculto');
  mostrarRespuestaBtn.classList.add('oculto');
  siguienteBtn.classList.remove('oculto');
});

siguienteBtn.addEventListener('click', () => {
  indice++;
  if (indice < preguntasFiltradas.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
});

function mostrarResultado() {
  contenido.classList.add('oculto');
  resultadoContainer.classList.remove('oculto');

  if (tipoSeleccionado === 'reflexion') {
    const mensajesMotivadores = [
      "Gracias por dedicar tiempo a reflexionar. Que estas palabras sigan iluminando tu camino cada día.",
      "La reflexión es el primer paso hacia la transformación. Sigue creciendo en sabiduría y fe.",
      "Cada momento de reflexión fortalece tu espíritu. Que esta experiencia te impulse a seguir adelante.",
      "El camino hacia el crecimiento personal se construye con reflexión. ¡Sigue adelante con fe y esperanza!",
      "Reflexionar es abrir el corazón. Que esta experiencia te acerque más a la paz y la luz interior."
    ];
    const mensaje = mensajesMotivadores[Math.floor(Math.random() * mensajesMotivadores.length)];
    resultadoContainer.textContent = mensaje;
  } else {
    const porcentaje = (puntaje / preguntasFiltradas.length) * 100;
    let frase = "";
    if (porcentaje < 75) {
      frase = "Si compartimos un poco más en comunidad seremos mejores.";
    } else if (porcentaje < 87) {
      frase = "Estás encaminado. Eres bueno.";
    } else {
      frase = "Eres un iluminado de la palabra.";
    }
    resultadoContainer.textContent = `Completado. Puntaje: ${puntaje} / ${preguntasFiltradas.length} (${porcentaje.toFixed(2)}%). ${frase}`;
  }

  iniciarBtn.textContent = "Volver al inicio";
  iniciarBtn.classList.remove('oculto');
  iniciarBtn.disabled = false;

  mostrarRespuestaBtn.classList.add('oculto');
  siguienteBtn.classList.add('oculto');
}
