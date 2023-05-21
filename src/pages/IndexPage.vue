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
    <q-table :rows="horarios" class="q-mt-md q-table">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="negative" round dense @click="eliminarHorario(props.rowIndex)" icon="delete" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-btn
      @click="calcularHorasTrabajadas"
      label="Calcular Horas Trabajadas"
      class="q-mt-md"
      color="primary"
    />
    <q-card class="q-mt-md">
      Horas trabajadas: <q-badge outline color="dark" :label="horasTrabajadas" />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Db, dbRef, set, update, Auth, onValue, onAuthStateChanged } from 'boot/firebase';

const user = ref(null);

onMounted(() => {
  console.log('onMounted')
  const unsubscribe = Auth.onAuthStateChanged((currentUser) => {
    user.value = currentUser;
    if (currentUser) {
      obtenerHorarios();
    } else {
      horarios.value = [];
    }
  });

  onUnmounted(unsubscribe);
});

const mnsj = ref('hola')
const horasTrabajadas = ref('');
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
const user = Auth.currentUser;
  if (user) {
    const starCountRef = dbRef(Db, `users/${user.uid}/horariosRegistrados`);
    onValue(starCountRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const horariosRegistrados = Object.values(data);
        horarios.value = horariosRegistrados;
      } else {
        horarios.value = [];
      }
    });
  } else {
    horarios.value = [];
  }
};
const registrarHorario = async () => {
  try {
    const horario = {
      fecha: fecha.value,
      horaEntrada: horaEntrada.value,
      horaSalida: horaSalida.value,
    };
    const horariosRegistrados = horarios.value;
    horariosRegistrados.push(horario);
    const user = Auth.currentUser;
    set(dbRef(Db, `users/${user.uid}` ), { horariosRegistrados });
    // obtenerHorarios();
  } catch (error) {
    console.error('Error al registrar horario:', error);
  }
};
// obtenerHorarios();
const calcularHorasTrabajadas = () => {
  const totalHorasTrabajadas = horarios.value.reduce((total, horario) => {
    const horaEntrada = new Date(`2000-01-01T${horario.horaEntrada}`);
    const horaSalida = new Date(`2000-01-01T${horario.horaSalida}`);
    if (horaSalida < horaEntrada) {
      horaSalida.setHours(horaSalida.getHours() + 24);
    }
    const horasTrabajadas = (horaSalida - horaEntrada) / 1000 / 60 / 60;
    mnsj.value = `${total} ${horasTrabajadas}`
    return total + horasTrabajadas;
  }, 0);
  horasTrabajadas.value = totalHorasTrabajadas;
  mnsj.value = horasTrabajadas.value
};
const eliminarHorario = (index) => {
  const horariosRegistrados = horarios.value
  horariosRegistrados.splice(index, 1);
  const user = Auth.currentUser;
  set(dbRef(Db, `users/${user.uid}` ), { horariosRegistrados });
  // obtenerHorarios();
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

/* Fondo principal */
body {
  background-color: #e0e5ec;
}

/* Estilo de las cajas */
.q-card, .q-form {
  background-color: #e0e5ec;
  border-radius: 25px;
  box-shadow: -20px -20px 60px #c7d2e0, 20px 20px 60px #ffffff;
  padding: 20px;
  margin-bottom: 20px;
}

/* Estilo de los títulos */
.text-h6 {
  color: #1c2331;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  text-shadow: 1px 1px #ffffff;
}

/* Estilo de los input y botones */
.q-input, .q-btn {
  background-color: #e0e5ec;
  border-radius: 15px;
  box-shadow: -10px -10px 30px #c7d2e0, 10px 10px 30px #ffffff;
  padding: 10px 15px;
  font-size: 18px;
  color: #1c2331;
}

.q-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

/* Estilo de la tabla */
.q-table {
  background-color: #e0e5ec;
  border-radius: 25px;
  box-shadow: -20px -20px 60px #c7d2e0, 20px 20px 60px #ffffff;
}

.q-table th, .q-table td {
  color: #1c2331;
  font-weight: 500;
  text-align: center;
  padding: 10px 15px;
}

.q-table th:first-child, .q-table td:first-child {
  width: 1%;
  white-space: nowrap;
}

/* Estilo del botón de eliminar */
.q-btn-negative {
  background-color: #e0e5ec;
  border-radius: 50%;
  box-shadow: -10px -10px 30px #c7d2e0, 10px 10px 30px #ffffff;
  padding: 5px;
  font-size: 18px;
  color: #1c2331;
}

.q-btn-negative:hover {
  background-color: #c7d2e0;
  color: #ffffff;
}

/* Estilo del badge de horas trabajadas */
.q-badge {
  border-radius: 15px;
  font-size: 18px;
  font-weight: 500;
  padding: 5px 10px;
  margin: 10px 0;
  background-color: #e0e5ec;
  color: #1c2331;
  box-shadow: -5px -5px 15px #c7d2e0, 5px 5px 15px #ffffff;
}

</style>
