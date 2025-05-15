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

    // Vaciar opciones previas si se reinicia
    temaSelect.innerHTML = '<option value="">-- Selecciona tema --</option>';

    const temasUnicos = [...new Set(preguntas.map(p => p.tema))];
    temasUnicos.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      temaSelect.appendChild(opt);
    });

    // Habilitar el select si estaba deshabilitado
    temaSelect.disabled = false;
  })
  .catch(err => {
    console.error('Error cargando preguntas:', err);
    alert('No se pudieron cargar las preguntas.');
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
      btn.textContent =
