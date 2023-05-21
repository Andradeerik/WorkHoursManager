<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>App</q-toolbar-title>
        <div v-if="!userAuth" class="text-subtitle1 q-mr-md" @click="LoginGoogle()">login</div>
        <q-btn flat round dense @click="!userAuth ? LoginGoogle() : ''">
          <q-avatar size="35px">
            <img v-if="!userAuth" src="https://www.google.com/images/hpp/ic_wahlberg_product_core_48.png8.png" />
            <img v-else :src="userPhoto" />
          </q-avatar>
          <q-menu v-if="userAuth" style="border-radius: 20px;">
            <div class="row no-wrap q-pa-md" >
              <div class="column items-center">
                <div class="text-subtitle1 q-mb-xs">{{ userDisplayName }}</div>
                <div class="text-subtitle2 q-mb-xs">{{ userEmail }}</div>
                <q-btn
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                  @click="LogoutGoogle()"
                  v-close-popup
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { Auth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'boot/firebase';


export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup() {
    const user = Auth.currentUser;
    const userAuth = ref(false);
    const userPhoto = ref('');
    const userDisplayName = ref('');
    const userEmail = ref('');
    if (user) {
      userAuth.value = true;
      userPhoto.value = user.photoURL;
      userDisplayName.value = user.displayName;
      userEmail.value = user.email;
    } else {
      console.log('no user')
    }
    onAuthStateChanged(Auth, (user) => {

  if (user) {
    userAuth.value = true;
    userPhoto.value = user.photoURL;
    userDisplayName.value = user.displayName;
    userEmail.value = user.email;

  } else {
  }
});
    return {
      userEmail,
      userDisplayName,
      userPhoto,
      userAuth,
      LoginGoogle() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(Auth, provider)
        .then((result) => {
          userAuth.value = true;
          userPhoto.value = result.user.photoURL;
          userDisplayName.value = result.user.displayName;
          userEmail.value = result.user.email;
        })
        .catch((error) => {
          console.log(error)
        });
      },
      LogoutGoogle() {
        Auth.signOut().then(() => {
          userAuth.value = false;
          userPhoto.value = '';
          userDisplayName.value = '';
          userEmail.value = '';

        }).catch((error) => {
          console.log('An error happened.')
        });
      },
    };
  },
});
</script>
