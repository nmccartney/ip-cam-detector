<template>
    <div>
        <!-- {{path}} -->
        <v-card :loading="loading" flat class="directory mx-auto">
            <template slot="progress">
                <v-progress-linear color="deep-purple" height="10" indeterminate></v-progress-linear>
            </template>

            <v-card-text>
                <v-toolbar dense flat>
                    <v-icon @click="openContents" v-if="!open">mdi-chevron-up</v-icon>
                    <v-icon @click="openContents" v-if="open">mdi-chevron-down</v-icon>

                    <v-icon class="mr-2">mdi-folder</v-icon>

                    <v-toolbar-title>{{dirLabel}}</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn icon v-if="open">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>

                    <v-btn icon>
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </v-toolbar>

                <div v-if="open" class="contents" color="white" elevation="1">

                    <div v-if="assets.length<=0&&!loading">No content</div>

                    <div v-for="asset in assets" :key="asset.path">
                        <!-- {{asset.path}} -->
                        <AssetViewer :path="asset.path"></AssetViewer>
                    </div>

                    <!-- <v-virtual-scroll :bench="20" :items="assets" height="300" item-height="64">
                        <template v-slot:default="{ item }">
                            <AssetViewer :path="item.path"></AssetViewer>
                        </template>
                    </v-virtual-scroll> -->

                </div>

            </v-card-text>

        </v-card>
    </div>
</template>
  
<script>
// import { VVirtualScroll } from 'vuetify/lib'
// import AssetViewer from './AssetViewer';
// eslint-disable-next-line
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
    name: 'Directory',
    components: {
        AssetViewer: () => import('./AssetViewer'),
        // VVirtualScroll: () => import('vuetify/lib').then(comp => {
        //     // eslint-disable-next-line
        //     console.log('-', comp.Scroll)
        //     return comp.Scroll
        // })
    },
    props: {
        path: null
    },
    data: () => ({
        loading: false,
        open: false,
        assets: []
    }),
    async created() {

        // this.path.substring(0, this.path.lastIndexOf("/"));

        // eslint-disable-next-line
        console.log(`setup dir:<${this.path}>!`, this.path)

        // await this.getCurr();
    },
    computed: {
        dirLabel() {
            if (!this.path) return ""
            let label = this.path.split('/').filter(str => str > "")
            label = label[label.length - 1] || "/"
            return label
        }
    },
    methods: {
        async openContents() {
            this.open = !this.open

            if (this.open) {
                await this.getCurr()
            } else {
                this.assets = [];
            }
        },
        async getCurr() {
            this.loading = true;
            await pause(400)
            fetch(`http://10.0.0.199:3000/${this.path}`)
                .then(res => res.json())
                .then(res => {
                    this.loading = false;
                    // eslint-disable-next-line
                    console.log('res: ', res)
                    this.assets = res.map(item => Object.assign({ path: item, name: item, children: [] }, {}))
                })
                .catch(err => { throw err })

        },
        async fetchUsers(item) {
            // Remove in 6 months and say
            // you've made optimizations! :)
            await pause(400)

            // eslint-disable-next-line
            console.log(`item `, item)

            return fetch(`http://10.0.0.199:3000/${item.path}`)
                .then(res => res.json())
                .then(json => {
                    // eslint-disable-next-line
                    console.log(`json ---`, json)

                    //item.children.push(...json)
                    if (json == typeof string) {
                        return item = { name: json, children: [] }
                    }
                    item.children.push(...json.map(item => { return { name: item, children: [] } }))
                })
                .catch(err => { throw err })
        },
    }
};
</script>
<style scoped>
.directory {
    margin: 5px 0;
}

.directory .v-card__text {
    padding: 0;
    ;
}

.directory .contents {
    padding: 0px 0px 0px 20px;
}
</style>