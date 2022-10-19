<template>
    <div>
        {{path}}
        <v-treeview :items="children" :load-children="fetchUsers" activatable open-on-click transition>
            <template v-slot:prepend="{ item }">
                <v-icon v-if="!item.children">
                    mdi-folder
                </v-icon>
                <!-- {{item.name}} -->
            </template>
        </v-treeview>
    </div>
</template>
  
<script>

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
    props: {
        path: null
    },
    data: () => ({
        children: [{ name: '/', children: [] }]
    }),
    async created() {
        // eslint-disable-next-line
        console.log(`setup dir`)
        await this.getCurr();
    },
    methods: {
        async getCurr() {

            fetch(`http://10.0.0.40:3000/${this.path}`)
                .then(res => res.json())
                .then(res => {
                    // eslint-disable-next-line
                    console.log('res: ', res)
                    this.children = res.map(item => Object.assign({ path: item, name: item, children: [] }, {}))
                })
                .catch(err => { throw err })

        },
        async fetchUsers(item) {
            // Remove in 6 months and say
            // you've made optimizations! :)
            await pause(400)

            // eslint-disable-next-line
            console.log(`item `, item)

            return fetch(`http://10.0.0.40:3000/${item.path}`)
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
  