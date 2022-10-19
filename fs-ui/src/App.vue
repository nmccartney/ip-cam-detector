<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>File System</span>
        <!-- <span class="font-weight-light">MATERIAL DESIGN</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank">
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <!-- <HelloWorld/> -->

      <div class="root-folder">
        <!-- <AssetViewer v-if="false" path="/" />
        <DetectionViewer path="/" /> -->

        <router-view />

      </div>

    </v-content>
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
    //
  }),
};
</script>
<style>
.root-folder {
  padding: 20px;
}
</style>
