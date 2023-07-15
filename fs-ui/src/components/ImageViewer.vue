<template>
    <div style="padding:5px 0px 5px 20px;">
        <v-toolbar dense flat>

            <v-icon class="mr-2" @click="() => { open = true }">
                mdi-image
            </v-icon>
            <v-toolbar-title>{{ imgLabel }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-dialog v-model="open" fullscreen hide-overlay transition="dialog-bottom-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-eye</v-icon>
                    </v-btn>
                    <!-- <v-btn color="secondary" x-small dark v-bind="attrs" v-on="on">
                        show
                    </v-btn> -->
                </template>
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-btn icon dark @click="open = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>{{ imgLabel }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn icon @click="runJob()">
                                <v-icon>mdi-play</v-icon>
                            </v-btn>
                            <v-btn icon>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text v-if="open">
                        <v-img :src="imgSrc" />
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-toolbar>

        <!-- <img :src="path" width="100" height="auto" alt=""> -->
    </div>
</template>
  
<script>
// eslint-disable-next-line
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
    props: {
        path: null
    },
    data: () => ({
        open: false
    }),
    computed: {
        imgLabel() {
            if (!this.path) return ""
            let label = this.path.split('/').filter(str => str > "")
            label = label[label.length - 1] || "/"
            return label
        },
        imgSrc() {
            return "http://10.0.0.106:3000/" + this.path
        }
    },
    created() {
    },
    methods: {
        runJob() {
            // eslint-disable-next-line
            console.log('path: ', this.path)
            fetch(`http://10.0.0.106:5000/run?image=ftp-dir/${this.path}`)
                .then(res => res.json())
                .then(res => {
                    this.loading = false;
                    // eslint-disable-next-line
                    console.log('Requesting new job confirmed. Resp: ', res)
                })
                .catch(err => {
                    // eslint-disable-next-line
                    console.log(`Requesting new job failed. Error:`, err)
                })
        }
    }
};
</script>
  