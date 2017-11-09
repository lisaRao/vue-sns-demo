<template>
    <div class="app">
        <p>
            <button type="button" @click="focus">focus</button>
            <button type="button" @click="fullScreen">full screen</button>
            <button type="button" @click="showModuleName=!showModuleName">toggle module name</button>
            <button type="button" @click="reset">change content</button>
            <span style="white-space: nowrap">content length : {{content.length}}</span>
        </p>
        <vue-html5-editor :content="content" :height="300" 
        :show-module-name="showModuleName" @change="updateData" ref="editor"></vue-html5-editor>
    </div>
</template>
<script>
import VueHtml5Editor from 'vue-html5-editor'
import Vue from 'vue'

Vue.use(VueHtml5Editor, {
    showModuleName: true,
    image: {
        sizeLimit: 512 * 1024,
        compress: true,
        width: 500,
        height: 500,
        quality: 80
    }
  
})
export default {
    data() {
        return {
            content: "<h3>vue html5 editor</h3>",
            showModuleName: false,
        }
    },
    methods: {
        updateData: function (data) {
            // sync content to component
            this.content = data
        },
        fullScreen: function () {
            this.$refs.editor.enableFullScreen()
        },
        focus: function () {
            this.$refs.editor.focus()
        },
        reset:function () {
            var newContent = prompt('please input some html code: ')
            if(newContent){
                this.content = newContent
            }
        }
    }    
}
</script>

<style lang="less" scoped>
.app {
    margin: 50px auto;
    width: 800px;
    max-width: 100%;
}
</style>


