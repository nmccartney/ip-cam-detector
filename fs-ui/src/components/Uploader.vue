<template>
    <div>
        <v-card class="mx-auto " max-width="344">
            <v-card-title>Uploader</v-card-title>
            <v-card-text>
                <v-file-input @change="selectFile" show-size counter multiple label="Detection input"></v-file-input>
                <v-btn @click="upload" color="primary">submit</v-btn>
                <v-divider />
                {{ currentFile }}
            </v-card-text>
        </v-card>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    name: 'Uploader',
    data: () => ({
        currentFile: undefined,
        loader: false
    }),
    methods: {
        selectFile(file) {
            this.currentFile = file;
        },
        async upload() {
            // eslint-disable-next-line
            console.log(`file `, this.currentFile)

            if (!this.currentFile) {
                return;
            }

            this.message = "";

            try {
                var formData = new FormData();
                formData.append("file", this.currentFile[0]);
                const response = await axios.post(`http://10.0.0.199:3030/v1/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // eslint-disable-next-line
                console.log(response.data)

            } catch (err) {
                // eslint-disable-next-line
                console.warn(err)
                this.currentFile = undefined;
            }
        },
    }
};
</script>
  