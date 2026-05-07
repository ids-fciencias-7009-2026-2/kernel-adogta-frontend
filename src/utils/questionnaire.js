export const preguntasCuestionario = [
  {
    id: 'tiempoEjercicio',
    label: '¿Cómo describirías tu nivel de actividad física diaria?',
    options: [
      { label: 'Sedentario', value: 'SEDENTARIO' },
      { label: 'Moderado', value: 'MODERADO' },
      { label: 'Intenso', value: 'INTENSO' }
    ]
  },
  {
    id: 'tiempoSoledad',
    label: '¿Cuántas horas al día pasará la mascota sin supervisión humana?',
    options: [
      { label: 'Menos de 4h', value: 'MENOS_DE_4H' },
      { label: 'De 4h a 8h', value: 'DE_4H_A_8H' },
      { label: 'Más de 8h', value: 'MAS_DE_8H' }
    ]
  },
  {
    id: 'tieneNiños',
    label: '¿Viven niños en el hogar?',
    options: [
      { label: 'Si', value: 'SI' },
      { label: 'No', value: 'NO' }
    ]
  },
  {
    id: 'tieneMascotas',
    label: '¿Tienes otras mascotas actualmente?',
    options: [
      { label: 'Si', value: 'SI' },
      { label: 'No', value: 'NO' }
    ]
  },
  {
    id: 'tieneAlergias',
    label: '¿Alguien en casa tiene alergias diagnosticadas?',
    options: [
      { label: 'Si', value: 'SI' },
      { label: 'No', value: 'NO' }
    ]
  },
  {
    id: 'presupuesto',
    label: '¿Cuál es tu ingreso mensual promedio?',
    options: [
      { label: 'Menos de $10,000', value: 'MENOS_DE_10K' },
      { label: 'Entre $10,000 y $20,000', value: 'DE_10K_A_20K' },
      { label: 'Más de $20,000', value: 'MAS_DE_20K' }
    ]
  }
];

export const mapearCuestionarioAPayload = (respuestas) => ({
  presupuesto: respuestas.presupuesto,
  tieneAlergias: respuestas.tieneAlergias,
  fechaEnvio: new Date().toISOString().slice(0, 10),
  tieneMascotas: respuestas.tieneMascotas,
  tiempoEjercicio: respuestas.tiempoEjercicio,
  tiempoSoledad: respuestas.tiempoSoledad,
  tieneNiños: respuestas.tieneNiños
});
