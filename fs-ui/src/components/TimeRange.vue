<template>
    <v-row>
        <v-col cols="11" sm="5">
            <!-- date picker -->
            <!-- <v-dialog ref="startDate" v-model="startDateModal" :return-value.sync="time" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="dateRangeText" label="From Date" prepend-icon="mdi-clock-time-four-outline"
                        readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="dates" ></v-date-picker>
            </v-dialog> -->
            <!-- time picker -->
            <v-dialog ref="dialog1" v-model="modal1" :return-value.sync="time" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="time" label="From Time" prepend-icon="mdi-clock-time-four-outline" readonly
                        v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-time-picker v-if="modal1" v-model="time" full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal1 = false">
                        Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.dialog1.save(time)">
                        OK
                    </v-btn>
                </v-time-picker>
            </v-dialog>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="11" sm="5">
            <v-dialog ref="dialog" v-model="modal2" :return-value.sync="time" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="time" label="To" prepend-icon="mdi-clock-time-four-outline" readonly
                        v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-time-picker v-if="modal2" v-model="time" full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal2 = false">
                        Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(time)">
                        OK
                    </v-btn>
                </v-time-picker>
            </v-dialog>
        </v-col>
    </v-row>
</template>
  
<script>
export default {
    data: () => ({
        dates: ['2019-09-10', '2019-09-20'],
        startDateModal: false,
        time: null,
        modal1: false,
        modal2: false,
    }),
    computed: {
        dateRangeText() {
            return this.dates.join(' ~ ')
        },
    },
    methods: {
    }
};
</script>
  