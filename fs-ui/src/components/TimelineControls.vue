<template id="timeline-control-template">
    <a href="#" @click="handleClick">
        <v-icon>{{ control.icon_class }}</v-icon>
    </a>
</template>

<script>
export default {
    name: "TimelineItem",
    props: {
        control: {}
    },
    data: () => ({
    }),
    methods: {
        handleClick() { }
    }
};
</script>
  