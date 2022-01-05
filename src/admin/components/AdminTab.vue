<template>
    <div v-if="isActive">
        <slot></slot>
    </div>
</template>
<script>
import { computed, getCurrentInstance, inject, watchEffect } from '@vue/runtime-core'
export default {
    name:"AdminTab",
    props:{
        title:{
            type:String,
            default:"Tab"
        }
    },
    setup(props) {
        const instance = getCurrentInstance();
        const { tabs, active } = inject("tabsState");

        const index = computed(() =>
            tabs.value.findIndex((target) => target.uid === instance.uid)
        );
        const isActive = computed(() => index.value === active.value);

        watchEffect(() => {
            if (index.value === -1) {
                tabs.value.push(instance);
            }
        });

        return {
            isActive,
        };
    },
    watch:{
        isActive:function(newValue,oldValue){
            if (newValue){
                this.$emit("activated")
            }
        }
    }
}
</script>