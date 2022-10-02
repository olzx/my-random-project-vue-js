Vue.component('posts-blocks', {
    data: function() {
        return {
            savePosts: [],
            lastSelected: {}
        }
    },
    props: ['title'],
    template: `
        <div class="posts-blocks">
            <div v-if="title" class="posts-blocks__title">
                <h1>{{ title }}</h1>
            </div>
            <div class="posts-blocks__blocks">
                <data-save-posts 
                    v-bind:posts="savePosts"
                    v-bind:lastPost="lastSelected"
                    v-on:remove-post="removeSelectPost"
                ></data-save-posts>
                <loader-posts 
                    class="posts" 
                    v-on:select-post="addSelectPost"
                ></loader-posts>
            </div>
        </div>
    `,
    methods: {
        addSelectPost: function(selectPost) {
            const isFind = this.savePosts.indexOf(selectPost)
            if (isFind === -1) {
                this.savePosts.push(selectPost)
                this.lastSelected = selectPost
            } else {
                this.savePosts.splice(isFind, 1)
                this.removeLastSelected(selectPost)
            }
        },
        removeSelectPost: function(selectPost) {
            const isFind = this.savePosts.indexOf(selectPost)
            if (isFind !== -1) {
                this.savePosts.splice(isFind, 1)
                this.removeLastSelected(selectPost)
            }
        },
        removeLastSelected: function(selectedPost) {
            if (selectedPost === this.lastSelected) {
                this.lastSelected = {}
            }
        }
    }
})

Vue.component('data-save-posts', {
    props: ['posts', 'lastPost'],
    template: `
        <div class="data-save-posts">
            <span class="data-save-posts__selected">
                <p>Вы выбрали [{{ posts.length }}]: </p>
                <input v-if="isInputVisible(lastPost)" v-model="lastPost.title" v-bind:size="lastPostLength(lastPost)" class="data-save-posts__input">
            </span>
            <ul>
                <view-posts
                    v-for="post in posts"
                    v-bind:key="post.id"
                    v-bind:item="post"
                    v-on:remove-post="$emit('remove-post', post)"
                >   
                </view-posts>
            </ul>
        </div>    
    `,
    methods: {
        lastPostLength: function(lastPost) {
            if (lastPost.title?.length > 50) {
                return 50
            } else {
                return lastPost.title?.length
            }
        },
        inputWork: function(event) {
            console.log(event)
            return event
        },
        isInputVisible: function(lastPost) {
            return Object.keys(lastPost).length !== 0
        }
    }
})

Vue.component('loader-posts', {
    data: function() {
        return {
            posts: []
        }
    },
    template: `
        <ul>
            <view-posts
                v-for="item in posts"
                v-bind:key="item.id"
                v-bind:item="item"
                v-bind:handlerSelect="true"
                v-on:select-post="$emit('select-post', item)"
            ></view-posts>
        </ul>
    `,
    created: function() {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then(json => this.titleOneUpper(json))
            .then(modifyJson => this.posts = modifyJson)
    },
    methods: {
        titleOneUpper(postsArr) {
            let modifyArr = postsArr
            for(let i = 0; i < modifyArr.length; i++) {
                let titleArr = modifyArr[i].title.split('')
                titleArr[0] = titleArr[0].toUpperCase()
                modifyArr[i].title = titleArr.join('')
                modifyArr[i].selected = false
            }
            return modifyArr
        }
    }
})

Vue.component('view-posts', {
    props: ['item', 'handlerSelect'],
    template: `
        <li
            v-if="handlerSelect"
            v-bind:class="{ 'completed-true': item.completed, 'completed-false': !item.completed }"
            v-on:click="selectPost(item)"
        >
            [{{ item.id }}] {{ item.title }} {{ item.selected ? '✔' : '' }}
        </li>

        <li
            v-else
            v-bind:class="{ 'completed-true': item.completed, 'completed-false': !item.completed }"
            v-on:click="removeSelectPost(item)"
        >
            [{{ item.id }}] {{ item.title }}
        </li>
    `,
    methods: {
        selectPost: function(item) {
            this.$emit('select-post', item)
            item.selected = item.selected ? false : true
        },
        removeSelectPost: function(item) {
            this.$emit('remove-post', item)
            item.selected = item.selected ? false : true
        }
    }
})

const app = new Vue({
    el: "#app"
})