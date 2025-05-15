let preguntas = [];
let preguntasFiltradas = [];
let indice = 0;
let puntaje = 0;
let timerInterval;

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

fetch('preguntas.json')
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
  });

iniciarBtn.addEventListener('click', () => {
  const tema = temaSelect.value;
  preguntasFiltradas = preguntas.filter(p => p.tema === tema);
  indice = 0;
  puntaje = 0;
  contenido.classList.remove('oculto');
  resultadoContainer.classList.add('oculto');
  mostrarPregunta();
});

function mostrarPregunta() {
  clearInterval(timerInterval);
  const actual = preguntasFiltradas[indice];
  preguntaContainer.textContent = actual.pregunta;
  opcionesContainer.innerHTML = '';
  respuestaContainer.classList.add('oculto');
  mostrarRespuestaBtn.classList.add('oculto');
  siguienteBtn.classList.add('oculto');
  timerBar.classList.add('oculto');
  timerBar.style.width = '100%';

  if (actual.tipo === 'quiz') {
    const opciones = [actual.respuesta, actual.opcion_1, actual.opcion_2, actual.opcion_3];
    opciones.forEach((op, i) => {
      const btn = document.createElement('button');
      btn.textContent = op;
      btn.onclick = () => {
        if (i === actual.correcta) {
          btn.style.background = 'green';
          puntaje++;
        } else {
          btn.style.background = 'red';
        }
        siguienteBtn.classList.remove('oculto');
      };
      opcionesContainer.appendChild(btn);
    });
    opcionesContainer.classList.remove('oculto');
  } else {
    respuestaContainer.textContent = actual.respuesta;
    mostrarRespuestaBtn.classList.remove('oculto');
    timerBar.classList.remove('oculto');
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
  resultadoContainer.textContent = `Completado. Puntaje: ${puntaje} / ${preguntasFiltradas.length}`;
}
