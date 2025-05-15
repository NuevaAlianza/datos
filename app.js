 let preguntas = [];
let preguntasFiltradas = [];
let indice = 0;
let puntaje = 0;
let timerInterval;
let tipoSeleccionado = '';

const tipoSelect = document.getElementById('tipoSelect');
const temaSelect = document.getElementById('temaSelect');
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
  tipoSeleccionado = tipoSelect.value;
  const tema = temaSelect.value;
  if (!tipoSeleccionado) return alert('Por favor selecciona un tipo (Reflexión o Quiz)');
  if (!tema) return alert('Por favor selecciona un tema');

  preguntasFiltradas = preguntas.filter(p => p.tema === tema && p.tipo === tipoSeleccionado);
  if (preguntasFiltradas.length === 0) {
    alert('No hay preguntas para este tema y tipo seleccionado');
    return;
  }
  indice = 0;
  puntaje = 0;
  contenido.classList.remove('oculto');
  resultadoContainer.classList.add('oculto');
  document.getElementById('seleccion').classList.add('oculto'); // ocultar selección al iniciar
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
        // Deshabilitar todos botones para evitar múltiples clicks
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

  let porcentaje = Math.round((puntaje / preguntasFiltradas.length) * 100);
  let mensajeFinal = '';

  if (porcentaje <= 75) {
    mensajeFinal = 'Sigamos creciendo juntos. Compartiendo más en comunidad, seremos mejores.';
  } else if (porcentaje > 75 && porcentaje <= 87) {
    mensajeFinal = '¡Estás encaminado! Tu conocimiento es bueno y puede inspirar a otros.';
  } else {
    mensajeFinal = '¡Eres un iluminado de la Palabra! Sigue brillando y guiando con sabiduría.';
  }

  resultadoContainer.innerHTML = `
    <h2>Completado</h2>
    <p>Puntaje: ${puntaje} / ${preguntasFiltradas.length} (${porcentaje}%)</p>
    <p>${mensajeFinal}</p>
    <button id="reiniciarBtn">Reiniciar</button>
  `;

  // Mostrar selección otra vez al reiniciar
  document.getElementById('reiniciarBtn').addEventListener('click', () => {
    resultadoContainer.classList.add('oculto');
    contenido.classList.add('oculto');
    document.getElementById('seleccion').classList.remove('oculto');
    tipoSelect.value = '';
    temaSelect.value = '';
  });
}
