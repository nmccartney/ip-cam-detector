<template>
    <div class="timeline-wrapper">
        <!-- <h2>Timeline</h2> -->

        <!-- <TimeRange /> -->


        <!-- <v-select v-model="tags" @change="refresh" :items="tagTypes" attach chips label="Detection Types" multiple></v-select> -->


        <v-row>
            <v-col sm="9">
                <v-autocomplete v-model="tags" :items="tagTypes" outlined dense chips small-chips
                    @change="autoCompleteHanlder" label="Detection Types" multiple>
                    <template v-slot:selection="data">
                        <v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select"
                            @click:close="remove(data.item, data.parent)">
                            {{ data.item }}
                        </v-chip>
                    </template>
                </v-autocomplete>
            </v-col>
            <v-col sm="3">
                <v-switch v-model="autoRefresh" :label="`Auto refresh`"></v-switch>
            </v-col>
        </v-row>


        <v-pagination @input="getNewPageList" v-model="page" :length="length"></v-pagination>

        <div id="timeline-template">
            <ul class="timeline">
                <li v-for="(item, id) in items" is="timeline-item" :item="item" :onDelete="refresh" :key="id">
                </li>
            </ul>
        </div>

        <v-pagination @input="getNewPageList" v-model="page" :length="length"></v-pagination>
    </div>
</template>
  
<script>
// import Directory from './Directory';
import TimelineItem from './TimelineItem';
// import TimeRange from './TimeRange'
// import axios from 'axios';

const IMAGE_AI_TAGS = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop_sign',
    'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra',
    'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard',
    'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
    'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
    'broccoli', 'carrot', 'hot dog', 'pizza', 'donot', 'cake', 'chair', 'couch', 'potted plant', 'bed',
    'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven',
    'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair dryer', 'toothbrush']

// eslint-disable-next-line
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
    name: 'DetectionViewer',
    components: {
        TimelineItem,
        // TimeRange
    },
    props: {
        path: {
            default: '/'
        },
        // items: []
    },
    data: () => ({
        tagTypes: IMAGE_AI_TAGS.sort(),
        tags: ['person'],
        detections: [],
        // pageModel: 0,
        autoRefresh: true,
        page: 0,
        length: 0,
        detectionLimit: 10,
        dialog: [],
        detectionInterval: null,
        items: [
            {
                id: 5,
                icon_class: 'mdi-comment',
                icon_status: '',
                title: 'Admin added a comment.',
                controls: [
                    {
                        method: 'edit',
                        icon_class: 'mdi-pencil'
                    },
                    {
                        method: 'delete',
                        icon_class: 'mdi-trash'
                    }
                ],
                created: '24. Sep 17:03',
                body: '<p><i>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam, maxime alias nam dignissimos natus voluptate iure deleniti. Doloremque, perspiciatis voluptas dignissimos ex, ullam et, reprehenderit similique possimus iste commodi minima fugiat non culpa, veniam temporibus laborum. Distinctio ipsam cupiditate debitis aliquid deleniti consectetur voluptates corporis officiis tempora minus veniam, accusamus cum optio nesciunt illo nulla odio? Quidem nesciunt, omnis at quo aliquam porro amet fugit mollitia minus explicabo, possimus deserunt rem ut commodi laboriosam quia. Numquam, est facilis rem iste voluptatum. Cupiditate porro fuga saepe quis nulla mollitia, magni dicta soluta distinctio tempore voluptate quo perferendis. Maiores eveniet deleniti, nemo.</i></p>'
            },
        ]
    }),
    async created() {
        // this.loading = true;
        // await pause(400)

        // fetch(`http://10.0.0.199:3030/v1/detection?${this.tagQuery}`)
        //     .then(res => res.json())
        //     .then(res => {
        //         this.loading = false;
        //         // eslint-disable-next-line
        //         console.log('res: ', res)
        //         this.items = res.results
        //         this.page = res.page
        //         this.length = res.totalPages
        //         // this.assets = res.map(item => Object.assign({ path: item, name: item, children: [] }, {}))
        //     })
        //     .catch(err => {
        //         // throw err 
        //         // eslint-disable-next-line
        //         console.warn('detections get:', err);
        //     })

        // try {
        //     const response = await axios.get(`http://10.0.0.199:3030/v1/detection`);
        //     // eslint-disable-next-line
        //     console.log('detection get:', response.data);
        // } catch (error) {
        //     // eslint-disable-next-line
        //     console.error(`Error! Cannot add detection to core: ${error.message}`);
        // }

        if (this.detectionInterval) {
            clearInterval(this.detectionInterval)
            this.detectionInterval = null;
        }

        this.detectionInterval = setInterval(this.autoRefreshHandler, 2000)

        await this.refresh()
    },
    beforeDestroy() {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval)
            this.detectionInterval = null;
        }
    },
    computed: {
        tagQuery() {
            if (this.tags.length == 0) return ''
            let q = this.tags.reduce((acc, curr) => {
                if (!acc) acc = ''
                return acc += `&objectTags[]=${curr}`
            }, null)
            return q
        }
    },
    methods: {
        async autoCompleteHanlder() {
            this.page = 1
            await this.refresh()
        },
        async autoRefreshHandler() {
            if (this.autoRefresh) {
                await this.refresh()
            }
        },
        async refresh() {
            await this.getNewPageList(this.page)
        },
        async getNewPageList(val) {
            let page = val || 0
            await fetch(`http://10.0.0.199:3030/v1/detection?page=${page}${this.tagQuery}`)
                .then(res => res.json())
                .then(res => {
                    this.loading = false;
                    // eslint-disable-next-line
                    // console.log('res: ', res)
                    this.items = res.results
                    this.page = res.page
                    this.length = res.totalPages
                    // this.assets = res.map(item => Object.assign({ path: item, name: item, children: [] }, {}))
                })
                .catch(err => { throw err })
        },
        remove(item, parent) {
            parent.blur()
            const index = this.tags.indexOf(item)
            if (index >= 0) this.tags.splice(index, 1)
            this.refresh()
        },
    }
};
</script>
  
<style scoped  lang="scss">
@import 'https://fonts.googleapis.com/css?family=Libre+Franklin';

// body {
//     font-family: 'Libre Franklin', sans-serif;
// }
.timeline-wrapper {
    max-width: 860px;
    margin: 0 auto;
}

#timeline-header {
    font-size: 26px;
}

.timeline {
    list-style: none;
    padding: 20px 0 20px;
    position: relative;

    &:before {
        background-color: #eee;
        bottom: 0;
        content: " ";
        left: 50px;
        margin-left: -1.5px;
        position: absolute;
        top: 0;
        width: 3px;
    }

    >li {
        margin-bottom: 20px;
        position: relative;

        &:before,
        &:after {
            content: " ";
            display: table;
        }

        &:after {
            clear: both;
        }

        >.timeline-panel {
            border-radius: 2px;
            border: 1px solid #d4d4d4;
            box-shadow: 0 1px 2px rgba(100, 100, 100, 0.2);
            margin-left: 100px;
            padding: 20px;
            position: relative;

            .timeline-heading {
                .timeline-panel-controls {
                    position: absolute;
                    right: 8px;
                    top: 5px;

                    .timestamp {
                        display: inline-block;
                    }

                    .controls {
                        display: inline-block;
                        padding-right: 5px;
                        border-right: 1px solid #aaa;

                        a {
                            color: #999;
                            font-size: 11px;
                            padding: 0 5px;

                            &:hover {
                                color: #333;
                                text-decoration: none;
                                cursor: pointer;
                            }
                        }
                    }

                    .controls+.timestamp {
                        padding-left: 5px;
                    }
                }
            }
        }

        .timeline-badge {
            background-color: #999;
            border-radius: 50%;
            color: #fff;
            font-size: 1.4em;
            height: 50px;
            left: 50px;
            line-height: 52px;
            margin-left: -25px;
            position: absolute;
            text-align: center;
            top: 16px;
            width: 50px;
            z-index: 100;
        }

        .timeline-badge+.timeline-panel {
            &:before {
                border-bottom: 15px solid transparent;
                border-left: 0 solid #ccc;
                border-right: 15px solid #ccc;
                border-top: 15px solid transparent;
                content: " ";
                display: inline-block;
                position: absolute;
                left: -15px;
                right: auto;
                top: 26px;
            }

            &:after {
                border-bottom: 14px solid transparent;
                border-left: 0 solid #fff;
                border-right: 14px solid #fff;
                border-top: 14px solid transparent;
                content: " ";
                display: inline-block;
                position: absolute;
                left: -14px;
                right: auto;
                top: 27px;
            }
        }
    }
}

.timeline-badge {
    &.primary {
        background-color: #2e6da4 !important;
    }

    &.success {
        background-color: #3f903f !important;
    }

    &.warning {
        background-color: #f0ad4e !important;
    }

    &.danger {
        background-color: #d9534f !important;
    }

    &.info {
        background-color: #5bc0de !important;
    }
}

.timeline-title {
    margin-top: 0;
    color: inherit;
}

.timeline-body {

    >p,
    >ul {
        margin-bottom: 0;
    }

    >p+p {
        margin-top: 5px;
    }
}

.copy {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #aaa;
    font-size: 11px;

    >* {
        color: #444;
    }
}
</style>