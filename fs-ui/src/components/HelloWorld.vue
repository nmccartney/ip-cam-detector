<template>
  <v-container>
    <v-layout text-center wrap>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to fs
        </h1>
      </v-flex>

      <v-flex mb-5 xs12>
        <h2 class="headline font-weight-bold mb-3">What's next?</h2>

        <v-layout justify-center>
          <v-treeview :items="items" :load-children="fetchUsers" activatable color="warning" open-on-click transition>
            <template v-slot:prepend="{ item }">
              <v-icon v-if="!item.children">
                mdi-account
              </v-icon>
              {{item.value}}
            </template>
          </v-treeview>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    items: [{
      name: 'Users',
      children: [],
    }]
  }),
  methods: {
    async fetchUsers(item) {
      // Remove in 6 months and say
      // you've made optimizations! :)
      // await pause(1500)

      // eslint-disable-next-line
      console.log(`item `, item)

      return fetch('http://0.0.0.0:3000')
        .then(res => res.json())
        .then(json => {
          // eslint-disable-next-line
          console.log(`json `, json)

          //item.children.push(...json)
          if (json == typeof string) {
            return item = { value: json, children: null }
          }
          item.children.push(...json.map(item => { return { value: item } }))
        })
        .catch(err => { throw err })
    },
  }
};
</script>
