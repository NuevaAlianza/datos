let preguntas = [];
let preguntasFiltradas = [];
let indice = 0;
let puntaje = 0;
let tipoSeleccionado = '';
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
const timerBar = document.getElementById('timer');
const reiniciarBtn = document.getElementById('reiniciarBtn');

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
  if (!tipoSeleccionado || !tema) return alert('Por favor selecciona tipo y tema');

  preguntasFiltradas = preguntas.filter(p => p.tema === tema && p.tipo === tipoSeleccionado);
  if (preguntasFiltradas.length === 0) {
    alert('No hay preguntas para esta combinación');
    return;
  }

  preguntasFiltradas = preguntasFiltradas.sort(() => Math.random() - 0.5);
  indice = 0;
  puntaje = 0;
  contenido.classList.remove('oculto');
  resultadoContainer.classList.add('oculto');
  reiniciarBtn.classList.add('oculto');
  document.getElementById('seleccion').classList.add('oculto');
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
    const opciones = [actual.respuesta, actual.opcion_1, actual.opcion_2, actual.opcion_3]
      .map((text, i) => ({ text: text || '---', index: i }));
    opciones.sort(() => Math.random() - 0.5);

    opcionesContainer.classList.remove('oculto');
    opciones.forEach((op, i) => {
      const btn = document.createElement('button');
      btn.textContent = op.text;
      btn.onclick = () => {
        if (op.index === actual.correcta) {
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

reiniciarBtn.addEventListener('click', () => {
  document.getElementById('seleccion').classList.remove('oculto');
  contenido.classList.add('oculto');
  resultadoContainer.classList.add('oculto');
  reiniciarBtn.classList.add('oculto');
});

function mostrarResultado() {
  contenido.classList.add('oculto');
  resultadoContainer.classList.remove('oculto');
  reiniciarBtn.classList.remove('oculto');

  if (tipoSeleccionado === 'quiz') {
    const porcentaje = (puntaje / preguntasFiltradas.length) * 100;
    let mensaje = '';

    if (porcentaje <= 75) {
      mensaje = 'Sigamos creciendo juntos. Compartiendo más en comunidad, seremos mejores.';
    } else if (porcentaje <= 87) {
      mensaje = '¡Estás encaminado! Tu conocimiento es bueno y puede inspirar a otros.';
    } else {
      mensaje = '¡Eres un iluminado de la Palabra! Sigue brillando y guiando con sabiduría.';
    }

    resultadoContainer.innerHTML = `
      <h2>Completado</h2>
      <p>Puntaje: ${puntaje} / ${preguntasFiltradas.length} (${porcentaje.toFixed(1)}%)</p>
      <p><strong>${mensaje}</strong></p>
    `;
  } else {
    const frasesReflexion = [
      'Gracias por dedicar tiempo a reflexionar.',
      'Tu búsqueda te transforma.',
      'El corazón que reflexiona es tierra fértil.',
      '¡Sigue profundizando! Dios habla al alma atenta.'
    ];
    const aleatoria = frasesReflexion[Math.floor(Math.random() * frasesReflexion.length)];
    resultadoContainer.innerHTML = `<h2>Gracias por Reflexionar</h2><p>${aleatoria}</p>`;
  }
}
