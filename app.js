let preguntas = [];
let preguntasFiltradas = [];
let indice = 0;
let puntaje = 0;
let timerInterval;

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
const resultadoTexto = document.getElementById('resultadoTexto');
const reiniciarBtn = document.getElementById('reiniciarBtn');
const timerBar = document.getElementById('timer');

// Carga las preguntas desde datos.json y llena el select de temas
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

// Evento para iniciar el quiz o reflexión
iniciarBtn.addEventListener('click', () => {
  const tipo = tipoSelect.value;
  const tema = temaSelect.value;

  if (!tipo) return alert('Por favor selecciona un tipo de pregunta');
  if (!tema) return alert('Por favor selecciona un tema');

  preguntasFiltradas = preguntas.filter(p => p.tema === tema && p.tipo === tipo);
  if (preguntasFiltradas.length === 0) {
    alert('No hay preguntas para esta combinación de tema y tipo');
    return;
  }

  // Reiniciar estados
  indice = 0;
  puntaje = 0;

  // Ocultar selección y mostrar contenido
  document.getElementById('seleccion').classList.add('oculto');
  contenido.classList.remove('oculto');
  resultadoContainer.classList.add('oculto');

  mostrarPregunta();
});

function mostrarPregunta() {
  clearInterval(timerInterval);
  timerBar.style.background = 'green';
  timerBar.style.width = '100%';
  timerBar.classList.remove('oculto');

  const actual = preguntasFiltradas[indice];
  preguntaContainer.textContent = actual.pregunta;
  opcionesContainer.innerHTML = '';
  respuestaContainer.classList.add('oculto');
  mostrarRespuestaBtn.classList.add('oculto');
  siguienteBtn.classList.add('oculto');

  if (actual.tipo === 'quiz') {
    opcionesContainer.classList.remove('oculto');
    // El índice de la opción correcta (0 = respuesta correcta)
    // Desordenar opciones para no mostrar siempre igual
    const opciones = [actual.respuesta, actual.opcion_1, actual.opcion_2, actual.opcion_3].filter(Boolean);
    // Mezclar opciones
    const opcionesMezcladas = opciones
      .map(op => ({ op, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(obj => obj.op);

    opcionesMezcladas.forEach(op => {
      const btn = document.createElement('button');
      btn.textContent = op;
      btn.onclick = () => {
        // Deshabilitar botones
        Array.from(opcionesContainer.children).forEach(b => b.disabled = true);

        if (op === actual.respuesta) {
          btn.style.background = 'green';
          puntaje++;
        } else {
          btn.style.background = 'red';
          // Mostrar la opción correcta en verde
          Array.from(opcionesContainer.children).forEach(b => {
            if (b.textContent === actual.respuesta) b.style.background = 'green';
          });
        }

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
    if (duracion > 20) {
      timerBar.style.background = 'green';
    } else if (duracion > 10) {
      timerBar.style.background = 'yellow';
    } else {
      timerBar.style.background = 'red';
    }
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
  resultadoTexto.textContent = `Completado. Puntaje: ${puntaje} / ${preguntasFiltradas.length}`;
}

// Reiniciar al inicio
reiniciarBtn.addEventListener('click', () => {
  resultadoContainer.classList.add('oculto');
  document.getElementById('seleccion').classList.remove('oculto');
  tipoSelect.value = '';
  temaSelect.value = '';
  contenido.classList.add('oculto');
  indice = 0;
  puntaje = 0;
  clearInterval(timerInterval);
  timerBar.classList.add('oculto');
});
