<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Registro de horarios</div>
    <q-form @submit="registrarHorario">
      <q-input v-model="fecha" type="date" label="Fecha" class="q-mb-md" />
      <q-input
        v-model="horaEntrada"
        type="time"
        label="Hora de entrada"
        class="q-mb-md"
      />
      <q-input
        v-model="horaSalida"
        type="time"
        label="Hora de salida"
        class="q-mb-md"
      />
      <div class="q-mt-md">
        <q-btn type="submit" label="Registrar" color="primary" />
      </div>
    </q-form>
    <q-table :rows="horarios" class="q-mt-md"> </q-table>
    <q-btn
      @click="calcularHorasTrabajadas"
      label="Calcular Horas Trabajadas"
      class="q-mt-md"
      color="primary"
    />
    <q-card class="q-mt-md">
      <q-card-section>Horas trabajadas: {{ horasTrabajadas }}</q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
const horasTrabajadas = ref(0);
const horarios = ref([]);
const fecha = ref(new Date().toISOString().substr(0, 10));
const horaEntrada = ref(
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
);
const ahora = new Date();
ahora.setHours(ahora.getHours() + 2);
const horaSalida = ref(
  ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
);
const obtenerHorarios = () => {
  const horariosRegistrados =
    JSON.parse(localStorage.getItem('horarios')) || [];
  horarios.value = horariosRegistrados;
};
const registrarHorario = async () => {
  try {
    const horario = {
      fecha: fecha.value,
      horaEntrada: horaEntrada.value,
      horaSalida: horaSalida.value,
    };
    const horariosRegistrados =
      JSON.parse(localStorage.getItem('horarios')) || [];
    horariosRegistrados.push(horario);
    localStorage.setItem('horarios', JSON.stringify(horariosRegistrados));
    console.log('Horario registrado con ID:', horariosRegistrados.length);
    obtenerHorarios();
  } catch (error) {
    console.error('Error al registrar horario:', error);
  }
};
obtenerHorarios();
const calcularHorasTrabajadas = () => {
  const totalHorasTrabajadas = horarios.value.reduce((total, horario) => {
    const horaEntrada = new Date(`2000-01-01T${horario.horaEntrada}`);
    const horaSalida = new Date(`2000-01-01T${horario.horaSalida}`);
    const horasTrabajadas = (horaSalida - horaEntrada) / 1000 / 60 / 60;
    return total + horasTrabajadas;
  }, 0);
  horasTrabajadas.value = totalHorasTrabajadas;
};
</script>

<style>
.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-weight-medium {
  font-weight: 500;
}
</style>
