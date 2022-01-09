<template>
    <div>
        <AdminTabs v-model="active">
            <AdminTab title="Users">
                <AdminUsers />
            </AdminTab>
            <AdminTab title="Plans">
                <AdminAccountPlans />
            </AdminTab>
            <AdminTab title="CRON Tasks">
                <AdminCronTasks />
            </AdminTab>
            <AdminTab title="CRON Jobs">
                <AdminCronJobs />
            </AdminTab>
        </AdminTabs>
    </div>

</template>
<script>
import { ref } from '@vue/reactivity'
import AdminTab from '../components/AdminTab.vue'
import AdminTabs from '../components/AdminTabs.vue'

import AdminUsers from './AdminUsers.vue'
import AdminCronJobs from './AdminCronJobs.vue'
import AdminCronTasks from './AdminCronTasks.vue'
import AdminAccountPlans from './AdminAccountPlans.vue'

export default{
    name:"AdminMain",
    components:{
        AdminTab,
        AdminTabs,
        AdminUsers,
        AdminCronJobs,
        AdminCronTasks,
        AdminAccountPlans
    },
    setup() {
        const active = ref(0);

        return { active };
    },
}
</script>
