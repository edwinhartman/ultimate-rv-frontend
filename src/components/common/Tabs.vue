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
    name:"Tabs",
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
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap:0.1rem;
    margin-block-start: 0;
    padding-left:0;
}
li.tab {
    padding-left:1.5rem;
    padding-right:1.5rem;
    padding-top:0.1rem;
    padding-bottom: 0.1rem;
    overflow: hidden;
    align-items: center;
    display: flex;
    cursor: pointer;
    border-top-right-radius: 0.375rem;
    border-top-left-radius: 0.375rem;
    border-color:rgba(72,187,120,1);
    min-width: 5rem;
    /* margin-right: 0.1rem; */
}
li.active-tab{
    color:white;
    background-color: rgba(95, 95, 95,0.8);
}

li.inactive-tab{
    background-color: rgb(194, 194, 194);
}
li.inactive-tab:hover{
    color:rgb(44, 44, 44);
    font-weight: 800;
}
</style>