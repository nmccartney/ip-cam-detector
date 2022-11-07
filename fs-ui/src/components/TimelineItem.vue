<template>
    <li class="timeline-item" v-if="item">
        <div class="timeline-badge">
            <v-icon color="white">mdi-comment</v-icon>
        </div>

        <div class="timeline-panel">
            <div class="timeline-heading">
                <h4 class="timeline-title">{{ item.title }}</h4>

            </div>
            <div class="timeline-body" v-if="item.evaluations">
                <!-- {{ item.body }} -->
                <v-row>
                    <v-col :cols="3">
                        <div class="timeline-panel-controls">
                            <div class="timestamp">
                                <small class="text-muted">
                                    <!-- {{ item.created }} -->
                                    24. Sep 17:03
                                </small>
                            </div>
                            <div class="controls">
                                <TimelineControls v-for="(control, id) in controls" :control="control" :key="id" />
                            </div>
                        </div>

                        <v-divider></v-divider>

                        <div v-for="(ev, id) in item.evaluations" :key="id">
                            <div>
                                <v-chip small v-for="(tag, key, i) in ev.tags" :key="i" class="ma-1" color="secondary">
                                    {{ key }}
                                    <!-- {{ tag }} -->
                                </v-chip>
                            </div>
                        </div>
                    </v-col>

                    <v-col :cols="9">

                        <div v-for="(ev, id) in item.evaluations" :key="id">

                            <v-img v-if="ev.status == 'complete'"
                                :src="'http://10.0.0.199:3000/' + ev.detection_path" />
                        </div>
                    </v-col>
                    <v-col v-if="item.evaluations.filter(ev => ev.status !== 'complete').length !== 0">
                        <v-img :src="'http://10.0.0.199:3000/' + item.path" />
                    </v-col>
                </v-row>
            </div>
        </div>
    </li>

</template>
  
<script>
import TimelineControls from './TimelineControls';


export default {
    name: "TimelineItem",
    components: {
        TimelineControls
    },
    props: {
        item: {}
    },
    data: () => ({
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
    }),
    methods: {
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
  