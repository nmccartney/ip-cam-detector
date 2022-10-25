<template>
    <div>
        <!-- --{{path}}-- {{ext}} -- {{viewer}} -->
        <!-- Inactive components will be cached! -->
        <!-- <keep-alive>
            <component :is="viewer" :path="path"></component>
        </keep-alive> -->
        <span>{{ page }}</span>
        <!-- <ul>
            <li v-for="detection in detections" :key="detection.id">
                {{detection}}
            </li>
        </ul> -->
        <v-data-table :headers="detectionHeaders" :items="detections" :items-per-page="detectionLimit"
            class="elevation-1">

            <template v-slot:item.evaluations="{ item }">
                {{item.evaluations.length}}
            </template>

            <template v-slot:item.path="{ item }">

                <v-dialog v-model="dialog[item.id]" fullscreen hide-overlay transition="dialog-bottom-transition">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        {{ item.path }}
                        <!-- <v-btn color="secondary" x-small dark v-bind="attrs" v-on="on">
                        show
                    </v-btn> -->
                    </template>
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="dialog[item.id] = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>{{ item.path }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <!-- <v-btn icon @click="runJob()">
                                <v-icon>mdi-play</v-icon>
                            </v-btn> -->
                                <v-btn icon>
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        <v-card-text v-if="dialog[item.id]">
                            <v-img :src="'http://10.0.0.199:3000/'+item.path" />
                            <div v-for="(item, id) in item.evaluations" :key="id">
                                <v-img v-if="item.status=='complete'" :src="'http://10.0.0.199:3000/'+item.detection_path" />
                            </div>
                        </v-card-text>
                    </v-card>
                </v-dialog>

            </template>

        </v-data-table>

        <v-pagination @input="getNewPageList" v-model="page" :length="length"></v-pagination>
        <!-- <component :is="viewer" :path="path"></component> -->
        <hr>
        <span>{{ evalPage }}</span>
        <!-- <ul>
            <li v-for="ev in evals" :key="ev.id">
                {{ev.status}} {{ev.path}} {{ev.tags}}
                <ul v-if="ev.tags">
                    <li v-for="tag in Object.keys(ev.tags)" :tag="tag">
                        {{ev.tags[tag]}}
                    </li>
                </ul>
            </li>
        </ul> -->
        <v-data-table :headers="evalHeaders" :items="evals" :items-per-page="evalLimit" class="elevation-1">
        </v-data-table>

        <v-pagination @input="getNewEvalPageList" v-model="evalPage" :length="evalLength"></v-pagination>
    </div>

</template>
  
<script>
// import Directory from './Directory';
// import ImageViewer from './ImageViewer';

// eslint-disable-next-line
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
    name: 'DetectionViewer',
    components: {
    },
    props: {
        path: {
            default: '/'
        }
    },
    data: () => ({
        detections: [],
        evals: [],
        // pageModel: 0,
        page: 0,
        evalPage: 0,
        length: 0,
        evalLength: 0,
        evalLimit: 10,
        detectionLimit: 10,
        dialog:[],
        evalHeaders: [
            {
                text: 'Status',
                align: 'start',
                sortable: true,
                value: 'status',
            },
            { text: 'Path', value: 'path' },
            { text: 'Tags', value: 'tags' }
        ],
        detectionHeaders: [
            {
                text: 'Status',
                align: 'start',
                sortable: true,
                value: 'status',
            },
            { text: 'File', value: 'fileName' },
            { text: 'Evaluations', value: 'evaluations' },
            { text: 'Path', value: 'path' }
        ]
    }),
    async created() {
        // this.loading = true;
        // await pause(400)
        fetch(`http://10.0.0.199:3030/v1/detection`)
            .then(res => res.json())
            .then(res => {
                this.loading = false;
                // eslint-disable-next-line
                console.log('res: ', res)
                this.detections = res.results
                this.page = res.page
                this.length = res.totalPages
                // this.assets = res.map(item => Object.assign({ path: item, name: item, children: [] }, {}))
            })
            .catch(err => { throw err })

        fetch(`http://10.0.0.199:3030/v1/eval`)
            .then(res => res.json())
            .then(res => {
                this.loading = false;
                // eslint-disable-next-line
                console.log('eval res: ', res)
                this.evals = res.results
                this.evalPage = res.page
                this.evalLength = res.totalPages
                // this.assets = res.map(item => Object.assign({ path: item, name: item, children: [] }, {}))
            })
            .catch(err => { throw err })
    },
    computed: {
    },
    methods: {
        getNewPageList(val) {
            fetch(`http://10.0.0.199:3030/v1/detection?page=${val}`)
                .then(res => res.json())
                .then(res => {
                    this.loading = false;
                    // eslint-disable-next-line
                    console.log('res: ', res)
                    this.detections = res.results
                    this.page = res.page
                    this.length = res.totalPages
                    // this.assets = res.map(item => Object.assign({ path: item, name: item, children: [] }, {}))
                })
                .catch(err => { throw err })
        },
        getNewEvalPageList(val) {
            fetch(`http://10.0.0.199:3030/v1/eval?page=${val}`)
                .then(res => res.json())
                .then(res => {
                    this.loading = false;
                    // eslint-disable-next-line
                    console.log('eval res: ', res)
                    this.evals = res.results
                    this.evalPage = res.page
                    this.evalLength = res.totalPages
                    // this.assets = res.map(item => Object.assign({ path: item, name: item, children: [] }, {}))
                })
                .catch(err => { throw err })
        }
    }
};
</script>
  