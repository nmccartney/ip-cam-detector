<template>
    <li class="timeline-item" v-if="item">
        <div class="timeline-badge">
            <v-icon color="white">mdi-comment</v-icon>
        </div>

        <div class="timeline-panel">
            <div class="timeline-heading">
                <h2 class="timeline-title">{{ timeSinceDetection }} </h2>
                <small class="text-muted">
                    <!-- {{ item.createdAt }} -->
                    {{ item.path }}
                    <!-- {{ timeSinceDetection }} -->
                    <!-- 24. Sep 17:03 -->
                </small>
                <br>
                <v-chip small v-for="(key, i) in item.objectTags" :key="i" class="ma-1" color="secondary">
                    {{ key }}
                </v-chip>
            </div>
            <div class="timeline-body" v-if="item.evaluations">
                <!-- {{ item.body }} -->
                <v-row>
                    <v-col :cols="6">
                        <div class="timeline-panel-controls">
                            <div class="timestamp">

                            </div>
                            <div class="controls">
                                <TimelineControls :item="item" v-for="(control, id) in controls" :control="control"
                                    :key="id" />
                            </div>
                        </div>
                    </v-col>
                    <v-col :cols="6">
                    </v-col>

                    <v-col :cols="12">

                        <v-dialog v-model="dialog" width="860">
                            <template v-slot:activator="{ on, attrs }">
                                <!-- <v-img v-if="ev.status == 'complete'" @click="dialog = true"
                                    :src="'http://10.0.0.199:3000/' + ev.detection_path" /> -->
                                <v-img :src="'http://10.0.0.199:3000/' + item.path" @click="dialog = true" />
                            </template>

                            <v-card>
                                <v-toolbar dark color="primary">
                                    <v-btn icon dark @click="dialog = false">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                    <v-toolbar-title>{{ item.path }}</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-toolbar-items>
                                        <v-btn icon @click="runJob('object')">
                                            <v-icon>mdi-play</v-icon>
                                        </v-btn>
                                        <v-btn icon @click="runJob('prediction')">
                                            <v-icon>mdi-brain</v-icon>
                                        </v-btn>
                                        <v-btn icon>
                                            <v-icon>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </v-toolbar-items>
                                </v-toolbar>
                                <v-card-text v-if="dialog">
                                    <v-row>
                                        <v-col style="max-width:900px; margin: 0 auto;">
                                            <v-chip v-for="(tag, key, i) in item.evaluations[currentEval].tags" :key="i"
                                                class="ma-1" color="secondary">
                                                {{ key }}
                                            </v-chip>
                                            <v-carousel v-model="currentEval">
                                                <v-carousel-item v-for="(ev, id) in item.evaluations" :key="id">
                                                    <v-sheet height="100%" tile>
                                                        <v-row class="fill-height" align="center" justify="center">
                                                            <v-img v-if="ev.status == 'complete'"
                                                                :src="'http://10.0.0.199:3000/' + ev.detection_path" />
                                                        </v-row>
                                                    </v-sheet>
                                                </v-carousel-item>
                                            </v-carousel>

                                        </v-col>
                                        <v-col
                                            v-if="item.evaluations.filter(ev => ev.status !== 'complete').length !== 0">
                                            <v-img :src="'http://10.0.0.199:3000/' + item.path" />
                                        </v-col>
                                    </v-row>

                                </v-card-text>
                            </v-card>
                        </v-dialog>
                        <!-- <div v-for="(ev, id) in item.evaluations" :key="id"></div> -->
                    </v-col>
                    <!-- <v-col v-if="item.evaluations.filter(ev => ev.status !== 'complete').length !== 0">
                        <v-img :src="'http://10.0.0.199:3000/' + item.path" />
                    </v-col> -->
                </v-row>
            </div>
        </div>
    </li>

</template>
  
<script>
import TimelineControls from './TimelineControls';
import axios from 'axios';

let VM = {};

export default {
    name: "TimelineItem",
    components: {
        TimelineControls
    },
    props: {
        item: {},
        onDelete: { type: Function, default: () => { } }
    },
    data: () => ({
        currentEval: 0,
        dialog: false,
        controls: [
            // {
            //     method: 'edit',
            //     icon_class: 'mdi-pencil',
            //     func: () => { }
            // },
            {
                method: 'delete',
                icon_class: 'mdi-delete',
                func: async (id) => {
                    // eslint-disable-next-line
                    console.log(`delete ${id}`);

                    try {
                        const response = await axios.delete(`http://10.0.0.199:3030/v1/detection/${id}`);
                        // eslint-disable-next-line
                        console.log('Deleted detection to core', response.data);
                    } catch (error) {
                        // eslint-disable-next-line
                        console.error(`Error! Cannot add detection to core: ${error.message}`);
                    }

                    VM.onDelete()
                }
            }
        ],
    }),
    created() {
        VM = this
    },
    computed: {
        timeSinceDetection() {
            return this.timeDifference(Date.now(), new Date(this.item.createdAt))
        }
    },
    methods: {
        async runJob(type) {
            // eslint-disable-next-line
            console.log(`run ${type} job ${this.item.id}`);

            try {
                const response = await axios.post(`http://10.0.0.199:3030/v1/eval/${type}`, { detectionId: this.item.id });
                // eslint-disable-next-line
                console.log('Run job for detection to core', response.data);
            } catch (error) {
                // eslint-disable-next-line
                console.error(`Error! Cannot add detection to core: ${error.message}`);
            }
        },
        timeDifference(current, previous) {

            var msPerMinute = 60 * 1000;
            var msPerHour = msPerMinute * 60;
            var msPerDay = msPerHour * 24;
            var msPerMonth = msPerDay * 30;
            var msPerYear = msPerDay * 365;

            var elapsed = current - previous;

            if (elapsed < msPerMinute) {
                return Math.round(elapsed / 1000) + ' seconds ago';
            }

            else if (elapsed < msPerHour) {
                return Math.round(elapsed / msPerMinute) + ' minutes ago';
            }

            else if (elapsed < msPerDay) {
                return Math.round(elapsed / msPerHour) + ' hours ago';
            }

            else if (elapsed < msPerMonth) {
                return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
            }

            else if (elapsed < msPerYear) {
                return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
            }

            else {
                return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
            }
        }
    }
};
</script>

<style scoped lang="scss">
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

.timeline-item {
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
}
</style>
  