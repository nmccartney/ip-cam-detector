<template id="timeline-control-template">
    <v-btn icon @click="handleClick">
        <v-icon>{{ control.icon_class }}</v-icon>
    </v-btn>
</template>

<script>
export default {
    name: "TimelineItem",
    props: {
        control: {},
        item: {}
    },
    data: () => ({
    }),
    methods: {
        async handleClick() {
            await this.control.func(this.item.id)
        }
    }
};
</script>
  