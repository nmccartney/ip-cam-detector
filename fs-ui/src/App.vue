<template>
  <v-app>

    <v-navigation-drawer v-model="drawer" app absolute temporary>
      <v-list-item>
        <!-- <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar> -->

        <v-list-item-icon>
            <v-icon>mdi-cctv</v-icon>
          </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>IP Camera Detector</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item link router-link to="/">
          <v-list-item-icon>
            <v-icon>mdi-timeline-alert</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Timeline</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router-link to="/detections">
          <v-list-item-icon>
            <v-icon>mdi-motion-sensor</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Detections</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router-link to="/evaluations">
          <v-list-item-icon>
            <v-icon>mdi-account-clock</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Evaluations</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router-link to="/file-explorer">
          <v-list-item-icon>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>File Explorer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>{{currentRouteName}}</span>
        <!-- <span class="font-weight-light">MATERIAL DESIGN</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank">
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <!-- <div class="root-folder">
        <router-view />
      </div> -->

      <v-container fluid>

        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>


    <v-footer app>
      <!-- -->
      tada
    </v-footer>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
// import AssetViewer from './components/AssetViewer';
// import DetectionViewer from './components/DetectionViewer';

export default {
  name: 'App',
  components: {
    // HelloWorld,
    // AssetViewer,
    // DetectionViewer,
  },
  data: () => ({
    drawer: null
  }),
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  }
};
</script>
<style>
.root-folder {
  padding: 20px;
}
</style>
