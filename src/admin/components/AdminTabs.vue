<template>
    <ul>
        <li
            v-for="(tab, i) of tabs"
            :key="i"
            :class="
                active === i
                    ? 'active-tab'
                    : 'inactive-tab'
            "
            class="tab"
            @click="selectTab(i)"
        >
            {{ tab.props.title }}
        </li>
    </ul>
    <div>
        <slot />
    </div>
</template>
<script>
import { computed, provide, ref } from '@vue/runtime-core'
export default{
    name:"AdminTabs",
    props: {
        modelValue: {
            type: [String, Number],
        },
    },
    setup(props, { slots, emit }) {
        const active = computed(() => props.modelValue);
        const tabs = ref([]);

        function selectTab(tab) {
            emit("update:modelValue", tab);
        }

        provide("tabsState", {
            active,
            tabs,
        });

        return {
            tabs,
            active,
            selectTab,
        };
    }
}    
</script>
<style scoped>
ul {
    display: flex;
}
li.tab {
    padding-left:1.5rem;
    padding-right:1.5rem;
    padding-top:0.75rem;
    padding-bottom: 0.75rem;
    overflow: hidden;
    align-items: center;
    display: flex;
    cursor: pointer;
    border-top-right-radius: 0.375rem;
    border-top-left-radius: 0.375rem;
    border-color:rgba(72,187,120,1);
    min-width: 5rem;
    margin-right: 0.1rem;
}
li.active-tab{
    color:white;
    background-color: red;
}

li.inactive-tab{
    background-color: rgb(194, 194, 194);
}
li.inactive-tab:hover{
    color:rgb(44, 44, 44);
    font-weight: 800;
}
</style>