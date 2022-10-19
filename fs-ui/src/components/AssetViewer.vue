<template>
    <div>
        <!-- --{{path}}-- {{ext}} -- {{viewer}} -->
        <!-- Inactive components will be cached! -->
        <!-- <keep-alive>
            <component :is="viewer" :path="path"></component>
        </keep-alive> -->
        <component :is="viewer" :path="path"></component>
    </div>

</template>
  
<script>
import Directory from './Directory';
import ImageViewer from './ImageViewer';

// eslint-disable-next-line
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
    name: 'AssetViewer',
    components: {
        Directory,
        ImageViewer,
    },
    props: {
        path: {
            default: '/'
        }
    },
    data: () => ({
        viewer: null,
        ext: null
    }),
    created() {

        let type = null;
        type = this.getAssetType(this.path);

        // eslint-disable-next-line
        console.log(`setup type:   `, type)

        switch (type) {
            case 'image':
                this.viewer = 'ImageViewer'
                break;
            case 'Directory':
                this.viewer = 'Directory'
                break;
            case 'text':
                this.viewer = null // TODO
                break;
            default:
                this.viewer = null
        }
        // eslint-disable-next-line
        console.log(`setup viewer:   `, this.viewer)
    },
    methods: {
        getAssetType(path) {
            var re = /(?:\.([^.]+))?$/;
            let ext = re.exec(path)[1]
            this.ext = ext

            // eslint-disable-next-line
            console.log(`extention `, ext)
            if (ext === `jpg` || ext === 'png' || ext === 'jpeg') {
                return 'image'
            }
            if (ext === `txt` || ext === 'json' || ext === 'yml') {
                return 'text'
            }
            return 'Directory'
        }
    }
};
</script>
  