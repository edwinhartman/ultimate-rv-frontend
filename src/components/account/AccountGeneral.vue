<template>
    <div>
        <h1 class="font-bold">Account General</h1>
        <div class="text-left flex flex-col">
            <div class="w-full">
                <label for="FirstName" class="mr-2">First Name</label>
                <input type="text" name="FirstName" class="bg-gray-100 border-gray-200 border rounded-md w-60">
            </div>
            <div class="w-full">
                <label for="LastName" class="mr-2">Last Name</label>
                <input type="text" name="LastName" class="bg-gray-100 border-gray-200 border rounded-md w-60">
            </div>
            <div class="w-full">
                <label for="EmailAddress" class="mr-2">Email</label>
                <input type="email" name="EmailAddress" class="bg-gray-100 border-gray-200 border rounded-md w-72">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"AccountGeneral"
}
</script>